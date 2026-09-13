import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSellerProposals } from "@/lib/db/queries/jobs";
import {
  FileText,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "My Proposals",
};

function statusLabel(status: string): string {
  switch (status) {
    case "submitted":
      return "Awaiting decision";
    case "shortlisted":
      return "Shortlisted";
    case "accepted":
      return "Awarded to you";
    case "rejected":
      return "Not selected";
    case "withdrawn":
      return "Withdrawn";
    default:
      return status;
  }
}

function statusStyle(status: string): string {
  switch (status) {
    case "submitted":
      return "bg-blue-100 text-blue-700";
    case "shortlisted":
      return "bg-amber-100 text-amber-700";
    case "accepted":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "withdrawn":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function statusIcon(status: string) {
  switch (status) {
    case "accepted":
      return CheckCircle;
    case "rejected":
      return XCircle;
    case "submitted":
    case "shortlisted":
      return Clock;
    default:
      return FileText;
  }
}

export default async function MyProposalsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/proposals");
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
          {proposals.map((proposal) => {
            const Icon = statusIcon(proposal.status);
            const jobMissing = !proposal.job;
            return (
              <div
                key={proposal.id}
                className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary text-lg truncate">
                      {proposal.job?.title || "Job no longer available"}
                    </h3>
                    <p className="text-xs text-text-tertiary mt-1">
                      Submitted{" "}
                      {new Date(proposal.created_at).toLocaleDateString(
                        "en-KE",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <span
                    className={`self-start inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${statusStyle(
                      proposal.status,
                    )}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {statusLabel(proposal.status)}
                  </span>
                </div>

                <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                  {proposal.cover_letter}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-text-secondary">
                    <FileText className="h-4 w-4 text-text-tertiary" />
                    <span className="font-medium text-text-primary">
                      KES{" "}
                      {proposal.proposed_price?.toLocaleString() || "Not set"}
                    </span>
                  </div>
                  {proposal.delivery_time_days && (
                    <div className="flex items-center gap-1 text-text-secondary">
                      <Clock className="h-4 w-4 text-text-tertiary" />
                      {proposal.delivery_time_days} days
                    </div>
                  )}
                </div>

                {proposal.status === "accepted" && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-medium text-success">
                      You were awarded this job. Check your dashboard orders.
                    </span>
                    <Link
                      href="/dashboard/orders"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      View orders <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}

                {proposal.status === "rejected" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-sm text-text-tertiary">
                      The buyer chose another proposal for this job.
                    </span>
                  </div>
                )}

                {!jobMissing &&
                  (proposal.status === "submitted" ||
                    proposal.status === "shortlisted") && (
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm text-text-tertiary">
                        Awaiting the buyer&apos;s decision.
                      </span>
                      <Link
                        href={`/job/${proposal.job?.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        View job <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
              </div>
            );
          })}
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
