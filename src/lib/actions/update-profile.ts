"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UpdateProfileState = {
  error?: string;
  success?: boolean;
} | null;

export async function updateProfile(
  prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to update your profile." };
  }

  const fullName = (formData.get("fullName") as string)?.trim();
  const headline = (formData.get("headline") as string)?.trim() || null;
  const about = (formData.get("about") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const city = (formData.get("city") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const hourlyRateRaw = formData.get("hourlyRate") as string;
  const workPreference = (formData.get("workPreference") as string) || null;
  const avatarUrl = (formData.get("avatarUrl") as string)?.trim() || null;
  const coverUrl = (formData.get("coverUrl") as string)?.trim() || null;

  if (!fullName || fullName.length < 2) {
    return { error: "Please enter your full name." };
  }

  if (headline && headline.length > 120) {
    return { error: "Headline must be under 120 characters." };
  }

  const updates: Record<string, unknown> = {
    full_name: fullName,
    headline,
    about,
    phone,
    city,
    location,
    work_preference: workPreference || null,
    avatar_url: avatarUrl,
    cover_url: coverUrl,
  };

  const hourlyRate = hourlyRateRaw ? Number(hourlyRateRaw) : null;
  if (hourlyRateRaw && (Number.isNaN(hourlyRate) || (hourlyRate ?? 0) < 0)) {
    return { error: "Hourly rate must be a positive number." };
  }
  updates.hourly_rate = hourlyRate;

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/profile");

  return { success: true };
}
