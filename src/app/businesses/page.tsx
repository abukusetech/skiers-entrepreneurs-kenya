import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { getPublicBusinesses } from "@/lib/db/queries/business-profiles";
import { BusinessesExplorer } from "@/components/marketplace/BusinessesExplorer";

export const metadata: Metadata = {
  title: "Nearby Businesses",
  description:
    "Find shops, hotels, salons, restaurants, and local businesses on SKIERS.",
};

export default async function BusinessesPage() {
  const businesses = await getPublicBusinesses();

  return (
    <div className="bg-background-primary">
      <section className="bg-dark py-16 lg:py-20">
        <div className="container-site">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-md px-4 py-2 mb-6">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span className="text-white text-xs font-medium">
              {businesses.length}{" "}
              {businesses.length === 1 ? "business" : "businesses"} listed
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-4">
            Nearby Businesses
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            Shops, hotels, salons, restaurants, and local businesses on SKIERS.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site">
          <BusinessesExplorer businesses={businesses} />
        </div>
      </section>
    </div>
  );
}
