"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CreateServiceOrderState = {
  error?: string;
  success?: boolean;
  orderId?: string;
} | null;

async function getCommissionRate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  amount: number,
): Promise<number> {
  const { data } = await supabase
    .from("platform_settings")
    .select("setting_value")
    .eq("setting_key", "commission_tiers")
    .eq("is_active", true)
    .maybeSingle();

  const tiers = (
    data?.setting_value as
      | { tiers?: { max: number | null; rate: number }[] }
      | null
      | undefined
  )?.tiers;

  if (!Array.isArray(tiers) || tiers.length === 0) return 12;

  const sorted = [...tiers].sort((a, b) => {
    if (a.max === null) return 1;
    if (b.max === null) return -1;
    return a.max - b.max;
  });

  return (
    sorted.find((tier) => tier.max === null || amount <= tier.max)?.rate ??
    sorted[sorted.length - 1].rate
  );
}

export async function createServiceOrder(
  _prevState: CreateServiceOrderState,
  formData: FormData,
): Promise<CreateServiceOrderState> {
  const serviceId = String(formData.get("serviceId") || "").trim();
  const packageId = String(formData.get("packageId") || "").trim();
  const requirements = String(formData.get("requirements") || "").trim();
  const deliveryDetails = String(formData.get("deliveryDetails") || "").trim();

  if (!serviceId || !packageId) {
    return { error: "Please select a service package." };
  }

  if (requirements.length < 10) {
    return { error: "Please describe the work you need in at least 10 characters." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to place an order." };
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select(
      "id, title, slug, seller_id, status, deleted_at, currency",
    )
    .eq("id", serviceId)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (serviceError || !service) {
    return { error: "That service is no longer available." };
  }

  if (service.seller_id === user.id) {
    return { error: "You cannot place an order for your own service." };
  }

  const { data: packageRow, error: packageError } = await supabase
    .from("service_packages")
    .select(
      "id, service_id, package_type, price, delivery_time_days",
    )
    .eq("id", packageId)
    .eq("service_id", serviceId)
    .maybeSingle();

  if (packageError || !packageRow) {
    return { error: "The selected package could not be found." };
  }

  if (packageRow.price <= 0) {
    return { error: "The selected package does not have a valid price." };
  }

  const totalAmount = Number(packageRow.price);
  const commissionRate = await getCommissionRate(supabase, totalAmount);
  const platformFee =
    Math.round(totalAmount * (commissionRate / 100) * 100) / 100;
  const sellerAmount = Math.round((totalAmount - platformFee) * 100) / 100;
  const orderNumber = `SK-${Date.now().toString(36).toUpperCase()}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      buyer_id: user.id,
      seller_id: service.seller_id,
      service_id: serviceId,
      order_type: "service",
      status: "payment_pending",
      total_amount: totalAmount,
      platform_fee: platformFee,
      seller_amount: sellerAmount,
      currency: service.currency || "KES",
      delivery_time_days: packageRow.delivery_time_days,
      requirements,
      buyer_notes: deliveryDetails || null,
      package_type: packageRow.package_type,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Error creating service order:", orderError?.message);
    return { error: "Could not create the order. Please try again." };
  }

  revalidatePath("/dashboard/orders");
  revalidatePath(`/service/${service.slug}`);

  return { success: true, orderId: order.id };
}
