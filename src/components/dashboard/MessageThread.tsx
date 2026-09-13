"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/lib/actions/messaging";
import { Avatar } from "@/components/ui/Avatar";
import { Loader2, Send } from "lucide-react";
import type { MessageItem } from "@/lib/db/queries/messages";

interface MessageThreadProps {
  conversationId: string;
  currentUserId: string;
  initialMessages: MessageItem[];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-KE", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDay(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
  });
}

export function MessageThread({
  conversationId,
  currentUserId,
  initialMessages,
}: MessageThreadProps) {
  // Optimistic messages that the server has not yet echoed back.
  const [pendingMessages, setPendingMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Remove optimistic entries once the server list contains them.
  const serverKeys = new Set(
    initialMessages.map(
      (m) => `${m.sender_id}|${m.content}|${m.created_at.slice(0, 16)}`,
    ),
  );
  const visiblePending = pendingMessages.filter((m) => {
    const key = `${m.sender_id}|${m.content}|${m.created_at.slice(0, 16)}`;
    return !serverKeys.has(key);
  });

  // Combined list for rendering, sorted by created_at.
  const messages = [...initialMessages, ...visiblePending].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  // Scroll to bottom whenever the visible message count changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Poll every 5 seconds to pick up new messages from the other party.
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;

    setError("");

    const optimistic: MessageItem = {
      id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
      attachment_url: null,
      attachment_type: null,
      created_at: new Date().toISOString(),
      sender: null,
    };

    setPendingMessages((prev) => [...prev, optimistic]);
    setDraft("");

    startTransition(async () => {
      const result = await sendMessage(conversationId, content);
      if (result?.error) {
        setError(result.error);
        setPendingMessages((prev) =>
          prev.filter((m) => m.id !== optimistic.id),
        );
      } else {
        router.refresh();
      }
    });
  }

  // Group messages by day for date separators.
  const grouped: { day: string; items: MessageItem[] }[] = [];
  for (const msg of messages) {
    const day = formatDay(msg.created_at);
    const last = grouped[grouped.length - 1];
    if (last && last.day === day) {
      last.items.push(msg);
    } else {
      grouped.push({ day, items: [msg] });
    }
  }

  return (
    <>
      {/* Scrollable thread */}
      <div className="flex-1 overflow-y-auto bg-white border-x border-border p-4 lg:p-6">
        {grouped.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-text-tertiary">
              No messages yet. Say hello.
            </p>
          </div>
        )}

        {grouped.map((group) => (
          <div key={group.day}>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-tertiary font-medium">
                {group.day}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-4">
              {group.items.map((msg) => {
                const isMine = msg.sender_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      isMine ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {!isMine && (
                      <Avatar
                        src={msg.sender?.avatar_url}
                        alt={msg.sender?.full_name || "User"}
                        size="sm"
                        className="shrink-0"
                      />
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        isMine
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-background-secondary text-text-primary rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                        {msg.content}
                      </p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isMine ? "text-blue-100" : "text-text-tertiary"
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white border border-t-0 border-border rounded-b-2xl p-4 shrink-0"
      >
        {error && <p className="text-xs text-error mb-2">{error}</p>}
        <div className="flex items-end gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            rows={1}
            placeholder="Write a message..."
            className="flex-1 resize-none px-4 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:border-primary max-h-40"
            style={{ minHeight: "44px" }}
          />
          <button
            type="submit"
            disabled={isPending || !draft.trim()}
            className="h-11 px-5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Send
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
        <p className="text-[10px] text-text-tertiary mt-2">
          Press Enter to send. Shift + Enter for a new line.
        </p>
      </form>
    </>
  );
}
