import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getServiceBySlug } from "@/lib/db/queries/services";
import { getOrCreateConversation } from "@/lib/actions/messaging";
import { Avatar } from "@/components/ui/Avatar";
import {
  Star,
  Clock,
  CheckCircle,
  Package,
  MessageSquare,
  Shield,
  RefreshCw,
  MapPin,
  Info,
} from "lucide-react";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.title,
    description: service.description.slice(0, 160),
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const seller = service.seller;
  const category = service.category;
  const isOwner = Boolean(user && seller && user.id === seller.id);

  const providerName = service.business_name || seller?.full_name || "Provider";
  const providerLogo = service.business_logo_url || seller?.avatar_url;
  const providerVerified =
    service.business_verified || seller?.is_verified || false;

  return (
    <div className="bg-background-primary">
      <div className="border-b border-border bg-background-secondary">
        <div className="container-site py-4">
          <nav className="flex items-center gap-2 text-xs text-text-tertiary">
            <Link
              href="/services"
              className="hover:text-primary transition-colors"
            >
              Services
            </Link>
            {category && (
              <>
                <span>/</span>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-text-secondary truncate">
              {service.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-site py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
              {service.title}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <Avatar src={providerLogo} alt={providerName} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">
                    {providerName}
                  </p>
                  {providerVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                {seller?.headline && (
                  <p className="text-xs text-text-secondary truncate">
                    {seller.headline}
                  </p>
                )}
              </div>
              {service.rating_count > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  <span className="text-sm font-semibold">
                    {service.rating_average.toFixed(1)}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    ({service.rating_count})
                  </span>
                </div>
              )}
            </div>

            {service.images.length > 0 && (
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={service.images[0].image_url}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                    priority
                  />
                </div>
                {service.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {service.images.slice(1, 5).map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square rounded-lg overflow-hidden border border-border"
                      >
                        <Image
                          src={img.image_url}
                          alt={service.title}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 mb-6">
              <h2 className="text-xl font-display font-bold text-text-primary mb-4">
                About this service
              </h2>
              <p className="text-sm lg:text-base text-text-secondary leading-relaxed whitespace-pre-wrap">
                {service.description}
              </p>
            </div>

            {service.packages.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 mb-6">
                <h2 className="text-xl font-display font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Packages
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {service.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-background-secondary rounded-xl p-5 border border-border"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
                        {pkg.package_type}
                      </p>
                      <p className="text-2xl font-display font-bold text-text-primary mb-3">
                        KES {pkg.price.toLocaleString()}
                      </p>
                      {pkg.delivery_time_days && (
                        <p className="text-xs text-text-secondary flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3" />
                          {pkg.delivery_time_days} days delivery
                        </p>
                      )}
                      {pkg.revision_limit !== null && (
                        <p className="text-xs text-text-secondary flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" />
                          {pkg.revision_limit} revisions
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.faqs.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
                <h2 className="text-xl font-display font-bold text-text-primary mb-4">
                  Frequently asked questions
                </h2>
                <div className="space-y-3">
                  {service.faqs.map((faq) => (
                    <details
                      key={faq.id}
                      className="group bg-background-secondary rounded-xl overflow-hidden"
                    >
                      <summary className="flex items-center justify-between gap-4 p-4 cursor-pointer list-none">
                        <span className="font-medium text-text-primary text-sm">
                          {faq.question}
                        </span>
                        <span className="shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center text-text-secondary group-open:bg-primary group-open:text-white transition-colors">
                          <svg
                            className="w-3.5 h-3.5 transition-transform duration-300 group-open:rotate-45"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-4">
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-lg p-6">
              <div className="mb-5">
                <p className="text-xs text-text-tertiary mb-1">Starting from</p>
                <p className="text-3xl font-display font-bold text-text-primary">
                  {service.currency} {service.starting_price.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {service.delivery_time_days && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock className="h-4 w-4 text-text-tertiary" />
                    {service.delivery_time_days} days delivery
                  </div>
                )}
                {service.revision_limit !== null && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <RefreshCw className="h-4 w-4 text-text-tertiary" />
                    {service.revision_limit} revisions included
                  </div>
                )}
                {service.location && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin className="h-4 w-4 text-text-tertiary" />
                    {service.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Shield className="h-4 w-4 text-success" />
                  Protected by escrow
                </div>
              </div>

              {isOwner ? (
                <div className="bg-background-secondary rounded-xl p-4 flex items-start gap-3">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-text-secondary leading-relaxed">
                    This is your own service. You cannot order it or message
                    yourself. Manage it from{" "}
                    <Link
                      href="/dashboard/services"
                      className="text-primary hover:underline"
                    >
                      your dashboard
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <>
                  <Link
                    href={`/order/new?service=${service.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors mb-3"
                  >
                    Continue to order
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      if (!user) {
                        redirect(`/login?redirect=/service/${service.slug}`);
                      }
                      if (!seller?.id) return;
                      const result = await getOrCreateConversation(seller.id, {
                        serviceId: service.id,
                      });
                      if (result.conversationId) {
                        redirect(
                          `/dashboard/messages/${result.conversationId}`,
                        );
                      }
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-md bg-transparent border border-border text-text-primary text-sm font-semibold hover:bg-background-secondary transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Contact seller
                    </button>
                  </form>

                  <p className="text-xs text-text-tertiary text-center mt-4">
                    You will not be charged yet.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
