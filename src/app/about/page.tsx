import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  Shield,
  Heart,
  Zap,
  Users,
  Sparkles,
  TrendingUp,
  Handshake,
  Target,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | SKIERS ENTREPRENEURS KENYA",
  description:
    "SKIERS ENTREPRENEURS KENYA is a Kenyan-built marketplace connecting employers, freelancers, and local businesses across all 47 counties. Paid securely with M-Pesa.",
};

const stats = [
  { value: "47", label: "Counties served" },
  { value: "M-Pesa", label: "Built-in payments" },
  { value: "0%", label: "Fee to post a job" },
  { value: "24/7", label: "Platform availability" },
];

const values = [
  {
    icon: Shield,
    title: "Trust first",
    desc: "Every profile is verified. Every payment is protected. Every review is real. We don't cut corners on trust. It's the foundation of everything we do.",
  },
  {
    icon: Zap,
    title: "Move fast",
    desc: "Post a job in two minutes. Get proposals the same day. Start work tomorrow. Kenyan businesses don't have time to waste, and neither do we.",
  },
  {
    icon: Handshake,
    title: "Fair to both sides",
    desc: "Buyers get quality work. Talent gets paid on time. We take a small, transparent fee, and we earn it by making the whole thing work better.",
  },
  {
    icon: Heart,
    title: "Local first",
    desc: "We're built in Kenya, for Kenya. We know how M-Pesa works. We know how Kenyan businesses actually run. We're not copying a Silicon Valley playbook.",
  },
  {
    icon: Users,
    title: "Real opportunity",
    desc: "Thousands of talented Kenyans are stuck without access to steady work. SKIERS opens a door for a graphic designer in Kisumu, a welder in Nakuru, a translator in Nairobi.",
  },
  {
    icon: Globe,
    title: "Global standards",
    desc: "We hold ourselves to the same standards as the biggest platforms in the world, but we never forget who we're building for.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background-primary">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-dark">
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-dark/90 via-dark/85 to-primary/60" />
        </div>

        <div className="relative container-site py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-white text-xs font-medium">
                About SKIERS ENTREPRENEURS KENYA
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6 animate-slide-up">
              We built this for Kenya.
            </h1>

            <p
              className="text-lg text-gray-200 max-w-2xl leading-relaxed animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              A marketplace where anyone can find the right person for any job
              and anyone with a skill can find real work. No middlemen. No
              guesswork. Just honest work, done properly, paid securely.
            </p>
          </div>
        </div>
      </section>

      {/* ============ THE STORY ============ */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                Our story
              </p>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary leading-tight">
                Finding someone reliable shouldn&apos;t be this hard.
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-6 text-text-secondary leading-relaxed">
              <p className="text-lg">
                SKIERS started with a problem almost every Kenyan has faced at
                some point.
              </p>

              <p>
                You need a plumber in Nairobi. Or a photographer in Mombasa. Or
                a web developer to finally fix your business website. So where
                do you go? Facebook groups full of unverified strangers. A
                WhatsApp contact from a cousin&apos;s friend. Word of mouth that
                never quite works out.
              </p>

              <p>
                You either pay someone who does a bad job and disappears, or you
                give up and do it yourself. Either way, you lose time, money, or
                both.
              </p>

              <p>
                And on the other side of the same coin: thousands of talented
                Kenyans with real skills: welders, designers, translators,
                engineers, cleaners, tutors who can&apos;t find steady work
                because no one knows they exist. Not because they aren&apos;t
                good. Because there&apos;s no proper place to find them.
              </p>

              <p className="text-lg font-medium text-text-primary">
                SKIERS exists to fix both sides of that problem.
              </p>

              <p>
                We built a marketplace where employers can post any job, from a
                website to a wedding, from plumbing to graphic design, and where
                any skilled Kenyan can offer their services to the whole
                country. Every transaction is protected. Every payment runs
                through M-Pesa. Every review is real.
              </p>

              <p>
                We&apos;re not trying to be Silicon Valley. We&apos;re a Kenyan
                company solving a Kenyan problem, and we&apos;re proud of that.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="py-14 bg-background-secondary border-y border-border">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl lg:text-5xl font-display font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MISSION & VISION ============ */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-linear-to-br from-primary to-primary-hover rounded-2xl p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">
                  Our mission
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  To connect every Kenyan who needs work done with every Kenyan
                  who can do it safely, fairly, and fast. And to make sure the
                  person doing the work actually gets paid for it.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-dark rounded-2xl p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
                  <TrendingUp className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">
                  Our vision
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Kenya&apos;s most trusted marketplace. Where finding talent,
                  hiring workers, and paying for services is as easy as sending
                  an M-Pesa. Where every talented Kenyan has a real shot at
                  steady work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ VALUES ============ */}
      <section className="section-padding bg-background-secondary">
        <div className="container-site">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
              What we stand for
            </p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
              Six things we won&apos;t compromise on
            </h2>
            <p className="text-text-secondary">
              These aren&apos;t corporate values on a wall. They&apos;re the
              rules we run the business by.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-6 border border-border card-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT WE'RE NOT ============ */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3 text-center">
              A note on honesty
            </p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary text-center mb-8">
              What we are, and what we&apos;re not
            </h2>

            <div className="space-y-5 text-text-secondary leading-relaxed">
              <p>
                We&apos;re not a charity. We&apos;re a business, and we charge a
                small fee to keep the lights on and the platform improving.
              </p>

              <p>
                We&apos;re not a job board where nothing happens after you
                apply. Real work gets done here, real money changes hands, and
                real reviews get written.
              </p>

              <p>
                We&apos;re not perfect. Like any young company, we&apos;re
                learning as we go and we take feedback seriously. If something
                isn&apos;t working, tell us. We listen.
              </p>

              <p className="text-lg font-medium text-text-primary">
                What we can promise: we&apos;ll always be honest with you,
                we&apos;ll always protect your money, and we&apos;ll always put
                Kenya first.
              </p>
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
            Ready to join us?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Whether you&apos;re looking to hire or looking for work, you belong
            here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-white text-primary hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto"
            >
              Create free account
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary transition-colors duration-300 w-full sm:w-auto"
            >
              Talk to us
            </Link>
          </div>

          <p className="text-sm text-blue-200 mt-8">
            Questions? Email us at{" "}
            <a
              href="mailto:skierscreatives@gmail.com"
              className="text-white underline underline-offset-4 hover:no-underline"
            >
              skierscreatives@gmail.com
            </a>{" "}
            or WhatsApp{" "}
            <a
              href="https://wa.me/254768860572"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 hover:no-underline"
            >
              +254 768 860 572
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
