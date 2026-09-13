"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AcceptProposalState = {
  error?: string;
} | null;

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

  const { data: orderId, error } = await supabase.rpc(
    "accept_proposal_for_job",
    {
      p_job_id: jobId,
      p_proposal_id: proposalId,
    },
  );

  if (error) {
    console.error("accept_proposal_for_job failed:", error.message);
    return { error: error.message };
  }

  if (!orderId) {
    return { error: "Could not create the order. Please try again." };
  }

  revalidatePath(`/job/${jobId}`);
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/proposals");

  redirect(`/order/${orderId}`);
}
