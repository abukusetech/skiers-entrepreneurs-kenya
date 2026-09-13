import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Headphones,
  Building2,
  Send,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | SKIERS ENTREPRENEURS KENYA",
  description:
    "Get in touch with SKIERS ENTREPRENEURS KENYA. WhatsApp, email, or send us a message. We respond within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="bg-background-primary">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-dark py-20 lg:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-info/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container-site text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Headphones className="h-3.5 w-3.5 text-accent" />
            <span className="text-white text-xs font-medium">
              We&apos;re here to help
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 animate-slide-up">
            Get in touch
          </h1>

          <p
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Questions, feedback, or something not working? We read every message
            and reply within 24 hours, usually faster.
          </p>
        </div>
      </section>

      {/* ============ CONTACT CARDS ============ */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/254768860572"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-border rounded-2xl p-6 card-lift"
            >
              <div className="w-12 h-12 rounded-xl bg-kenya-green/10 flex items-center justify-center mb-5 group-hover:bg-kenya-green transition-colors">
                <MessageCircle className="h-6 w-6 text-kenya-green group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                WhatsApp
              </h3>
              <p className="text-sm text-text-secondary mb-3">
                The fastest way to reach us
              </p>
              <p className="text-sm font-medium text-kenya-green">
                +254 768 860 572
              </p>
            </a>

            {/* Email */}
            <a
              href="mailto:skierscreatives@gmail.com"
              className="group bg-white border border-border rounded-2xl p-6 card-lift"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                <Mail className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                Email
              </h3>
              <p className="text-sm text-text-secondary mb-3">
                For detailed questions
              </p>
              <p className="text-sm font-medium text-primary break-all">
                skierscreatives@gmail.com
              </p>
            </a>

            {/* Location */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                Location
              </h3>
              <p className="text-sm text-text-secondary mb-3">
                Where our team works from
              </p>
              <p className="text-sm font-medium text-text-primary">
                Nairobi, Kenya
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FORM + INFO ============ */}
      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left: Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-border p-8 lg:p-10">
                <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  Send us a message
                </h2>
                <p className="text-text-secondary mb-8">
                  Fill in the form below and we&apos;ll get back to you as soon
                  as we can.
                </p>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-text-primary mb-2"
                      >
                        Your name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Kamau"
                        className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-text-primary mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      What is this about?
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors bg-white"
                    >
                      <option>General question</option>
                      <option>I need help hiring</option>
                      <option>I need help finding work</option>
                      <option>Payment or M-Pesa issue</option>
                      <option>Report a problem with a user</option>
                      <option>Business partnership</option>
                      <option>Something else</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      placeholder="Tell us what's on your mind..."
                      className="w-full px-4 py-3 border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Send message
                    <Send className="h-4 w-4 ml-2" />
                  </Button>

                  <p className="text-xs text-text-tertiary">
                    By sending a message you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              </div>
            </div>

            {/* Right: Info panels */}
            <div className="lg:col-span-5 space-y-6">
              {/* Hours */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-primary">
                    Working hours
                  </h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-text-secondary">
                      Monday to Friday
                    </span>
                    <span className="text-text-primary font-medium">
                      8:00 AM - 8:00 PM
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-text-secondary">Saturday</span>
                    <span className="text-text-primary font-medium">
                      9:00 AM - 6:00 PM
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-text-secondary">Sunday</span>
                    <span className="text-text-primary font-medium">
                      10:00 AM - 4:00 PM
                    </span>
                  </li>
                </ul>
                <p className="text-xs text-text-tertiary mt-4">
                  Emergency payment issues? WhatsApp us anytime. We monitor it
                  24/7.
                </p>
              </div>

              {/* For businesses */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-text-primary">
                    For businesses
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Hiring at scale? Need a custom plan for your company? Our
                  business team can help.
                </p>
                <p className="text-sm font-medium text-text-primary mb-1">
                  Email
                </p>
                <a
                  href="mailto:skierscreatives@gmail.com?subject=Business%20Inquiry"
                  className="text-sm text-primary hover:underline break-all"
                >
                  skierscreatives@gmail.com
                </a>
              </div>

              {/* Join the team */}
              <div className="bg-dark text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-semibold">Work with us</h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    We&apos;re a small team in Nairobi building something big.
                    If you want to help shape the future of work in Kenya, reach
                    out.
                  </p>
                  <a
                    href="mailto:skierscreatives@gmail.com?subject=Careers"
                    className="text-sm text-accent hover:underline"
                  >
                    Send us your CV →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ SHORTCUT ============ */}
      <section className="py-16 bg-white border-t border-border">
        <div className="container-site text-center">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-3">
            Looking for a quick answer?
          </h2>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto">
            Most common questions are already answered in our FAQ, you might
            find what you need there in seconds.
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            Visit the FAQ
          </Link>
        </div>
      </section>
    </div>
  );
}
