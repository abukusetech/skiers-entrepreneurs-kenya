import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark text-white mt-24">
      <div className="container-site py-16 lg:py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-10 border-b border-white/10">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-full.png"
              alt="SKIERS ENTREPRENEURS KENYA"
              width={220}
              height={60}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/254768860572"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-kenya-green hover:bg-green-700 px-4 py-2.5 rounded-md transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp: +254 768 860 572
            </a>
            <a
              href="mailto:skierscreatives@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-white border border-white/20 hover:border-white/60 px-4 py-2.5 rounded-md transition-colors"
            >
              <Mail className="h-4 w-4" />
              skierscreatives@gmail.com
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 py-12">
          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300">
              For Employers
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/services"
                  className="text-white hover:text-accent transition-colors"
                >
                  Find Talent
                </Link>
              </li>
              <li>
                <Link
                  href="/post-job"
                  className="text-white hover:text-accent transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/businesses"
                  className="text-white hover:text-accent transition-colors"
                >
                  Nearby Businesses
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-white hover:text-accent transition-colors"
                >
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-white hover:text-accent transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-white hover:text-accent transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white hover:text-accent transition-colors"
                >
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300">
              For Talent
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/jobs"
                  className="text-white hover:text-accent transition-colors"
                >
                  Find Work
                </Link>
              </li>
              <li>
                <Link
                  href="/create-service"
                  className="text-white hover:text-accent transition-colors"
                >
                  Offer Your Services
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-white hover:text-accent transition-colors"
                >
                  Freelancer Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-white hover:text-accent transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-white hover:text-accent transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/withdrawals"
                  className="text-white hover:text-accent transition-colors"
                >
                  Withdrawals
                </Link>
              </li>
              <li>
                <Link
                  href="/m-pesa"
                  className="text-white hover:text-accent transition-colors"
                >
                  M-Pesa Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300">
              Marketplace
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/services"
                  className="text-white hover:text-accent transition-colors"
                >
                  All Services
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-white hover:text-accent transition-colors"
                >
                  All Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-white hover:text-accent transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/businesses"
                  className="text-white hover:text-accent transition-colors"
                >
                  Businesses
                </Link>
              </li>
              <li>
                <Link
                  href="/trust"
                  className="text-white hover:text-accent transition-colors"
                >
                  Trust &amp; Safety
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-300">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-white hover:text-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-white hover:text-accent transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white hover:text-accent transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-white hover:text-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-white hover:text-accent transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-6 text-xs">
            <Link
              href="/about"
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/faq"
              className="text-gray-400 hover:text-white transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-400 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cookies
            </Link>
            <Link
              href="/trust"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Trust &amp; Safety
            </Link>
            <Link
              href="/m-pesa"
              className="text-gray-400 hover:text-white transition-colors"
            >
              M-Pesa Guide
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} SKIERS ENTREPRENEURS KENYA. All
              rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Made with care in Nairobi, Kenya.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
