"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createListing,
  type CreateListingState,
} from "@/lib/actions/create-listing";
import {
  updateListing,
  deleteListing,
  type UpdateListingState,
} from "@/lib/actions/update-listing";
import { uploadAvatar } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ListingFormProps {
  mode: "create" | "edit";
  listingId?: string;
  initial?: {
    title: string;
    description: string;
    categoryId: string;
    startingPrice: string;
    deliveryTimeDays: string;
    isRemote: boolean;
    location: string;
    coverUrl: string;
  };
}

interface Category {
  id: string;
  name: string;
}

const emptyInitial = {
  title: "",
  description: "",
  categoryId: "",
  startingPrice: "",
  deliveryTimeDays: "",
  isRemote: true,
  location: "",
  coverUrl: "",
};

export function ListingForm({
  mode,
  listingId,
  initial = emptyInitial,
}: ListingFormProps) {
  const createState = useActionState<CreateListingState, FormData>(
    createListing,
    null,
  );
  const updateState = useActionState<UpdateListingState, FormData>(
    (prev, formData) =>
      listingId ? updateListing(listingId, prev, formData) : prev,
    null,
  );

  const [state, formAction, pending] =
    mode === "create" ? createState : updateState;

  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [userId, setUserId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState("");

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [startingPrice, setStartingPrice] = useState(initial.startingPrice);
  const [deliveryTimeDays, setDeliveryTimeDays] = useState(
    initial.deliveryTimeDays,
  );
  const [isRemote, setIsRemote] = useState(initial.isRemote);
  const [location, setLocation] = useState(initial.location);
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
      router.push("/dashboard/listings");
      router.refresh();
    }
  }, [state, router]);

  async function handleCoverUpload(file: File | null) {
    if (!file || !userId) return;
    setUploading(true);
    setLocalError("");

    if (file.size > 5 * 1024 * 1024) {
      setLocalError("Cover image must be under 5 MB.");
      setUploading(false);
      return;
    }

    const url = await uploadAvatar(file, userId, "listing-cover");
    if (url) {
      setCoverUrl(url);
    } else {
      setLocalError("Cover upload failed. Please try again.");
    }
    setUploading(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError("");

    if (title.trim().length < 5) {
      setLocalError("Title must be at least 5 characters.");
      return;
    }
    if (description.trim().length < 20) {
      setLocalError("Description must be at least 20 characters.");
      return;
    }
    if (!categoryId) {
      setLocalError("Please pick a category.");
      return;
    }
    if (!startingPrice) {
      setLocalError("Please enter a price.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  }

  async function handleDelete() {
    if (!listingId) return;
    if (
      !confirm("Delete this listing? It will be removed from the marketplace.")
    )
      return;

    const result = await deleteListing(listingId);
    if (result?.error) {
      setLocalError(result.error);
      return;
    }
    router.push("/dashboard/listings");
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 max-w-3xl">
      {(state?.error || localError) && (
        <div className="flex items-center gap-2 text-sm text-error bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {localError || state?.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="categoryId" value={categoryId} />
        <input type="hidden" name="startingPrice" value={startingPrice} />
        <input type="hidden" name="deliveryTimeDays" value={deliveryTimeDays} />
        <input type="hidden" name="location" value={location} />
        <input type="hidden" name="coverUrl" value={coverUrl} />
        <input type="hidden" name="imageUrls" value="" />
        {isRemote && <input type="hidden" name="isRemote" value="on" />}

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Listing title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Full house cleaning service"
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
            placeholder="What exactly is included, how long it takes, who it is for."
            className="w-full px-4 py-3 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category
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

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Price (KES)
            </label>
            <input
              type="number"
              min={0}
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              placeholder="5000"
              className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Delivery time (days)
            </label>
            <input
              type="number"
              min={1}
              value={deliveryTimeDays}
              onChange={(e) => setDeliveryTimeDays(e.target.value)}
              placeholder="3"
              className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Can be delivered remotely
            </label>
          </div>
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
              placeholder="Nairobi"
              className="w-full h-11 px-4 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Cover image (optional)
          </label>
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt="Cover"
              className="w-full h-40 rounded-lg object-cover mb-3 border border-border"
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

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Link
            href="/dashboard/listings"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md border border-border text-sm font-semibold text-text-primary hover:bg-background-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Link>

          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center h-11 px-6 rounded-md border border-error/30 text-sm font-semibold text-error hover:bg-error/5 transition-colors"
            >
              Delete listing
            </button>
          )}

          <button
            type="submit"
            disabled={pending || uploading}
            className="flex-1 h-11 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {pending || uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Publish listing"
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
