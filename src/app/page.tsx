import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import {
  Search,
  MapPin,
  Shield,
  Star,
  Users,
  ArrowRight,
  Pause,
  Code,
  Palette,
  Megaphone,
  Wrench,
  GraduationCap,
  Calendar,
  Hotel,
  Truck,
  Scale,
  Heart,
  Leaf,
  PenTool,
  Lock,
  BadgeCheck,
  Smartphone,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Find Talent, Work and Businesses",
  description:
    "Kenya's marketplace connecting employers, freelancers, and local businesses.",
};

const categories = [
  { name: "Technology and IT", slug: "technology", Icon: Code },
  { name: "Creative and Design", slug: "creative", Icon: Palette },
  { name: "Marketing and Sales", slug: "marketing", Icon: Megaphone },
  { name: "Writing and Translation", slug: "writing", Icon: PenTool },
  { name: "Home and Cleaning", slug: "home-services", Icon: Wrench },
  { name: "Education and Tutoring", slug: "education", Icon: GraduationCap },
  { name: "Events and Catering", slug: "events", Icon: Calendar },
  { name: "Hotels and Hospitality", slug: "hotels", Icon: Hotel },
  { name: "Transport and Delivery", slug: "transport", Icon: Truck },
  { name: "Legal and Finance", slug: "legal", Icon: Scale },
  { name: "Health and Wellness", slug: "health", Icon: Heart },
  { name: "Agriculture", slug: "agriculture", Icon: Leaf },
];

const howItWorksHiring = [
  {
    image: "/hero.png",
    isDark: true,
    title: "Posting jobs is always free",
    desc: "Describe what you need. It takes less than two minutes.",
  },
  {
    image: "/hero.png",
    isDark: false,
    title: "Get proposals and hire",
    desc: "Compare profiles, ratings, and prices. Chat with the best matches.",
  },
  {
    image: "/hero.png",
    isDark: false,
    title: "Pay when work is done",
    desc: "Money is held safely and released only when you approve.",
  },
];

const howItPays = [
  {
    icon: Lock,
    title: "Money held in escrow",
    desc: "Your M-Pesa payment is held securely and only released to the worker once you approve the completed work.",
  },
  {
    icon: BadgeCheck,
    title: "One commission, no subscriptions",
    desc: "Posting jobs and browsing services is free. SKIERS takes a small commission only when a job is actually completed.",
  },
  {
    icon: Smartphone,
    title: "Pay and get paid on M-Pesa",
    desc: "Buyers pay by STK push. Workers are paid out to their M-Pesa number once the job is marked complete.",
  },
];

interface HomePageProps {
  searchParams: Promise<{ deleted?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { deleted } = await searchParams;
  const showDeletedBanner = deleted === "1";

  return (
    <div className="bg-background-primary">
      {showDeletedBanner && (
        <div className="bg-success/10 border-b border-success/20">
          <div className="container-site py-3">
            <div className="flex items-center gap-3 max-w-3xl mx-auto">
              <CheckCircle className="h-5 w-5 text-success shrink-0" />
              <p className="text-sm text-success">
                Your account has been deleted. Thank you for using SKIERS.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden bg-dark">
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            alt=""
            fill
            priority
            loading="eager"
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-dark/90 via-dark/80 to-primary/70" />
        </div>

        <div className="relative container-site py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-md px-4 py-2 mb-6">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span className="text-white text-xs font-medium">
                Built for Kenya, all 47 counties
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              Find the right people.
              <br />
              <span className="text-accent">Get any work done.</span>
            </h1>

            <p className="text-lg text-gray-200 max-w-2xl mb-10 leading-relaxed">
              Hire freelancers, skilled workers, and local businesses across
              Kenya, from coding to cleaning, hotels to plumbing. Pay safely
              with M-Pesa.
            </p>

            <form
              action="/services"
              method="get"
              className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl mb-6"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                <input
                  type="text"
                  name="q"
                  placeholder="What do you need help with?"
                  className="w-full h-12 pl-12 pr-4 text-text-primary bg-transparent focus:outline-none text-sm"
                />
              </div>
              <Button type="submit" size="md" className="w-full sm:w-auto">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-300 py-1.5">Popular:</span>
              {[
                "Web design",
                "Cleaning",
                "Photography",
                "Hotels",
                "Plumbing",
              ].map((tag) => (
                <Link
                  key={tag}
                  href={`/services?q=${encodeURIComponent(tag)}`}
                  className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-md px-3 py-1.5 text-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="container-site py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  M-Pesa secure
                </p>
                <p className="text-xs text-text-tertiary">
                  Safe escrow payments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Star className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Reviews on every job
                </p>
                <p className="text-xs text-text-tertiary">
                  Rated by real buyers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Trusted talent
                </p>
                <p className="text-xs text-text-tertiary">Verified profiles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Nationwide
                </p>
                <p className="text-xs text-text-tertiary">
                  Online and physical work
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-12">
            Find freelancers for every type of work
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group bg-white border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  <cat.Icon
                    className="h-6 w-6 text-primary"
                    strokeWidth={1.75}
                  />
                </div>
                <p className="font-medium text-text-primary group-hover:text-primary transition-colors leading-snug">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white border-t border-border">
        <div className="container-site">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary">
              How hiring works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorksHiring.map((item) => (
              <div key={item.title}>
                <div className="relative h-64 rounded-2xl overflow-hidden bg-dark mb-5 group">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                      item.isDark ? "opacity-40" : "opacity-90"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 ${
                      item.isDark
                        ? "bg-linear-to-br from-dark via-dark/80 to-primary/40"
                        : "bg-linear-to-t from-dark/70 via-dark/20 to-transparent"
                    }`}
                  />
                  {item.isDark && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-3xl font-display font-bold tracking-tight">
                          Hire
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center">
                        <Pause className="h-4 w-4 text-dark" />
                      </div>
                    </>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              See how finding work is different
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-3">
              How payment works
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              No subscriptions. A single, transparent commission when a job is
              completed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {howItPays.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-8 border border-border"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              See the full fee breakdown
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark text-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6 leading-tight">
                Built for Kenya.
                <br />
                Made for the world.
              </h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                Whether you need a website built in Nairobi, a cleaner in
                Mombasa, or a photographer for your wedding in Kisumu, SKIERS
                connects you with trusted professionals everywhere in Kenya.
              </p>

              <ul className="space-y-4">
                {[
                  "Pay with M-Pesa, fast and secure",
                  "Identity-verified profiles",
                  "Local and remote work in one place",
                  "Escrow protection on every order",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-200">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <p className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wide">
                Every order on SKIERS
              </p>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-200">
                    Payment is held until you approve the delivered work
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-200">
                    Every worker profile can be ID-verified before you hire
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-200">
                    Both sides leave a review once the order is closed
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="relative container-site text-center">
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-4 max-w-3xl mx-auto">
            Ready to hire or get hired?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Post a job for free, or list what you do and start getting orders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/post-job"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-white text-primary hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
            >
              Hire someone
            </Link>
            <Link
              href="/create-service"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary transition-colors duration-200 w-full sm:w-auto"
            >
              Offer your skills
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
