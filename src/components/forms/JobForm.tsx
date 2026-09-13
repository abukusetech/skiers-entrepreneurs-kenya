"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { createJob, type CreateJobState } from "@/lib/actions/create-job";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  FileText,
  DollarSign,
  MapPin,
} from "lucide-react";

const initialState: CreateJobState = null;

type Category = { id: string; name: string };

const experienceLevels = [
  { value: "entry", label: "Entry level", desc: "Anyone can apply" },
  {
    value: "intermediate",
    label: "Intermediate",
    desc: "Some experience needed",
  },
  { value: "expert", label: "Expert", desc: "Deep expertise required" },
];

const projectScopes = [
  { value: "small", label: "Small", desc: "Quick tasks, few days" },
  { value: "medium", label: "Medium", desc: "Weeks of work" },
  { value: "large", label: "Large", desc: "Long term or complex" },
];

export function JobForm() {
  const [state, formAction, pending] = useActionState(createJob, initialState);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stepError, setStepError] = useState("");
  const router = useRouter();

  // Step 1
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  // Step 2
  const [budgetType, setBudgetType] = useState<"fixed" | "hourly" | "open">(
    "fixed",
  );
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [projectScope, setProjectScope] = useState("medium");
  const [skills, setSkills] = useState("");

  // Step 3
  const [isRemote, setIsRemote] = useState(true);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order");

      if (cats) setCategories(cats);
    }

    load();
  }, []);

  useEffect(() => {
    if (state?.success && state.jobSlug) {
      router.push(`/job/${state.jobSlug}`);
      router.refresh();
    }
  }, [state, router]);

  function goNext() {
    setStepError("");

    if (step === 1) {
      if (title.trim().length < 10) {
        setStepError("Title must be at least 10 characters.");
        return;
      }
      if (!categoryId) {
        setStepError("Please pick a category.");
        return;
      }
      if (description.trim().length < 50) {
        setStepError("Description must be at least 50 characters.");
        return;
      }
    }

    if (step === 2) {
      if (budgetMin) {
        const n = parseFloat(budgetMin);
        if (isNaN(n) || n < 0) {
          setStepError("Minimum budget must be a valid number.");
          return;
        }
      }
      if (budgetMax) {
        const n = parseFloat(budgetMax);
        if (isNaN(n) || n < 0) {
          setStepError("Maximum budget must be a valid number.");
          return;
        }
      }
      if (
        budgetMin &&
        budgetMax &&
        parseFloat(budgetMax) < parseFloat(budgetMin)
      ) {
        setStepError("Maximum budget must be greater than minimum.");
        return;
      }
    }

    setStep((s) => Math.min(s + 1, 3));
  }

  function goBack() {
    setStepError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (step < 3) {
      goNext();
      return;
    }

    const formData = new FormData(e.currentTarget);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <div className="min-h-screen bg-background-secondary py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <p className="text-xs text-text-tertiary text-center mb-3">
            Step {step} of 3
          </p>
          <div className="h-1.5 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-xl p-8 lg:p-10">
          {(state?.error || stepError) && (
            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg mb-5 text-sm">
              {stepError || state?.error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Hidden fields */}
            <input type="hidden" name="title" value={title} />
            <input type="hidden" name="categoryId" value={categoryId} />
            <input type="hidden" name="description" value={description} />
            <input type="hidden" name="budgetType" value={budgetType} />
            <input type="hidden" name="budgetMin" value={budgetMin} />
            <input type="hidden" name="budgetMax" value={budgetMax} />
            <input type="hidden" name="deadline" value={deadline} />
            <input
              type="hidden"
              name="experienceLevel"
              value={experienceLevel}
            />
            <input type="hidden" name="projectScope" value={projectScope} />
            <input type="hidden" name="skills" value={skills} />
            <input type="hidden" name="location" value={location} />
            {isRemote && <input type="hidden" name="isRemote" value="on" />}

            {/* ==================== STEP 1 ==================== */}
            {step === 1 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  What do you need done?
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  Give your job a clear title and describe what you need.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Job title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Build a modern website for my restaurant"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      At least 10 characters.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full h-12 px-4 border border-border rounded-md text-sm bg-white focus:outline-none focus:border-primary"
                    >
                      <option value="">Pick a category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={7}
                      placeholder="Describe your project in detail. What do you need done? What are the requirements? What does success look like?"
                      className="w-full px-4 py-3 border border-border rounded-md text-sm focus:outline-none focus:border-primary resize-none"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      At least 50 characters.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* ==================== STEP 2 ==================== */}
            {step === 2 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  Set the details
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  Budget, deadline, and the kind of expertise you need.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-3">
                      Budget type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: "fixed", label: "Fixed price" },
                        { value: "hourly", label: "Hourly" },
                        { value: "open", label: "Open" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setBudgetType(
                              opt.value as "fixed" | "hourly" | "open",
                            )
                          }
                          className={`text-left p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                            budgetType === opt.value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/40 text-text-primary"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {budgetType !== "open" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Minimum (KES)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
                            KES
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={budgetMin}
                            onChange={(e) => setBudgetMin(e.target.value)}
                            placeholder="10000"
                            className="w-full h-12 pl-16 pr-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Maximum (KES)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
                            KES
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={budgetMax}
                            onChange={(e) => setBudgetMax(e.target.value)}
                            placeholder="50000"
                            className="w-full h-12 pl-16 pr-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Deadline (optional)
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-3">
                      Experience level
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {experienceLevels.map((lvl) => (
                        <button
                          key={lvl.value}
                          type="button"
                          onClick={() => setExperienceLevel(lvl.value)}
                          className={`text-left p-4 rounded-xl border-2 transition-all ${
                            experienceLevel === lvl.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <p className="font-medium text-text-primary text-sm mb-1">
                            {lvl.label}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {lvl.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-3">
                      Project scope
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {projectScopes.map((sc) => (
                        <button
                          key={sc.value}
                          type="button"
                          onClick={() => setProjectScope(sc.value)}
                          className={`text-left p-4 rounded-xl border-2 transition-all ${
                            projectScope === sc.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <p className="font-medium text-text-primary text-sm mb-1">
                            {sc.label}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {sc.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Required skills (optional)
                    </label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="React, Node.js, UI Design"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      Separate with commas.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* ==================== STEP 3 ==================== */}
            {step === 3 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  Where is the work?
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  Choose remote or on site, then review before posting.
                </p>

                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isRemote"
                      checked={isRemote}
                      onChange={(e) => setIsRemote(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="isRemote"
                      className="text-sm text-text-secondary"
                    >
                      This job can be done remotely
                    </label>
                  </div>

                  {!isRemote && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Nairobi, Kenya"
                        className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  )}

                  {/* Review */}
                  <div className="bg-background-secondary rounded-xl p-5 border border-border">
                    <p className="text-xs font-bold uppercase tracking-wider text-accent mb-4">
                      Review
                    </p>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="text-text-tertiary mb-0.5">Title</dt>
                        <dd className="font-medium text-text-primary">
                          {title || "Not set"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-text-tertiary mb-0.5">Category</dt>
                        <dd className="font-medium text-text-primary">
                          {categories.find((c) => c.id === categoryId)?.name ||
                            "Not set"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-text-tertiary mb-0.5">Budget</dt>
                        <dd className="font-medium text-text-primary">
                          {budgetType === "open"
                            ? "Open"
                            : budgetMin && budgetMax
                              ? `KES ${budgetMin} - ${budgetMax}`
                              : budgetMin
                                ? `KES ${budgetMin} and up`
                                : budgetMax
                                  ? `Up to KES ${budgetMax}`
                                  : "Not set"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-text-tertiary mb-0.5">
                          Experience
                        </dt>
                        <dd className="font-medium text-text-primary capitalize">
                          {experienceLevel}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-text-tertiary mb-0.5">Scope</dt>
                        <dd className="font-medium text-text-primary capitalize">
                          {projectScope}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md border border-border text-sm font-semibold text-text-primary hover:bg-background-secondary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 h-12 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 h-12 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      Post job for free
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-text-tertiary mt-6">
          Posting is always free. You will only pay when you hire someone.
        </p>
      </div>
    </div>
  );
}
