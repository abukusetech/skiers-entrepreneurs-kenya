"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

export type OrganizationProfileState = {
  error?: string;
  success?: boolean;
  slug?: string;
} | null;

export async function saveOrganizationProfile(
  prevState: OrganizationProfileState,
  formData: FormData,
): Promise<OrganizationProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You are not signed in." };
  }

  const name = (formData.get("name") as string)?.trim();
  const tagline = (formData.get("tagline") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const organizationType =
    (formData.get("organizationType") as string)?.trim() || null;
  const sector = (formData.get("sector") as string)?.trim() || null;
  const categoryId = (formData.get("categoryId") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const website = (formData.get("website") as string)?.trim() || null;
  const county = (formData.get("county") as string)?.trim() || null;
  const town = (formData.get("town") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;
  const employeeCount = formData.get("employeeCount") as string;
  const foundedYear = formData.get("foundedYear") as string;
  const registrationNumber =
    (formData.get("registrationNumber") as string)?.trim() || null;
  const taxId = (formData.get("taxId") as string)?.trim() || null;
  const logoUrl = (formData.get("logoUrl") as string)?.trim() || null;
  const coverUrl = (formData.get("coverUrl") as string)?.trim() || null;

  if (!name || name.length < 2) {
    return { error: "Organization name is required." };
  }
  if (!description || description.length < 50) {
    return { error: "Description must be at least 50 characters." };
  }
  if (!organizationType) {
    return { error: "Please select the organization type." };
  }
  if (!categoryId) {
    return { error: "Please pick a sector category." };
  }

  const { data: existing } = await supabase
    .from("organization_profiles")
    .select("id, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  const payload = {
    owner_id: user.id,
    name,
    tagline,
    description,
    organization_type: organizationType,
    sector,
    category_id: categoryId,
    phone,
    email,
    website,
    county,
    town,
    address,
    employee_count: employeeCount ? parseInt(employeeCount, 10) : null,
    founded_year: foundedYear ? parseInt(foundedYear, 10) : null,
    registration_number: registrationNumber,
    tax_id: taxId,
    logo_url: logoUrl,
    cover_url: coverUrl,
    onboarding_completed: true,
  };

  if (existing) {
    const { error } = await supabase
      .from("organization_profiles")
      .update(payload)
      .eq("id", existing.id);

    if (error) {
      console.error("Error updating organization:", error.message);
      return { error: "Could not save your organization profile." };
    }

    await supabase
      .from("profiles")
      .update({
        organization_id: existing.id,
        onboarding_role: "organization",
      })
      .eq("id", user.id);

    revalidatePath("/dashboard", "layout");
    return { success: true, slug: existing.slug };
  }

  const slug = slugify(name);

  const { data: created, error: createError } = await supabase
    .from("organization_profiles")
    .insert({ ...payload, slug })
    .select("id, slug")
    .single();

  if (createError || !created) {
    console.error("Error creating organization:", createError?.message);
    return { error: "Could not create your organization profile." };
  }

  await supabase
    .from("profiles")
    .update({
      organization_id: created.id,
      onboarding_role: "organization",
    })
    .eq("id", user.id);

  revalidatePath("/dashboard", "layout");
  return { success: true, slug: created.slug };
}
