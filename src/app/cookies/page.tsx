import Link from "next/link";
import type { Metadata } from "next";
import {
  Cookie,
  Shield,
  Settings,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | SKIERS ENTREPRENEURS KENYA",
  description:
    "How SKIERS ENTREPRENEURS KENYA uses cookies and similar technologies. Learn what cookies we use and how to control them.",
};

const cookieTypes = [
  {
    name: "Essential cookies",
    icon: Shield,
    required: true,
    desc: "These cookies are required for the Platform to work. Without them, you cannot sign in, stay signed in, or complete a transaction. We cannot turn these off.",
    examples: [
      "Session cookie that keeps you signed in",
      "Security token that protects against attacks",
      "Cookie that remembers your language preference",
    ],
  },
  {
    name: "Analytics cookies",
    icon: Settings,
    required: false,
    desc: "These cookies help us understand how people use the Platform. They tell us which pages are popular, where users get stuck, and how we can improve. The data is anonymous.",
    examples: [
      "Which pages you visit and for how long",
      "Which device and browser you use",
      "Where you came from before landing on our site",
    ],
  },
  {
    name: "Preference cookies",
    icon: Settings,
    required: false,
    desc: "These cookies remember your choices so you do not have to set them again. For example, whether you prefer the light or dark theme, or your default search filters.",
    examples: [
      "Theme preference",
      "Default sort order for search results",
      "Language selection",
    ],
  },
  {
    name: "Marketing cookies",
    icon: Settings,
    required: false,
    desc: "These cookies help us show you relevant content and measure how well our campaigns work. We never sell this data to third parties.",
    examples: [
      "Which pages you have seen so we do not show the same thing twice",
      "Which ads led you to SKIERS",
    ],
  },
];

export default function CookiesPage() {
  return (
    <div className="bg-background-primary">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-dark py-20 lg:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-info/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container-site">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Cookie className="h-3.5 w-3.5 text-accent" />
              <span className="text-white text-xs font-medium">
                Small files, big deal
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 animate-slide-up">
              Cookie Policy
            </h1>

            <p
              className="text-lg text-gray-300 leading-relaxed animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Cookies are small files we use to make SKIERS work smoothly. This
              page explains exactly what we use, why, and how you can control
              them.
            </p>

            <p className="text-sm text-gray-400 mt-6">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* ============ WHAT ARE COOKIES ============ */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-5">
            What are cookies?
          </h2>

          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Cookies are tiny text files that a website saves on your device
              when you visit. They let the website remember things about you
              between visits, or just between pages on the same visit.
            </p>

            <p>
              Without cookies, every page you visit would forget who you are.
              You would have to sign in again and again. Cookies fix that.
            </p>

            <p>
              We also use similar technologies like local storage and session
              storage. Throughout this page, when we say cookies we mean all of
              these together.
            </p>
          </div>
        </div>
      </section>

      {/* ============ TYPES OF COOKIES ============ */}
      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-3">
              The cookies we use
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We group cookies into four types. Only the first one is required.
              You can turn off the rest at any time.
            </p>
          </div>

          <div className="space-y-5">
            {cookieTypes.map((type) => (
              <div
                key={type.name}
                className="bg-white border border-border rounded-2xl p-6 lg:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center">
                    <type.icon className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg lg:text-xl font-display font-semibold text-text-primary">
                        {type.name}
                      </h3>
                      {type.required ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-error bg-error/10 px-2.5 py-1 rounded-full">
                          <XCircle className="h-3 w-3" />
                          Always on
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          Optional
                        </span>
                      )}
                    </div>

                    <p className="text-sm lg:text-base text-text-secondary leading-relaxed mb-4">
                      {type.desc}
                    </p>

                    <div className="bg-background-secondary rounded-lg p-4">
                      <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                        Examples
                      </p>
                      <ul className="space-y-2">
                        {type.examples.map((ex) => (
                          <li
                            key={ex}
                            className="flex items-start gap-2 text-sm text-text-secondary"
                          >
                            <span className="shrink-0 w-1 h-1 rounded-full bg-text-tertiary mt-2" />
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ THIRD PARTY ============ */}
      <section className="section-padding bg-white border-t border-border">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-5">
            Third party cookies
          </h2>

          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              We work with a small number of trusted third parties who may set
              their own cookies when you use SKIERS.
            </p>

            <div className="bg-background-secondary rounded-2xl p-6 my-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-text-primary mb-1">
                  Supabase
                </p>
                <p className="text-sm text-text-secondary">
                  Handles authentication and the database. Uses cookies to keep
                  you signed in securely.
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-text-primary mb-1">
                  Vercel
                </p>
                <p className="text-sm text-text-secondary">
                  Hosts the SKIERS website. Uses cookies for security and
                  performance monitoring.
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-text-primary mb-1">
                  Safaricom M-Pesa
                </p>
                <p className="text-sm text-text-secondary">
                  Processes payments. Uses cookies only during the payment flow,
                  never on other pages.
                </p>
              </div>
            </div>

            <p>
              We do not allow third parties to use cookies on SKIERS for
              advertising or cross-site tracking. We also do not sell any cookie
              data.
            </p>
          </div>
        </div>
      </section>

      {/* ============ MANAGING COOKIES ============ */}
      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-5">
            How to control cookies
          </h2>

          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              You have full control over cookies. Here is how to manage them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                Browser settings
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every browser lets you block or delete cookies. Look in Settings
                then Privacy for these options. Be careful, blocking essential
                cookies will break your ability to sign in.
              </p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                On your device
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Some devices let you control cookies and tracking at the system
                level. This applies to mobile phones and tablets. Check your
                device settings under Privacy.
              </p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                Private browsing
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Using private or incognito mode reduces the cookies stored on
                your device. They are deleted when you close the window.
              </p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                Contact us
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Want us to turn off optional cookies for you? Email us and we
                will handle it within 7 days. Contact details below.
              </p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 mt-6">
            <h3 className="font-semibold text-text-primary mb-2">
              What happens if you block cookies
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              Blocking essential cookies means:
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-error shrink-0 mt-0.5" />
                You cannot stay signed in to your account
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-error shrink-0 mt-0.5" />
                You cannot complete a payment or hire anyone
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-error shrink-0 mt-0.5" />
                Your preferences will not be saved between visits
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============ CONTACT CTA ============ */}
      <section className="section-padding bg-white border-t border-border">
        <div className="container-site">
          <div className="max-w-3xl mx-auto bg-dark text-white rounded-2xl p-10 lg:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative text-center">
              <Cookie className="h-10 w-10 text-accent mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-display font-bold mb-3">
                Questions about cookies?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
                If you have any questions about how we use cookies, or if you
                want us to change your preferences, reach out any time.
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
                  href="mailto:skierscreatives@gmail.com?subject=Cookie%20Question"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold rounded-md bg-transparent text-white border-2 border-white hover:bg-white hover:text-dark transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email us
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400">
                See also our{" "}
                <Link href="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
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
