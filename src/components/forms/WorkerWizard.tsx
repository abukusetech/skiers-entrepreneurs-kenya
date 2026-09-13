"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatar, uploadCV } from "@/lib/supabase/storage";
import { saveWorkerOnboarding, type WorkerOnboardingState } from "@/lib/auth/actions";

export function WorkerWizard() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<WorkerOnboardingState, FormData>(saveWorkerOnboarding, null);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [uploading, setUploading] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.auth.getUser(),
      supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order"),
    ]).then(([userResult, categoryResult]) => {
      if (userResult.data.user) setUserId(userResult.data.user.id);
      if (categoryResult.data) setCategories(categoryResult.data);
    });
  }, []);

  useEffect(() => {
    if (state?.success) router.push("/onboarding/complete?role=worker");
  }, [state, router]);

  async function uploadFile(file: File | null, kind: "avatar" | "cv") {
    if (!file || !userId) return;
    setUploading(kind);
    setLocalError("");
    try {
      if (kind === "avatar") {
        if (file.size > 5 * 1024 * 1024) throw new Error("Profile photo must be under 5 MB.");
        const url = await uploadAvatar(file, userId, "avatar");
        if (!url) throw new Error("Could not upload the profile photo.");
        setAvatarUrl(url);
      } else {
        if (file.size > 10 * 1024 * 1024) throw new Error("CV must be under 10 MB.");
        const url = await uploadCV(file, userId);
        if (!url) throw new Error("Could not upload the CV.");
        setCvUrl(url);
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading("");
    }
  }

  function next() {
    setLocalError("");
    if (step === 1) {
      const form = document.querySelector<HTMLFormElement>("#worker-onboarding-form");
      const headline = (form?.elements.namedItem("headline") as HTMLInputElement | null)?.value.trim();
      const category = (form?.elements.namedItem("primaryCategoryId") as HTMLSelectElement | null)?.value;
      if (!headline || headline.length < 10) return setLocalError("Headline must be at least 10 characters.");
      if (!category) return setLocalError("Please choose your primary category.");
    }
    if (step === 2) {
      const form = document.querySelector<HTMLFormElement>("#worker-onboarding-form");
      const skills = (form?.elements.namedItem("skills") as HTMLInputElement | null)?.value.trim();
      if (!skills) return setLocalError("Add your main skills, separated by commas.");
    }
    if (step === 3) {
      const form = document.querySelector<HTMLFormElement>("#worker-onboarding-form");
      const about = (form?.elements.namedItem("about") as HTMLTextAreaElement | null)?.value.trim();
      const workPreference = (form?.elements.namedItem("workPreference") as HTMLSelectElement | null)?.value;
      if (!about || about.length < 50) return setLocalError("Your introduction must be at least 50 characters.");
      if (!workPreference) return setLocalError("Choose how you prefer to work.");
    }
    setStep((value) => Math.min(4, value + 1));
  }

  return (
    <main className="min-h-screen bg-background-secondary py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-primary mb-2">SKIERS ENTREPRENEURS KENYA</p>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-text-primary">Build your worker profile</h1>
          <p className="text-text-secondary mt-2">Tell buyers what you do, what you are good at, and how they can work with you.</p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={`h-2 flex-1 rounded-full ${item <= step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>

          {(state?.error || localError) && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{localError || state?.error}</div>}

          <form id="worker-onboarding-form" action={formAction} className="space-y-6">
            <input type="hidden" name="avatarUrl" value={avatarUrl} />
            <input type="hidden" name="cvUrl" value={cvUrl} />

            <section className={step === 1 ? "space-y-5" : "hidden"}>
                <div><h2 className="text-xl font-bold text-text-primary">Your professional identity</h2><p className="text-sm text-text-secondary mt-1">Make the first impression clear and specific.</p></div>
                <label className="block"><span className="block text-sm font-medium mb-2">Professional headline</span><input name="headline" required placeholder="Full-stack web developer and UI designer" className="w-full h-12 px-4 rounded-lg border border-border" /></label>
                <label className="block"><span className="block text-sm font-medium mb-2">Primary category</span><select name="primaryCategoryId" required className="w-full h-12 px-4 rounded-lg border border-border bg-white"><option value="">Choose a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                <div className="grid sm:grid-cols-2 gap-4"><label className="block"><span className="block text-sm font-medium mb-2">Experience level</span><select name="experienceLevel" className="w-full h-12 px-4 rounded-lg border border-border bg-white"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="expert">Expert</option></select></label><label className="block"><span className="block text-sm font-medium mb-2">Years of experience</span><input name="yearsOfExperience" type="number" min="0" max="60" placeholder="2" className="w-full h-12 px-4 rounded-lg border border-border" /></label></div>
              </section>
            <section className={step === 2 ? "space-y-5" : "hidden"}>
                <div><h2 className="text-xl font-bold text-text-primary">Your skills</h2><p className="text-sm text-text-secondary mt-1">Add the skills buyers are most likely to search for.</p></div>
                <label className="block"><span className="block text-sm font-medium mb-2">Skills</span><input name="skills" required placeholder="React, Next.js, UI design, WordPress" className="w-full h-12 px-4 rounded-lg border border-border" /><span className="text-xs text-text-tertiary mt-1 block">Separate skills with commas.</span></label>
                <div className="grid sm:grid-cols-2 gap-4"><label className="block"><span className="block text-sm font-medium mb-2">Hourly rate (KES)</span><input name="hourlyRate" type="number" min="0" placeholder="1500" className="w-full h-12 px-4 rounded-lg border border-border" /></label><label className="block"><span className="block text-sm font-medium mb-2">Fixed project rate from (KES)</span><input name="fixedRateFrom" type="number" min="0" placeholder="5000" className="w-full h-12 px-4 rounded-lg border border-border" /></label></div>
              </section>
            <section className={step === 3 ? "space-y-5" : "hidden"}>
                <div><h2 className="text-xl font-bold text-text-primary">About your work</h2><p className="text-sm text-text-secondary mt-1">Give buyers enough information to understand what you bring.</p></div>
                <label className="block"><span className="block text-sm font-medium mb-2">About you</span><textarea name="about" required rows={7} placeholder="Tell buyers about your experience, strengths, and the type of work you enjoy." className="w-full px-4 py-3 rounded-lg border border-border resize-y" /></label>
                <div className="grid sm:grid-cols-2 gap-4"><label className="block"><span className="block text-sm font-medium mb-2">Work preference</span><select name="workPreference" required className="w-full h-12 px-4 rounded-lg border border-border bg-white"><option value="remote">Remote</option><option value="onsite">On-site</option><option value="hybrid">Hybrid</option></select></label><label className="block"><span className="block text-sm font-medium mb-2">Location</span><input name="location" placeholder="Nairobi, Kenya" className="w-full h-12 px-4 rounded-lg border border-border" /></label></div>
              </section>
            <section className={step === 4 ? "space-y-5" : "hidden"}>
                <div><h2 className="text-xl font-bold text-text-primary">Finish your profile</h2><p className="text-sm text-text-secondary mt-1">A profile photo and CV are optional, but they help buyers trust your profile.</p></div>
                <label className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border"><div><p className="font-medium">Profile photo</p><p className="text-xs text-text-tertiary">JPG, PNG or WebP, up to 5 MB.</p></div><span className="relative inline-flex items-center gap-2 h-10 px-4 rounded-md border border-border text-sm font-semibold"><Upload className="h-4 w-4" />{uploading === "avatar" ? "Uploading..." : avatarUrl ? "Uploaded" : "Choose photo"}<input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => uploadFile(e.target.files?.[0] || null, "avatar")} /></span></label>
                <label className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border"><div><p className="font-medium">CV / Resume</p><p className="text-xs text-text-tertiary">PDF or document, up to 10 MB.</p></div><span className="relative inline-flex items-center gap-2 h-10 px-4 rounded-md border border-border text-sm font-semibold"><Upload className="h-4 w-4" />{uploading === "cv" ? "Uploading..." : cvUrl ? "Uploaded" : "Choose CV"}<input type="file" accept=".pdf,.doc,.docx" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => uploadFile(e.target.files?.[0] || null, "cv")} /></span></label>
                <div className="rounded-xl bg-background-secondary border border-border p-4 flex gap-3"><CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" /><p className="text-sm text-text-secondary">Once submitted, your profile can be discovered by buyers and you can start creating services and submitting proposals.</p></div>
              </section>

            <div className="flex justify-between gap-3 pt-4 border-t border-border">
              {step > 1 ? <button type="button" onClick={() => setStep((value) => value - 1)} className="h-11 px-5 rounded-md border border-border text-sm font-semibold">Back</button> : <span />}
              {step < 4 ? <button type="button" onClick={next} className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-primary text-white text-sm font-semibold">Continue <ArrowRight className="h-4 w-4" /></button> : <button type="submit" disabled={pending || !!uploading} className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-primary text-white text-sm font-semibold disabled:opacity-60">{pending && <Loader2 className="h-4 w-4 animate-spin" />} {pending ? "Saving..." : "Complete profile"}</button>}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
