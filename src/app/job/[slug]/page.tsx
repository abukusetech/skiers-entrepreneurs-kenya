import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  getJobBySlug,
  getProposalsForJob,
  type ProposalItem,
} from "@/lib/db/queries/jobs";
import { Avatar } from "@/components/ui/Avatar";
import { ProposalForm } from "@/components/forms/ProposalForm";
import { ViewCvButton } from "@/components/forms/ViewCvButton";
import { acceptProposal } from "@/lib/actions/accept-proposal";
import { getOrCreateConversation } from "@/lib/actions/messaging";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

interface JobDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return { title: "Job Not Found" };
  }

  return {
    title: job.title,
    description: job.description.slice(0, 160),
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUserRole: string | null = null;
  let hasApplied = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role_choice, is_seller, is_buyer")
      .eq("id", user.id)
      .single();

    currentUserRole = profile?.role_choice || null;

    if (profile?.role_choice === "worker") {
      const { data: existingProposal } = await supabase
        .from("proposals")
        .select("id")
        .eq("job_id", job.id)
        .eq("seller_id", user.id)
        .maybeSingle();

      hasApplied = Boolean(existingProposal);
    }
  }

  const buyer = job.buyer;
  const category = job.category;
  const isOwner = user?.id === buyer?.id;

  let proposals: ProposalItem[] = [];
  if (isOwner) {
    proposals = await getProposalsForJob(job.id);
  }

  const budgetLabel = (() => {
    if (job.budget_type === "open") return "Open budget";
    if (job.budget_min && job.budget_max) {
      return `${job.currency} ${job.budget_min.toLocaleString()} - ${job.currency} ${job.budget_max.toLocaleString()}`;
    }
    if (job.budget_min) {
      return `${job.currency} ${job.budget_min.toLocaleString()} and up`;
    }
    if (job.budget_max) {
      return `Up to ${job.currency} ${job.budget_max.toLocaleString()}`;
    }
    return "Not specified";
  })();

  return (
    <div className="bg-background-primary">
      <div className="border-b border-border bg-background-secondary">
        <div className="container-site py-4">
          <nav className="flex items-center gap-2 text-xs text-text-tertiary">
            <Link
              href="/jobs"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              All jobs
            </Link>
            <span>/</span>
            <span className="text-text-secondary truncate">{job.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-site py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
              {job.title}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <Avatar
                src={buyer?.avatar_url}
                alt={buyer?.full_name || "Buyer"}
                size="md"
              />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {buyer?.full_name || "Anonymous Buyer"}
                </p>
                <p className="text-xs text-text-tertiary">
                  Posted{" "}
                  {new Date(
                    job.published_at || job.created_at,
                  ).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 mb-6">
              <h2 className="text-xl font-display font-bold text-text-primary mb-4">
                Project description
              </h2>
              <p className="text-sm lg:text-base text-text-secondary leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {job.skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 mb-6">
                <h2 className="text-xl font-display font-bold text-text-primary mb-4">
                  Required skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isOwner ? (
              <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-text-primary">
                    Proposals ({proposals.length})
                  </h2>
                  <Link
                    href="/dashboard/projects"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Manage in dashboard
                  </Link>
                </div>

                {proposals.length === 0 ? (
                  <div className="text-center py-10 bg-background-secondary rounded-xl">
                    <p className="text-sm text-text-secondary mb-1">
                      No proposals yet
                    </p>
                    <p className="text-xs text-text-tertiary">
                      Workers will submit proposals here soon.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((proposal) => {
                      const seller = proposal.seller;
                      return (
                        <div
                          key={proposal.id}
                          className="border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <Avatar
                              src={seller?.avatar_url}
                              alt={seller?.full_name || "Worker"}
                              size="md"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-text-primary truncate">
                                  {seller?.full_name || "Worker"}
                                </p>
                                {seller?.is_verified && (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full shrink-0">
                                    <CheckCircle className="h-3 w-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              {seller?.headline && (
                                <p className="text-xs text-text-secondary truncate">
                                  {seller.headline}
                                </p>
                              )}
                              {seller && (
                                <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary mt-1">
                                  <span>
                                    {seller.rating_count > 0
                                      ? `${seller.rating_average.toFixed(
                                          1,
                                        )} (${seller.rating_count})`
                                      : "New"}
                                  </span>
                                  <span>
                                    {seller.total_completed_orders} orders
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs text-text-tertiary">
                                Proposed
                              </p>
                              <p className="text-lg font-display font-bold text-text-primary">
                                KES{" "}
                                {proposal.proposed_price?.toLocaleString() ||
                                  "Not set"}
                              </p>
                              {proposal.delivery_time_days && (
                                <p className="text-xs text-text-tertiary">
                                  {proposal.delivery_time_days} days
                                </p>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap mb-4">
                            {proposal.cover_letter}
                          </p>

                          <div className="flex flex-wrap items-center gap-3">
                            <form
                              action={async () => {
                                "use server";
                                if (!seller?.id) return;
                                const result = await getOrCreateConversation(
                                  seller.id,
                                  { jobId: job.id },
                                );
                                if (result.conversationId) {
                                  redirect(
                                    `/dashboard/messages/${result.conversationId}`,
                                  );
                                }
                              }}
                            >
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-md bg-transparent border border-border text-text-primary hover:bg-background-secondary transition-colors"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                Message
                              </button>
                            </form>

                            <ViewCvButton
                              cvUrl={seller?.cv_url || null}
                              applicantName={seller?.full_name || "Applicant"}
                            />

                            {proposal.is_shortlisted && (
                              <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                                Shortlisted
                              </span>
                            )}

                            {job.status === "published" &&
                              (proposal.status === "submitted" ||
                                proposal.status === "shortlisted") && (
                                <form
                                  action={async () => {
                                    "use server";
                                    await acceptProposal(job.id, proposal.id);
                                  }}
                                >
                                  <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Accept and hire
                                  </button>
                                </form>
                              )}

                            {proposal.status === "accepted" && (
                              <span className="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full">
                                Hired
                              </span>
                            )}

                            <span className="text-xs text-text-tertiary ml-auto">
                              Submitted{" "}
                              {new Date(proposal.created_at).toLocaleDateString(
                                "en-KE",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : !user ? (
              <div className="bg-background-secondary border border-border rounded-2xl p-6 text-center">
                <p className="text-sm text-text-secondary mb-4">
                  Log in to submit a proposal for this job.
                </p>
                <Link
                  href={`/login?redirect=/job/${job.slug}`}
                  className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                  Log in to apply
                </Link>
              </div>
            ) : currentUserRole !== "worker" ? (
              <div className="bg-background-secondary border border-border rounded-2xl p-6 text-center">
                <p className="text-sm text-text-secondary">
                  Only workers can submit proposals. Switch to a worker account
                  to apply for jobs.
                </p>
              </div>
            ) : hasApplied ? (
              <div className="bg-success/10 border border-success/20 rounded-2xl p-6 text-center">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-3" />
                <p className="text-sm font-medium text-success mb-1">
                  Proposal submitted
                </p>
                <p className="text-xs text-text-secondary">
                  The buyer will review your proposal and reach out if
                  interested.
                </p>
              </div>
            ) : (
              <ProposalForm jobId={job.id} />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-lg p-6">
              <div className="mb-5">
                <p className="text-xs text-text-tertiary mb-1">Budget</p>
                <p className="text-2xl font-display font-bold text-text-primary">
                  {budgetLabel}
                </p>
              </div>

              <div className="space-y-3 pb-5 border-b border-border mb-5">
                {category && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Briefcase className="h-4 w-4 text-text-tertiary" />
                    {category.name}
                  </div>
                )}
                {job.experience_level && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle className="h-4 w-4 text-text-tertiary" />
                    <span className="capitalize">
                      {job.experience_level} level
                    </span>
                  </div>
                )}
                {job.project_scope && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock className="h-4 w-4 text-text-tertiary" />
                    <span className="capitalize">
                      {job.project_scope} project
                    </span>
                  </div>
                )}
                {job.deadline && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="h-4 w-4 text-text-tertiary" />
                    Due{" "}
                    {new Date(job.deadline).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  {job.is_remote ? (
                    <>
                      <Clock className="h-4 w-4 text-text-tertiary" />
                      Remote
                    </>
                  ) : job.location ? (
                    <>
                      <MapPin className="h-4 w-4 text-text-tertiary" />
                      {job.location}
                    </>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Users className="h-4 w-4 text-text-tertiary" />
                  {job.proposal_count}{" "}
                  {job.proposal_count === 1 ? "proposal" : "proposals"}
                </div>
              </div>

              <div className="text-xs text-text-tertiary text-center">
                Job #{job.id.slice(0, 8)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
