import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { canCreateListing, getMarketplaceRole } from "@/lib/auth/permissions";
import { ListingForm } from "@/components/dashboard/ListingForm";

export const metadata: Metadata = { title: "Edit Listing" };

interface PageProps { params: Promise<{ id: string }> }

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirect=/dashboard/listings/${id}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();
  const role = getMarketplaceRole(profile);
  if (!canCreateListing(role)) redirect("/dashboard");

  const { data: listing } = await supabase
    .from("services")
    .select("id, title, description, category_id, starting_price, delivery_time_days, is_remote, location, cover_url, business_id, organization_id")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!listing) notFound();

  if (role === "business") {
    const { data: business } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("id", listing.business_id)
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!business) notFound();
  } else {
    const { data: organization } = await supabase
      .from("organization_profiles")
      .select("id")
      .eq("id", listing.organization_id)
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!organization) notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">Edit Listing</h1>
        <p className="text-text-secondary">Update your listing. Changes appear immediately on the marketplace.</p>
      </div>
      <ListingForm
        mode="edit"
        listingId={listing.id}
        initial={{
          title: listing.title,
          description: listing.description,
          categoryId: listing.category_id || "",
          startingPrice: listing.starting_price.toString(),
          deliveryTimeDays: listing.delivery_time_days?.toString() || "",
          isRemote: listing.is_remote,
          location: listing.location || "",
          coverUrl: listing.cover_url || "",
        }}
      />
    </div>
  );
}
