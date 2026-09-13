"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveBusinessOnboarding,
  type BusinessOnboardingState,
} from "@/lib/actions/save-business-onboarding";
import { uploadAvatar } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Store,
  MapPin,
  Phone,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const initialState: BusinessOnboardingState = null;

const KENYA_COUNTIES = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
];

interface Category {
  id: string;
  name: string;
}

export function BusinessWizard() {
  const [state, formAction, pending] = useActionState(
    saveBusinessOnboarding,
    initialState,
  );
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userId, setUserId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [stepError, setStepError] = useState("");
  const router = useRouter();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [county, setCounty] = useState("");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [services, setServices] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [kraPin, setKraPin] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

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
    if (state?.success) {
      router.push("/onboarding/complete?role=business");
      router.refresh();
    }
  }, [state, router]);

  function goNext() {
    setStepError("");
    if (step === 1) {
      if (name.trim().length < 2) {
        return setStepError("Enter your business name.");
      }
      if (description.trim().length < 50) {
        return setStepError("Description must be at least 50 characters.");
      }
      if (!categoryId) {
        return setStepError("Pick the category that best fits your business.");
      }
    }
    if (step === 2) {
      if (!phone.trim()) {
        return setStepError("A business phone number is required.");
      }
    }
    if (step === 3) {
      if (!county) {
        return setStepError("Select your county.");
      }
    }
    setStep((s) => Math.min(s + 1, 5));
  }

  function goBack() {
    setStepError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleLogoUpload(file: File | null) {
    if (!file || !userId) return;
    setUploading(true);
    setStepError("");

    if (file.size > 5 * 1024 * 1024) {
      setStepError("Logo must be under 5 MB.");
      setUploading(false);
      return;
    }

    const url = await uploadAvatar(file, userId, "business-logo");
    if (url) {
      setLogoUrl(url);
    } else {
      setStepError("Logo upload failed. Please try again.");
    }
    setUploading(false);
  }

  async function handleCoverUpload(file: File | null) {
    if (!file || !userId) return;
    setUploading(true);
    setStepError("");

    if (file.size > 5 * 1024 * 1024) {
      setStepError("Cover image must be under 5 MB.");
      setUploading(false);
      return;
    }

    const url = await uploadAvatar(file, userId, "business-cover");
    if (url) {
      setCoverUrl(url);
    } else {
      setStepError("Cover upload failed. Please try again.");
    }
    setUploading(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (step < 5) {
      goNext();
      return;
    }

    if (uploading) {
      setStepError("Please wait for the current upload to finish.");
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
        <div className="mb-8">
          <p className="text-xs text-text-tertiary text-center mb-3">
            Step {step} of 5
          </p>
          <div className="h-1.5 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
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
            <input type="hidden" name="name" value={name} />
            <input type="hidden" name="tagline" value={tagline} />
            <input type="hidden" name="description" value={description} />
            <input type="hidden" name="industry" value={industry} />
            <input type="hidden" name="categoryId" value={categoryId} />
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="website" value={website} />
            <input type="hidden" name="county" value={county} />
            <input type="hidden" name="town" value={town} />
            <input type="hidden" name="address" value={address} />
            <input type="hidden" name="building" value={building} />
            <input type="hidden" name="services" value={services} />
            <input
              type="hidden"
              name="registrationNumber"
              value={registrationNumber}
            />
            <input type="hidden" name="kraPin" value={kraPin} />
            <input type="hidden" name="logoUrl" value={logoUrl} />
            <input type="hidden" name="coverUrl" value={coverUrl} />
            <input type="hidden" name="hours" value="{}" />

            {step === 1 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  Tell us about your business
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  This is what customers will see when they find you on SKIERS.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Business name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Mama Oliech Restaurant"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Tagline (optional)
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      maxLength={100}
                      placeholder="The best fish in Kisumu since 1995"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      What does your business do?
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Describe your products, services, and what makes you different."
                      className="w-full px-4 py-3 border border-border rounded-md text-sm focus:outline-none focus:border-primary resize-none"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      At least 50 characters. {description.length} so far.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="Hospitality, retail, beauty, automotive"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Main category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full h-12 px-4 border border-border rounded-md text-sm bg-white focus:outline-none focus:border-primary"
                    >
                      <option value="">Pick the closest match</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  How can customers reach you?
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  We recommend a business line rather than a personal number.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Business phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Business email (optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@yourbusiness.co.ke"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Website (optional)
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourbusiness.co.ke"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  Where are you located?
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  Customers use this to find businesses near them.
                </p>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        County
                      </label>
                      <select
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="w-full h-12 px-4 border border-border rounded-md text-sm bg-white focus:outline-none focus:border-primary"
                      >
                        <option value="">Select county</option>
                        {KENYA_COUNTIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Town or area
                      </label>
                      <input
                        type="text"
                        value={town}
                        onChange={(e) => setTown(e.target.value)}
                        placeholder="Westlands"
                        className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Street address (optional)
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Mpaka Road"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Building or landmark (optional)
                    </label>
                    <input
                      type="text"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      placeholder="Westlands Business Park, 3rd floor"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Main services or products
                    </label>
                    <input
                      type="text"
                      value={services}
                      onChange={(e) => setServices(e.target.value)}
                      placeholder="Lunch, dinner, catering, takeaway"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      Separate with commas.
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  Business documents
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  Optional but recommended. Verified businesses get more
                  customers and rank higher in search.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Business registration number
                    </label>
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="CPR/2015/123456"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      KRA PIN certificate number
                    </label>
                    <input
                      type="text"
                      value={kraPin}
                      onChange={(e) => setKraPin(e.target.value)}
                      placeholder="P051234567X"
                      className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <p className="text-xs text-text-tertiary">
                    Documents are verified by our team. Your information stays
                    private and is never shown publicly.
                  </p>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  Add your branding
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  Optional. A logo and cover image make your business stand out.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Business logo
                    </label>
                    {logoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="w-20 h-20 rounded-full object-cover mb-3 border border-border"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      disabled={uploading}
                      onChange={(e) =>
                        handleLogoUpload(e.target.files?.[0] || null)
                      }
                      className="w-full h-12 px-4 py-2.5 border border-border rounded-md text-sm bg-white"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      JPG or PNG. Square works best.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Cover image
                    </label>
                    {coverUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverUrl}
                        alt="Cover"
                        className="w-full h-32 rounded-lg object-cover mb-3 border border-border"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      disabled={uploading}
                      onChange={(e) =>
                        handleCoverUpload(e.target.files?.[0] || null)
                      }
                      className="w-full h-12 px-4 py-2.5 border border-border rounded-md text-sm bg-white"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      Wide landscape image. 1200x400 works well.
                    </p>
                  </div>
                </div>
              </>
            )}

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
              {step < 5 ? (
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
                  disabled={pending || uploading}
                  className="flex-1 h-12 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {uploading || pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete business profile
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-text-tertiary mt-6">
          You can update everything later from your dashboard.
        </p>
      </div>
    </div>
  );
}
