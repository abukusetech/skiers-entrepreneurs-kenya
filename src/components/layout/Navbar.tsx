"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, MapPin, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (isMounted) {
        setUser(user);
        setLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user || null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container-site">
        <div className="flex justify-between items-center h-20 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo-full.png"
              alt="SKIERS ENTREPRENEURS KENYA"
              width={180}
              height={48}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/services"
              className="text-sm font-medium text-text-secondary hover:text-primary link-underline"
            >
              Find Talent
            </Link>
            <Link
              href="/jobs"
              className="text-sm font-medium text-text-secondary hover:text-primary link-underline"
            >
              Find Work
            </Link>
            <Link
              href="/businesses"
              className="text-sm font-medium text-text-secondary hover:text-primary link-underline flex items-center gap-1"
            >
              <MapPin className="h-3.5 w-3.5" />
              Nearby
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-text-secondary hover:text-primary link-underline"
            >
              Categories
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-text-secondary hover:text-primary link-underline"
            >
              Pricing
            </Link>
          </nav>

          {/* Right side desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-32 h-10 rounded-md bg-background-secondary animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                >
                  Log in
                </Link>
                <Button asChild size="sm">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-6 space-y-4 animate-fade-in">
          <Link
            href="/services"
            className="block text-base font-medium text-text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Find Talent
          </Link>
          <Link
            href="/jobs"
            className="block text-base font-medium text-text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Find Work
          </Link>
          <Link
            href="/businesses"
            className="block text-base font-medium text-text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Nearby
          </Link>
          <Link
            href="/categories"
            className="block text-base font-medium text-text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            href="/pricing"
            className="block text-base font-medium text-text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </Link>

          <div className="pt-4 border-t border-border space-y-3">
            {loading ? (
              <div className="h-11 rounded-md bg-background-secondary animate-pulse" />
            ) : user ? (
              <>
                <Button asChild variant="primary" className="w-full">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild variant="primary" className="w-full">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
