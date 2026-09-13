import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedJobs } from "@/lib/db/queries/jobs";
import { JobCard } from "@/components/marketplace/JobCard";
import { Search, Sparkles, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Find Work | SKIERS ENTREPRENEURS KENYA",
  description:
    "Browse jobs posted by employers across Kenya. Web development, design, cleaning, events, and more.",
};

interface JobsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const { q } = await searchParams;
  const jobs = await getPublishedJobs({ searchQuery: q || undefined });

  return (
    <div className="bg-background-primary">
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark py-16 lg:py-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-info/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container-site">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-white text-xs font-medium">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"} open now
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 animate-slide-up">
              Find Work
            </h1>
            <p
              className="text-lg text-gray-300 max-w-2xl animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Browse jobs posted by employers across Kenya.
            </p>
          </div>

          <form
            action="/jobs"
            method="get"
            className="max-w-2xl mt-8 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-white rounded-xl p-2 flex items-center shadow-xl">
              <Search className="h-5 w-5 text-text-tertiary ml-3 shrink-0" />
              <input
                type="text"
                name="q"
                defaultValue={q || ""}
                placeholder="Search for a job, skill, or employer"
                className="flex-1 h-12 px-4 focus:outline-none text-text-primary bg-transparent text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center h-12 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-white">
        <div className="container-site">
          {q && (
            <div className="mb-6 flex items-center gap-2 animate-fade-in">
              <p className="text-sm text-text-secondary">
                Results for{" "}
                <span className="font-semibold text-text-primary">
                  &ldquo;{q}&rdquo;
                </span>
              </p>
              <span className="text-xs bg-background-secondary px-2 py-1 rounded-full text-text-tertiary">
                {jobs.length} {jobs.length === 1 ? "match" : "matches"}
              </span>
            </div>
          )}

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <div
                  key={job.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-5">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
                {q ? "No jobs match your search" : "No jobs posted yet"}
              </h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                {q
                  ? "Try a different keyword, or browse all open jobs."
                  : "Be the first to post a job on SKIERS."}
              </p>
              <Link
                href={q ? "/jobs" : "/post-job"}
                className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                {q ? "Browse all jobs" : "Post a job"}
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
