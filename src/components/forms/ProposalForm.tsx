"use client";

import { useActionState, useState, startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  submitProposal,
  type SubmitProposalState,
} from "@/lib/actions/submit-proposal";
import { Loader2, Send, Check } from "lucide-react";

const initialState: SubmitProposalState = null;

interface ProposalFormProps {
  jobId: string;
}

export function ProposalForm({ jobId }: ProposalFormProps) {
  const [state, formAction, pending] = useActionState(
    (prevState: SubmitProposalState, formData: FormData) =>
      submitProposal(jobId, prevState, formData),
    initialState,
  );
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [deliveryTimeDays, setDeliveryTimeDays] = useState("");
  const [localError, setLocalError] = useState("");
  const router = useRouter();

  // Refresh the page after a successful submit so the job detail page
  // shows the "already applied" state instead of the form.
  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state?.success, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError("");

    if (coverLetter.trim().length < 30) {
      setLocalError("Cover letter must be at least 30 characters.");
      return;
    }
    if (!proposedPrice) {
      setLocalError("Please enter your proposed price.");
      return;
    }
    const price = parseFloat(proposedPrice);
    if (isNaN(price) || price <= 0) {
      setLocalError("Proposed price must be a valid number above zero.");
      return;
    }

    const formData = new FormData();
    formData.set("coverLetter", coverLetter);
    formData.set("proposedPrice", proposedPrice);
    formData.set("deliveryTimeDays", deliveryTimeDays);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
      <h2 className="text-xl font-display font-bold text-text-primary mb-2">
        Submit a proposal
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Tell the buyer why you are the right fit for this job.
      </p>

      {(state?.error || localError) && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg mb-5 text-sm">
          {localError || state?.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
          <Check className="h-4 w-4" />
          Proposal submitted. The buyer will see it right away.
        </div>
      )}

      {!state?.success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Cover letter
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Introduce yourself. Explain your experience with similar work. Tell the buyer why you are the right person for this job."
              className="w-full px-4 py-3 border border-border rounded-md text-sm focus:outline-none focus:border-primary resize-none"
            />
            <p className="text-xs text-text-tertiary mt-1">
              At least 30 characters. {coverLetter.length} so far.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Your price (KES)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
                  KES
                </span>
                <input
                  type="number"
                  min={1}
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder="25000"
                  className="w-full h-12 pl-16 pr-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Delivery time (days)
              </label>
              <input
                type="number"
                min={1}
                value={deliveryTimeDays}
                onChange={(e) => setDeliveryTimeDays(e.target.value)}
                placeholder="14"
                className="w-full h-12 px-4 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full h-12 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending proposal...
              </>
            ) : (
              <>
                Send proposal
                <Send className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-xs text-text-tertiary text-center">
            Submitting a proposal is free. You only pay a small commission when
            you get hired and complete the job.
          </p>
        </form>
      )}
    </div>
  );
}
