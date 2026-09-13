"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Store, Sparkles, Search } from "lucide-react";
import type { PublicBusinessProfile } from "@/lib/db/queries/business-profiles";

interface BusinessesExplorerProps {
  businesses: PublicBusinessProfile[];
}

export function BusinessesExplorer({ businesses }: BusinessesExplorerProps) {
  const [query, setQuery] = useState("");
  const [county, setCounty] = useState<string | null>(null);

  const counties = Array.from(
    new Set(businesses.map((b) => b.county).filter(Boolean)),
  ) as string[];

  const filtered = businesses.filter((b) => {
    if (county && b.county !== county) return false;
    if (!query) return true;
    const hay =
      `${b.name} ${b.tagline ?? ""} ${b.description ?? ""} ${b.town ?? ""}`.toLowerCase();
    return hay.includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="max-w-2xl mb-6">
        <div className="bg-white rounded-xl p-2 flex items-center border border-border">
          <Search className="h-5 w-5 text-text-tertiary ml-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, town, or service"
            className="flex-1 h-12 px-4 focus:outline-none text-text-primary bg-transparent text-sm"
          />
        </div>
      </div>

      {counties.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setCounty(null)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              !county
                ? "bg-primary text-white"
                : "bg-white border border-border text-text-secondary hover:border-primary"
            }`}
          >
            All counties
          </button>
          {counties.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCounty(c)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                county === c
                  ? "bg-primary text-white"
                  : "bg-white border border-border text-text-secondary hover:border-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-5">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
            {businesses.length === 0
              ? "No businesses listed yet"
              : "No businesses match that search"}
          </h2>
          <p className="text-text-secondary mb-8">
            {businesses.length === 0
              ? "Be the first to add a business on SKIERS."
              : "Try a different keyword or county."}
          </p>
          {businesses.length === 0 && (
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Add your business
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <Link
              key={b.id}
              href={`/service?business=${b.slug}`}
              className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-40 bg-linear-to-br from-primary/10 to-accent/5">
                {b.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.cover_url}
                    alt={b.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="p-5 -mt-10 relative">
                {b.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.logo_url}
                    alt={b.name}
                    className="w-16 h-16 rounded-full border-4 border-white object-cover bg-white"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-display font-bold text-primary">
                      {b.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                      {b.name}
                    </h3>
                    {b.verification_status === "verified" && (
                      <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
                    )}
                  </div>
                  {b.tagline && (
                    <p className="text-xs text-text-secondary truncate mb-2">
                      {b.tagline}
                    </p>
                  )}
                  {b.town && b.county && (
                    <p className="text-xs text-text-tertiary flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {b.town}, {b.county}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
