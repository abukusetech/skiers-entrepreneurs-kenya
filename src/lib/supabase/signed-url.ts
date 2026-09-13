"use client";

import { createClient } from "@/lib/supabase/client";

export async function getSignedCvUrl(
  cvPath: string,
  expiresInSeconds = 300,
): Promise<string | null> {
  if (!cvPath) return null;

  const supabase = createClient();

  // If the path already contains a full URL, return it as is.
  if (cvPath.startsWith("http://") || cvPath.startsWith("https://")) {
    return cvPath;
  }

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(cvPath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    console.error("Could not sign CV URL:", error?.message);
    return null;
  }

  return data.signedUrl;
}
