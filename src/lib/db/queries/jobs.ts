import { createClient } from "@/lib/supabase/server";

export type JobListItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  budget_type: string;
  currency: string;
  deadline: string | null;
  location: string | null;
  is_remote: boolean;
  experience_level: string | null;
  project_scope: string | null;
  status: string;
  proposal_count: number;
  view_count: number;
  created_at: string;
  published_at: string | null;
  buyer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    is_verified: boolean;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  business_name: string | null;
  business_logo_url: string | null;
  organization_name: string | null;
  organization_logo_url: string | null;
};

export type JobDetail = JobListItem & {
  skills: string[];
  attachments: {
    id: string;
    file_url: string;
    file_name: string | null;
    file_size: number | null;
  }[];
};

export type ProposalItem = {
  id: string;
  cover_letter: string;
  proposed_price: number | null;
  delivery_time_days: number | null;
  is_shortlisted: boolean;
  status: string;
  created_at: string;
  seller: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    headline: string | null;
    is_verified: boolean;
    rating_average: number;
    rating_count: number;
    total_completed_orders: number;
    cv_url: string | null;
  } | null;
};

type RawJob = {
  id: string;
  title: string;
  slug: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  budget_type: string;
  currency: string;
  deadline: string | null;
  location: string | null;
  is_remote: boolean;
  experience_level: string | null;
  project_scope: string | null;
  status: string;
  proposal_count: number;
  view_count: number;
  created_at: string;
  published_at: string | null;
  buyer:
    | {
        id: string;
        full_name: string;
        avatar_url: string | null;
        is_verified: boolean;
      }
    | {
        id: string;
        full_name: string;
        avatar_url: string | null;
        is_verified: boolean;
      }[]
    | null;
  category:
    | { id: string; name: string; slug: string }
    | { id: string; name: string; slug: string }[]
    | null;
  business:
    | { name: string; logo_url: string | null }
    | { name: string; logo_url: string | null }[]
    | null;
  organization:
    | { name: string; logo_url: string | null }
    | { name: string; logo_url: string | null }[]
    | null;
};

function normalizeJob(row: unknown): JobListItem {
  const raw = row as RawJob;
  const buyer = Array.isArray(raw.buyer) ? raw.buyer[0] : raw.buyer;
  const category = Array.isArray(raw.category) ? raw.category[0] : raw.category;
  const business = Array.isArray(raw.business) ? raw.business[0] : raw.business;
  const organization = Array.isArray(raw.organization)
    ? raw.organization[0]
    : raw.organization;

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    budget_min: raw.budget_min,
    budget_max: raw.budget_max,
    budget_type: raw.budget_type,
    currency: raw.currency,
    deadline: raw.deadline,
    location: raw.location,
    is_remote: raw.is_remote,
    experience_level: raw.experience_level,
    project_scope: raw.project_scope,
    status: raw.status,
    proposal_count: raw.proposal_count,
    view_count: raw.view_count,
    created_at: raw.created_at,
    published_at: raw.published_at,
    buyer: buyer ?? null,
    category: category ?? null,
    business_name: business?.name ?? null,
    business_logo_url: business?.logo_url ?? null,
    organization_name: organization?.name ?? null,
    organization_logo_url: organization?.logo_url ?? null,
  };
}

const jobSelect = `
  id,
  title,
  slug,
  description,
  budget_min,
  budget_max,
  budget_type,
  currency,
  deadline,
  location,
  is_remote,
  experience_level,
  project_scope,
  status,
  proposal_count,
  view_count,
  created_at,
  published_at,
  buyer:profiles!jobs_buyer_id_fkey(
    id,
    full_name,
    avatar_url,
    is_verified
  ),
  category:categories!jobs_category_id_fkey(
    id,
    name,
    slug
  ),
  business:business_profiles!jobs_business_id_fkey(
    name,
    logo_url
  ),
  organization:organization_profiles!jobs_organization_id_fkey(
    name,
    logo_url
  )
`;

export async function getPublishedJobs(options?: {
  categorySlug?: string;
  searchQuery?: string;
  limit?: number;
}): Promise<JobListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select(jobSelect)
    .eq("status", "published")
    .eq("visibility", "public")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching jobs:", error.message);
    return [];
  }

  let jobs = (data || []).map(normalizeJob);

  if (options?.categorySlug) {
    jobs = jobs.filter((j) => j.category?.slug === options.categorySlug);
  }

  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase();
    jobs = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.buyer?.full_name.toLowerCase().includes(q) ||
        j.business_name?.toLowerCase().includes(q) ||
        j.organization_name?.toLowerCase().includes(q) ||
        j.category?.name.toLowerCase().includes(q),
    );
  }

  return jobs;
}

export async function getJobBySlug(slug: string): Promise<JobDetail | null> {
  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from("jobs")
    .select(jobSelect)
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !job) {
    if (error) console.error("Error fetching job:", error.message);
    return null;
  }

  const normalized = normalizeJob(job);

  const [skillsRes, attachmentsRes] = await Promise.all([
    supabase
      .from("job_skills")
      .select("skill:skills(id, name, slug)")
      .eq("job_id", job.id),
    supabase
      .from("job_attachments")
      .select("id, file_url, file_name, file_size")
      .eq("job_id", job.id),
  ]);

  const skills = (skillsRes.data || [])
    .map((row) => {
      const skillField = row.skill as
        | { name?: string }
        | { name?: string }[]
        | null;
      if (Array.isArray(skillField)) return skillField[0]?.name;
      return skillField?.name;
    })
    .filter((name): name is string => Boolean(name));

  return {
    ...normalized,
    skills,
    attachments: attachmentsRes.data || [],
  };
}

export async function getBuyerJobs(buyerId: string): Promise<JobListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(jobSelect)
    .eq("buyer_id", buyerId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching buyer jobs:", error.message);
    return [];
  }

  return (data || []).map(normalizeJob);
}

export async function getProposalsForJob(
  jobId: string,
): Promise<ProposalItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("proposals")
    .select(
      `
      id,
      cover_letter,
      proposed_price,
      delivery_time_days,
      is_shortlisted,
      status,
      created_at,
      seller:profiles!proposals_seller_id_fkey(
        id,
        full_name,
        avatar_url,
        headline,
        is_verified,
        rating_average,
        rating_count,
        total_completed_orders,
        cv_url
      )
    `,
    )
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching proposals:", error.message);
    return [];
  }

  return (data || []) as unknown as ProposalItem[];
}

export async function getSellerProposals(sellerId: string): Promise<
  {
    id: string;
    cover_letter: string;
    proposed_price: number | null;
    delivery_time_days: number | null;
    status: string;
    created_at: string;
    job: {
      id: string;
      title: string;
      slug: string;
      status: string;
      budget_min: number | null;
      budget_max: number | null;
      currency: string;
    } | null;
  }[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("proposals")
    .select(
      `
      id,
      cover_letter,
      proposed_price,
      delivery_time_days,
      status,
      created_at,
      job:jobs!proposals_job_id_fkey(
        id,
        title,
        slug,
        status,
        budget_min,
        budget_max,
        currency
      )
    `,
    )
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching seller proposals:", error.message);
    return [];
  }

  return (data || []) as unknown as {
    id: string;
    cover_letter: string;
    proposed_price: number | null;
    delivery_time_days: number | null;
    status: string;
    created_at: string;
    job: {
      id: string;
      title: string;
      slug: string;
      status: string;
      budget_min: number | null;
      budget_max: number | null;
      currency: string;
    } | null;
  }[];
}

export async function getSellerProposalForJob(
  jobId: string,
  sellerId: string,
): Promise<{ id: string; status: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("proposals")
    .select("id, status")
    .eq("job_id", jobId)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}
