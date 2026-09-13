import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBusinessProfileByOwner } from "@/lib/db/queries/business-profiles";
import {
  getBusinessListings,
  type ServiceListItem,
} from "@/lib/db/queries/services";
import { Plus, Tag, Eye, Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "My Listings",
};

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending_review: "bg-amber-100 text-amber-700",
  published: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  archived: "bg-gray-100 text-gray-700",
};

export default async function ListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/listings");
  }

  const business = await getBusinessProfileByOwner(user.id);

  if (!business) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
            My Listings
          </h1>
          <p className="text-text-secondary">
            Everything you offer. Customers browse these on the marketplace.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-lg">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-semibold text-text-primary mb-1">
            Complete your business profile first
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            We need a few details about your business before you can list what
            you offer.
          </p>
          <Link
            href="/dashboard/business-profile"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Go to business profile
          </Link>
        </div>
      </div>
    );
  }

  const listings = await getBusinessListings(business.id);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-2">
            My Listings
          </h1>
          <p className="text-text-secondary">
            Everything you offer. Customers browse these on the marketplace.
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="inline-flex items-center gap-2 h-11 px-5 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add a listing
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((listing: ServiceListItem) => (
            <div
              key={listing.id}
              className="bg-white border border-border rounded-2xl overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-linear-to-br from-primary/10 to-accent/5 shrink-0">
                  {listing.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.cover_url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : business.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={business.logo_url}
                      alt={business.name}
                      className="w-full h-full object-contain p-3"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="h-8 w-8 text-primary/30" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        statusStyles[listing.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {listing.status.replace(/_/g, " ")}
                    </span>
                    {listing.category && (
                      <span className="text-xs text-text-tertiary">
                        {listing.category.name}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/service/${listing.slug}`}
                    className="font-semibold text-text-primary text-lg hover:text-primary transition-colors line-clamp-1"
                  >
                    {listing.title}
                  </Link>

                  <p className="text-sm text-text-secondary line-clamp-2 mt-1">
                    {listing.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {listing.view_count ?? 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {listing.rating_count > 0
                        ? `${listing.rating_average.toFixed(1)} (${listing.rating_count})`
                        : "No ratings yet"}
                    </span>
                    <span>{listing.order_count} orders</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end gap-3 shrink-0">
                  <p className="text-lg font-display font-bold text-text-primary">
                    {listing.currency} {listing.starting_price.toLocaleString()}
                  </p>
                  <Link
                    href={`/dashboard/listings/${listing.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Edit
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-text-primary mb-1">
            No listings yet
          </h3>
          <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
            Add what you offer. Each listing is a product, dish, service, or
            offering that customers can book or buy.
          </p>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Add your first listing
          </Link>
        </div>
      )}
    </div>
  );
}
