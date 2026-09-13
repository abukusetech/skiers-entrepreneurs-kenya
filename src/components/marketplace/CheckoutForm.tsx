"use client";

import { useState, useActionState } from "react";
import {
  createServiceOrderAndPay,
  type CheckoutState,
} from "@/lib/actions/checkout";
import {
  Shield,
  Smartphone,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface ServicePackage {
  id: string;
  packageType: string;
  title: string;
  description: string | null;
  price: number;
  deliveryTimeDays: number | null;
  revisionLimit: number | null;
}

interface CheckoutFormProps {
  service: {
    id: string;
    title: string;
    currency: string;
    startingPrice: number;
    deliveryTimeDays: number | null;
    revisionLimit: number | null;
  };
  packages: ServicePackage[];
}

const PACKAGE_LABELS: Record<string, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
};

function commissionRateFor(amount: number): number {
  if (amount < 10_000) return 0.15;
  if (amount <= 100_000) return 0.12;
  return 0.1;
}

export function CheckoutForm({ service, packages }: CheckoutFormProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    packages.length > 0 ? packages[0].id : null,
  );
  const [state, formAction, isPending] = useActionState<
    CheckoutState,
    FormData
  >(createServiceOrderAndPay, null);

  const selected = packages.find((p) => p.id === selectedPackageId) || null;
  const price = selected?.price ?? service.startingPrice;
  const deliveryDays = selected?.deliveryTimeDays ?? service.deliveryTimeDays;
  const revisionLimit = selected?.revisionLimit ?? service.revisionLimit;
  const commission = Math.round(price * commissionRateFor(price));

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="serviceId" value={service.id} />
      {selectedPackageId && (
        <input type="hidden" name="packageId" value={selectedPackageId} />
      )}

      {state?.error && (
        <div className="flex items-center gap-2 text-sm text-error bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      {packages.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-sm font-semibold text-text-primary mb-4">
            Choose a package
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`text-left rounded-xl border-2 p-4 transition-colors ${
                  selectedPackageId === pkg.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                  {PACKAGE_LABELS[pkg.packageType] || pkg.packageType}
                </p>
                <p className="font-display font-bold text-text-primary mb-1">
                  {service.currency} {pkg.price.toLocaleString()}
                </p>
                {pkg.deliveryTimeDays && (
                  <p className="text-xs text-text-tertiary">
                    {pkg.deliveryTimeDays} days delivery
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border p-5">
        <label
          htmlFor="requirements"
          className="block text-sm font-semibold text-text-primary mb-2"
        >
          What do you need done?
        </label>
        <textarea
          id="requirements"
          name="requirements"
          rows={5}
          required
          minLength={10}
          placeholder="Describe the work, any files or references the seller needs, and your deadline."
          className="w-full px-4 py-3 rounded-md border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
        />
      </div>

      <div className="bg-white rounded-2xl border border-border p-5">
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-text-primary mb-2"
        >
          M-Pesa number to pay from
        </label>
        <div className="relative">
          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="07XX XXX XXX"
            className="w-full h-12 pl-11 pr-4 rounded-md border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <p className="text-xs text-text-tertiary mt-2">
          You will get an M-Pesa prompt on this number to confirm payment.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Service price</span>
          <span className="text-text-primary font-medium">
            {service.currency} {price.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Delivery</span>
          <span className="text-text-primary font-medium">
            {deliveryDays ? `${deliveryDays} days` : "Standard"}
            {revisionLimit ? `, ${revisionLimit} revisions` : ""}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
          <span className="text-text-primary">Total to pay</span>
          <span className="text-primary">
            {service.currency} {price.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-text-tertiary pt-1">
          A platform commission of {Math.round(commissionRateFor(price) * 100)}%
          ({service.currency} {commission.toLocaleString()}) is deducted from
          the seller payout, not added on top of your total.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-tertiary">
        <Shield className="h-4 w-4 text-success shrink-0" />
        Your payment is held in escrow and only released to the seller once you
        approve the completed work.
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-12 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending M-Pesa prompt...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Pay {service.currency} {price.toLocaleString()} with M-Pesa
          </>
        )}
      </button>

      <p className="text-xs text-text-tertiary text-center">
        If payment fails, you can retry from your orders page. No money is taken
        unless the M-Pesa prompt is completed on your phone.
      </p>
    </form>
  );
}
