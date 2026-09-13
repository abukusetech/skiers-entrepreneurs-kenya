"use server";

import { createClient } from "@/lib/supabase/server";
import { canCreateListing, getMarketplaceRole } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export type UpdateListingState = {
  error?: string;
  success?: boolean;
} | null;

export async function updateListing(
  listingId: string,
  prevState: UpdateListingState,
  formData: FormData,
): Promise<UpdateListingState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  const role = getMarketplaceRole(profile);

  if (!canCreateListing(role)) {
    return { error: "Only business and organization accounts can manage listings." };
  }

  // Confirm this listing belongs to a business owned by the user
  const { data: listing } = await supabase
    .from("services")
    .select("id, business_id, organization_id")
    .eq("id", listingId)
    .maybeSingle();

  if (!listing) {
    return { error: "Listing not found." };
  }

  if (role === "business") {
    const { data: business } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("id", listing.business_id)
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!business) return { error: "You do not own this listing." };
  } else {
    const { data: organization } = await supabase
      .from("organization_profiles")
      .select("id")
      .eq("id", listing.organization_id)
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!organization) return { error: "You do not own this listing." };
  }

  const title = (formData.get("title") as string)?.trim();
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const startingPrice = formData.get("startingPrice") as string;
  const deliveryTimeDays = formData.get("deliveryTimeDays") as string;
  const isRemote = formData.get("isRemote") === "on";
  const location = (formData.get("location") as string)?.trim();
  const coverUrl = (formData.get("coverUrl") as string)?.trim() || null;

  if (!title || title.length < 5) {
    return { error: "Listing title must be at least 5 characters." };
  }
  if (!description || description.length < 20) {
    return { error: "Description must be at least 20 characters." };
  }
  if (!startingPrice) {
    return { error: "Please enter a price." };
  }

  const parsedPrice = parseFloat(startingPrice);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return { error: "Price must be a valid number." };
  }

  const { error } = await supabase
    .from("services")
    .update({
      title,
      description,
      category_id: categoryId,
      starting_price: parsedPrice,
      delivery_time_days: deliveryTimeDays
        ? parseInt(deliveryTimeDays, 10)
        : null,
      is_remote: isRemote,
      is_local: !isRemote,
      location: location || null,
      cover_url: coverUrl,
    })
    .eq("id", listingId);

  if (error) {
    console.error("Error updating listing:", error.message);
    return { error: "Could not update the listing." };
  }

  revalidatePath("/services");
  revalidatePath("/dashboard/listings");
  revalidatePath(`/dashboard/listings/${listingId}`);

  return { success: true };
}

export async function deleteListing(listingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  const role = getMarketplaceRole(profile);

  if (!canCreateListing(role)) {
    return { error: "Only business and organization accounts can manage listings." };
  }

  const { data: listing } = await supabase
    .from("services")
    .select("id, business_id, organization_id")
    .eq("id", listingId)
    .maybeSingle();

  if (!listing) {
    return { error: "Listing not found." };
  }

  if (role === "business") {
    const { data: business } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("id", listing.business_id)
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!business) return { error: "You do not own this listing." };
  } else {
    const { data: organization } = await supabase
      .from("organization_profiles")
      .select("id")
      .eq("id", listing.organization_id)
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!organization) return { error: "You do not own this listing." };
  }

  const { error } = await supabase
    .from("services")
    .update({
      status: "archived",
      deleted_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/services");
  revalidatePath("/dashboard/listings");
  return { success: true };
}
