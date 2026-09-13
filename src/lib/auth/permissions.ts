import "server-only";

import { createClient } from "@/lib/supabase/server";

export type MarketplaceRole =
  | "buyer"
  | "worker"
  | "business"
  | "organization";

export type ProfileRoleSource = {
  role_choice?: string | null;
  onboarding_role?: string | null;
};

export function getMarketplaceRole(
  profile: ProfileRoleSource | null | undefined,
): MarketplaceRole | null {
  const role = profile?.role_choice || profile?.onboarding_role;

  if (
    role === "buyer" ||
    role === "worker" ||
    role === "business" ||
    role === "organization"
  ) {
    return role;
  }

  return null;
}

export function canPostJobs(role: MarketplaceRole | null): boolean {
  return role === "buyer" || role === "business" || role === "organization";
}

export function canWorkForOthers(role: MarketplaceRole | null): boolean {
  return role === "worker";
}

export function canCreateWorkerService(role: MarketplaceRole | null): boolean {
  return role === "worker";
}

export function canSubmitProposal(role: MarketplaceRole | null): boolean {
  return role === "worker";
}

export function canCreateListing(role: MarketplaceRole | null): boolean {
  return role === "business" || role === "organization";
}

// Backward-compatible alias for any existing imports.
export const canCreateBusinessListing = canCreateListing;

export async function getCurrentMarketplaceRole(): Promise<{
  userId: string;
  role: MarketplaceRole | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    role: getMarketplaceRole(profile),
  };
}
