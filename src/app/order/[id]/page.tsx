import Link from "next/link";
import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/lib/db/queries/orders";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Order | SKIERS ENTREPRENEURS KENYA",
};

const statusStyles: Record<string, string> = {
  created: "bg-gray-100 text-gray-700",
  payment_pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  in_progress: "bg-blue-100 text-blue-700",
  submitted: "bg-purple-100 text-purple-700",
  in_review: "bg-purple-100 text-purple-700",
  revision_requested: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  disputed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/order/${id}`);
  }

  const order = await getOrderById(id, user.id);

  if (!order) {
    notFound();
  }

  const isBuyer = order.buyer?.id === user.id;
  const counterparty = isBuyer ? order.seller : order.buyer;
  const title = order.service?.title || order.job?.title || "Order";
  const titleHref = order.service
    ? `/service/${order.service.slug}`
    : order.job
      ? `/job/${order.job.slug}`
      : null;

  return (
    <div className="bg-background-secondary min-h-screen py-10">
      <div className="container-site max-w-3xl">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                statusStyles[order.status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status.replace(/_/g, " ")}
            </span>
            <span className="text-xs text-text-tertiary">
              Order #{order.order_number}
            </span>
          </div>

          <h1 className="text-xl lg:text-2xl font-display font-bold text-text-primary mb-1">
            {titleHref ? (
              <Link href={titleHref} className="hover:text-primary">
                {title}
              </Link>
            ) : (
              title
            )}
          </h1>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            <Avatar
              src={counterparty?.avatar_url}
              alt={counterparty?.full_name || "User"}
              size="md"
            />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {counterparty?.full_name || "Unknown"}
              </p>
              <p className="text-xs text-text-tertiary">
                {isBuyer ? "Seller" : "Buyer"} on this order
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <p className="text-xs text-text-tertiary mb-1">Total</p>
              <p className="font-semibold text-text-primary">
                {order.currency} {order.total_amount.toLocaleString()}
              </p>
            </div>
            {order.delivery_time_days && (
              <div>
                <p className="text-xs text-text-tertiary mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Delivery
                </p>
                <p className="font-semibold text-text-primary">
                  {order.delivery_time_days} days
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-text-tertiary mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Placed
              </p>
              <p className="font-semibold text-text-primary">
                {new Date(order.created_at).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            {order.completed_at && (
              <div>
                <p className="text-xs text-text-tertiary mb-1">Completed</p>
                <p className="font-semibold text-text-primary">
                  {new Date(order.completed_at).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {order.requirements && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-2">
                Requirements
              </p>
              <p className="text-sm text-text-secondary whitespace-pre-line">
                {order.requirements}
              </p>
            </div>
          )}
        </div>

        {order.milestones.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 mb-6">
            <h2 className="font-semibold text-text-primary mb-4">
              Milestones
            </h2>
            <div className="space-y-3">
              {order.milestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background-secondary"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {m.title}
                    </p>
                    {m.description && (
                      <p className="text-xs text-text-tertiary truncate">
                        {m.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-text-primary">
                      {order.currency} {m.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-text-tertiary capitalize">
                      {m.status.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-sm text-text-secondary">
          Payment, delivery, and revision actions for this order (M-Pesa
          checkout, marking work delivered, requesting revisions) are part of
          the payments build-out and will appear here once that phase ships.
        </div>
      </div>
    </div>
  );
}
