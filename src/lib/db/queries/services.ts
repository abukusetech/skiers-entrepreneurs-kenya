import { createClient } from "@/lib/supabase/server";

export type ServiceListItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  starting_price: number;
  currency: string;
  delivery_time_days: number | null;
  rating_average: number;
  rating_count: number;
  order_count: number;
  view_count: number;
  status: string;
  created_at: string;
  cover_url: string | null;
  seller: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    headline: string | null;
    is_verified: boolean;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  business_id: string | null;
  business_name: string | null;
  business_logo_url: string | null;
  business_verified: boolean | null;
};

export type ServiceDetail = ServiceListItem & {
  revision_limit: number | null;
  is_remote: boolean;
  is_local: boolean;
  location: string | null;
  packages: {
    id: string;
    package_type: string;
    title: string;
    description: string | null;
    price: number;
    delivery_time_days: number | null;
    revision_limit: number | null;
  }[];
  images: {
    id: string;
    image_url: string;
    sort_order: number;
  }[];
  faqs: {
    id: string;
    question: string;
    answer: string;
    sort_order: number;
  }[];
};

const serviceSelect = `
  id,
  title,
  slug,
  description,
  starting_price,
  currency,
  delivery_time_days,
  rating_average,
  rating_count,
  order_count,
  view_count,
  status,
  created_at,
  cover_url,
  business_id,
  seller:profiles!services_seller_id_fkey(
    id,
    full_name,
    avatar_url,
    headline,
    is_verified
  ),
  category:categories!services_category_id_fkey(
    id,
    name,
    slug
  ),
  business:business_profiles!services_business_id_fkey(
    name,
    logo_url,
    verification_status
  )
`;

type RawService = Omit<
  ServiceListItem,
  "business_name" | "business_logo_url" | "business_verified"
> & {
  business:
    | { name: string; logo_url: string | null; verification_status: string }
    | { name: string; logo_url: string | null; verification_status: string }[]
    | null;
};

function normalizeService(row: unknown): ServiceListItem {
  const raw = row as RawService;
  const biz = Array.isArray(raw.business) ? raw.business[0] : raw.business;
  return {
    ...raw,
    business_name: biz?.name ?? null,
    business_logo_url: biz?.logo_url ?? null,
    business_verified: biz?.verification_status === "verified",
  };
}

export async function getPublishedServices(options?: {
  categorySlug?: string;
  searchQuery?: string;
  limit?: number;
}): Promise<ServiceListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("services")
    .select(serviceSelect)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching services:", error.message);
    return [];
  }

  let services = (data || []).map(normalizeService);

  if (options?.categorySlug) {
    services = services.filter(
      (s) => s.category?.slug === options.categorySlug,
    );
  }

  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase();
    services = services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.seller?.full_name.toLowerCase().includes(q) ||
        s.business_name?.toLowerCase().includes(q) ||
        s.category?.name.toLowerCase().includes(q),
    );
  }

  return services;
}

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceDetail | null> {
  const supabase = await createClient();

  const { data: service, error } = await supabase
    .from("services")
    .select(
      `
      id,
      title,
      slug,
      description,
      starting_price,
      currency,
      delivery_time_days,
      revision_limit,
      rating_average,
      rating_count,
      order_count,
      view_count,
      status,
      created_at,
      cover_url,
      is_remote,
      is_local,
      location,
      business_id,
      seller:profiles!services_seller_id_fkey(
        id,
        full_name,
        avatar_url,
        headline,
        is_verified
      ),
      category:categories!services_category_id_fkey(
        id,
        name,
        slug
      ),
      business:business_profiles!services_business_id_fkey(
        name,
        logo_url,
        verification_status
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !service) {
    if (error) console.error("Error fetching service:", error.message);
    return null;
  }

  const [packagesRes, imagesRes, faqsRes] = await Promise.all([
    supabase
      .from("service_packages")
      .select(
        "id, package_type, title, description, price, delivery_time_days, revision_limit",
      )
      .eq("service_id", service.id)
      .order("price", { ascending: true }),
    supabase
      .from("service_images")
      .select("id, image_url, sort_order")
      .eq("service_id", service.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("service_faqs")
      .select("id, question, answer, sort_order")
      .eq("service_id", service.id)
      .order("sort_order", { ascending: true }),
  ]);

  const normalized = normalizeService(service);

  const detail: ServiceDetail = {
    ...normalized,
    revision_limit:
      (service as { revision_limit?: number | null }).revision_limit ?? null,
    is_remote: (service as { is_remote?: boolean }).is_remote ?? true,
    is_local: (service as { is_local?: boolean }).is_local ?? false,
    location: (service as { location?: string | null }).location ?? null,
    packages: packagesRes.data || [],
    images: imagesRes.data || [],
    faqs: faqsRes.data || [],
  };

  return detail;
}

export async function getSellerServices(
  sellerId: string,
): Promise<ServiceListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select(serviceSelect)
    .eq("seller_id", sellerId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching seller services:", error.message);
    return [];
  }

  return (data || []).map(normalizeService);
}

export async function getBusinessListings(
  businessId: string,
): Promise<ServiceListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select(serviceSelect)
    .eq("business_id", businessId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching business listings:", error.message);
    return [];
  }

  return (data || []).map(normalizeService);
}
