import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/marketplace/CheckoutForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: serviceId } = await searchParams;

  if (!serviceId) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/order/new?service=${serviceId}`);
  }

  const { data: service } = await supabase
    .from("services")
    .select(
      "id, title, slug, starting_price, currency, delivery_time_days, revision_limit, seller_id, status, profiles:seller_id(full_name)",
    )
    .eq("id", serviceId)
    .eq("status", "published")
    .maybeSingle();

  if (!service) {
    notFound();
  }

  if (service.seller_id === user.id) {
    redirect(`/service/${service.slug}`);
  }

  const { data: packages } = await supabase
    .from("service_packages")
    .select(
      "id, package_type, title, description, price, delivery_time_days, revision_limit",
    )
    .eq("service_id", serviceId)
    .order("price", { ascending: true });

  const sellerName = Array.isArray(service.profiles)
    ? service.profiles[0]?.full_name
    : (service.profiles as { full_name?: string } | null)?.full_name;

  return (
    <div className="bg-background-secondary min-h-screen py-10">
      <div className="container-site max-w-2xl">
        <Link
          href={`/service/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to service
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-1">
            Order this service
          </h1>
          <p className="text-sm text-text-secondary">
            {service.title} by {sellerName || "the seller"}
          </p>
        </div>

        <CheckoutForm
          service={{
            id: service.id,
            title: service.title,
            currency: service.currency,
            startingPrice: service.starting_price,
            deliveryTimeDays: service.delivery_time_days,
            revisionLimit: service.revision_limit,
          }}
          packages={(packages || []).map((p) => ({
            id: p.id,
            packageType: p.package_type,
            title: p.title,
            description: p.description,
            price: p.price,
            deliveryTimeDays: p.delivery_time_days,
            revisionLimit: p.revision_limit,
          }))}
        />
      </div>
    </div>
  );
}
