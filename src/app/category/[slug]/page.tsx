import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/db/queries/categories";
import { getPublishedServices } from "@/lib/db/queries/services";
import { getPublishedJobs } from "@/lib/db/queries/jobs";
import { ServiceCard } from "@/components/marketplace/ServiceCard";
import { JobCard } from "@/components/marketplace/JobCard";
import { ArrowRight, Package, Briefcase } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | SKIERS ENTREPRENEURS KENYA" };
  }

  return {
    title: `${category.name} | SKIERS ENTREPRENEURS KENYA`,
    description:
      category.description ||
      `Browse ${category.name} services and jobs on SKIERS ENTREPRENEURS KENYA.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [services, jobs] = await Promise.all([
    getPublishedServices({ categorySlug: slug }),
    getPublishedJobs({ categorySlug: slug }),
  ]);

  const activeTab = tab === "jobs" ? "jobs" : "services";

  return (
    <div className="bg-background-primary">
      <section className="bg-dark py-14 lg:py-16">
        <div className="container-site">
          <p className="text-xs font-medium text-gray-400 mb-3">
            <Link href="/categories" className="hover:text-white">
              Categories
            </Link>{" "}
            / {category.name}
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-3">
            {category.name}
          </h1>
          <p className="text-base text-gray-300 max-w-2xl leading-relaxed">
            {category.description ||
              `Services and jobs in ${category.name}.`}
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-border sticky top-20 z-40">
        <div className="container-site">
          <div className="flex gap-1">
            <Link
              href={`/category/${slug}?tab=services`}
              className={`inline-flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "services"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <Package className="h-4 w-4" />
              Services ({services.length})
            </Link>
            <Link
              href={`/category/${slug}?tab=jobs`}
              className={`inline-flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "jobs"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Jobs ({jobs.length})
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site">
          {activeTab === "services" ? (
            services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="No services in this category yet"
                actionHref="/create-service"
                actionLabel="List the first one"
              />
            )
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Briefcase}
              title="No open jobs in this category yet"
              actionHref="/post-job"
              actionLabel="Post one"
            />
          )}
        </div>
      </section>

      <section className="py-10 bg-background-secondary border-t border-border">
        <div className="container-site text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Browse all categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  actionHref,
  actionLabel,
}: {
  icon: typeof Package;
  title: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-5">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
        {title}
      </h2>
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        Be the first to change that.
      </p>
      <Link
        href={actionHref}
        className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
