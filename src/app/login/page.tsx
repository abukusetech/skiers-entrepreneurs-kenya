"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, type AuthState } from "@/lib/auth/actions";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const initialState: AuthState = null;

function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (state?.success) {
      router.push(redirectTo);
      router.refresh();
    }
  }, [state, router, redirectTo]);

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-border shadow-xl p-8 lg:p-10">
          <Link href="/" className="flex justify-center mb-8">
            <span className="text-2xl font-display font-bold text-primary">
              SKIERS<span className="text-accent">CREATIVE</span>
            </span>
          </Link>

          <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary text-center mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-text-secondary text-center mb-8">
            Log in to continue to your account.
          </p>

          {state?.error && (
            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg mb-5 text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full h-12 pl-11 pr-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-primary"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-12 border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full h-12 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {pending ? (
                "Logging in..."
              ) : (
                <>
                  Log in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            Do not have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-text-tertiary mt-6">
          Need help? WhatsApp us at{" "}
          <a
            href="https://wa.me/254768860572"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kenya-green hover:underline font-medium"
          >
            +254 768 860 572
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-text-tertiary">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
