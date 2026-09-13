import { createClient } from "@/lib/supabase/server";

export type PublicProfessional = {
  id: string;
  full_name: string;
  headline: string | null;
  about: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  city: string | null;
  location: string | null;
  hourly_rate: number | null;
  work_preference: string | null;
  is_verified: boolean;
  is_seller: boolean;
  rating_average: number;
  rating_count: number;
  total_completed_orders: number;
  languages: string[];
  slug: string;
};

function profileSlug(fullName: string, id: string): string {
  const base = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "user"}-${id.slice(0, 8)}`;
}

export async function getProfessionalBySlug(
  slug: string,
): Promise<PublicProfessional | null> {
  const supabase = await createClient();

  // We don't store the slug in the DB for profiles today. Fetch all sellers
  // and match by computed slug. This is fine at current scale; if the seller
  // list grows past a few thousand, add a slug column and index it.
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, headline, about, avatar_url, cover_url, city, location, hourly_rate, work_preference, is_verified, is_seller, rating_average, rating_count, total_completed_orders, languages, deleted_at",
    )
    .eq("is_seller", true)
    .eq("is_active", true)
    .is("deleted_at", null);

  if (error) {
    console.error("Error fetching professional:", error.message);
    return null;
  }

  const rows = (data || []) as Array<{
    id: string;
    full_name: string | null;
    headline: string | null;
    about: string | null;
    avatar_url: string | null;
    cover_url: string | null;
    city: string | null;
    location: string | null;
    hourly_rate: number | null;
    work_preference: string | null;
    is_verified: boolean | null;
    is_seller: boolean | null;
    rating_average: number | null;
    rating_count: number | null;
    total_completed_orders: number | null;
    languages: string[] | null;
    deleted_at: string | null;
  }>;

  const match = rows.find(
    (candidate) =>
      profileSlug(candidate.full_name || "", candidate.id) === slug,
  );

  if (!match) return null;

  return {
    id: match.id,
    full_name: match.full_name || "",
    headline: match.headline,
    about: match.about,
    avatar_url: match.avatar_url,
    cover_url: match.cover_url,
    city: match.city,
    location: match.location,
    hourly_rate: match.hourly_rate,
    work_preference: match.work_preference,
    is_verified: match.is_verified ?? false,
    is_seller: match.is_seller ?? false,
    rating_average: match.rating_average ?? 0,
    rating_count: match.rating_count ?? 0,
    total_completed_orders: match.total_completed_orders ?? 0,
    languages: match.languages ?? [],
    slug: profileSlug(match.full_name || "", match.id),
  };
}

export async function listPublicProfessionals(limit = 24) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, headline, about, avatar_url, cover_url, city, location, hourly_rate, work_preference, is_verified, is_seller, rating_average, rating_count, total_completed_orders, languages",
    )
    .eq("is_seller", true)
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("rating_average", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching professionals:", error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id as string,
    full_name: (row.full_name as string) || "",
    headline: (row.headline as string) || null,
    about: (row.about as string) || null,
    avatar_url: (row.avatar_url as string) || null,
    cover_url: (row.cover_url as string) || null,
    city: (row.city as string) || null,
    location: (row.location as string) || null,
    hourly_rate: (row.hourly_rate as number) || null,
    work_preference: (row.work_preference as string) || null,
    is_verified: Boolean(row.is_verified),
    is_seller: Boolean(row.is_seller),
    rating_average: (row.rating_average as number) || 0,
    rating_count: (row.rating_count as number) || 0,
    total_completed_orders: (row.total_completed_orders as number) || 0,
    languages: (row.languages as string[]) || [],
    slug: profileSlug((row.full_name as string) || "", row.id as string),
  }));
}
