"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { retryOrderPayment, type CheckoutState } from "@/lib/actions/checkout";
import { approveOrder, cancelOrder } from "@/lib/actions/manage-order";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

interface OrderActionsProps {
  orderId: string;
  isBuyer: boolean;
  orderStatus: string;
  getStatus: (orderId: string) => Promise<{
    orderStatus: string;
    paymentStatus: string | null;
    mpesaReceiptNumber: string | null;
  } | null>;
}

const APPROVABLE_STATUSES = [
  "paid",
  "in_progress",
  "submitted",
  "in_review",
  "revision_requested",
];

export function OrderActions({
  orderId,
  isBuyer,
  orderStatus,
}: OrderActionsProps) {
  const router = useRouter();
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [retryState, retryAction, isRetrying] = useActionState<
    CheckoutState,
    FormData
  >(retryOrderPayment, null);

  function handleApprove() {
    setActionError(null);
    startTransition(async () => {
      const result = await approveOrder(orderId);
      if (result?.error) {
        setActionError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleCancel() {
    setActionError(null);
    startTransition(async () => {
      const result = await cancelOrder(orderId);
      if (result?.error) {
        setActionError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  if (["created", "payment_pending"].includes(orderStatus) && isBuyer) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-text-primary">Payment</h2>
        </div>

        <div className="flex items-center gap-3 text-sm text-text-secondary bg-background-secondary rounded-xl p-4 mb-4">
          <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
          Check your phone for the M-Pesa prompt and enter your PIN to complete
          payment. This page updates once the payment is confirmed.
        </div>

        {retryState?.error && (
          <div className="flex items-center gap-2 text-sm text-error bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {retryState.error}
          </div>
        )}

        <form action={retryAction} className="flex flex-col sm:flex-row gap-3">
          <input type="hidden" name="orderId" value={orderId} />
          <input
            name="phone"
            type="tel"
            required
            placeholder="07XX XXX XXX"
            className="flex-1 h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <button
            type="submit"
            disabled={isRetrying}
            className="h-11 px-5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 shrink-0"
          >
            {isRetrying ? "Sending..." : "Send M-Pesa prompt"}
          </button>
        </form>

        {actionError && (
          <div className="flex items-center gap-2 text-sm text-error bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {actionError}
          </div>
        )}

        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="mt-3 text-xs font-medium text-text-tertiary hover:text-error"
        >
          Cancel this order
        </button>
      </div>
    );
  }

  if (APPROVABLE_STATUSES.includes(orderStatus) && isBuyer) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-text-primary">
            Payment held in escrow
          </h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Once you are happy with the delivered work, approve the order to
          release payment to the seller.
        </p>

        {actionError && (
          <div className="flex items-center gap-2 text-sm text-error bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {actionError}
          </div>
        )}

        <button
          type="button"
          onClick={handleApprove}
          disabled={isPending}
          className="h-11 px-6 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {isPending ? "Releasing payment..." : "Approve and release payment"}
        </button>
      </div>
    );
  }

  if (orderStatus === "completed") {
    return (
      <div className="bg-success/5 border border-success/20 rounded-2xl p-6 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
        <p className="text-sm text-text-primary">
          This order is complete and payment has been released.
        </p>
      </div>
    );
  }

  return null;
}
