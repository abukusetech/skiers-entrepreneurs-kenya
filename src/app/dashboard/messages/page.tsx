import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserConversations } from "@/lib/db/queries/messages";
import { Avatar } from "@/components/ui/Avatar";
import { MessageSquare, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Messages",
};

function formatTimestamp(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return date.toLocaleTimeString("en-KE", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
  });
}

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/messages");
  }

  const conversations = await getUserConversations(user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
          Messages
        </h1>
        <p className="text-text-secondary">
          Chat with buyers and sellers about your jobs and orders.
        </p>
      </div>

      {conversations.length > 0 ? (
        <div className="bg-white rounded-2xl border border-border divide-y divide-border overflow-hidden">
          {conversations.map((c) => {
            const hasUnread = c.unread_count > 0;
            return (
              <Link
                key={c.conversation_id}
                href={`/dashboard/messages/${c.conversation_id}`}
                className="flex items-start gap-4 p-5 hover:bg-background-secondary transition-colors"
              >
                <Avatar
                  src={c.other_user_avatar}
                  alt={c.other_user_name || "User"}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`truncate ${
                        hasUnread
                          ? "font-semibold text-text-primary"
                          : "font-medium text-text-primary"
                      }`}
                    >
                      {c.other_user_name || "User"}
                    </p>
                    {c.other_user_verified && (
                      <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                    )}
                    <span className="text-xs text-text-tertiary ml-auto shrink-0">
                      {formatTimestamp(c.last_message_at)}
                    </span>
                  </div>

                  {c.job_title && c.job_slug && (
                    <p className="text-xs text-primary truncate mb-1">
                      Job: {c.job_title}
                    </p>
                  )}
                  {c.service_title && c.service_slug && (
                    <p className="text-xs text-primary truncate mb-1">
                      Service: {c.service_title}
                    </p>
                  )}
                  {c.order_number && (
                    <p className="text-xs text-text-tertiary truncate mb-1">
                      Order #{c.order_number}
                    </p>
                  )}

                  <p
                    className={`text-sm truncate ${
                      hasUnread
                        ? "text-text-primary font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    {c.last_message_sender === user.id ? "You: " : ""}
                    {c.last_message_content || "No messages yet"}
                  </p>
                </div>
                {hasUnread && (
                  <span className="shrink-0 self-center min-w-6 h-6 px-2 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                    {c.unread_count > 99 ? "99+" : c.unread_count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-display font-bold text-text-primary mb-3">
            No conversations yet
          </h2>
          <p className="text-text-secondary mb-8 leading-relaxed">
            When you message a buyer or seller, the conversation will appear
            here.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Browse services
          </Link>
        </div>
      )}
    </div>
  );
}
