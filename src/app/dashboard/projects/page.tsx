import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { canPostJobs, getMarketplaceRole } from "@/lib/auth/permissions";
import { getBuyerJobs } from "@/lib/db/queries/jobs";
import {
  Briefcase,
  ArrowRight,
  Users,
  Plus,
  Calendar,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "My Jobs | SKIERS ENTREPRENEURS KENYA",
};

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  published: "bg-blue-100 text-blue-700",
  awarded: "bg-purple-100 text-purple-700",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-700",
};

export default async function MyJobsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/projects");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canPostJobs(getMarketplaceRole(profile))) {
    redirect("/dashboard");
  }

  const jobs = await getBuyerJobs(user.id);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
            My Jobs
          </h1>
          <p className="text-text-secondary">
            Every job you have posted, and how it is going.
          </p>
        </div>
        <Link
          href="/post-job"
          className="inline-flex items-center gap-2 h-11 px-5 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          Post a new job
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/job/${job.slug}`}
              className="block bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary text-lg group-hover:text-primary transition-colors truncate">
                    {job.title}
                  </h3>
                  <p className="text-xs text-text-tertiary mt-1">
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
                <span
                  className={`self-start text-xs px-3 py-1 rounded-full font-medium ${
                    statusStyles[job.status] ||
                    "bg-background-secondary text-text-secondary"
                  }`}
                >
                  {job.status.charAt(0).toUpperCase() +
                    job.status.slice(1).replace(/_/g, " ")}
                </span>
              </div>

              <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                {job.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-text-secondary">
                  <Users className="h-4 w-4 text-text-tertiary" />
                  <span className="font-medium text-text-primary">
                    {job.proposal_count}
                  </span>
                  <span>
                    {job.proposal_count === 1 ? "proposal" : "proposals"}
                  </span>
                </div>
                {job.budget_min && job.budget_max && (
                  <div className="text-text-secondary">
                    Budget:{" "}
                    <span className="font-medium text-text-primary">
                      {job.currency} {job.budget_min.toLocaleString()} -{" "}
                      {job.budget_max.toLocaleString()}
                    </span>
                  </div>
                )}
                {job.deadline && (
                  <div className="flex items-center gap-1 text-text-secondary">
                    <Calendar className="h-4 w-4 text-text-tertiary" />
                    Due{" "}
                    {new Date(job.deadline).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                )}
                {!job.is_remote && job.location && (
                  <div className="flex items-center gap-1 text-text-secondary">
                    <MapPin className="h-4 w-4 text-text-tertiary" />
                    {job.location}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-text-tertiary">
                  {job.proposal_count > 0
                    ? `Review ${job.proposal_count} ${
                        job.proposal_count === 1 ? "proposal" : "proposals"
                      }`
                    : "Waiting for proposals"}
                </span>
                <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-border rounded-2xl">
          <Briefcase className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            No jobs posted yet
          </h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Post your first job for free and receive proposals from skilled
            workers within hours.
          </p>
          <Link
            href="/post-job"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Post a job
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}
