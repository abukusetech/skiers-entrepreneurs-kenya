"use server";

import { createClient } from "@/lib/supabase/server";
import { canCreateWorkerService, getMarketplaceRole } from "@/lib/auth/permissions";
import { slugify } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

export type CreateServiceState = {
  error?: string;
  success?: boolean;
  serviceSlug?: string;
} | null;

export async function createService(
  prevState: CreateServiceState,
  formData: FormData,
): Promise<CreateServiceState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to create a service." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  const role = getMarketplaceRole(profile);

  if (!canCreateWorkerService(role)) {
    return {
      error: "Only workers can create freelance services or offer their skills for hire.",
    };
  }

  // ----- Basic details -----
  const title = (formData.get("title") as string)?.trim();
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const deliveryTimeDays = formData.get("deliveryTimeDays") as string;
  const revisionLimit = formData.get("revisionLimit") as string;
  const isRemote = formData.get("isRemote") === "on";
  const location = (formData.get("location") as string)?.trim();

  if (!title || title.length < 10) {
    return { error: "Title must be at least 10 characters." };
  }
  if (!categoryId) {
    return { error: "Please pick a category." };
  }
  if (!description || description.length < 50) {
    return { error: "Description must be at least 50 characters." };
  }

  // ----- Pricing -----
  const pricingMode = (formData.get("pricingMode") as string) || "single";
  const startingPrice = formData.get("startingPrice") as string;

  let parsedStartingPrice = 0;
  let packages: {
    package_type: "basic" | "standard" | "premium";
    title: string;
    description: string | null;
    price: number;
    delivery_time_days: number | null;
    revision_limit: number | null;
  }[] = [];

  if (pricingMode === "packages") {
    const basic = formData.get("basicPrice") as string;
    const standard = formData.get("standardPrice") as string;
    const premium = formData.get("premiumPrice") as string;

    if (!basic || !standard || !premium) {
      return { error: "Please fill in all three package prices." };
    }

    const basicNum = parseFloat(basic);
    const standardNum = parseFloat(standard);
    const premiumNum = parseFloat(premium);

    if (
      isNaN(basicNum) ||
      isNaN(standardNum) ||
      isNaN(premiumNum) ||
      basicNum <= 0 ||
      standardNum <= 0 ||
      premiumNum <= 0
    ) {
      return { error: "All package prices must be valid numbers above zero." };
    }

    parsedStartingPrice = basicNum;

    const deliveryNum = deliveryTimeDays ? parseInt(deliveryTimeDays) : null;
    const revisionNum = revisionLimit ? parseInt(revisionLimit) : null;

    packages = [
      {
        package_type: "basic",
        title: "Basic",
        description: null,
        price: basicNum,
        delivery_time_days: deliveryNum,
        revision_limit: revisionNum,
      },
      {
        package_type: "standard",
        title: "Standard",
        description: null,
        price: standardNum,
        delivery_time_days: deliveryNum ? deliveryNum + 3 : null,
        revision_limit: revisionNum,
      },
      {
        package_type: "premium",
        title: "Premium",
        description: null,
        price: premiumNum,
        delivery_time_days: deliveryNum ? deliveryNum + 7 : null,
        revision_limit: revisionNum ? revisionNum + 2 : null,
      },
    ];
  } else {
    if (!startingPrice) {
      return { error: "Please enter a starting price." };
    }

    parsedStartingPrice = parseFloat(startingPrice);

    if (isNaN(parsedStartingPrice) || parsedStartingPrice <= 0) {
      return { error: "Starting price must be a valid number above zero." };
    }
  }

  // ----- Create the service -----
  const slug = slugify(title);

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .insert({
      seller_id: user.id,
      title,
      slug,
      description,
      category_id: categoryId,
      starting_price: parsedStartingPrice,
      currency: "KES",
      delivery_time_days: deliveryTimeDays ? parseInt(deliveryTimeDays) : null,
      revision_limit: revisionLimit ? parseInt(revisionLimit) : 3,
      is_remote: isRemote,
      is_local: !isRemote,
      location: location || null,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .select("id, slug")
    .single();

  if (serviceError || !service) {
    console.error("Error creating service:", serviceError?.message);
    return { error: "Could not create your service. Please try again." };
  }

  // ----- Save packages -----
  if (packages.length > 0) {
    const { error: pkgError } = await supabase.from("service_packages").insert(
      packages.map((p) => ({
        service_id: service.id,
        ...p,
      })),
    );

    if (pkgError) {
      console.error("Error creating packages:", pkgError.message);
    }
  }

  // ----- Save images (URLs already uploaded client side) -----
  const imageUrlsRaw = (formData.get("imageUrls") as string) || "";
  const imageUrls = imageUrlsRaw
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);

  if (imageUrls.length > 0) {
    const { error: imgError } = await supabase.from("service_images").insert(
      imageUrls.map((url, index) => ({
        service_id: service.id,
        image_url: url,
        sort_order: index,
      })),
    );

    if (imgError) {
      console.error("Error creating service images:", imgError.message);
    }
  }

  // ----- Save FAQs -----
  const faqsRaw = (formData.get("faqs") as string) || "";
  if (faqsRaw) {
    try {
      const parsed = JSON.parse(faqsRaw) as {
        question: string;
        answer: string;
      }[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        await supabase.from("service_faqs").insert(
          parsed.map((f, index) => ({
            service_id: service.id,
            question: f.question,
            answer: f.answer,
            sort_order: index,
          })),
        );
      }
    } catch {
      console.error("Could not parse FAQs");
    }
  }

  revalidatePath("/services");
  revalidatePath("/dashboard");

  return { success: true, serviceSlug: service.slug };
}
