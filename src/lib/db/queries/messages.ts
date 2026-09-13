import { createClient } from "@/lib/supabase/server";

export type ConversationSummary = {
  conversation_id: string;
  other_user_id: string | null;
  other_user_name: string | null;
  other_user_avatar: string | null;
  other_user_headline: string | null;
  other_user_verified: boolean | null;
  last_message_content: string | null;
  last_message_at: string | null;
  last_message_sender: string | null;
  unread_count: number;
  job_id: string | null;
  job_title: string | null;
  job_slug: string | null;
  service_id: string | null;
  service_title: string | null;
  service_slug: string | null;
  order_id: string | null;
  order_number: string | null;
  created_at: string;
};

export type MessageItem = {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  content: string;
  attachment_url: string | null;
  attachment_type: string | null;
  created_at: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
};

export type ConversationDetail = {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  other_user_headline: string | null;
  other_user_verified: boolean;
  job_id: string | null;
  job_title: string | null;
  job_slug: string | null;
  service_id: string | null;
  service_title: string | null;
  service_slug: string | null;
  order_id: string | null;
  order_number: string | null;
};

export async function getUserConversations(
  userId: string,
): Promise<ConversationSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_user_conversations", {
    p_user_id: userId,
  });

  if (error) {
    console.error("Error fetching conversations:", error.message);
    return [];
  }

  return (data || []) as ConversationSummary[];
}

export async function getConversationMessages(
  conversationId: string,
  userId: string,
  limit = 100,
): Promise<MessageItem[]> {
  const supabase = await createClient();

  // RLS on conversation_members only shows the current user's own row,
  // so this is a fast membership check for the current user.
  const { data: membership } = await supabase
    .from("conversation_members")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("profile_id", userId)
    .maybeSingle();

  if (!membership) {
    return [];
  }

  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      id,
      conversation_id,
      sender_id,
      content,
      attachment_url,
      attachment_type,
      created_at,
      sender:profiles!messages_sender_id_fkey(
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .eq("conversation_id", conversationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching messages:", error.message);
    return [];
  }

  return (data || []) as unknown as MessageItem[];
}

export async function getConversationDetail(
  conversationId: string,
  userId: string,
): Promise<ConversationDetail | null> {
  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("conversation_members")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("profile_id", userId)
    .maybeSingle();

  if (!membership) {
    return null;
  }

  const { data: conv, error: convError } = await supabase
    .from("conversations")
    .select(
      `
      id,
      job_id,
      service_id,
      order_id,
      job:jobs!conversations_job_id_fkey(id, title, slug),
      service:services!conversations_service_id_fkey(id, title, slug),
      order:orders!conversations_order_id_fkey(id, order_number)
    `,
    )
    .eq("id", conversationId)
    .maybeSingle();

  if (convError || !conv) {
    console.error("Error fetching conversation:", convError?.message);
    return null;
  }

  // Use the same RPC to fetch the other member (RLS-safe).
  const { data: otherRows, error: rpcError } = await supabase.rpc(
    "get_user_conversations",
    { p_user_id: userId },
  );

  if (rpcError) {
    console.error("Error fetching other member:", rpcError.message);
    return null;
  }

  const summary = ((otherRows || []) as ConversationSummary[]).find(
    (row) => row.conversation_id === conversationId,
  );

  if (!summary || !summary.other_user_id) {
    return null;
  }

  const job = Array.isArray(conv.job) ? conv.job[0] : conv.job;
  const service = Array.isArray(conv.service) ? conv.service[0] : conv.service;
  const order = Array.isArray(conv.order) ? conv.order[0] : conv.order;

  return {
    id: conv.id,
    other_user_id: summary.other_user_id,
    other_user_name: summary.other_user_name || "User",
    other_user_avatar: summary.other_user_avatar,
    other_user_headline: summary.other_user_headline,
    other_user_verified: summary.other_user_verified ?? false,
    job_id: conv.job_id,
    job_title: job?.title ?? null,
    job_slug: job?.slug ?? null,
    service_id: conv.service_id,
    service_title: service?.title ?? null,
    service_slug: service?.slug ?? null,
    order_id: conv.order_id,
    order_number: order?.order_number ?? null,
  };
}
