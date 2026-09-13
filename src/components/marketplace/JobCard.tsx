import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Clock, MapPin, Users, Calendar, Building2 } from "lucide-react";
import type { JobListItem } from "@/lib/db/queries/jobs";

interface JobCardProps {
  job: JobListItem;
}

export function JobCard({ job }: JobCardProps) {
  const buyer = job.buyer;
  const category = job.category;

  const posterName =
    job.business_name || job.organization_name || buyer?.full_name || "Buyer";
  const posterImage =
    job.business_logo_url || job.organization_logo_url || buyer?.avatar_url;
  const isCompany = Boolean(job.business_name || job.organization_name);

  return (
    <Link
      href={`/job/${job.slug}`}
      className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col p-6"
    >
      <div className="flex items-start gap-3 mb-4">
        <Avatar src={posterImage} alt={posterName} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <p className="text-xs text-text-tertiary truncate flex items-center gap-1">
            {isCompany && <Building2 className="h-3 w-3" />}
            {isCompany ? posterName : `by ${posterName}`}
          </p>
        </div>
      </div>

      <p className="text-sm text-text-secondary line-clamp-2 mb-4 min-h-10">
        {job.description}
      </p>

      <div className="bg-linear-to-r from-primary/5 to-accent/5 rounded-xl p-3 mb-4 flex items-center justify-between">
        <span className="text-xs text-text-tertiary">Budget</span>
        <span className="font-bold text-text-primary text-sm">
          {job.currency}{" "}
          {job.budget_min && job.budget_max
            ? `${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()}`
            : job.budget_min
              ? `from ${job.budget_min.toLocaleString()}`
              : job.budget_max
                ? `up to ${job.budget_max.toLocaleString()}`
                : "Open"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {category && (
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
            {category.name}
          </span>
        )}
        {job.is_remote ? (
          <span className="text-xs bg-background-secondary text-text-secondary px-3 py-1 rounded-full">
            Remote
          </span>
        ) : job.location ? (
          <span className="text-xs bg-background-secondary text-text-secondary px-3 py-1 rounded-full flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
        ) : null}
        {job.project_scope && (
          <span className="text-xs bg-background-secondary text-text-secondary px-3 py-1 rounded-full capitalize">
            {job.project_scope} project
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div className="flex items-center gap-1 text-xs text-text-tertiary">
          <Users className="h-3.5 w-3.5" />
          <span>
            {job.proposal_count}{" "}
            {job.proposal_count === 1 ? "proposal" : "proposals"}
          </span>
        </div>
        {job.deadline ? (
          <div className="flex items-center gap-1 text-xs text-text-tertiary">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Due{" "}
              {new Date(job.deadline).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-text-tertiary">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {new Date(job.published_at || job.created_at).toLocaleDateString(
                "en-KE",
                { day: "numeric", month: "short" },
              )}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
