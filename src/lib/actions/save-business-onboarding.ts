"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

export type BusinessOnboardingState = {
  error?: string;
  success?: boolean;
  slug?: string;
} | null;

export async function saveBusinessOnboarding(
  prevState: BusinessOnboardingState,
  formData: FormData,
): Promise<BusinessOnboardingState> {
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
  const industry = (formData.get("industry") as string)?.trim() || null;
  const categoryId = (formData.get("categoryId") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const website = (formData.get("website") as string)?.trim() || null;
  const county = (formData.get("county") as string)?.trim() || null;
  const town = (formData.get("town") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;
  const building = (formData.get("building") as string)?.trim() || null;
  const servicesRaw = (formData.get("services") as string)?.trim() || "";
  const registrationNumber =
    (formData.get("registrationNumber") as string)?.trim() || null;
  const kraPin = (formData.get("kraPin") as string)?.trim() || null;
  const hoursRaw = (formData.get("hours") as string)?.trim() || "{}";
  const logoUrl = (formData.get("logoUrl") as string)?.trim() || null;
  const coverUrl = (formData.get("coverUrl") as string)?.trim() || null;

  if (!name || name.length < 2) {
    return { error: "Business name is required." };
  }
  if (!description || description.length < 50) {
    return { error: "Description must be at least 50 characters." };
  }
  if (!categoryId) {
    return { error: "Please pick a category." };
  }

  const services = servicesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let hours: Record<string, unknown> = {};
  try {
    hours = JSON.parse(hoursRaw);
  } catch {
    hours = {};
  }

  // Check if the owner already has a business profile.
  const { data: existing } = await supabase
    .from("business_profiles")
    .select("id, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  const payload = {
    owner_id: user.id,
    name,
    tagline,
    description,
    industry,
    category_id: categoryId,
    phone,
    email,
    website,
    county,
    town,
    address,
    building,
    services,
    hours,
    registration_number: registrationNumber,
    kra_pin: kraPin,
    logo_url: logoUrl,
    cover_url: coverUrl,
    onboarding_completed: true,
  };

  if (existing) {
    const { error } = await supabase
      .from("business_profiles")
      .update(payload)
      .eq("id", existing.id);

    if (error) {
      console.error("Error updating business profile:", error.message);
      return { error: "Could not save your business profile." };
    }

    // Link profile → business
    await supabase
      .from("profiles")
      .update({
        business_id: existing.id,
        onboarding_role: "business",
        onboarding_completed: true,
      })
      .eq("id", user.id);

    revalidatePath("/dashboard", "layout");
    return { success: true, slug: existing.slug };
  }

  const slug = slugify(name);

  const { data: created, error: createError } = await supabase
    .from("business_profiles")
    .insert({ ...payload, slug })
    .select("id, slug")
    .single();

  if (createError || !created) {
    console.error("Error creating business profile:", createError?.message);
    return { error: "Could not create your business profile." };
  }

  await supabase
    .from("profiles")
    .update({
      business_id: created.id,
      onboarding_role: "business",
      onboarding_completed: true,
    })
    .eq("id", user.id);

  revalidatePath("/dashboard", "layout");
  return { success: true, slug: created.slug };
}
