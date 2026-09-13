import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Star, Clock, CheckCircle } from "lucide-react";
import type { ServiceListItem } from "@/lib/db/queries/services";

interface ServiceCardProps {
  service: ServiceListItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const seller = service.seller;
  const category = service.category;

  const providerName = service.business_name || seller?.full_name || "Provider";
  const providerLogo = service.business_logo_url || seller?.avatar_url;
  const providerVerified =
    service.business_verified || seller?.is_verified || false;

  return (
    <Link
      href={`/service/${service.slug}`}
      className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-video bg-linear-to-r from-primary/10 to-accent/5 overflow-hidden">
        {service.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.cover_url}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-display font-bold text-primary/30">
              {category?.name || "Service"}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative shrink-0">
            <Avatar src={providerLogo} alt={providerName} size="md" />
            {providerVerified && (
              <span className="absolute -bottom-1 -right-1 bg-success text-white rounded-full p-0.5">
                <CheckCircle className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
              {service.title}
            </h3>
            <p className="text-xs text-text-tertiary truncate">
              {providerName}
            </p>
          </div>
        </div>

        <p className="text-sm text-text-secondary line-clamp-2 mb-4 min-h-10">
          {service.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-text-primary">
              {service.currency} {service.starting_price.toLocaleString()}
            </span>
            <span className="text-xs text-text-tertiary ml-1">from</span>
          </div>
          {service.rating_count > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span className="text-sm font-semibold">
                {service.rating_average.toFixed(1)}
              </span>
              <span className="text-xs text-text-tertiary">
                ({service.rating_count})
              </span>
            </div>
          ) : (
            <span className="text-xs bg-background-secondary text-text-tertiary px-2 py-1 rounded-full">
              New
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          {category && (
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              {category.name}
            </span>
          )}
          {service.delivery_time_days && (
            <span className="text-xs text-text-tertiary flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {service.delivery_time_days} days
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
