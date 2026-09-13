import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserOrders } from "@/lib/db/queries/orders";
import { FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Orders | SKIERS ENTREPRENEURS KENYA",
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

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/orders");
  }

  const orders = await getUserOrders(user.id, "all");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
          Orders
        </h1>
        <p className="text-text-secondary">
          Everything you are buying or delivering, in one place.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const isBuyer = order.buyer?.id === user.id;
            const counterparty = isBuyer ? order.seller : order.buyer;
            const title = order.service?.title || order.job?.title || "Order";

            return (
              <div
                key={order.id}
                className="bg-white border border-border rounded-2xl p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        #{order.order_number}
                      </span>
                    </div>
                    <h3 className="font-semibold text-text-primary text-lg truncate">
                      {title}
                    </h3>
                    <p className="text-xs text-text-tertiary mt-1">
                      {isBuyer ? "Seller" : "Buyer"}:{" "}
                      {counterparty?.full_name || "Unknown"} &middot;{" "}
                      {new Date(order.created_at).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-display font-bold text-text-primary">
                      {order.currency} {order.total_amount.toLocaleString()}
                    </p>
                    <Link
                      href={`/order/${order.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline mt-1"
                    >
                      View order <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-text-primary mb-1">
            No orders yet
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            Orders appear here once a service is purchased or a job proposal
            is accepted.
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
