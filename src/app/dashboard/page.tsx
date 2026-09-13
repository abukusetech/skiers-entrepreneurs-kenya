import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMarketplaceRole, canPostJobs } from "@/lib/auth/permissions";
import { getOrderStats } from "@/lib/db/queries/orders";
import { getBuyerJobs, getSellerProposals } from "@/lib/db/queries/jobs";
import { getSellerServices } from "@/lib/db/queries/services";
import {
  Briefcase,
  Package,
  FileText,
  Wallet,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | SKIERS ENTREPRENEURS KENYA",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role_choice, onboarding_role, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  const role = getMarketplaceRole(profile);
  const isWorker = role === "worker";
  const canPost = canPostJobs(role);

  const [buyerStats, sellerStats, jobs, services, proposals] =
    await Promise.all([
      canPost ? getOrderStats(user.id, "buyer") : null,
      isWorker ? getOrderStats(user.id, "seller") : null,
      canPost ? getBuyerJobs(user.id) : Promise.resolve([]),
      isWorker ? getSellerServices(user.id) : Promise.resolve([]),
      isWorker ? getSellerProposals(user.id) : Promise.resolve([]),
    ]);

  const activeJobs = jobs.filter((j) =>
    ["published", "in_review", "awarded", "in_progress"].includes(j.status),
  ).length;
  const publishedServices = services.filter(
    (s) => s.status === "published",
  ).length;
  const pendingProposals = proposals.filter(
    (p) => p.status === "submitted" || p.status === "shortlisted",
  ).length;

  const cards = [
    ...(canPost
      ? [
          {
            href: "/dashboard/projects",
            icon: Briefcase,
            label: "Active jobs",
            value: activeJobs,
            sub: `${jobs.length} posted total`,
          },
        ]
      : []),
    ...(isWorker
      ? [
          {
            href: "/dashboard/services",
            icon: Package,
            label: "Published services",
            value: publishedServices,
            sub: `${services.length} total`,
          },
          {
            href: "/dashboard/proposals",
            icon: FileText,
            label: "Pending proposals",
            value: pendingProposals,
            sub: `${proposals.length} submitted total`,
          },
        ]
      : []),
    {
      href: "/dashboard/orders",
      icon: TrendingUp,
      label: "Active orders",
      value: (buyerStats?.active ?? 0) + (sellerStats?.active ?? 0),
      sub: `${(buyerStats?.completed ?? 0) + (sellerStats?.completed ?? 0)} completed`,
    },
    ...(isWorker
      ? [
          {
            href: "/withdrawals",
            icon: Wallet,
            label: "Earned (completed orders)",
            value: `KES ${(sellerStats?.totalAmount ?? 0).toLocaleString()}`,
            sub: "M-Pesa payouts coming soon",
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-1">
          Welcome back, {profile?.full_name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-sm text-text-secondary">
          Here is what is happening with your account.
        </p>
      </div>

      {!profile?.onboarding_completed && isWorker && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-text-primary">
            Finish setting up your worker profile to start getting hired.
          </p>
          <Link
            href="/onboarding/worker"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0"
          >
            Complete setup <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl border border-border p-6 flex items-start gap-4 hover:shadow-lg hover:border-primary/30 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
              <card.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-display font-bold text-text-primary leading-tight">
                {card.value}
              </p>
              <p className="text-sm font-medium text-text-primary mt-0.5">
                {card.label}
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {canPost && (
          <Link
            href="/post-job"
            className="bg-white rounded-2xl border border-dashed border-border p-6 text-center hover:border-primary hover:bg-primary/5 transition-all"
          >
            <p className="font-semibold text-text-primary mb-1">Post a job</p>
            <p className="text-xs text-text-tertiary">
              Get proposals from vetted talent
            </p>
          </Link>
        )}
        {isWorker && (
          <Link
            href="/create-service"
            className="bg-white rounded-2xl border border-dashed border-border p-6 text-center hover:border-primary hover:bg-primary/5 transition-all"
          >
            <p className="font-semibold text-text-primary mb-1">
              List a service
            </p>
            <p className="text-xs text-text-tertiary">
              Offer your skills to buyers
            </p>
          </Link>
        )}
        <Link
          href={
            role === "business"
              ? "/dashboard/business-profile"
              : role === "organization"
                ? "/dashboard/organization-profile"
                : "/dashboard/profile"
          }
          className="bg-white rounded-2xl border border-dashed border-border p-6 text-center hover:border-primary hover:bg-primary/5 transition-all"
        >
          <p className="font-semibold text-text-primary mb-1">
            Update your profile
          </p>
          <p className="text-xs text-text-tertiary">
            A complete profile builds trust
          </p>
        </Link>
      </div>
    </div>
  );
}
