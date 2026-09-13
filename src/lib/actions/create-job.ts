"use server";

import { createClient } from "@/lib/supabase/server";
import { getMarketplaceRole, canPostJobs } from "@/lib/auth/permissions";
import { slugify } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

export type CreateJobState = {
  error?: string;
  success?: boolean;
  jobSlug?: string;
} | null;

export async function createJob(
  prevState: CreateJobState,
  formData: FormData,
): Promise<CreateJobState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to post a job." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  const role = getMarketplaceRole(profile);

  if (!canPostJobs(role)) {
    return {
      error: "Only buyers, businesses, and organizations can post jobs.",
    };
  }

  const title = (formData.get("title") as string)?.trim();
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const budgetType = (formData.get("budgetType") as string) || "fixed";
  const budgetMin = formData.get("budgetMin") as string;
  const budgetMax = formData.get("budgetMax") as string;
  const deadline = (formData.get("deadline") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const isRemote = formData.get("isRemote") === "on";
  const experienceLevel =
    (formData.get("experienceLevel") as string) || "intermediate";
  const projectScope = (formData.get("projectScope") as string) || "medium";
  const skillsRaw = (formData.get("skills") as string)?.trim();

  if (!title || title.length < 10) {
    return { error: "Job title must be at least 10 characters." };
  }
  if (!categoryId) {
    return { error: "Please pick a category." };
  }
  if (!description || description.length < 50) {
    return { error: "Description must be at least 50 characters." };
  }

  let parsedBudgetMin: number | null = null;
  let parsedBudgetMax: number | null = null;

  if (budgetMin) {
    const n = parseFloat(budgetMin);
    if (isNaN(n) || n < 0) {
      return { error: "Minimum budget must be a valid number." };
    }
    parsedBudgetMin = n;
  }
  if (budgetMax) {
    const n = parseFloat(budgetMax);
    if (isNaN(n) || n < 0) {
      return { error: "Maximum budget must be a valid number." };
    }
    parsedBudgetMax = n;
  }
  if (
    parsedBudgetMin !== null &&
    parsedBudgetMax !== null &&
    parsedBudgetMax < parsedBudgetMin
  ) {
    return { error: "Maximum budget must be greater than minimum." };
  }

  let businessId: string | null = null;
  let organizationId: string | null = null;

  if (role === "business") {
    const { data: business } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!business) {
      return {
        error: "Complete your business profile before posting a job.",
      };
    }

    businessId = business.id;
  }

  if (role === "organization") {
    const { data: organization } = await supabase
      .from("organization_profiles")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!organization) {
      return {
        error: "Complete your organization profile before posting a job.",
      };
    }

    organizationId = organization.id;
  }

  const slug = slugify(title);

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .insert({
      buyer_id: user.id,
      business_id: businessId,
      organization_id: organizationId,
      title,
      slug,
      description,
      category_id: categoryId,
      budget_type: budgetType,
      budget_min: parsedBudgetMin,
      budget_max: parsedBudgetMax,
      currency: "KES",
      deadline: deadline || null,
      location: location || null,
      is_remote: isRemote,
      is_onsite: !isRemote,
      experience_level: experienceLevel,
      project_scope: projectScope,
      status: "published",
      visibility: "public",
      published_at: new Date().toISOString(),
    })
    .select("id, slug")
    .single();

  if (jobError || !job) {
    console.error("Error creating job:", jobError?.message);
    return { error: "Could not post your job. Please try again." };
  }

  if (skillsRaw) {
    const skillNames = skillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const skillName of skillNames) {
      const skillSlug = skillName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const { data: existingSkill } = await supabase
        .from("skills")
        .select("id")
        .eq("slug", skillSlug)
        .maybeSingle();

      let skillId = existingSkill?.id;

      if (!skillId) {
        const { data: newSkill } = await supabase
          .from("skills")
          .insert({ name: skillName, slug: skillSlug })
          .select("id")
          .maybeSingle();
        skillId = newSkill?.id;
      }

      if (skillId) {
        await supabase.from("job_skills").upsert({
          job_id: job.id,
          skill_id: skillId,
        });
      }
    }
  }

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");

  return { success: true, jobSlug: job.slug };
}
