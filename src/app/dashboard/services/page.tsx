import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canWorkForOthers, getMarketplaceRole } from "@/lib/auth/permissions";
import { getSellerServices } from "@/lib/db/queries/services";
import { setServiceStatus, deleteService } from "@/lib/actions/manage-service";
import { Package, Plus, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "My Services",
};

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending_review: "bg-amber-100 text-amber-700",
  published: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  archived: "bg-gray-100 text-gray-700",
};

export default async function MyServicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/services");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_choice, onboarding_role")
    .eq("id", user.id)
    .maybeSingle();

  if (!canWorkForOthers(getMarketplaceRole(profile))) {
    redirect("/dashboard");
  }

  const services = await getSellerServices(user.id);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
            My Services
          </h1>
          <p className="text-text-secondary">
            Everything you have listed, and how it is performing.
          </p>
        </div>
        <Link
          href="/create-service"
          className="inline-flex items-center gap-2 h-11 px-5 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          New service
        </Link>
      </div>

      {services.length > 0 ? (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-border rounded-2xl p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        statusStyles[service.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {service.status.replace(/_/g, " ")}
                    </span>
                    {service.category && (
                      <span className="text-xs text-text-tertiary">
                        {service.category.name}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/service/${service.slug}`}
                    className="font-semibold text-text-primary text-lg hover:text-primary transition-colors line-clamp-1"
                  >
                    {service.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />{" "}
                      {service.rating_count > 0
                        ? `${service.rating_average.toFixed(1)} (${service.rating_count})`
                        : "No ratings yet"}
                    </span>
                    <span>{service.order_count} orders</span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
                  <p className="text-lg font-display font-bold text-text-primary">
                    {service.currency} {service.starting_price.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    {service.status !== "published" && (
                      <form
                        action={async () => {
                          "use server";
                          await setServiceStatus(service.id, "published");
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Publish
                        </button>
                      </form>
                    )}
                    {service.status === "published" && (
                      <form
                        action={async () => {
                          "use server";
                          await setServiceStatus(service.id, "draft");
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs font-semibold text-text-secondary hover:underline"
                        >
                          Unpublish
                        </button>
                      </form>
                    )}
                    <form
                      action={async () => {
                        "use server";
                        await deleteService(service.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs font-semibold text-error hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-text-primary mb-1">
            No services yet
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            List what you do best and start getting orders.
          </p>
          <Link
            href="/create-service"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Create your first service
          </Link>
        </div>
      )}
    </div>
  );
}
