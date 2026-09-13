import Link from "next/link";
import type { Metadata } from "next";
import {
  Smartphone,
  Shield,
  Lock,
  Clock,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "M-Pesa Guide",
  description:
    "How payments and payouts work on SKIERS through M-Pesa. Escrow, protection, and refunds explained.",
};

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Buyer sends an order",
    body: "The buyer picks a service or accepts a proposal, describes the work, and enters the M-Pesa number they will pay from.",
  },
  {
    number: "02",
    icon: Lock,
    title: "Safaricom sends the prompt",
    body: "An STK push arrives on the buyer's phone. They enter their M-Pesa PIN to complete payment. The money leaves their account.",
  },
  {
    number: "03",
    icon: Shield,
    title: "SKIERS holds the money in escrow",
    body: "The payment lands in SKIERS, not the worker. The worker sees the order is funded and starts delivering.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Buyer approves, worker gets paid",
    body: "When the buyer approves the delivered work, money is released to the worker. They can withdraw to their own M-Pesa.",
  },
];

const faqs = [
  {
    q: "How much does SKIERS charge?",
    a: "A small commission on completed orders. Jobs under KES 10,000 pay 15%. Jobs between KES 10,000 and 100,000 pay 12%. Jobs above KES 100,000 pay 10%. The commission is deducted from the worker payout, not added on top of the buyer's total.",
  },
  {
    q: "What if the work is not delivered?",
    a: "The money stays in escrow. The buyer can request a revision or open a dispute. Money is only released when the buyer approves, or if a dispute is resolved in the worker's favour.",
  },
  {
    q: "Can I pay with a bank card?",
    a: "Not yet. M-Pesa is the only payment method supported. It works for the vast majority of Kenyans and clears in seconds. Bank and card support is planned but not yet live.",
  },
  {
    q: "How long do withdrawals take?",
    a: "Withdrawals to M-Pesa are processed by our team within 24 hours of a request. You receive an SMS from Safaricom once the money lands.",
  },
  {
    q: "What happens if my phone is off when the prompt comes?",
    a: "The prompt expires in about 60 seconds. If you miss it, no money moves. The order stays pending and you can retry the payment from the order page.",
  },
];

export default function MPesaPage() {
  return (
    <div className="bg-background-primary">
      <section className="bg-dark py-20 lg:py-24">
        <div className="container-site">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-md px-4 py-2 mb-6">
            <Smartphone className="h-3.5 w-3.5 text-accent" />
            <span className="text-white text-xs font-medium">
              M-Pesa on SKIERS
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 max-w-3xl">
            Pay and get paid with M-Pesa
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            Every order on SKIERS is funded through M-Pesa and held safely in
            escrow. Here is exactly how it works, from prompt to payout.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
              The full flow
            </p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
              What happens after you place an order
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Four steps. Nothing leaves escrow until the work is approved.
            </p>
          </div>

          <div className="space-y-5 max-w-4xl">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white border border-border rounded-2xl p-6 lg:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4 md:w-40 shrink-0">
                    <span className="text-4xl font-display font-bold text-primary/20">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm lg:text-base text-text-secondary leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site max-w-3xl">
          <div className="flex items-start gap-3 bg-white border border-border rounded-2xl p-6 mb-8">
            <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text-primary mb-1">
                About the M-Pesa prompt
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                When you confirm an order, Safaricom sends an STK push to your
                phone. Enter your M-Pesa PIN to pay. The prompt expires in about
                60 seconds, but you can retry any time from the order page.
              </p>
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-8">
            Common questions
          </h2>

          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group bg-white border border-border rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
                  <span className="font-medium text-text-primary text-sm lg:text-base">
                    {item.q}
                  </span>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-background-secondary flex items-center justify-center text-text-secondary group-open:bg-primary group-open:text-white transition-colors">
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/trust"
              className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              How we protect your money
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              See the fee breakdown
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white border-t border-border">
        <div className="container-site max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-text-primary">
              Getting help fast
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-6">
            If something goes wrong with a payment, WhatsApp is the fastest way
            to reach us. We monitor it during working hours and can usually
            trace a stuck transaction in minutes.
          </p>
          <a
            href="https://wa.me/254768860572"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-kenya-green text-white hover:bg-green-700 transition-colors"
          >
            WhatsApp +254 768 860 572
          </a>
        </div>
      </section>
    </div>
  );
}
