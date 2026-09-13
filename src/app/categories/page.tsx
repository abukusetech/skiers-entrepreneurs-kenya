import Link from "next/link";
import type { Metadata } from "next";
import { getCategoryCounts } from "@/lib/db/queries/categories";
import {
  ArrowRight,
  Code,
  Palette,
  Megaphone,
  PenTool,
  Wrench,
  GraduationCap,
  Calendar,
  Hotel,
  Truck,
  Scale,
  Heart,
  Leaf,
  Briefcase,
  Sparkles,
  Search,
  ChefHat,
  Camera,
  Hammer,
  Car,
  Stethoscope,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Browse Categories | SKIERS ENTREPRENEURS KENYA",
  description:
    "Explore every category on SKIERS ENTREPRENEURS KENYA. From tech and design to cleaning, catering, hotels, transport, legal, health, and more.",
};

// Category presentation metadata. Counts are joined at render time from
// the database, never hardcoded here.
const categoryMeta = [
  {
    name: "Technology and IT",
    slug: "technology",
    icon: Code,
    desc: "Web developers, mobile app builders, IT support, cybersecurity, and data specialists.",
  },
  {
    name: "Creative and Design",
    slug: "creative",
    icon: Palette,
    desc: "Graphic designers, brand identity, illustrators, video editors, and animators.",
  },
  {
    name: "Marketing and Sales",
    slug: "marketing",
    icon: Megaphone,
    desc: "Digital marketing, SEO, paid ads, social media managers, and sales consultants.",
  },
  {
    name: "Writing and Translation",
    slug: "writing",
    icon: PenTool,
    desc: "Copywriters, content writers, editors, translators, and proofreaders.",
  },
  {
    name: "Home and Cleaning",
    slug: "home-services",
    icon: Wrench,
    desc: "House cleaners, plumbers, electricians, painters, gardeners, and handymen.",
  },
  {
    name: "Education and Tutoring",
    slug: "education",
    icon: GraduationCap,
    desc: "Private tutors, exam coaches, language teachers, and training professionals.",
  },
  {
    name: "Events and Catering",
    slug: "events",
    icon: Calendar,
    desc: "Event planners, caterers, decorators, DJs, MCs, and entertainers.",
  },
  {
    name: "Hotels and Hospitality",
    slug: "hotels",
    icon: Hotel,
    desc: "Hotels, lodges, guesthouses, Airbnb hosts, tour guides, and travel services.",
  },
  {
    name: "Transport and Delivery",
    slug: "transport",
    icon: Truck,
    desc: "Drivers, couriers, movers, trucking companies, boda boda, and logistics.",
  },
  {
    name: "Legal and Finance",
    slug: "legal",
    icon: Scale,
    desc: "Lawyers, accountants, tax advisors, bookkeepers, and financial consultants.",
  },
  {
    name: "Health and Wellness",
    slug: "health",
    icon: Heart,
    desc: "Nurses, caregivers, therapists, nutritionists, personal trainers, and wellness coaches.",
  },
  {
    name: "Agriculture",
    slug: "agriculture",
    icon: Leaf,
    desc: "Farm workers, agronomists, livestock experts, agri-tech, and equipment operators.",
  },
  {
    name: "Business and Admin",
    slug: "business",
    icon: Briefcase,
    desc: "Virtual assistants, project managers, HR consultants, and business strategists.",
  },
  {
    name: "Food and Cooking",
    slug: "food",
    icon: ChefHat,
    desc: "Private chefs, bakers, food trucks, catering services, and meal prep.",
  },
  {
    name: "Photography and Video",
    slug: "photography",
    icon: Camera,
    desc: "Wedding photographers, event videographers, product photographers, and drone operators.",
  },
  {
    name: "Construction and Repair",
    slug: "construction",
    icon: Hammer,
    desc: "Masons, welders, carpenters, roofers, tilers, and general contractors.",
  },
  {
    name: "Automotive Services",
    slug: "automotive",
    icon: Car,
    desc: "Mechanics, panel beaters, car wash, car hire, and vehicle inspection.",
  },
  {
    name: "Medical and Care",
    slug: "medical",
    icon: Stethoscope,
    desc: "Home care nurses, elderly care, childcare, medical consultations, and lab services.",
  },
  {
    name: "Real Estate and Property",
    slug: "real-estate",
    icon: Building,
    desc: "Property agents, landlords, valuers, property managers, and moving services.",
  },
];

// Human-readable count line. Never invents numbers.
function formatCounts(serviceCount: number, jobCount: number): string {
  const parts: string[] = [];

  if (serviceCount > 0) {
    parts.push(
      `${serviceCount} ${serviceCount === 1 ? "service" : "services"}`,
    );
  }
  if (jobCount > 0) {
    parts.push(`${jobCount} open ${jobCount === 1 ? "job" : "jobs"}`);
  }

  if (parts.length === 0) return "New";
  return parts.join(" · ");
}

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();

  const totalCategories = categoryMeta.length;

  return (
    <div className="bg-background-primary">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-dark py-20 lg:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-info/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container-site">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-white text-xs font-medium">
                {totalCategories} categories
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 animate-slide-up">
              Browse all categories
            </h1>

            <p
              className="text-lg text-gray-300 leading-relaxed animate-slide-up max-w-2xl"
              style={{ animationDelay: "0.1s" }}
            >
              Whatever you need done, there is someone on SKIERS who can do it.
              Pick a category to see the people available and the jobs posted
              right now.
            </p>
          </div>

          {/* Search shortcut */}
          <div
            className="max-w-2xl mt-10 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <form
              action="/services"
              method="get"
              className="bg-white rounded-xl p-2 flex items-center"
            >
              <Search className="h-5 w-5 text-text-tertiary ml-4" />
              <input
                type="text"
                name="q"
                placeholder="Search for a specific skill or service"
                className="flex-1 h-12 px-4 focus:outline-none text-text-primary bg-transparent text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center h-12 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES GRID ============ */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryMeta.map((cat) => {
              const count = counts[cat.slug] ?? {
                serviceCount: 0,
                jobCount: 0,
              };
              const countLine = formatCounts(
                count.serviceCount,
                count.jobCount,
              );

              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group bg-white border border-border rounded-2xl p-6 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <cat.icon
                        className="h-6 w-6 text-primary group-hover:text-white transition-colors"
                        strokeWidth={1.75}
                      />
                    </div>
                    <ArrowRight className="h-5 w-5 text-text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-lg font-display font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {cat.desc}
                  </p>

                  <p className="text-xs font-medium text-accent">{countLine}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CANNOT FIND ============ */}
      <section className="section-padding bg-background-secondary border-t border-border">
        <div className="container-site">
          <div className="max-w-3xl mx-auto bg-white border border-border rounded-2xl p-8 lg:p-12 text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-3">
              Cannot find what you need?
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto">
              If your skill or service is not listed, you can still post a job
              and describe exactly what you need. Someone with the right skills
              will apply.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/post-job"
                className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                Post a custom job
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-transparent border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Suggest a category
              </Link>
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
            Ready to find the right person?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Post your job for free. It takes two minutes. Real people will apply
            within hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/post-job"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-white text-primary hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto"
            >
              Post a job
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-md bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary transition-colors duration-300 w-full sm:w-auto"
            >
              Offer your skills
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
