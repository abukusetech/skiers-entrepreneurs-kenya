"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Package,
  MessageSquare,
  Wallet,
  ShieldCheck,
  LogOut,
  Plus,
  Store,
  Building2,
  Tag,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { logout } from "@/lib/auth/actions";

interface DashboardSidebarProps {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  isBuyer: boolean;
  isSeller?: boolean;
  isVerified: boolean;
  onboardingRole: string | null;
}

export function DashboardSidebar({
  fullName,
  email,
  avatarUrl,
  isBuyer,
  isVerified,
  onboardingRole,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const role = (onboardingRole || "").toLowerCase();
  const isWorker = role === "worker";
  const isBusiness = role === "business";
  const isOrganization = role === "organization";
  const isPlainBuyer = !isWorker && !isBusiness && !isOrganization && isBuyer;

  const links: {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    exact?: boolean;
  }[] = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
  ];

  if (isBusiness) {
    links.push({
      href: "/dashboard/listings",
      label: "My Listings",
      icon: Tag,
    });
  }

  if (isWorker) {
    links.push(
      { href: "/dashboard/services", label: "My Services", icon: Package },
      { href: "/dashboard/proposals", label: "My Proposals", icon: FileText },
    );
  }

  if (isOrganization || isPlainBuyer) {
    links.push({
      href: "/dashboard/projects",
      label: "My Jobs",
      icon: Briefcase,
    });
  }

  links.push(
    { href: "/dashboard/orders", label: "Orders", icon: FileText },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/withdrawals", label: "Wallet", icon: Wallet },
  );

  if (isBusiness) {
    links.push({
      href: "/dashboard/business-profile",
      label: "Business Profile",
      icon: Store,
    });
  } else if (isOrganization) {
    links.push({
      href: "/dashboard/organization-profile",
      label: "Organization Profile",
      icon: Building2,
    });
  } else {
    links.push({
      href: "/dashboard/profile",
      label: "Profile settings",
      icon: User,
    });
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-border p-5 mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={avatarUrl} alt={fullName} size="lg" />
          <div className="min-w-0">
            <p className="font-semibold text-text-primary truncate">
              {fullName}
            </p>
            <p className="text-xs text-text-tertiary truncate">{email}</p>
          </div>
        </div>
        {isVerified ? (
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-success bg-green-50 rounded-full px-2.5 py-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </div>
        ) : (
          <Link
            href={
              isBusiness
                ? "/dashboard/business-profile"
                : isOrganization
                  ? "/dashboard/organization-profile"
                  : "/dashboard/profile"
            }
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-text-tertiary hover:text-primary"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Get verified
          </Link>
        )}
      </div>

      <nav className="bg-white rounded-2xl border border-border p-2">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href, link.exact)
                    ? "bg-primary/5 text-primary"
                    : "text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                }`}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-border mt-2 pt-2">
          {isBusiness && (
            <Link
              href="/dashboard/listings/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Add a listing
            </Link>
          )}

          {isWorker && (
            <Link
              href="/create-service"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="h-4 w-4 shrink-0" />
              New service
            </Link>
          )}

          {(isOrganization || isPlainBuyer) && (
            <Link
              href="/post-job"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Post a job
            </Link>
          )}

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-background-secondary hover:text-error transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Log out
            </button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
