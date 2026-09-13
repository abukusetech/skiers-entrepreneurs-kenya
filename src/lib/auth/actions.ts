"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AuthState = {
  error?: string;
  success?: boolean;
  message?: string;
  redirectTo?: string;
} | null;

export type WorkerOnboardingState = {
  error?: string;
  success?: boolean;
} | null;

export async function signup(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string)?.trim();
  const roleChoice = formData.get("roleChoice") as string;

  if (!email || !password || !fullName) {
    return { error: "Please fill in every field." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (
    !roleChoice ||
    !["buyer", "worker", "business", "organization"].includes(roleChoice)
  ) {
    return { error: "Please choose what brings you to SKIERS." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) return { error: error.message };

  if (data?.user?.identities?.length === 0) {
    return { error: "An account with this email already exists." };
  }

  if (!data?.user) {
    return { error: "Something went wrong. Please try again." };
  }

  const updates: Record<string, unknown> = {
    role_choice: roleChoice,
    account_type:
      roleChoice === "worker"
        ? "seller"
        : roleChoice === "buyer"
          ? "buyer"
          : "both",
    is_buyer: roleChoice !== "worker",
    is_seller:
      roleChoice === "worker" ||
      roleChoice === "business" ||
      roleChoice === "organization",
  };

  const { error: profileError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", data.user.id);

  if (profileError) {
    console.error(
      "Failed to update profile after signup:",
      profileError.message,
    );
  }

  revalidatePath("/", "layout");

  const redirectTo =
    roleChoice === "worker"
      ? "/onboarding/worker"
      : roleChoice === "business"
        ? "/dashboard/business-profile"
        : roleChoice === "organization"
          ? "/dashboard/organization-profile"
          : "/dashboard";

  return { success: true, redirectTo };
}

export async function login(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "Wrong email or password." };

  revalidatePath("/", "layout");
  return { success: true, redirectTo: "/dashboard" };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

export async function saveWorkerOnboarding(
  prevState: WorkerOnboardingState,
  formData: FormData,
): Promise<WorkerOnboardingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You are not signed in. Please log in again." };

  const headline = (formData.get("headline") as string)?.trim();
  const primaryCategoryId = (
    formData.get("primaryCategoryId") as string
  )?.trim();
  const experienceLevel = (formData.get("experienceLevel") as string)?.trim();
  const yearsOfExperience = formData.get("yearsOfExperience") as string;
  const skills = (formData.get("skills") as string)?.trim();
  const about = (formData.get("about") as string)?.trim();
  const workPreference = (formData.get("workPreference") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const hourlyRate = formData.get("hourlyRate") as string;
  const fixedRateFrom = formData.get("fixedRateFrom") as string;
  const avatarUrl = (formData.get("avatarUrl") as string)?.trim();
  const cvUrl = (formData.get("cvUrl") as string)?.trim();

  if (!headline || headline.length < 10) {
    return { error: "Your headline should be at least 10 characters." };
  }
  if (!primaryCategoryId) return { error: "Please pick a category." };
  if (!experienceLevel) return { error: "Please pick an experience level." };
  if (!skills || skills.length < 2)
    return { error: "Please add at least 3 skills." };
  if (!about || about.length < 50) {
    return {
      error: "Tell us a bit more about yourself. At least 50 characters.",
    };
  }
  if (!workPreference) return { error: "Please pick your work preference." };

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      headline,
      primary_category_id: primaryCategoryId,
      experience_level: experienceLevel,
      years_of_experience: yearsOfExperience
        ? parseInt(yearsOfExperience)
        : null,
      about,
      work_preference: workPreference,
      location: location || null,
      hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
      fixed_rate_from: fixedRateFrom ? parseFloat(fixedRateFrom) : null,
      avatar_url: avatarUrl || null,
      cv_url: cvUrl || null,
      onboarding_completed: true,
      onboarding_role: "worker",
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to save worker onboarding:", updateError.message);
    return { error: "Could not save your details. Please try again." };
  }

  const skillNames = skills
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const skillName of skillNames) {
    const slug = skillName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const { data: existing } = await supabase
      .from("skills")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    let skillId = existing?.id;
    if (!skillId) {
      const { data: created } = await supabase
        .from("skills")
        .insert({ name: skillName, slug })
        .select("id")
        .maybeSingle();
      skillId = created?.id;
    }
    if (skillId) {
      await supabase
        .from("profile_skills")
        .upsert({ profile_id: user.id, skill_id: skillId });
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}
