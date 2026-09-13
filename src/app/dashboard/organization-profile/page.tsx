import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationProfileByOwner } from "@/lib/db/queries/organization-profiles";
import { OrganizationProfileForm } from "@/components/dashboard/OrganizationProfileForm";
import { DeleteOrganizationProfile } from "@/components/dashboard/DeleteOrganizationProfile";

export const metadata: Metadata = {
  title: "Organization Profile",
};

export default async function OrganizationProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/organization-profile");
  }

  const profile = await getOrganizationProfileByOwner(user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
          Organization Profile
        </h1>
        <p className="text-text-secondary">
          This is what freelancers see when you post work on SKIERS.
        </p>
      </div>

      {profile && (profile.cover_url || profile.logo_url) && (
        <div className="mb-8 rounded-2xl overflow-hidden border border-border bg-white max-w-3xl">
          <div className="relative h-40 bg-linear-to-r from-primary/10 to-accent/5">
            {profile.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.cover_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div className="px-6 pb-5 -mt-10 relative">
            {profile.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.logo_url}
                alt="Logo"
                className="w-20 h-20 rounded-full border-4 border-white object-cover bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-primary">
                  {profile.name.charAt(0)}
                </span>
              </div>
            )}
            <h2 className="text-xl font-display font-bold text-text-primary mt-3">
              {profile.name}
            </h2>
            {profile.tagline && (
              <p className="text-sm text-text-secondary mt-0.5">
                {profile.tagline}
              </p>
            )}
          </div>
        </div>
      )}

      <OrganizationProfileForm
        initial={{
          name: profile?.name || "",
          tagline: profile?.tagline || "",
          description: profile?.description || "",
          organizationType: profile?.organization_type || "",
          sector: profile?.sector || "",
          categoryId: profile?.category_id || "",
          phone: profile?.phone || "",
          email: profile?.email || "",
          website: profile?.website || "",
          county: profile?.county || "",
          town: profile?.town || "",
          address: profile?.address || "",
          employeeCount: profile?.employee_count?.toString() || "",
          foundedYear: profile?.founded_year?.toString() || "",
          registrationNumber: profile?.registration_number || "",
          taxId: profile?.tax_id || "",
          logoUrl: profile?.logo_url || "",
          coverUrl: profile?.cover_url || "",
        }}
      />

      {profile && <DeleteOrganizationProfile />}
    </div>
  );
}
