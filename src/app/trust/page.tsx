import Link from "next/link";
import type { Metadata } from "next";
import {
  Shield,
  Lock,
  BadgeCheck,
  AlertCircle,
  Scale,
  Users,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Trust & Safety",
  description:
    "How SKIERS keeps payments safe, verifies profiles, and handles disputes.",
};

const pillars = [
  {
    icon: Lock,
    title: "Escrow on every order",
    body: "Money paid for a job is held by SKIERS until the buyer approves the completed work. It is never sent directly to the seller at the moment of payment.",
  },
  {
    icon: BadgeCheck,
    title: "Profile verification",
    body: "Workers, businesses, and organizations can verify their identity with a national ID and selfie. Verified profiles get a badge and rank higher in search.",
  },
  {
    icon: Scale,
    title: "Fair dispute resolution",
    body: "If a buyer and seller disagree, either side can open a dispute. Our team reviews the evidence from both sides and makes a decision.",
  },
  {
    icon: Users,
    title: "Real reviews only",
    body: "Reviews can only be left after an order is complete. That means every rating on SKIERS comes from a real transaction.",
  },
];

export default function TrustPage() {
  return (
    <div className="bg-background-primary">
      <section className="bg-dark py-20 lg:py-24">
        <div className="container-site">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-md px-4 py-2 mb-6">
            <Shield className="h-3.5 w-3.5 text-accent" />
            <span className="text-white text-xs font-medium">
              Trust &amp; Safety
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 max-w-3xl">
            How we keep SKIERS safe
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            Every order on SKIERS is protected by escrow. Every worker can be
            verified. Every dispute gets a fair hearing. Here is exactly how it
            works.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
              The four pillars
            </p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
              What protects you on SKIERS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="bg-white border border-border rounded-2xl p-6 lg:p-8"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-8">
            How a dispute works
          </h2>

          <div className="space-y-4">
            {[
              {
                t: "1. Talk first",
                d: "If there is a problem, message the other side on SKIERS. Most issues are misunderstandings and resolve in a few messages.",
              },
              {
                t: "2. Open a dispute",
                d: "If direct messages do not resolve it, either side can open a dispute on the order. Payment stays locked in escrow.",
              },
              {
                t: "3. We review the evidence",
                d: "Our team reads the messages, looks at the deliverables, and listens to both sides. We do not make decisions on a coin toss.",
              },
              {
                t: "4. We publish the outcome",
                d: "Every dispute resolution comes with a written reason, sent to both sides. Escrowed money moves according to the decision.",
              },
            ].map((s) => (
              <div
                key={s.t}
                className="bg-white border border-border rounded-2xl p-5"
              >
                <p className="font-semibold text-text-primary mb-1">{s.t}</p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {s.d}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-dark text-white rounded-2xl p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-accent" />
                <h3 className="font-display font-bold text-lg">
                  Reporting a user
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                If someone on SKIERS breaks our terms, harasses you, or tries to
                scam you, report them. Every report is read by a person, not an
                automated filter.
              </p>
              <a
                href="https://wa.me/254768860572?text=Report%20a%20user"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold rounded-md bg-kenya-green text-white hover:bg-green-700 transition-colors"
              >
                Report to our team
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white border-t border-border">
        <div className="container-site max-w-3xl text-center">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-3">
            More detail on the rules
          </h2>
          <p className="text-text-secondary mb-6">
            The legal side of trust lives in our Terms of Service and Privacy
            Policy. Read them any time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/terms"
              className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Read the Terms
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
