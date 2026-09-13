import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { canWorkForOthers, getMarketplaceRole } from "@/lib/auth/permissions";
import { getSellerProposals } from "@/lib/db/queries/jobs";
import { FileText, ArrowRight, Clock } from "lucide-react";
export const metadata: Metadata = {
  title: "My Proposals | SKIERS ENTREPRENEURS KENYA",
};

const statusStyles: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  shortlisted: "bg-amber-100 text-amber-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-700",
};

export default async function MyProposalsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/proposals");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canWorkForOthers(getMarketplaceRole(profile))) {
    redirect("/dashboard");
  }

  const proposals = await getSellerProposals(user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
          My Proposals
        </h1>
        <p className="text-text-secondary">
          Every proposal you have submitted, and where it stands.
        </p>
      </div>

      {proposals.length > 0 ? (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Link
              key={proposal.id}
              href={proposal.job ? `/job/${proposal.job.slug}` : "#"}
              className="block bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary text-lg group-hover:text-primary transition-colors truncate">
                    {proposal.job?.title || "Job no longer available"}
                  </h3>
                  <p className="text-xs text-text-tertiary mt-1">
                    Submitted{" "}
                    {new Date(proposal.created_at).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`self-start text-xs px-3 py-1 rounded-full font-medium ${
                    statusStyles[proposal.status] ||
                    "bg-background-secondary text-text-secondary"
                  }`}
                >
                  {proposal.status.charAt(0).toUpperCase() +
                    proposal.status.slice(1)}
                </span>
              </div>

              <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                {proposal.cover_letter}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-text-secondary">
                  <FileText className="h-4 w-4 text-text-tertiary" />
                  <span className="font-medium text-text-primary">
                    KES {proposal.proposed_price?.toLocaleString() || "Not set"}
                  </span>
                </div>
                {proposal.delivery_time_days && (
                  <div className="flex items-center gap-1 text-text-secondary">
                    <Clock className="h-4 w-4 text-text-tertiary" />
                    {proposal.delivery_time_days} days
                  </div>
                )}
                {proposal.job?.budget_min && proposal.job?.budget_max && (
                  <span className="text-xs text-text-tertiary">
                    Job budget: {proposal.job.currency}{" "}
                    {proposal.job.budget_min.toLocaleString()} -{" "}
                    {proposal.job.budget_max.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-text-tertiary">
                  View job details
                </span>
                <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-border rounded-2xl">
          <FileText className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            No proposals yet
          </h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Browse open jobs and submit your first proposal. It takes two
            minutes.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Browse open jobs
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}
