import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canPostJobs, getMarketplaceRole } from "@/lib/auth/permissions";
import { JobForm } from "@/components/forms/JobForm";

export const metadata: Metadata = {
  title: "Post a Job | SKIERS ENTREPRENEURS KENYA",
};

export default async function PostJobPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/post-job");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canPostJobs(getMarketplaceRole(profile))) {
    redirect("/dashboard");
  }

  return <JobForm />;
}
