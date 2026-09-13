import { createClient } from "@/lib/supabase/server";

export type OrganizationProfile = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  organization_type: string | null;
  sector: string | null;
  category_id: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  county: string | null;
  town: string | null;
  address: string | null;
  employee_count: number | null;
  founded_year: number | null;
  registration_number: string | null;
  tax_id: string | null;
  logo_url: string | null;
  cover_url: string | null;
  verification_status: string;
  verification_docs: Record<string, unknown>;
  is_active: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export async function getOrganizationProfileByOwner(
  ownerId: string,
): Promise<OrganizationProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organization_profiles")
    .select("*")
    .eq("owner_id", ownerId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("Error fetching organization profile:", error.message);
    return null;
  }

  return data as OrganizationProfile | null;
}

export async function getOrganizationProfileBySlug(
  slug: string,
): Promise<OrganizationProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organization_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("Error fetching organization profile:", error.message);
    return null;
  }

  return data as OrganizationProfile | null;
}
