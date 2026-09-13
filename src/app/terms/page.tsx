import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText,
  UserCheck,
  CreditCard,
  Shield,
  AlertCircle,
  Scale,
  Ban,
  RefreshCw,
  Mail,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | SKIERS ENTREPRENEURS KENYA",
  description:
    "Read the terms of service for SKIERS ENTREPRENEURS KENYA. Understand your rights and responsibilities when using our marketplace.",
};

const sections = [
  {
    icon: FileText,
    title: "1. Agreement to these terms",
    body: [
      "By creating an account or using SKIERS ENTREPRENEURS KENYA (which we will call SKIERS, the Platform, or we throughout this document), you agree to these terms. If you do not agree with any part of these terms, please do not use the Platform.",
      "These terms apply to everyone who uses SKIERS: buyers who post jobs, sellers who offer services, freelancers, workers, businesses, and visitors who browse without an account.",
    ],
  },
  {
    icon: UserCheck,
    title: "2. Your account",
    body: [
      "To post a job, offer a service, or send a message, you must create an account. You are responsible for keeping your password safe and for everything that happens under your account.",
      "You must be at least 18 years old to use SKIERS. If you are under 18, you may only use the Platform with the involvement of a parent or legal guardian.",
      "You agree to provide accurate information when you sign up. If your details change, keep them up to date. Providing false information may result in account suspension.",
    ],
  },
  {
    icon: Scale,
    title: "3. What SKIERS is",
    body: [
      "SKIERS is a marketplace. We connect people who need work done with people who can do the work. We are not the employer, not the contractor, and not the worker. The actual agreement for any job is between the buyer and the seller.",
      "We provide the tools: search, messaging, escrow payments through M-Pesa, reviews, and dispute resolution. We do not supervise, direct, or control the work that is performed.",
      "Because of this, we cannot guarantee the quality of any service or the reliability of any user. What we can do is hold money in escrow, verify users who want to be verified, and remove accounts that break our rules.",
    ],
  },
  {
    icon: CreditCard,
    title: "4. Payments and commission",
    body: [
      "All payments on SKIERS are processed through M-Pesa. When a buyer hires someone, they pay into a secure escrow account. The money is not released to the worker until the buyer approves the completed work.",
      "We charge a small commission on every completed and approved job. The exact rate is shown to both the buyer and the seller before the job begins. The commission is our only mandatory fee.",
      "Optional subscription plans (Pro and Business) are billed monthly. They are not required to use the Platform. You can cancel anytime.",
      "If a job is cancelled before work begins, the escrowed money is refunded to the buyer. If a job is disputed after work is delivered, the money stays in escrow until we make a decision. We will always explain our reasoning.",
      "Workers can withdraw their earnings to M-Pesa at any time. Withdrawals usually take a few minutes. There is no withdrawal fee.",
    ],
  },
  {
    icon: Shield,
    title: "5. Reviews, ratings, and reputation",
    body: [
      "After a job is completed, both the buyer and the seller can leave a review. Reviews should be honest and based on the actual work that was done.",
      "We do not remove negative reviews just because someone does not like them. We only remove reviews that violate our community guidelines, such as reviews containing hate speech, personal information, or false claims about a user.",
      "Trying to manipulate ratings through fake reviews, multiple accounts, or any other means will result in immediate account suspension.",
    ],
  },
  {
    icon: Ban,
    title: "6. Things you must not do",
    body: [
      "Do not use SKIERS for anything illegal. This includes fraud, money laundering, scams, or any activity that violates Kenyan law.",
      "Do not harass, threaten, or abuse other users. Do not post hateful, discriminatory, or sexually explicit content.",
      "Do not attempt to move a transaction off the Platform to avoid paying commission. This is against our rules and removes your protection under escrow.",
      "Do not impersonate anyone, create fake accounts, or misrepresent your skills, qualifications, or identity.",
      "Do not scrape, copy, or use automated tools to extract data from the Platform without our written permission.",
      "Breaking any of these rules can result in immediate account suspension or permanent ban, at our discretion.",
    ],
  },
  {
    icon: AlertCircle,
    title: "7. Disputes between users",
    body: [
      "If you have a problem with another user, try to resolve it directly through the Platform messaging system first. Most issues are misunderstandings that clear up in a conversation.",
      "If you cannot agree, either party can open a dispute. Our team reviews the messages, files, and evidence from both sides, and makes a decision.",
      "Our decisions are based on the evidence available. We will always explain our reasoning to both sides. Escrowed money stays protected until the dispute is closed.",
      "Our decision on a dispute is final as far as the Platform is concerned. If you disagree with our decision, you are free to pursue other legal remedies outside the Platform.",
    ],
  },
  {
    icon: Scale,
    title: "8. Limitation of our liability",
    body: [
      "SKIERS is a marketplace, not a party to any job. We are not liable for the quality of work performed, delays, damages, or losses arising from any transaction between users.",
      "We do our best to verify users, hold payments safely, and resolve disputes fairly. But we cannot guarantee that every job will go perfectly or that every user will behave well.",
      "To the maximum extent permitted by Kenyan law, our total liability to you in any matter relating to the Platform is limited to the amount of any commission we earned on the specific transaction in question.",
    ],
  },
  {
    icon: RefreshCw,
    title: "9. Changes to these terms",
    body: [
      "We may update these terms from time to time. When we do, we will update the date at the bottom of this page and post a notice on the Platform.",
      "If the changes are significant, we will send an email to every account holder explaining what changed.",
      "By continuing to use SKIERS after the terms are updated, you agree to the new terms. If you do not agree with the updates, you may close your account at any time.",
    ],
  },
  {
    icon: Ban,
    title: "10. Closing your account",
    body: [
      "You can close your account at any time from your account settings. When you close your account, we delete your personal data, portfolio, and messages.",
      "If you have pending jobs, active disputes, or unsettled balances, you must resolve them before the account can be closed.",
      "We may also suspend or close your account if you break these terms, if we are required by law, or if your account has been inactive for a very long period.",
    ],
  },
  {
    icon: Scale,
    title: "11. Governing law",
    body: [
      "These terms are governed by the laws of Kenya. Any dispute arising from these terms or your use of the Platform is subject to the exclusive jurisdiction of the courts of Kenya.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-background-primary">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-dark py-20 lg:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-info/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container-site">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <FileText className="h-3.5 w-3.5 text-accent" />
              <span className="text-white text-xs font-medium">
                Legal document
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 animate-slide-up">
              Terms of Service
            </h1>

            <p
              className="text-lg text-gray-300 leading-relaxed animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              The rules that govern your use of SKIERS ENTREPRENEURS KENYA.
              Please read them carefully before using the Platform.
            </p>

            <p className="text-sm text-gray-400 mt-6">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* ============ INTRO ============ */}
      <section className="py-12 bg-background-secondary border-b border-border">
        <div className="container-site max-w-3xl">
          <p className="text-text-secondary leading-relaxed">
            These terms of service are written in plain English because we
            believe rules should be clear, not confusing. If anything here is
            unclear, please write to us at{" "}
            <a
              href="mailto:skierscreatives@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              skierscreatives@gmail.com
            </a>{" "}
            and we will explain.
          </p>
        </div>
      </section>

      {/* ============ SECTIONS ============ */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-4xl">
          <div className="space-y-8">
            {sections.map((section) => (
              <div
                key={section.title}
                className="bg-white border border-border rounded-2xl p-6 lg:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg lg:text-xl font-display font-semibold text-text-primary mb-4">
                      {section.title}
                    </h2>
                    <div className="space-y-3">
                      {section.body.map((para, i) => (
                        <p
                          key={i}
                          className="text-sm lg:text-base text-text-secondary leading-relaxed"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT CTA ============ */}
      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site">
          <div className="max-w-3xl mx-auto bg-dark text-white rounded-2xl p-10 lg:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative text-center">
              <Scale className="h-10 w-10 text-accent mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-display font-bold mb-3">
                Questions about these terms?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
                If you have any questions about these terms of service, or if
                you need clarification on any part of them, reach out. We are
                happy to explain.
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
                  href="mailto:skierscreatives@gmail.com?subject=Terms%20Question"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold rounded-md bg-transparent text-white border-2 border-white hover:bg-white hover:text-dark transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email us
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400">
                See also our{" "}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/cookies" className="text-accent hover:underline">
                  Cookie Policy
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
