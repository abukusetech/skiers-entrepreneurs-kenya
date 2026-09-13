"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createService,
  type CreateServiceState,
} from "@/lib/actions/create-service";
import { uploadServiceImage } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  DollarSign,
  FileText,
} from "lucide-react";

const initialState: CreateServiceState = null;

type Category = { id: string; name: string };

type UploadedImage = { url: string; name: string };

export function ServiceForm() {
  const [state, formAction, pending] = useActionState(
    createService,
    initialState,
  );
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userId, setUserId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [stepError, setStepError] = useState("");
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryTimeDays, setDeliveryTimeDays] = useState("");
  const [revisionLimit, setRevisionLimit] = useState("3");
  const [isRemote, setIsRemote] = useState(true);
  const [location, setLocation] = useState("");

  const [pricingMode, setPricingMode] = useState<"single" | "packages">(
    "single",
  );
  const [startingPrice, setStartingPrice] = useState("");
  const [basicPrice, setBasicPrice] = useState("");
  const [standardPrice, setStandardPrice] = useState("");
  const [premiumPrice, setPremiumPrice] = useState("");

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

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
    if (state?.success && state.serviceSlug) {
      router.push(`/service/${state.serviceSlug}`);
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
      if (pricingMode === "single") {
        const p = parseFloat(startingPrice);
        if (isNaN(p) || p <= 0) {
          setStepError("Enter a valid starting price.");
          return;
        }
      } else {
        const b = parseFloat(basicPrice);
        const s = parseFloat(standardPrice);
        const pr = parseFloat(premiumPrice);
        if (isNaN(b) || isNaN(s) || isNaN(pr) || b <= 0 || s <= 0 || pr <= 0) {
          setStepError("All three package prices must be valid numbers.");
          return;
        }
        if (s < b || pr < s) {
          setStepError(
            "Packages must go up in price. Basic < Standard < Premium.",
          );
          return;
        }
      }
    }

    setStep((s) => Math.min(s + 1, 3));
  }

  function goBack() {
    setStepError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0 || !userId) return;
    setUploading(true);
    setStepError("");

    const newImages: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        setStepError(`File ${file.name} is larger than 5 MB.`);
        continue;
      }
      const url = await uploadServiceImage(file, userId);
      if (url) {
        newImages.push({ url, name: file.name });
      }
    }

    setUploadedImages((prev) => [...prev, ...newImages]);
    setUploading(false);
  }

  function removeImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
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

  const imageUrlsString = uploadedImages.map((img) => img.url).join(",");

  return (
    <div className="min-h-screen bg-background-secondary py-10 px-4">
      <div className="max-w-3xl mx-auto">
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
            <input type="hidden" name="title" value={title} />
            <input type="hidden" name="categoryId" value={categoryId} />
            <input type="hidden" name="description" value={description} />
            <input
              type="hidden"
              name="deliveryTimeDays"
              value={deliveryTimeDays}
            />
            <input type="hidden" name="revisionLimit" value={revisionLimit} />
            <input type="hidden" name="location" value={location} />
            {isRemote && <input type="hidden" name="isRemote" value="on" />}
            <input type="hidden" name="pricingMode" value={pricingMode} />
            <input type="hidden" name="startingPrice" value={startingPrice} />
            <input type="hidden" name="basicPrice" value={basicPrice} />
            <input type="hidden" name="standardPrice" value={standardPrice} />
            <input type="hidden" name="premiumPrice" value={premiumPrice} />
            <input type="hidden" name="imageUrls" value={imageUrlsString} />

            {step === 1 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  Describe your service
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  Tell buyers what you offer and how you work.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Service title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Professional Website Design and Development"
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
                      rows={6}
                      placeholder="Describe what you offer, what the buyer will receive, and why they should choose you."
                      className="w-full px-4 py-3 border border-border rounded-md text-sm focus:outline-none focus:border-primary resize-none"
                    />
                    <p className="text-xs text-text-tertiary mt-1">
                      At least 50 characters.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Delivery time in days
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={deliveryTimeDays}
                        onChange={(e) => setDeliveryTimeDays(e.target.value)}
                        placeholder="7"
                        className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Revision limit
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={revisionLimit}
                        onChange={(e) => setRevisionLimit(e.target.value)}
                        placeholder="3"
                        className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

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
                      This service can be delivered remotely
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
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  Set your pricing
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  All amounts in KES. You can change this any time.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-3">
                      How do you want to price?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPricingMode("single")}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          pricingMode === "single"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <p className="font-medium text-text-primary text-sm mb-1">
                          Single price
                        </p>
                        <p className="text-xs text-text-secondary">
                          One price, simple to start.
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPricingMode("packages")}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          pricingMode === "packages"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <p className="font-medium text-text-primary text-sm mb-1">
                          Three packages
                        </p>
                        <p className="text-xs text-text-secondary">
                          Basic, Standard, Premium. Recommended.
                        </p>
                      </button>
                    </div>
                  </div>

                  {pricingMode === "single" && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Starting price
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
                          KES
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={startingPrice}
                          onChange={(e) => setStartingPrice(e.target.value)}
                          placeholder="15000"
                          className="w-full h-12 pl-16 pr-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  )}

                  {pricingMode === "packages" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Basic
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-xs">
                            KES
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={basicPrice}
                            onChange={(e) => setBasicPrice(e.target.value)}
                            placeholder="5000"
                            className="w-full h-12 pl-14 pr-3 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Standard
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-xs">
                            KES
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={standardPrice}
                            onChange={(e) => setStandardPrice(e.target.value)}
                            placeholder="15000"
                            className="w-full h-12 pl-14 pr-3 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Premium
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-xs">
                            KES
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={premiumPrice}
                            onChange={(e) => setPremiumPrice(e.target.value)}
                            placeholder="35000"
                            className="w-full h-12 pl-14 pr-3 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2">
                  Add some images
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                  Optional but recommended. Up to 5 images. JPG or PNG, max 5 MB
                  each.
                </p>

                <div className="space-y-5">
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {uploadedImages.map((img, i) => (
                        <div
                          key={img.url}
                          className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploadedImages.length < 5 && (
                    <label className="block border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        multiple
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => handleImageUpload(e.target.files)}
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 text-primary animate-spin" />
                          <p className="text-sm text-text-secondary">
                            Uploading...
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="h-8 w-8 text-text-tertiary" />
                          <p className="text-sm font-medium text-text-primary">
                            Click to upload images
                          </p>
                          <p className="text-xs text-text-tertiary">
                            You can add up to {5 - uploadedImages.length} more
                          </p>
                        </div>
                      )}
                    </label>
                  )}
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
                  disabled={pending || uploading}
                  className="flex-1 h-12 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {uploading || pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      Publish service
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-text-tertiary mt-6">
          You can edit this service any time from your dashboard.
        </p>
      </div>
    </div>
  );
}
