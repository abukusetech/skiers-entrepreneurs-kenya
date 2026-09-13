import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Shield, CreditCard, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, honest pricing. Free to post jobs, free to apply. We only charge a small commission when work is completed and paid through M-Pesa escrow.",
};

const commissionTiers = [
  {
    range: "Jobs under KES 10,000",
    rate: "15%",
    note: "Small jobs. Higher commission because we still do the same work.",
  },
  {
    range: "Jobs between KES 10,000 and 100,000",
    rate: "12%",
    note: "Most common tier. Balanced rate for both sides.",
  },
  {
    range: "Jobs over KES 100,000",
    rate: "10%",
    note: "Large jobs. Lower commission rewards bigger contracts.",
  },
];

const faqs = [
  {
    q: "Do I have to pay to use SKIERS?",
    a: "No. You can use the entire platform for free. Post jobs, apply to jobs, chat, hire, and get paid without ever paying a subscription fee. The only fee we charge is a small commission when a job is completed and paid.",
  },
  {
    q: "When exactly am I charged the commission?",
    a: "Only when work is completed and approved by the buyer. You never pay us just for posting or applying. If a job is cancelled or never gets done, no commission is charged.",
  },
  {
    q: "Who pays the commission, buyer or worker?",
    a: "Both sides contribute. The exact split is shown before you commit to a job. The buyer sees a small service fee added to their total, and the worker sees a small deduction from their payout.",
  },
  {
    q: "Do you take a cut of tips?",
    a: "No. Tips go 100 percent to the worker. We never touch them.",
  },
  {
    q: "Are there any hidden fees?",
    a: "None. Every fee is shown to you before you commit. If we ever add a new fee, we will announce it clearly on this page and inside the platform.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background-primary">
      <section className="bg-dark py-16 lg:py-20">
        <div className="container-site text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-md px-4 py-2 mb-6">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span className="text-white text-xs font-medium">
              One fee, no subscriptions
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4">
            Pricing that works for Kenya
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Free to post. Free to apply. We only make money when you do.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-md px-4 py-2 mb-6">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold">
                How we charge
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
              One small fee, only when work is done
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We take a small commission on completed and approved jobs. There
              are no monthly subscriptions, no credits to buy, and no charges
              just to use the platform.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {commissionTiers.map((tier, i) => (
                <div
                  key={tier.range}
                  className={`bg-white border rounded-2xl p-6 ${
                    i === 1 ? "border-primary shadow-lg" : "border-border"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                    Tier {i + 1}
                  </p>
                  <p className="text-sm text-text-secondary mb-4">
                    {tier.range}
                  </p>
                  <p className="text-4xl font-display font-bold text-primary mb-3">
                    {tier.rate}
                  </p>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    {tier.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-background-secondary rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary mb-1">
                  The commission is split between buyer and worker
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  On every job, a small percentage is added to the buyer total.
                  The rest comes out of the worker payout. Both sides know the
                  exact amount before they commit, no surprises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-8 text-center">
            What is included, always
          </h2>
          <div className="bg-white rounded-2xl border border-border p-8">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Post unlimited jobs",
                "Apply to unlimited jobs",
                "Full profile and portfolio",
                "Chat with buyers and workers",
                "Protected M-Pesa escrow payments",
                "Reviews and ratings",
                "Search and category filters",
                "Identity verification",
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-3">
                  <svg
                    className="h-4 w-4 text-success shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-text-secondary">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white border-t border-border">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-10 text-center">
            Common pricing questions
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
        </div>
      </section>

      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="relative container-site text-center">
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-4 max-w-3xl mx-auto">
            Start free. Pay only when it works.
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Create your account, post your first job, or offer your first
            service. It is all free to start.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-white text-primary hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
            >
              Create free account
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary transition-colors duration-200 w-full sm:w-auto"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
