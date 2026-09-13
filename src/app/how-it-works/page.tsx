import Link from "next/link";
import type { Metadata } from "next";
import {
  Briefcase,
  Users,
  Shield,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  Search,
  FileText,
  UserCheck,
  Send,
  Star,
  Wallet,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | SKIERS ENTREPRENEURS KENYA",
  description:
    "Learn how SKIERS ENTREPRENEURS KENYA works. Step by step guides for employers who want to hire and for freelancers who want to find work.",
};

const buyerSteps = [
  {
    number: "01",
    title: "Post your job for free",
    desc: "Tell us what you need done. Include a clear title, a short description, your budget, and any deadline. It takes about two minutes.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Review proposals from talent",
    desc: "Skilled Kenyans will apply within hours. Read their profiles, check ratings, view portfolios, and chat with the ones who look best.",
    icon: Users,
  },
  {
    number: "03",
    title: "Hire the right person",
    desc: "When you find someone you trust, accept their proposal. You can hire one freelancer or split the work across several. Your choice.",
    icon: UserCheck,
  },
  {
    number: "04",
    title: "Pay safely with M-Pesa",
    desc: "You pay through M-Pesa. The money is held in escrow. It is not released to the worker until you approve the work they deliver.",
    icon: CreditCard,
  },
  {
    number: "05",
    title: "Approve work and leave a review",
    desc: "Once you are happy with the result, approve it. The money goes to the worker. Then leave a review so others can trust them too.",
    icon: Star,
  },
];

const sellerSteps = [
  {
    number: "01",
    title: "Create your free profile",
    desc: "Sign up in two minutes. Add a photo, describe your skills, and set your rates. The stronger your profile, the more work you get.",
    icon: UserCheck,
  },
  {
    number: "02",
    title: "Browse jobs or publish gigs",
    desc: "Apply to jobs that match your skills. Or publish fixed services that buyers can hire you for directly, without waiting for applications.",
    icon: Search,
  },
  {
    number: "03",
    title: "Send proposals and win work",
    desc: "Write a short, clear proposal explaining why you are right for the job. Include your price and timeline. Buyers see every proposal you send.",
    icon: Send,
  },
  {
    number: "04",
    title: "Deliver the work",
    desc: "Once hired, chat with your client through the platform. Deliver the work on time. Request revisions if needed. Keep everything on SKIERS for your protection.",
    icon: MessageSquare,
  },
  {
    number: "05",
    title: "Get paid, then withdraw",
    desc: "When the buyer approves your work, the money is released to your account. Withdraw to M-Pesa any time. Most withdrawals arrive in minutes.",
    icon: Wallet,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-background-primary">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-dark py-20 lg:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-info/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container-site text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
            <span className="text-white text-xs font-medium">
              Simple from start to finish
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 animate-slide-up">
            How SKIERS works
          </h1>

          <p
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Whether you are hiring or looking for work, the process is simple,
            safe, and paid through M-Pesa. Here is exactly how it works.
          </p>
        </div>
      </section>

      {/* ============ FOR EMPLOYERS ============ */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              For employers
            </p>
          </div>

          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-3 max-w-2xl">
            How to hire on SKIERS
          </h2>

          <p className="text-text-secondary max-w-2xl mb-14 leading-relaxed">
            Post a job for free. Get real proposals from real Kenyans. Pay only
            when the work is done to your satisfaction.
          </p>

          <div className="space-y-5">
            {buyerSteps.map((step) => (
              <div
                key={step.number}
                className="group bg-white border border-border rounded-2xl p-6 lg:p-8 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4 md:w-40 shrink-0">
                    <span className="text-4xl font-display font-bold text-primary/20 group-hover:text-primary transition-colors">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <step.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm lg:text-base text-text-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/post-job"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Post a job for free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FOR FREELANCERS ============ */}
      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-dark flex items-center justify-center">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              For freelancers and workers
            </p>
          </div>

          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-3 max-w-2xl">
            How to find work on SKIERS
          </h2>

          <p className="text-text-secondary max-w-2xl mb-14 leading-relaxed">
            Build a profile, apply to jobs, and get paid through M-Pesa.
            Applying is always free. You only pay a small commission when you
            actually earn.
          </p>

          <div className="space-y-5">
            {sellerSteps.map((step) => (
              <div
                key={step.number}
                className="group bg-white border border-border rounded-2xl p-6 lg:p-8 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4 md:w-40 shrink-0">
                    <span className="text-4xl font-display font-bold text-primary/20 group-hover:text-primary transition-colors">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <step.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm lg:text-base text-text-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Create your free profile
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ PAYMENT FLOW ============ */}
      <section className="section-padding bg-white border-t border-border">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 rounded-full px-4 py-2 mb-6">
              <Shield className="h-3.5 w-3.5 text-success" />
              <span className="text-success text-xs font-semibold">
                Protected payments
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
              How payment works
            </h2>
            <p className="text-text-secondary leading-relaxed">
              Money is held in escrow until work is delivered. This protects
              both sides and is why hiring on SKIERS feels safer than paying a
              stranger directly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background-secondary rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary mx-auto flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs font-bold text-primary mb-2">Step 1</p>
                <h3 className="font-semibold text-text-primary mb-2">
                  Buyer pays
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Buyer sends money via M-Pesa. It goes into a secure escrow
                  account, not to the worker yet.
                </p>
              </div>

              <div className="bg-background-secondary rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs font-bold text-primary mb-2">Step 2</p>
                <h3 className="font-semibold text-text-primary mb-2">
                  Work is done
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Freelancer delivers the work. Buyer reviews it. Revisions can
                  be requested before approval.
                </p>
              </div>

              <div className="bg-background-secondary rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-success mx-auto flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs font-bold text-success mb-2">Step 3</p>
                <h3 className="font-semibold text-text-primary mb-2">
                  Money is released
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Buyer approves. Money leaves escrow. Freelancer can withdraw
                  to M-Pesa within minutes.
                </p>
              </div>
            </div>

            <div className="mt-10 bg-dark text-white rounded-2xl p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <h3 className="text-xl font-display font-bold mb-3">
                  What if something goes wrong?
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If the work is not delivered, or delivered badly, the buyer
                  can open a dispute. Money stays in escrow until it is
                  resolved. If the buyer does not respond after work is
                  submitted, the money is automatically released to the worker
                  after a set period.
                </p>
                <p className="text-sm text-gray-400">
                  Both sides are protected. That is what makes SKIERS work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section-padding bg-linear-to-br from-primary via-primary to-primary-hover relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-info/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container-site text-center">
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-4 max-w-3xl mx-auto">
            Ready to get started?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Post your first job, or create your free profile. Either way, it
            takes two minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/post-job"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-white text-primary hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto"
            >
              Post a job
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary transition-colors duration-300 w-full sm:w-auto"
            >
              Find work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
