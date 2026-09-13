"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signup, type AuthState } from "@/lib/auth/actions";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  UserCheck,
  Store,
  Building2,
  Check,
} from "lucide-react";

const initialState: AuthState = null;

const roles = [
  {
    value: "buyer",
    label: "I want to hire",
    description:
      "I need work done. Find talent, post jobs, hire professionals.",
    icon: Briefcase,
  },
  {
    value: "worker",
    label: "I want to work",
    description: "I offer skills and services. Find jobs, get hired, get paid.",
    icon: UserCheck,
  },
  {
    value: "business",
    label: "I run a business",
    description:
      "Shop, hotel, salon, restaurant, or service business that should be listed.",
    icon: Store,
  },
  {
    value: "organization",
    label: "I represent an organization",
    description:
      "Company, NGO, government agency, or cooperative that hires regularly.",
    icon: Building2,
  },
];

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleChoice, setRoleChoice] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) return;
    if (!email.trim()) return;
    if (password.length < 8) return;
    setStep(2);
  }

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                step >= 1
                  ? "bg-primary text-white"
                  : "bg-white text-text-tertiary"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                1
              </span>
              Details
            </div>
            <div className="w-8 h-px bg-border" />
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                step >= 2
                  ? "bg-primary text-white"
                  : "bg-white text-text-tertiary"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                2
              </span>
              Role
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-xl p-8 lg:p-10">
          <Link href="/" className="flex justify-center mb-8">
            <span className="text-2xl font-display font-bold text-primary">
              SKIERS<span className="text-accent">CREATIVE</span>
            </span>
          </Link>

          {state?.error && (
            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg mb-5 text-sm">
              {state.error}
            </div>
          )}

          {/* ==================== STEP 1: BASIC DETAILS ==================== */}
          {step === 1 && (
            <>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary text-center mb-2">
                Create your account
              </h1>
              <p className="text-sm text-text-secondary text-center mb-8">
                Join Kenya&apos;s marketplace for hiring and getting hired.
              </p>

              <form onSubmit={handleContinue} className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Kamau"
                      className="w-full h-12 pl-11 pr-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

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
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-12 pl-11 pr-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
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
                  <p className="text-xs text-text-tertiary mt-2">
                    Use at least 8 characters with letters and numbers.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </>
          )}

          {/* ==================== STEP 2: ROLE CHOICE ==================== */}
          {step === 2 && (
            <form action={formAction} className="space-y-5">
              {/* Hidden values carried over from step 1 */}
              <input type="hidden" name="fullName" value={fullName} />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="password" value={password} />
              <input type="hidden" name="roleChoice" value={roleChoice} />

              <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary text-center mb-2">
                What brings you to SKIERS?
              </h1>
              <p className="text-sm text-text-secondary text-center mb-6">
                Choose the role that fits you best. You can explore everything
                else later.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const selected = roleChoice === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setRoleChoice(role.value)}
                      className={`text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                        selected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-white hover:border-primary/40 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${
                            selected
                              ? "bg-primary text-white"
                              : "bg-primary/5 text-primary"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {selected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check
                              className="h-3.5 w-3.5 text-white"
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-text-primary mb-1">
                        {role.label}
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {role.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-md border border-border text-sm font-semibold text-text-primary hover:bg-background-secondary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={pending || !roleChoice}
                  className="flex-1 h-12 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {pending ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6 text-center text-sm text-text-secondary">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Log in
              </Link>
            </div>
          )}

          <p className="text-xs text-text-tertiary text-center mt-6 leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
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
