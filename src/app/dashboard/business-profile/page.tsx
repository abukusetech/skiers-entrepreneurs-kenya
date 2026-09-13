import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessProfileByOwner } from "@/lib/db/queries/business-profiles";
import { BusinessProfileForm } from "@/components/dashboard/BusinessProfileForm";
import { DeleteBusinessProfile } from "@/components/dashboard/DeleteBusinessProfile";

export const metadata: Metadata = {
  title: "Business Profile",
};

export default async function BusinessProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/business-profile");
  }

  const profile = await getBusinessProfileByOwner(user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
          Business Profile
        </h1>
        <p className="text-text-secondary">
          This is what customers see when they find your business on SKIERS.
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

      <BusinessProfileForm
        initial={{
          name: profile?.name || "",
          tagline: profile?.tagline || "",
          description: profile?.description || "",
          industry: profile?.industry || "",
          categoryId: profile?.category_id || "",
          phone: profile?.phone || "",
          email: profile?.email || "",
          website: profile?.website || "",
          county: profile?.county || "",
          town: profile?.town || "",
          address: profile?.address || "",
          building: profile?.building || "",
          services: profile?.services.join(", ") || "",
          registrationNumber: profile?.registration_number || "",
          kraPin: profile?.kra_pin || "",
          logoUrl: profile?.logo_url || "",
          coverUrl: profile?.cover_url || "",
        }}
      />

      {profile && <DeleteBusinessProfile />}
    </div>
  );
}
