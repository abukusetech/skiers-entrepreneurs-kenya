import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  getConversationDetail,
  getConversationMessages,
} from "@/lib/db/queries/messages";
import { markConversationRead } from "@/lib/actions/messaging";
import { MessageThread } from "@/components/dashboard/MessageThread";
import { Avatar } from "@/components/ui/Avatar";
import {
  ArrowLeft,
  CheckCircle,
  Briefcase,
  Package,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Conversation",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/dashboard/messages/${id}`);
  }

  const [conversation, messages] = await Promise.all([
    getConversationDetail(id, user.id),
    getConversationMessages(id, user.id),
  ]);

  if (!conversation) {
    notFound();
  }

  await markConversationRead(id);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-125">
      <div className="bg-white border border-border rounded-t-2xl p-4 flex items-center gap-3 shrink-0">
        <Link
          href="/dashboard/messages"
          className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <Avatar
          src={conversation.other_user_avatar}
          alt={conversation.other_user_name}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-text-primary truncate">
              {conversation.other_user_name}
            </p>
            {conversation.other_user_verified && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full shrink-0">
                <CheckCircle className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
          {conversation.other_user_headline && (
            <p className="text-xs text-text-tertiary truncate">
              {conversation.other_user_headline}
            </p>
          )}
        </div>
      </div>

      {(conversation.job_id ||
        conversation.service_id ||
        conversation.order_id) && (
        <div className="bg-background-secondary border-x border-border px-4 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs shrink-0">
          {conversation.job_id && conversation.job_slug && (
            <Link
              href={`/job/${conversation.job_slug}`}
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              <Briefcase className="h-3 w-3" />
              {conversation.job_title || "Job"}
            </Link>
          )}
          {conversation.service_id && conversation.service_slug && (
            <Link
              href={`/service/${conversation.service_slug}`}
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              <Package className="h-3 w-3" />
              {conversation.service_title || "Service"}
            </Link>
          )}
          {conversation.order_id && conversation.order_number && (
            <Link
              href={`/order/${conversation.order_id}`}
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              <FileText className="h-3 w-3" />
              Order #{conversation.order_number}
            </Link>
          )}
        </div>
      )}

      <MessageThread
        conversationId={id}
        currentUserId={user.id}
        initialMessages={messages}
      />
    </div>
  );
}
