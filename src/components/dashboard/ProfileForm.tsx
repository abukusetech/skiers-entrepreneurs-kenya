"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import {
  updateProfile,
  type UpdateProfileState,
} from "@/lib/actions/update-profile";
import { uploadAvatar } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

interface ProfileFormProps {
  initial: {
    fullName: string;
    headline: string;
    about: string;
    phone: string;
    city: string;
    location: string;
    hourlyRate: string;
    workPreference: string;
    avatarUrl: string;
    coverUrl: string;
  };
  isSeller: boolean;
}

const inputClass =
  "w-full h-11 px-4 rounded-md border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";
const labelClass = "block text-sm font-medium text-text-primary mb-1.5";

export function ProfileForm({ initial, isSeller }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<
    UpdateProfileState,
    FormData
  >(updateProfile, null);

  const [userId, setUserId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [coverUrl, setCoverUrl] = useState(initial.coverUrl);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  async function handleAvatarUpload(file: File | null) {
    if (!file || !userId) return;
    setUploading(true);
    setUploadError("");

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Profile photo must be under 5 MB.");
      setUploading(false);
      return;
    }

    const url = await uploadAvatar(file, userId, "avatar");
    if (url) {
      setAvatarUrl(url);
    } else {
      setUploadError("Profile photo upload failed. Please try again.");
    }
    setUploading(false);
  }

  async function handleCoverUpload(file: File | null) {
    if (!file || !userId) return;
    setUploading(true);
    setUploadError("");

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Cover image must be under 5 MB.");
      setUploading(false);
      return;
    }

    const url = await uploadAvatar(file, userId, "profile-cover");
    if (url) {
      setCoverUrl(url);
    } else {
      setUploadError("Cover upload failed. Please try again.");
    }
    setUploading(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (uploading) {
      setUploadError("Please wait for the current upload to finish.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("avatarUrl", avatarUrl);
    formData.set("coverUrl", coverUrl);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {state?.error && (
        <div className="flex items-center gap-2 text-sm text-error bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {uploadError && (
        <div className="flex items-center gap-2 text-sm text-error bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {uploadError}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 text-sm text-success bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Profile updated.
        </div>
      )}

      {/* Branding section */}
      <section className="pb-5 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center">
            <ImageIcon className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-base font-display font-semibold text-text-primary">
            Profile images
          </h2>
        </div>

        <div className="space-y-4">
          {/* Cover preview + upload */}
          <div>
            <label className={labelClass}>Cover image</label>
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt="Cover"
                className="w-full h-32 rounded-lg object-cover mb-3 border border-border"
              />
            ) : (
              <div className="w-full h-32 rounded-lg mb-3 border-2 border-dashed border-border bg-background-secondary flex items-center justify-center">
                <p className="text-xs text-text-tertiary">No cover image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              disabled={uploading}
              onChange={(e) => handleCoverUpload(e.target.files?.[0] || null)}
              className="w-full h-11 px-4 py-2 border border-border rounded-md text-sm bg-white"
            />
            <p className="text-xs text-text-tertiary mt-1">
              Wide landscape. 1200x400 works well.
            </p>
          </div>

          {/* Avatar preview + upload */}
          <div>
            <label className={labelClass}>Profile photo</label>
            <div className="flex items-center gap-4 mb-3">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-border bg-background-secondary flex items-center justify-center">
                  <p className="text-[10px] text-text-tertiary text-center leading-tight">
                    No photo
                  </p>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  disabled={uploading}
                  onChange={(e) =>
                    handleAvatarUpload(e.target.files?.[0] || null)
                  }
                  className="w-full h-11 px-4 py-2 border border-border rounded-md text-sm bg-white"
                />
              </div>
            </div>
            <p className="text-xs text-text-tertiary">
              Square. At least 400x400.
            </p>
          </div>
        </div>
      </section>

      {/* Basic info */}
      <div>
        <label htmlFor="fullName" className={labelClass}>
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          defaultValue={initial.fullName}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="headline" className={labelClass}>
          Headline
        </label>
        <input
          id="headline"
          name="headline"
          type="text"
          maxLength={120}
          placeholder="Full-stack developer and M-Pesa integrations specialist"
          defaultValue={initial.headline}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="about" className={labelClass}>
          About
        </label>
        <textarea
          id="about"
          name="about"
          rows={5}
          placeholder="Tell buyers and clients about your experience."
          defaultValue={initial.about}
          className={`${inputClass} h-auto py-3 resize-y`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="07XX XXX XXX"
            defaultValue={initial.phone}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="city" className={labelClass}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="Nairobi"
            defaultValue={initial.city}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          Location detail
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="Westlands, Nairobi"
          defaultValue={initial.location}
          className={inputClass}
        />
      </div>

      {isSeller && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-border">
          <div className="pt-4">
            <label htmlFor="hourlyRate" className={labelClass}>
              Hourly rate (KES)
            </label>
            <input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              min={0}
              step="1"
              defaultValue={initial.hourlyRate}
              className={inputClass}
            />
          </div>
          <div className="pt-4">
            <label htmlFor="workPreference" className={labelClass}>
              Work preference
            </label>
            <select
              id="workPreference"
              name="workPreference"
              defaultValue={initial.workPreference || ""}
              className={inputClass}
            >
              <option value="">Not set</option>
              <option value="remote">Remote only</option>
              <option value="onsite">Onsite only</option>
              <option value="both">Remote or onsite</option>
            </select>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || uploading}
        className="inline-flex items-center gap-2 h-11 px-6 text-sm font-semibold rounded-md bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {isPending || uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save changes"
        )}
      </button>
    </form>
  );
}
