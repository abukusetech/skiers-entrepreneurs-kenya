import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canCreateListing, getMarketplaceRole } from "@/lib/auth/permissions";
import { getBusinessProfileByOwner } from "@/lib/db/queries/business-profiles";
import { getOrganizationProfileByOwner } from "@/lib/db/queries/organization-profiles";
import { ListingForm } from "@/components/dashboard/ListingForm";

export const metadata: Metadata = {
  title: "Add Listing",
};

export default async function NewListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/listings/new");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  const role = getMarketplaceRole(profile);

  if (!canCreateListing(role)) {
    redirect("/dashboard");
  }

  if (role === "business") {
    const business = await getBusinessProfileByOwner(user.id);
    if (!business) redirect("/dashboard/business-profile");
  }

  if (role === "organization") {
    const organization = await getOrganizationProfileByOwner(user.id);
    if (!organization) redirect("/dashboard/organization-profile");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
          Add a Listing
        </h1>
        <p className="text-text-secondary">
          A single offering. It will appear on your business or organization
          profile and in the marketplace.
        </p>
      </div>

      <ListingForm mode="create" />
    </div>
  );
}
