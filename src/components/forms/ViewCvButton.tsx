"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { getSignedCvUrl } from "@/lib/supabase/signed-url";

interface ViewCvButtonProps {
  cvUrl: string | null;
  applicantName: string;
}

export function ViewCvButton({ cvUrl, applicantName }: ViewCvButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (!cvUrl) {
      setError("No CV uploaded");
      setTimeout(() => setError(""), 2500);
      return;
    }

    setLoading(true);
    setError("");

    const url = await getSignedCvUrl(cvUrl, 300);
    setLoading(false);

    if (!url) {
      setError("Could not open CV");
      setTimeout(() => setError(""), 2500);
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-md bg-transparent border border-border text-text-primary hover:bg-background-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label={`View CV of ${applicantName}`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileText className="h-3.5 w-3.5" />
      )}
      {error ? error : "View CV"}
    </button>
  );
}
