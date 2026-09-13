import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Professional | SKIERS ENTREPRENEURS KENYA",
};

export default function ProfessionalPage() {
  return (
    <div className="bg-background-primary">
      <section className="relative overflow-hidden bg-dark py-20 lg:py-24">
        <div className="relative container-site text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-white text-xs font-medium">Coming soon</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4">
            Professional profile
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            This profile page is being built.
          </p>
        </div>
      </section>
      <section className="section-padding bg-white text-center">
        <Link
          href="/professionals"
          className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
        >
          Back to professionals
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </section>
    </div>
  );
}
