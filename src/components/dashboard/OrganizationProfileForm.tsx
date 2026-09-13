"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveOrganizationProfile,
  type OrganizationProfileState,
} from "@/lib/actions/save-organization-profile";
import { uploadAvatar } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/client";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Building2,
  Phone,
  MapPin,
  Users,
} from "lucide-react";

const initialState: OrganizationProfileState = null;

const ORGANIZATION_TYPES = [
  { value: "company", label: "Private company" },
  { value: "ngo", label: "NGO or non-profit" },
  { value: "government", label: "Government agency" },
  { value: "cooperative", label: "Cooperative" },
  { value: "other", label: "Other" },
];

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

interface InitialOrganizationData {
  name: string;
  tagline: string;
  description: string;
  organizationType: string;
  sector: string;
  categoryId: string;
  phone: string;
  email: string;
  website: string;
  county: string;
  town: string;
  address: string;
  employeeCount: string;
  foundedYear: string;
  registrationNumber: string;
  taxId: string;
  logoUrl: string;
  coverUrl: string;
}

interface OrganizationProfileFormProps {
  initial: InitialOrganizationData;
}

export function OrganizationProfileForm({
  initial,
}: OrganizationProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    saveOrganizationProfile,
    initialState,
  );
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [userId, setUserId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [stepError, setStepError] = useState("");

  const [name, setName] = useState(initial.name);
  const [tagline, setTagline] = useState(initial.tagline);
  const [description, setDescription] = useState(initial.description);
  const [organizationType, setOrganizationType] = useState(
    initial.organizationType,
  );
  const [sector, setSector] = useState(initial.sector);
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [website, setWebsite] = useState(initial.website);
  const [county, setCounty] = useState(initial.county);
  const [town, setTown] = useState(initial.town);
  const [address, setAddress] = useState(initial.address);
  const [employeeCount, setEmployeeCount] = useState(initial.employeeCount);
  const [foundedYear, setFoundedYear] = useState(initial.foundedYear);
  const [registrationNumber, setRegistrationNumber] = useState(
    initial.registrationNumber,
  );
  const [taxId, setTaxId] = useState(initial.taxId);
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl);
  const [coverUrl, setCoverUrl] = useState(initial.coverUrl);

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
      router.refresh();
    }
  }, [state, router]);

  async function handleLogoUpload(file: File | null) {
    if (!file || !userId) return;
    setUploading(true);
    setStepError("");

    if (file.size > 5 * 1024 * 1024) {
      setStepError("Logo must be under 5 MB.");
      setUploading(false);
      return;
    }

    const url = await uploadAvatar(file, userId, "organization-logo");
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

    const url = await uploadAvatar(file, userId, "organization-cover");
    if (url) {
      setCoverUrl(url);
    } else {
      setStepError("Cover upload failed. Please try again.");
    }
    setUploading(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStepError("");

    if (name.trim().length < 2) {
      setStepError("Organization name is required.");
      return;
    }
    if (description.trim().length < 50) {
      setStepError("Description must be at least 50 characters.");
      return;
    }
    if (!organizationType) {
      setStepError("Please select the organization type.");
      return;
    }
    if (!categoryId) {
      setStepError("Please pick a primary category.");
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
    <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 max-w-3xl">
      {(state?.error || stepError) && (
        <div className="flex items-center gap-2 text-sm text-error bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {stepError || state?.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 text-sm text-success bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Organization profile saved.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="tagline" value={tagline} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="organizationType" value={organizationType} />
        <input type="hidden" name="sector" value={sector} />
        <input type="hidden" name="categoryId" value={categoryId} />
        <input type="hidden" name="phone" value={phone} />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="website" value={website} />
        <input type="hidden" name="county" value={county} />
        <input type="hidden" name="town" value={town} />
        <input type="hidden" name="address" value={address} />
        <input type="hidden" name="employeeCount" value={employeeCount} />
        <input type="hidden" name="foundedYear" value={foundedYear} />
        <input
          type="hidden"
          name="registrationNumber"
          value={registrationNumber}
        />
        <input type="hidden" name="taxId" value={taxId} />
        <input type="hidden" name="logoUrl" value={logoUrl} />
        <input type="hidden" name="coverUrl" value={coverUrl} />

        {/* Identity */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold text-text-primary">
              Identity
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Organization name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Safaricom PLC"
                className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                placeholder="Connecting Kenya, one call at a time"
                className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe your mission, the work you do, and who you serve."
                className="w-full px-4 py-3 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
              />
              <p className="text-xs text-text-tertiary mt-1">
                At least 50 characters. {description.length} so far.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Organization type
              </label>
              <select
                value={organizationType}
                onChange={(e) => setOrganizationType(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">Select type</option>
                {ORGANIZATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Sector
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Telecommunications, banking, health"
                  className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Primary category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-11 px-4 rounded-md border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="">Pick one</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="pt-6 border-t border-border">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold text-text-primary">
              Contact
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Primary phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 20 XXX XXXX"
                  className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Primary email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@yourorganization.co.ke"
                  className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Website (optional)
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourorganization.co.ke"
                className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="pt-6 border-t border-border">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold text-text-primary">
              Headquarters
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  County
                </label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full h-11 px-4 rounded-md border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                  placeholder="Upper Hill"
                  className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                placeholder="Kenyatta Avenue"
                className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Registration */}
        <section className="pt-6 border-t border-border">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold text-text-primary">
              Registration and size
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Number of employees
                </label>
                <input
                  type="number"
                  min={1}
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  placeholder="50"
                  className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Year founded
                </label>
                <input
                  type="number"
                  min={1800}
                  max={new Date().getFullYear()}
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(e.target.value)}
                  placeholder="1995"
                  className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Registration number
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="PVT-ABC123XYZ"
                  className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tax ID / KRA PIN (optional)
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="P051234567X"
                  className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <p className="text-xs text-text-tertiary">
              Registration info is used only for verification and is never shown
              publicly.
            </p>
          </div>
        </section>

        {/* Branding */}
        <section className="pt-6 border-t border-border">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-display font-semibold text-text-primary">
              Branding
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Logo
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
                onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)}
                className="w-full h-11 px-4 py-2 border border-border rounded-md text-sm bg-white"
              />
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
                onChange={(e) => handleCoverUpload(e.target.files?.[0] || null)}
                className="w-full h-11 px-4 py-2 border border-border rounded-md text-sm bg-white"
              />
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-border">
          <button
            type="submit"
            disabled={pending || uploading}
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {pending || uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save organization profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
