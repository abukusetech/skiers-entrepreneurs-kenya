"use server";

import { createClient } from "@/lib/supabase/server";
import { canCreateWorkerService, getMarketplaceRole } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

const ALLOWED_STATUSES = ["draft", "published", "archived"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

export async function setServiceStatus(serviceId: string, status: AllowedStatus) {
  if (!ALLOWED_STATUSES.includes(status)) {
    return { error: "Invalid status." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canCreateWorkerService(getMarketplaceRole(profile))) {
    return { error: "Only workers can manage freelance services." };
  }

  const updates: Record<string, unknown> = { status };
  if (status === "published") {
    updates.published_at = new Date().toISOString();
  }

  // RLS (seller_id = auth.uid()) enforces ownership server-side regardless
  // of what's sent here; the .eq("seller_id", ...) is defense in depth.
  const { error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", serviceId)
    .eq("seller_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  return { success: true };
}

export async function deleteService(serviceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canCreateWorkerService(getMarketplaceRole(profile))) {
    return { error: "Only workers can manage freelance services." };
  }

  const { error } = await supabase
    .from("services")
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", serviceId)
    .eq("seller_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  return { success: true };
}
