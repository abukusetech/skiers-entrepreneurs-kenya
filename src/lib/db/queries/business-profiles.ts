import { createClient } from "@/lib/supabase/server";

export type BusinessProfile = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  industry: string | null;
  category_id: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  county: string | null;
  town: string | null;
  address: string | null;
  building: string | null;
  latitude: number | null;
  longitude: number | null;
  hours: Record<string, unknown>;
  services: string[];
  logo_url: string | null;
  cover_url: string | null;
  registration_number: string | null;
  kra_pin: string | null;
  verification_status: string;
  verification_docs: Record<string, unknown>;
  is_active: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PublicBusinessProfile = Pick<
  BusinessProfile,
  | "id"
  | "name"
  | "slug"
  | "tagline"
  | "description"
  | "county"
  | "town"
  | "services"
  | "logo_url"
  | "cover_url"
  | "verification_status"
  | "category_id"
>;

export async function getBusinessProfileByOwner(
  ownerId: string,
): Promise<BusinessProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("owner_id", ownerId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("Error fetching business profile:", error.message);
    return null;
  }

  return data as BusinessProfile | null;
}

export async function getBusinessProfileBySlug(
  slug: string,
): Promise<BusinessProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("Error fetching business profile:", error.message);
    return null;
  }

  return data as BusinessProfile | null;
}

export async function getPublicBusinesses(options?: {
  county?: string;
  searchQuery?: string;
  limit?: number;
}): Promise<PublicBusinessProfile[]> {
  const supabase = await createClient();

  let query = supabase
    .from("business_profiles")
    .select(
      "id, name, slug, tagline, description, county, town, services, logo_url, cover_url, verification_status, category_id",
    )
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (options?.county) {
    query = query.eq("county", options.county);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching public businesses:", error.message);
    return [];
  }

  let businesses = (data || []) as unknown as PublicBusinessProfile[];

  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase();
    businesses = businesses.filter((b) => {
      const hay =
        `${b.name} ${b.tagline ?? ""} ${b.description ?? ""} ${b.town ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  return businesses;
}
