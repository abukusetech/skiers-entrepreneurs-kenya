import { createClient } from "@/lib/supabase/server";

export type CategoryWithCounts = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  serviceCount: number;
  jobCount: number;
};

// Live counts of published services + published jobs per category, keyed
// by category slug. Used to replace hardcoded marketing numbers with real
// figures pulled from the database.
export async function getCategoryCounts(): Promise<
  Record<string, { serviceCount: number; jobCount: number }>
> {
  const supabase = await createClient();

  const [categoriesRes, servicesRes, jobsRes] = await Promise.all([
    supabase.from("categories").select("id, slug").eq("is_active", true),
    supabase
      .from("services")
      .select("category_id")
      .eq("status", "published")
      .is("deleted_at", null),
    supabase
      .from("jobs")
      .select("category_id")
      .eq("status", "published")
      .eq("visibility", "public")
      .is("deleted_at", null),
  ]);

  const categories = categoriesRes.data || [];
  const services = servicesRes.data || [];
  const jobs = jobsRes.data || [];

  const serviceCountByCategory = new Map<string, number>();
  for (const s of services) {
    if (!s.category_id) continue;
    serviceCountByCategory.set(
      s.category_id,
      (serviceCountByCategory.get(s.category_id) || 0) + 1,
    );
  }

  const jobCountByCategory = new Map<string, number>();
  for (const j of jobs) {
    if (!j.category_id) continue;
    jobCountByCategory.set(
      j.category_id,
      (jobCountByCategory.get(j.category_id) || 0) + 1,
    );
  }

  const result: Record<string, { serviceCount: number; jobCount: number }> =
    {};
  for (const cat of categories) {
    result[cat.slug] = {
      serviceCount: serviceCountByCategory.get(cat.id) || 0,
      jobCount: jobCountByCategory.get(cat.id) || 0,
    };
  }

  return result;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<{ id: string; name: string; slug: string; description: string | null } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}
