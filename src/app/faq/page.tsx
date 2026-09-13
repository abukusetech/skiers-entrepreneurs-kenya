import Link from "next/link";
import type { Metadata } from "next";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Users,
  Briefcase,
  Shield,
  CreditCard,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help & FAQ | SKIERS ENTREPRENEURS KENYA",
  description:
    "Frequently asked questions about SKIERS ENTREPRENEURS KENYA. Learn how to hire, find work, pay with M-Pesa, and stay safe on the platform.",
};

const categories = [
  {
    name: "Getting started",
    icon: HelpCircle,
    questions: [
      {
        q: "What is SKIERS ENTREPRENEURS KENYA?",
        a: "It's a Kenyan marketplace where you can hire anyone for any job, or find work yourself. It connects employers, freelancers, skilled workers, and local businesses across all 47 counties. Payment runs through M-Pesa, protected by escrow.",
      },
      {
        q: "Is it free to use?",
        a: "Yes. Posting jobs is free. Applying to jobs is free. Creating a profile is free. We only make money when a job is actually completed: a small commission on the transaction. You never have to pay to use the platform.",
      },
      {
        q: "How do I create an account?",
        a: "Click Sign up at the top of any page, choose whether you want to hire or find work (or both), and fill in a few basic details. It takes about two minutes.",
      },
      {
        q: "Do I need to verify my identity?",
        a: "Not to start using the platform. But verified profiles appear higher in search results, get more work, and unlock bigger jobs. Verification is optional, quick, and free. Just upload your ID and a selfie.",
      },
    ],
  },
  {
    name: "For employers",
    icon: Briefcase,
    questions: [
      {
        q: "How do I hire someone?",
        a: "Post a job for free by describing what you need. Talent will send you proposals, usually within a few hours. Review their profiles, chat with the ones you like, and hire the best fit. You only pay when you've received work you're happy with.",
      },
      {
        q: "How much does it cost to hire?",
        a: "Posting jobs is free. When you hire someone, you pay their rate plus a small service fee. The exact amount is shown before you confirm, no surprises. Your money is held in escrow until you approve the work.",
      },
      {
        q: "What if I'm not happy with the work?",
        a: "You don't release the payment until the work is done to your satisfaction. If something goes wrong, you can request revisions or open a dispute. We hold the money in escrow until you approve, so you never lose money on work that wasn't delivered.",
      },
      {
        q: "Can I hire a team, not just individuals?",
        a: "Yes. You can hire agencies, small businesses, and teams the same way you hire an individual, there's no separate business tier required. Company profiles are supported so a business can post jobs and hire under its own name.",
      },
    ],
  },
  {
    name: "For freelancers & workers",
    icon: Users,
    questions: [
      {
        q: "How do I find work?",
        a: "Create your profile, list the services you offer, and start applying to jobs. You can also publish 'gigs' that buyers can hire you for directly, without needing to apply. Applying is completely free: no credits to buy, no paywall.",
      },
      {
        q: "When do I get paid?",
        a: "Payment is released to your M-Pesa as soon as the buyer approves the completed work, usually within minutes. If they don't respond within a set period after you submit, the money is released automatically.",
      },
      {
        q: "How much does SKIERS take?",
        a: "We take a small commission on each completed job. You only pay this when you actually earn. The exact amount is shown on every job before you accept. No hidden fees, no monthly subscriptions required.",
      },
      {
        q: "Do I need to have a portfolio?",
        a: "It helps a lot. Talent with a portfolio gets hired far more often. But if you're new, you can start with just a strong profile description and a clear photo. You can add portfolio items as you complete your first jobs.",
      },
      {
        q: "I have a physical shop or business. Can I list it?",
        a: "Yes. You can list your shop, showroom, or office on our map, and customers nearby can find and contact you directly. Physical businesses, hotels, salons, repair shops, catering, cleaning, and more, are a big part of what SKIERS is built for.",
      },
    ],
  },
  {
    name: "Payments & M-Pesa",
    icon: CreditCard,
    questions: [
      {
        q: "How do I pay for a job?",
        a: "When you hire someone, you pay via M-Pesa. You'll get a prompt on your phone. Enter your PIN, and the money goes into a secure escrow account. It's released to the worker only when you approve the work.",
      },
      {
        q: "Is my money safe?",
        a: "Yes. We hold money in escrow. It's not released until you approve the work. If there's a problem, you keep the money until it's resolved. This protects both sides and is why most people prefer hiring through SKIERS.",
      },
      {
        q: "How do I withdraw my earnings?",
        a: "Go to your dashboard, click Withdraw, enter your M-Pesa number, and the money arrives within minutes. There's a minimum withdrawal amount, but no fee for withdrawals.",
      },
      {
        q: "Can I pay with something other than M-Pesa?",
        a: "Right now M-Pesa is the only payment method. It's what works for almost every Kenyan. We'll add bank transfers and card payments in a future update.",
      },
      {
        q: "What if I send money to the wrong person?",
        a: "Contact us immediately via WhatsApp. If the job hasn't been completed or the money hasn't been released, we can usually reverse the transaction within a few hours.",
      },
      {
        q: "How much is the platform commission?",
        a: "We charge a small percentage of each completed job. The exact rate depends on the category. The amount is always shown to you before you commit to anything. You'll never be surprised by a fee.",
      },
    ],
  },
  {
    name: "Safety & trust",
    icon: Shield,
    questions: [
      {
        q: "How do I know a freelancer is legit?",
        a: "Look for the verified badge on their profile. Read their reviews from past clients. Check their portfolio and rating. If something feels off, don't hire. Trust your gut.",
      },
      {
        q: "What if someone scams me?",
        a: "Report them immediately using the Report button on their profile. We investigate every report and suspend accounts that violate our rules. If you paid through SKIERS, your money is protected by escrow.",
      },
      {
        q: "Can I share my personal contact info on the platform?",
        a: "You can, but we strongly recommend keeping communication and payments on SKIERS. This protects you: if something goes wrong, we can help. Off-platform deals have no protection.",
      },
      {
        q: "What happens if we have a disagreement?",
        a: "Try to resolve it directly through messages first. If you can't agree, open a dispute. Our team reviews both sides, looks at the evidence, and makes a fair decision. Escrowed money stays protected until the dispute is closed.",
      },
      {
        q: "Do you do background checks?",
        a: "For verified users, we check ID documents, phone numbers, and basic identity. Premium verified users get an extra level of checking. We don't run criminal background checks yet, but that's on our roadmap.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-background-primary">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-dark py-20 lg:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-info/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container-site text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <HelpCircle className="h-3.5 w-3.5 text-accent" />
            <span className="text-white text-xs font-medium">Help center</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 animate-slide-up">
            Frequently asked questions
          </h1>

          <p
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Quick answers to the questions we get most often. If you can&apos;t
            find what you need, contact us anytime.
          </p>
        </div>
      </section>

      {/* ============ FAQ SECTIONS ============ */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-4xl">
          {categories.map((cat, catIndex) => (
            <div
              key={cat.name}
              className={
                catIndex > 0 ? "mt-16 pt-16 border-t border-border" : ""
              }
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center">
                  <cat.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-text-primary">
                  {cat.name}
                </h2>
              </div>

              <div className="space-y-3">
                {cat.questions.map((item) => (
                  <details
                    key={item.q}
                    className="group bg-white border border-border rounded-xl overflow-hidden transition-colors hover:border-primary/30"
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
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site">
          <div className="max-w-3xl mx-auto bg-dark text-white rounded-2xl p-10 lg:p-14 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <AlertCircle className="h-10 w-10 text-accent mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-display font-bold mb-3">
                Still have a question?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Our team replies within 24 hours. WhatsApp is fastest, usually
                within an hour during working hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://wa.me/254768860572"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold rounded-md bg-kenya-green text-white hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp us
                </a>
                <a
                  href="mailto:skierscreatives@gmail.com"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold rounded-md bg-transparent text-white border-2 border-white hover:bg-white hover:text-dark transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Send an email
                </a>
              </div>

              <p className="text-xs text-gray-400 mt-6">
                Or visit our{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  contact page
                </Link>{" "}
                for more ways to reach us.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
