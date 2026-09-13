"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteBusinessProfile,
  type DeleteBusinessProfileState,
} from "@/lib/actions/delete-business-profile";
import { AlertTriangle, Loader2, X } from "lucide-react";

const initialState: DeleteBusinessProfileState = null;

export function DeleteBusinessProfile() {
  const [state, formAction, pending] = useActionState(
    deleteBusinessProfile,
    initialState,
  );
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state, router]);

  const canConfirm = confirmation === "DELETE";

  return (
    <div className="bg-white rounded-2xl border border-error/30 p-6 lg:p-8 max-w-3xl mt-8">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-11 h-11 rounded-xl bg-error/10 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-error" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-display font-semibold text-text-primary mb-2">
            Delete business profile
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            This deletes your business profile and all of its listings. Any
            active orders tied to those listings will be cancelled. This cannot
            be undone.
          </p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center h-11 px-5 text-sm font-semibold rounded-md bg-error text-white hover:bg-red-700 transition-colors"
          >
            Delete business profile
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-business-title"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 lg:p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-error" />
                </div>
                <h3
                  id="delete-business-title"
                  className="text-lg font-display font-bold text-text-primary"
                >
                  Are you sure?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setConfirmation("");
                }}
                className="text-text-tertiary hover:text-text-primary transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mb-5">
              Deleting your business profile removes it and all its listings
              from the marketplace. Active orders will be cancelled. This cannot
              be undone.
            </p>

            {state?.error && (
              <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg mb-5 text-sm">
                {state.error}
              </div>
            )}

            <form action={formAction}>
              <label
                htmlFor="delete-business-confirmation"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Type <span className="font-mono font-bold">DELETE</span> to
                confirm
              </label>
              <input
                id="delete-business-confirmation"
                name="confirmation"
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="DELETE"
                className="w-full h-11 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-error mb-5"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setConfirmation("");
                  }}
                  disabled={pending}
                  className="flex-1 h-11 rounded-md border border-border text-sm font-semibold text-text-primary hover:bg-background-secondary transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canConfirm || pending}
                  className="flex-1 h-11 rounded-md bg-error text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
