"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ManageOrderState = {
  error?: string;
  success?: boolean;
} | null;

type OrderRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
};

async function getOwnedOrder(orderId: string): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  order: OrderRow | null;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, userId: "", order: null, error: "You must be signed in." };
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, buyer_id, seller_id, status")
    .eq("id", orderId)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .maybeSingle();

  if (error || !order) {
    return {
      supabase,
      userId: user.id,
      order: null,
      error: "Order not found or you do not have access to it.",
    };
  }

  return { supabase, userId: user.id, order: order as OrderRow };
}

export async function deliverOrder(
  orderId: string,
): Promise<ManageOrderState> {
  const { supabase, userId, order, error } = await getOwnedOrder(orderId);

  if (error || !order) return { error };

  if (order.seller_id !== userId) {
    return { error: "Only the seller can mark an order as delivered." };
  }

  if (!["paid", "in_progress", "revision_requested"].includes(order.status)) {
    return { error: "This order cannot be marked as delivered in its current state." };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "submitted" })
    .eq("id", orderId)
    .eq("seller_id", userId);

  if (updateError) {
    return { error: "Could not mark the order as delivered. Please try again." };
  }

  revalidateOrderPaths(orderId);
  return { success: true };
}

export async function approveOrder(
  orderId: string,
): Promise<ManageOrderState> {
  const { supabase, userId, order, error } = await getOwnedOrder(orderId);

  if (error || !order) return { error };

  if (order.buyer_id !== userId) {
    return { error: "Only the buyer can approve delivered work." };
  }

  if (!["submitted", "in_review"].includes(order.status)) {
    return { error: "This order is not waiting for buyer approval." };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("buyer_id", userId);

  if (updateError) {
    return { error: "Could not approve the order. Please try again." };
  }

  revalidateOrderPaths(orderId);
  return { success: true };
}

export async function requestOrderRevision(
  orderId: string,
  revisionDetails: string,
): Promise<ManageOrderState> {
  const details = revisionDetails.trim();

  if (details.length < 5) {
    return { error: "Please describe what needs to be changed." };
  }

  const { supabase, userId, order, error } = await getOwnedOrder(orderId);

  if (error || !order) return { error };

  if (order.buyer_id !== userId) {
    return { error: "Only the buyer can request a revision." };
  }

  if (!["submitted", "in_review"].includes(order.status)) {
    return { error: "A revision cannot be requested in the current order state." };
  }

  const { error: revisionError } = await supabase
    .from("order_revisions")
    .insert({
      order_id: orderId,
      requested_by: userId,
      revision_details: details,
      status: "requested",
    });

  if (revisionError) {
    console.error("Error creating order revision:", revisionError.message);
    return { error: "Could not request a revision. Please try again." };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "revision_requested" })
    .eq("id", orderId)
    .eq("buyer_id", userId);

  if (updateError) {
    return { error: "The revision was created, but the order status could not be updated." };
  }

  revalidateOrderPaths(orderId);
  return { success: true };
}

export async function cancelOrder(
  orderId: string,
): Promise<ManageOrderState> {
  const { supabase, userId, order, error } = await getOwnedOrder(orderId);

  if (error || !order) return { error };

  if (
    ![
      "created",
      "payment_pending",
      "paid",
      "in_progress",
      "revision_requested",
    ].includes(order.status)
  ) {
    return { error: "This order cannot be cancelled in its current state." };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

  if (updateError) {
    return { error: "Could not cancel the order. Please try again." };
  }

  revalidateOrderPaths(orderId);
  return { success: true };
}

function revalidateOrderPaths(orderId: string) {
  revalidatePath(`/order/${orderId}`);
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
}
