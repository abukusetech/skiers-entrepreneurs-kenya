import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, email, avatar_url, is_buyer, is_seller, is_verified, role_choice, onboarding_role",
    )
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="container-site py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <DashboardSidebar
            fullName={profile?.full_name || "Your account"}
            email={profile?.email || user.email || ""}
            avatarUrl={profile?.avatar_url || null}
            isBuyer={profile?.is_buyer ?? true}
            isSeller={profile?.is_seller ?? false}
            isVerified={profile?.is_verified ?? false}
            onboardingRole={
              profile?.onboarding_role ?? profile?.role_choice ?? null
            }
          />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
