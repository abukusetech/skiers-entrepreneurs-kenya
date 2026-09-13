"use server";

import { canPostJobs, getMarketplaceRole } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AcceptProposalState = {
  error?: string;
} | null;

// Commission tiers are stored in platform_settings under "commission_tiers".
// Shape: { tiers: [{ max: number | null, rate: number }, ...] }
// The first tier whose `max` is >= amount (or null, meaning unbounded) wins.
async function getCommissionRate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  amount: number,
): Promise<number> {
  const { data, error } = await supabase
    .from("platform_settings")
    .select("setting_value")
    .eq("setting_key", "commission_tiers")
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data?.setting_value) {
    // Safe default: 12 percent, the mid tier. Never silently overcharge.
    return 12;
  }

  const tiers = (
    data.setting_value as { tiers?: { max: number | null; rate: number }[] }
  ).tiers;
  if (!Array.isArray(tiers) || tiers.length === 0) {
    return 12;
  }

  // Sort ascending by max so the smallest matching tier wins.
  // null max always sorts last.
  const sorted = [...tiers].sort((a, b) => {
    if (a.max === null) return 1;
    if (b.max === null) return -1;
    return a.max - b.max;
  });

  for (const tier of sorted) {
    if (tier.max === null || amount <= tier.max) {
      return tier.rate;
    }
  }

  // Fallback if every tier had a finite max below the amount.
  return sorted[sorted.length - 1].rate;
}

export async function acceptProposal(
  jobId: string,
  proposalId: string,
): Promise<AcceptProposalState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to accept a proposal." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canPostJobs(getMarketplaceRole(profile))) {
    return { error: "Only buyers, businesses, and organizations can hire workers." };
  }

  // Verify the job belongs to this buyer
  const { data: job } = await supabase
    .from("jobs")
    .select("id, buyer_id, status, title, slug")
    .eq("id", jobId)
    .single();

  if (!job) {
    return { error: "Job not found." };
  }

  if (job.buyer_id !== user.id) {
    return { error: "You can only accept proposals on your own jobs." };
  }

  if (job.status !== "published") {
    return { error: "This job is no longer open for hiring." };
  }

  // Verify the proposal exists for this job
  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, seller_id, proposed_price, delivery_time_days, status")
    .eq("id", proposalId)
    .eq("job_id", jobId)
    .single();

  if (!proposal) {
    return { error: "Proposal not found." };
  }

  if (proposal.status !== "submitted" && proposal.status !== "shortlisted") {
    return { error: "This proposal can no longer be accepted." };
  }

  if (!proposal.proposed_price || proposal.proposed_price <= 0) {
    return { error: "This proposal has no valid price." };
  }

  // Generate an order number
  const orderNumber = `SK-${Date.now().toString(36).toUpperCase()}`;

  // Pull the correct commission tier for this amount.
  const totalAmount = proposal.proposed_price;
  const commissionRate = await getCommissionRate(supabase, totalAmount);
  const platformFee =
    Math.round(totalAmount * (commissionRate / 100) * 100) / 100;
  const sellerAmount = Math.round((totalAmount - platformFee) * 100) / 100;

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      buyer_id: user.id,
      seller_id: proposal.seller_id,
      job_id: jobId,
      proposal_id: proposalId,
      order_type: "job",
      status: "in_progress",
      total_amount: totalAmount,
      platform_fee: platformFee,
      seller_amount: sellerAmount,
      currency: "KES",
      delivery_time_days: proposal.delivery_time_days,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError?.message);
    return { error: "Could not create the order. Please try again." };
  }

  // Update the accepted proposal
  await supabase
    .from("proposals")
    .update({ status: "accepted" })
    .eq("id", proposalId);

  // Reject all other proposals on this job
  await supabase
    .from("proposals")
    .update({ status: "rejected" })
    .eq("job_id", jobId)
    .neq("id", proposalId);

  // Mark the job as awarded
  await supabase.from("jobs").update({ status: "awarded" }).eq("id", jobId);

  revalidatePath(`/job/${job.slug}`);
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/projects");

  redirect(`/order/${order.id}`);
}
