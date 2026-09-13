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

  // Build the search query. Only add filters for values that actually
  // exist — never pass null to .eq(), because PostgREST treats that as
  // the literal string "null" and Postgres rejects it for UUID columns.
  let query = supabase
    .from("conversations")
    .select(
      `
      id,
      members:conversation_members(profile_id)
    `,
    )
    .limit(50);

  if (context?.jobId) {
    query = query.eq("job_id", context.jobId);
  } else {
    query = query.is("job_id", null);
  }

  if (context?.serviceId) {
    query = query.eq("service_id", context.serviceId);
  } else {
    query = query.is("service_id", null);
  }

  if (context?.orderId) {
    query = query.eq("order_id", context.orderId);
  } else {
    query = query.is("order_id", null);
  }

  const { data: candidates, error: searchError } = await query;

  if (searchError) {
    console.error("Error searching conversations:", searchError.message);
  }

  const existing = (candidates || []).find((c) => {
    const members = (c.members || []) as { profile_id: string }[];
    const ids = members.map((m) => m.profile_id);
    return ids.includes(user.id) && ids.includes(otherUserId);
  });

  if (existing) {
    return { conversationId: existing.id };
  }

  const { data: created, error: createError } = await supabase
    .from("conversations")
    .insert({
      job_id: context?.jobId ?? null,
      service_id: context?.serviceId ?? null,
      order_id: context?.orderId ?? null,
    })
    .select("id")
    .single();

  if (createError || !created) {
    console.error("Error creating conversation:", createError?.message);
    return { error: "Could not start the conversation. Please try again." };
  }

  // Insert the two members in two separate statements so the second one
  // sees the first, which satisfies the RLS policy.
  const { error: selfError } = await supabase
    .from("conversation_members")
    .insert({ conversation_id: created.id, profile_id: user.id });

  if (selfError) {
    console.error("Error adding self as member:", selfError.message);
    await supabase.from("conversations").delete().eq("id", created.id);
    return { error: "Could not add members to the conversation." };
  }

  const { error: otherError } = await supabase
    .from("conversation_members")
    .insert({ conversation_id: created.id, profile_id: otherUserId });

  if (otherError) {
    console.error("Error adding other member:", otherError.message);
    return { error: "Could not add members to the conversation." };
  }

  revalidatePath("/dashboard/messages");
  return { conversationId: created.id };
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
