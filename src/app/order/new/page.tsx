import Link from "next/link";
import type { Metadata } from "next";
import { ShoppingCart, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "New Order | SKIERS ENTREPRENEURS KENYA",
};

export default function NewOrderPage() {
  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-border shadow-xl p-8 lg:p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-3">
          Order flow coming soon
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          The full ordering and payment flow will be built in the next phase.
          You will be able to select a package, enter requirements, and pay
          securely with M-Pesa.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
        >
          Back to services
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
