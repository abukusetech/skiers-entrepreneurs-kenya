import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sitemap",
};

const groups = [
  {
    title: "Marketplace",
    links: [
      { href: "/services", label: "Find Talent" },
      { href: "/jobs", label: "Find Work" },
      { href: "/businesses", label: "Nearby Businesses" },
      { href: "/categories", label: "Categories" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { href: "/post-job", label: "Post a Job" },
      { href: "/pricing", label: "Pricing" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/contact", label: "Contact Sales" },
    ],
  },
  {
    title: "For Talent",
    links: [
      { href: "/create-service", label: "Offer Your Services" },
      { href: "/withdrawals", label: "Withdrawals" },
      { href: "/m-pesa", label: "M-Pesa Guide" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/trust", label: "Trust & Safety" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="bg-background-primary">
      <section className="relative overflow-hidden bg-dark py-20 lg:py-24">
        <div className="relative container-site text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4">
            Sitemap
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Every page on SKIERS ENTREPRENEURS KENYA.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-lg font-display font-semibold text-text-primary mb-4">
                  {group.title}
                </h2>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-primary inline-flex items-center gap-1 group"
                      >
                        {link.label}
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
