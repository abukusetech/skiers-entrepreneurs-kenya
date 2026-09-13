import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkerWizard } from "@/components/forms/WorkerWizard";

export const metadata: Metadata = {
  title: "Complete Your Profile | SKIERS ENTREPRENEURS KENYA",
};

export default async function WorkerOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  return <WorkerWizard />;
}
