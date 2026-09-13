import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canCreateWorkerService, getMarketplaceRole } from "@/lib/auth/permissions";
import { ServiceForm } from "@/components/forms/ServiceForm";

export const metadata: Metadata = {
  title: "Create a Service | SKIERS ENTREPRENEURS KENYA",
};

export default async function CreateServicePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/create-service");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canCreateWorkerService(getMarketplaceRole(profile))) {
    redirect("/dashboard");
  }

  return <ServiceForm />;
}
