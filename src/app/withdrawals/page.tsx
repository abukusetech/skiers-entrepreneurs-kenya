import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Wallet,
  ArrowRight,
  Smartphone,
  Clock,
  ShieldCheck,
  History,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Withdrawals",
  description:
    "Withdraw your SKIERS earnings to M-Pesa. Payouts are processed through Safaricom.",
};

export default async function WithdrawalsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/withdrawals");

  const { data: wallet } = await supabase
    .from("wallets")
    .select(
      "available_balance, pending_balance, total_earned, total_withdrawn, currency",
    )
    .eq("profile_id", user.id)
    .maybeSingle();

  const available = wallet?.available_balance ?? 0;
  const pending = wallet?.pending_balance ?? 0;
  const totalEarned = wallet?.total_earned ?? 0;
  const totalWithdrawn = wallet?.total_withdrawn ?? 0;
  const currency = wallet?.currency ?? "KES";

  const { data: payouts } = await supabase
    .from("payout_requests")
    .select("id, amount, currency, status, mpesa_phone, created_at")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const payoutList = payouts ?? [];

  return (
    <div className="bg-background-primary">
      <section className="bg-dark py-16 lg:py-20">
        <div className="container-site">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-md px-4 py-2 mb-6">
            <Wallet className="h-3.5 w-3.5 text-accent" />
            <span className="text-white text-xs font-medium">Your wallet</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-4">
            Withdrawals
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            Your SKIERS balance, held in escrow until each order is approved.
            Released funds can be withdrawn to M-Pesa.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white border border-border rounded-2xl p-5">
              <p className="text-xs text-text-tertiary mb-1">Available</p>
              <p className="text-2xl font-display font-bold text-text-primary">
                {currency} {available.toLocaleString()}
              </p>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5">
              <p className="text-xs text-text-tertiary mb-1">Pending</p>
              <p className="text-2xl font-display font-bold text-text-primary">
                {currency} {pending.toLocaleString()}
              </p>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5">
              <p className="text-xs text-text-tertiary mb-1">Total earned</p>
              <p className="text-2xl font-display font-bold text-text-primary">
                {currency} {totalEarned.toLocaleString()}
              </p>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5">
              <p className="text-xs text-text-tertiary mb-1">Withdrawn</p>
              <p className="text-2xl font-display font-bold text-text-primary">
                {currency} {totalWithdrawn.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 lg:p-8 mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-display font-semibold text-text-primary">
                Withdraw to M-Pesa
              </h2>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Enter the M-Pesa number you want your earnings sent to.
              Withdrawals are processed by our team. You will receive an SMS
              from Safaricom when the money arrives.
            </p>

            <div className="bg-background-secondary rounded-xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-text-tertiary mb-1">
                    Minimum withdrawal
                  </p>
                  <p className="font-medium text-text-primary">
                    {currency} 100
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary mb-1">
                    Processing time
                  </p>
                  <p className="font-medium text-text-primary">
                    Within 24 hours
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary mb-1">
                    Withdrawal fee
                  </p>
                  <p className="font-medium text-text-primary">None</p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary mb-1">Method</p>
                  <p className="font-medium text-text-primary">M-Pesa</p>
                </div>
              </div>
            </div>

            {available < 100 ? (
              <p className="text-sm text-text-secondary mt-6">
                You do not have enough available balance to withdraw yet.
                Complete an order to build your balance.
              </p>
            ) : (
              <a
                href={`https://wa.me/254768860572?text=${encodeURIComponent(
                  `Withdrawal request: ${currency} ${available.toLocaleString()} to my M-Pesa`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-11 px-6 mt-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                Request a withdrawal
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            )}
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <History className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-display font-semibold text-text-primary">
                Withdrawal history
              </h2>
            </div>

            {payoutList.length === 0 ? (
              <div className="bg-background-secondary rounded-xl p-8 text-center">
                <Clock className="h-8 w-8 text-text-tertiary mx-auto mb-3" />
                <p className="text-sm text-text-secondary">
                  No withdrawals yet. Your payout history will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {payoutList.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl bg-background-secondary"
                  >
                    <div>
                      <p className="font-medium text-text-primary text-sm">
                        {p.currency} {p.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {p.mpesa_phone || "No number"} ·{" "}
                        {new Date(p.created_at).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : p.status === "failed" || p.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex items-start gap-3 bg-background-secondary border border-border rounded-2xl p-5">
            <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary leading-relaxed">
              Every shilling you earn sits in escrow until the buyer approves
              the completed work. If a dispute is open, the money stays
              protected until it is resolved.{" "}
              <Link href="/trust" className="text-primary hover:underline">
                Read how we keep payments safe
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
