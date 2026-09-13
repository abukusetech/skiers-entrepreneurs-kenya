"use server";

import { createClient } from "@/lib/supabase/server";
import { canCreateListing, getMarketplaceRole } from "@/lib/auth/permissions";
import { slugify } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

export type CreateListingState = {
  error?: string;
  success?: boolean;
  listingSlug?: string;
} | null;

export async function createListing(
  prevState: CreateListingState,
  formData: FormData,
): Promise<CreateListingState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to add a listing." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  const role = getMarketplaceRole(profile);

  if (!canCreateListing(role)) {
    return {
      error: "Only business and organization accounts can create listings.",
    };
  }

  let businessId: string | null = null;
  let organizationId: string | null = null;

  if (role === "business") {
    const { data: business } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!business) {
      return {
        error:
          "You need to complete your business profile before adding listings.",
      };
    }

    businessId = business.id;
  }

  if (role === "organization") {
    const { data: organization } = await supabase
      .from("organization_profiles")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!organization) {
      return {
        error:
          "You need to complete your organization profile before adding listings.",
      };
    }

    organizationId = organization.id;
  }

  const title = (formData.get("title") as string)?.trim();
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const startingPrice = formData.get("startingPrice") as string;
  const deliveryTimeDays = formData.get("deliveryTimeDays") as string;
  const revisionLimit = formData.get("revisionLimit") as string;
  const isRemote = formData.get("isRemote") === "on";
  const location = (formData.get("location") as string)?.trim();
  const coverUrl = (formData.get("coverUrl") as string)?.trim() || null;
  const imageUrlsRaw = (formData.get("imageUrls") as string) || "";

  if (!title || title.length < 5) {
    return { error: "Listing title must be at least 5 characters." };
  }
  if (!categoryId) {
    return { error: "Please pick a category." };
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

  const slug = slugify(title);

  const { data: listing, error: listingError } = await supabase
    .from("services")
    .insert({
      seller_id: user.id,
      business_id: businessId,
      organization_id: organizationId,
      title,
      slug,
      description,
      category_id: categoryId,
      starting_price: parsedPrice,
      currency: "KES",
      delivery_time_days: deliveryTimeDays
        ? parseInt(deliveryTimeDays, 10)
        : null,
      revision_limit: revisionLimit ? parseInt(revisionLimit, 10) : 0,
      is_remote: isRemote,
      is_local: !isRemote,
      location: location || null,
      cover_url: coverUrl,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .select("id, slug")
    .single();

  if (listingError || !listing) {
    console.error("Error creating listing:", listingError?.message);
    return { error: "Could not create your listing. Please try again." };
  }

  // Save extra images
  const imageUrls = imageUrlsRaw
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);

  if (imageUrls.length > 0) {
    await supabase.from("service_images").insert(
      imageUrls.map((url, index) => ({
        service_id: listing.id,
        image_url: url,
        sort_order: index,
      })),
    );
  }

  revalidatePath("/services");
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard/organization-profile");
  revalidatePath("/dashboard");

  return { success: true, listingSlug: listing.slug };
}
