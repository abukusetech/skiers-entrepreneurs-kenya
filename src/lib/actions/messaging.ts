"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type MessagingState = {
  error?: string;
  success?: boolean;
  conversationId?: string;
} | null;

export async function getOrCreateConversation(
  otherUserId: string,
  context?: {
    jobId?: string;
    serviceId?: string;
    orderId?: string;
  },
): Promise<{ conversationId?: string; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to send a message." };
  }

  if (user.id === otherUserId) {
    return { error: "You cannot message yourself." };
  }

  const { data, error } = await supabase.rpc("get_or_create_conversation", {
    p_other_user_id: otherUserId,
    p_job_id: context?.jobId ?? null,
    p_service_id: context?.serviceId ?? null,
    p_order_id: context?.orderId ?? null,
  });

  if (error) {
    console.error("Error creating conversation:", error.message);
    return { error: "Could not start the conversation. Please try again." };
  }

  if (!data) {
    return { error: "Could not start the conversation. Please try again." };
  }

  revalidatePath("/dashboard/messages");
  return { conversationId: data as string };
}

export async function sendMessage(
  conversationId: string,
  content: string,
): Promise<MessagingState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to send a message." };
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return { error: "Message cannot be empty." };
  }
  if (trimmed.length > 4000) {
    return { error: "Message is too long (max 4000 characters)." };
  }

  const { error: insertError } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: trimmed,
  });

  if (insertError) {
    console.error("Error sending message:", insertError.message);
    return { error: "Could not send the message. Please try again." };
  }

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath("/dashboard/messages");
  revalidatePath(`/dashboard/messages/${conversationId}`);

  return { success: true };
}

export async function markConversationRead(
  conversationId: string,
): Promise<MessagingState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("conversation_members")
    .update({
      unread_count: 0,
      last_read_at: new Date().toISOString(),
    })
    .eq("conversation_id", conversationId)
    .eq("profile_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
