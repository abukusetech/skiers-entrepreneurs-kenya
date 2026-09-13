"use server";

import { canSubmitProposal, getMarketplaceRole } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SubmitProposalState = {
  error?: string;
  success?: boolean;
} | null;

export async function submitProposal(
  jobId: string,
  prevState: SubmitProposalState,
  formData: FormData,
): Promise<SubmitProposalState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to submit a proposal." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .single();

  if (!canSubmitProposal(getMarketplaceRole(profile))) {
    return {
      error: "Only workers can submit proposals. Business and organization accounts cannot work for other people.",
    };
  }

  const { data: job } = await supabase
    .from("jobs")
    .select("id, status, buyer_id, proposal_count, slug")
    .eq("id", jobId)
    .single();

  if (!job) {
    return { error: "Job not found." };
  }

  if (job.status !== "published") {
    return { error: "This job is no longer open for proposals." };
  }

  if (job.buyer_id === user.id) {
    return { error: "You cannot submit a proposal on your own job." };
  }

  const { data: existing } = await supabase
    .from("proposals")
    .select("id")
    .eq("job_id", jobId)
    .eq("seller_id", user.id)
    .maybeSingle();

  if (existing) {
    return { error: "You have already submitted a proposal for this job." };
  }

  const coverLetter = (formData.get("coverLetter") as string)?.trim();
  const proposedPrice = formData.get("proposedPrice") as string;
  const deliveryTimeDays = formData.get("deliveryTimeDays") as string;

  if (!coverLetter || coverLetter.length < 30) {
    return { error: "Cover letter must be at least 30 characters." };
  }

  if (!proposedPrice) {
    return { error: "Please enter your proposed price." };
  }

  const price = parseFloat(proposedPrice);
  if (isNaN(price) || price <= 0) {
    return { error: "Proposed price must be a valid number above zero." };
  }

  const { error: proposalError } = await supabase.from("proposals").insert({
    job_id: jobId,
    seller_id: user.id,
    cover_letter: coverLetter,
    proposed_price: price,
    delivery_time_days: deliveryTimeDays ? parseInt(deliveryTimeDays) : null,
    status: "submitted",
  });

  if (proposalError) {
    console.error("Error creating proposal:", proposalError.message);
    return { error: "Could not submit your proposal. Please try again." };
  }

  // Increment the proposal count atomically (avoids lost updates under
  // concurrent submissions).
  await supabase.rpc("increment_job_proposal_count", { p_job_id: jobId });

  revalidatePath(`/job/${job.slug}`);
  revalidatePath("/dashboard/proposals");
  revalidatePath("/dashboard/projects");

  return { success: true };
}
