"use server";

import { createClient } from "@/lib/supabase/server";
import { initiateStkPush } from "@/lib/mpesa/client";
import { redirect } from "next/navigation";

export type CheckoutState = {
  error?: string;
} | null;

function commissionRateFor(amount: number): number {
  if (amount < 10_000) return 0.15;
  if (amount <= 100_000) return 0.12;
  return 0.1;
}

export async function createServiceOrderAndPay(
  prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to place an order." };
  }

  const serviceId = formData.get("serviceId") as string;
  const packageId = (formData.get("packageId") as string) || null;
  const requirements = (formData.get("requirements") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  if (!serviceId) {
    return { error: "Missing service." };
  }
  if (!requirements || requirements.length < 10) {
    return { error: "Please describe what you need in a bit more detail." };
  }
  if (!phone) {
    return { error: "Enter the M-Pesa number to pay from." };
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select(
      "id, seller_id, title, starting_price, currency, delivery_time_days, status",
    )
    .eq("id", serviceId)
    .single();

  if (serviceError || !service) {
    return { error: "This service could not be found." };
  }
  if (service.status !== "published") {
    return { error: "This service is not currently available." };
  }
  if (service.seller_id === user.id) {
    return { error: "You cannot order your own service." };
  }

  let amount = service.starting_price;
  let deliveryDays = service.delivery_time_days;
  let packageType: string | null = null;

  if (packageId) {
    const { data: pkg } = await supabase
      .from("service_packages")
      .select("package_type, price, delivery_time_days")
      .eq("id", packageId)
      .eq("service_id", serviceId)
      .single();

    if (pkg) {
      amount = pkg.price;
      deliveryDays = pkg.delivery_time_days;
      packageType = pkg.package_type;
    }
  }

  const rate = commissionRateFor(amount);
  const platformFee = Math.round(amount * rate);
  const sellerAmount = amount - platformFee;
  const orderNumber = `SK-${Date.now().toString(36).toUpperCase()}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      buyer_id: user.id,
      seller_id: service.seller_id,
      service_id: service.id,
      order_type: "service",
      status: "created",
      package_type: packageType,
      total_amount: amount,
      platform_fee: platformFee,
      seller_amount: sellerAmount,
      currency: service.currency,
      delivery_time_days: deliveryDays,
      requirements,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message || "Could not create the order." };
  }

  const paymentReference = `${order.order_number}`;

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      payment_reference: paymentReference,
      order_id: order.id,
      buyer_id: user.id,
      amount,
      currency: service.currency,
      status: "pending",
      payment_method: "mpesa",
      mpesa_phone: phone,
    })
    .select("id")
    .single();

  if (paymentError || !payment) {
    return { error: paymentError?.message || "Could not start the payment." };
  }

  try {
    const stk = await initiateStkPush({
      phone,
      amount,
      accountReference: order.order_number,
      transactionDesc: `${service.title}`.slice(0, 13) || "SKIERS order",
    });

    await supabase
      .from("payments")
      .update({
        status: "processing",
        mpesa_checkout_request_id: stk.checkoutRequestId,
        mpesa_merchant_request_id: stk.merchantRequestId,
      })
      .eq("id", payment.id);

    await supabase
      .from("orders")
      .update({ status: "payment_pending" })
      .eq("id", order.id);
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Could not reach M-Pesa. Please try again.",
    };
  }

  redirect(`/order/${order.id}`);
}

export async function retryOrderPayment(
  prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const orderId = formData.get("orderId") as string;
  const phone = (formData.get("phone") as string)?.trim();

  if (!orderId || !phone) {
    return { error: "Missing order or phone number." };
  }

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, buyer_id, total_amount, currency, status, service:services(title)",
    )
    .eq("id", orderId)
    .single();

  if (!order || order.buyer_id !== user.id) {
    return { error: "Order not found." };
  }
  if (!["created", "payment_pending"].includes(order.status)) {
    return { error: "This order has already been paid or closed." };
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      payment_reference: `${order.order_number}-R${Date.now().toString(36).toUpperCase().slice(-4)}`,
      order_id: order.id,
      buyer_id: user.id,
      amount: order.total_amount,
      currency: order.currency,
      status: "pending",
      payment_method: "mpesa",
      mpesa_phone: phone,
    })
    .select("id")
    .single();

  if (paymentError || !payment) {
    return { error: paymentError?.message || "Could not start the payment." };
  }

  const serviceTitle = Array.isArray(order.service)
    ? order.service[0]?.title
    : (order.service as { title?: string } | null)?.title;

  try {
    const stk = await initiateStkPush({
      phone,
      amount: order.total_amount,
      accountReference: order.order_number,
      transactionDesc: (serviceTitle || "SKIERS order").slice(0, 13),
    });

    await supabase
      .from("payments")
      .update({
        status: "processing",
        mpesa_checkout_request_id: stk.checkoutRequestId,
        mpesa_merchant_request_id: stk.merchantRequestId,
      })
      .eq("id", payment.id);

    await supabase
      .from("orders")
      .update({ status: "payment_pending" })
      .eq("id", order.id);
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Could not reach M-Pesa. Please try again.",
    };
  }

  redirect(`/order/${order.id}`);
}
