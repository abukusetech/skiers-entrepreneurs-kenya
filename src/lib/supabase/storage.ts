"use client";

import { createClient } from "@/lib/supabase/client";

export async function uploadAvatar(
  file: File,
  userId: string,
  slot = "avatar",
): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const fileName = `${userId}/${slot}.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { cacheControl: "3600", upsert: true });

  if (error) {
    console.error("Avatar upload failed:", error.message);
    return null;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function uploadCV(
  file: File,
  userId: string,
): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const fileName = `${userId}/cv.${ext}`;

  const { error } = await supabase.storage
    .from("documents")
    .upload(fileName, file, { cacheControl: "3600", upsert: true });

  if (error) {
    console.error("CV upload failed:", error.message);
    return null;
  }

  return fileName;
}

export async function uploadServiceImage(
  file: File,
  userId: string,
): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const fileName = `${userId}/${uniqueName}.${ext}`;

  const { error } = await supabase.storage
    .from("service-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Service image upload failed:", error.message);
    return null;
  }

  const { data } = supabase.storage
    .from("service-images")
    .getPublicUrl(fileName);
  return data.publicUrl;
}
