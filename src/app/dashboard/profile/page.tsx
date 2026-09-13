import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { DeleteAccountSection } from "@/components/dashboard/DeleteAccountSection";

export const metadata: Metadata = {
  title: "Profile Settings",
};

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, headline, about, phone, city, location, hourly_rate, work_preference, is_seller, avatar_url, cover_url",
    )
    .eq("id", user.id)
    .single();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
          Profile Settings
        </h1>
        <p className="text-text-secondary">
          This is what buyers, clients, and collaborators see about you.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 max-w-2xl">
        <ProfileForm
          isSeller={profile?.is_seller ?? false}
          initial={{
            fullName: profile?.full_name || "",
            headline: profile?.headline || "",
            about: profile?.about || "",
            phone: profile?.phone || "",
            city: profile?.city || "",
            location: profile?.location || "",
            hourlyRate: profile?.hourly_rate?.toString() || "",
            workPreference: profile?.work_preference || "",
            avatarUrl: profile?.avatar_url || "",
            coverUrl: profile?.cover_url || "",
          }}
        />
      </div>

      <DeleteAccountSection />
    </div>
  );
}
