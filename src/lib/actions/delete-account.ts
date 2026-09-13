"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type DeleteAccountState = {
  error?: string;
  success?: boolean;
} | null;

export async function deleteAccount(
  prevState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const confirmation = (formData.get("confirmation") as string)?.trim();
  if (confirmation !== "DELETE") {
    return { error: "Type DELETE exactly to confirm." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You are not signed in." };
  }

  const userId = user.id;
  const now = new Date().toISOString();
  const deletedEmail = `deleted-${userId}@skiers.invalid`;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      error:
        "Account closure is not configured on this server. Please contact support.",
    };
  }

  // Cancel active work so no counterparty is left waiting.
  await admin
    .from("jobs")
    .update({ status: "cancelled" })
    .eq("buyer_id", userId)
    .in("status", ["draft", "published", "in_review"]);

  await admin
    .from("proposals")
    .update({ status: "withdrawn" })
    .eq("seller_id", userId)
    .in("status", ["submitted", "shortlisted"]);

  await admin
    .from("services")
    .update({ status: "archived", deleted_at: now })
    .eq("seller_id", userId)
    .eq("status", "published");

  await admin
    .from("orders")
    .update({ status: "cancelled", cancelled_at: now })
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .in("status", [
      "created",
      "payment_pending",
      "paid",
      "in_progress",
      "submitted",
      "in_review",
      "revision_requested",
    ]);

  // Anonymize the profile before deleting the auth user. We keep the row
  // so foreign keys on orders and reviews remain valid, but every personal
  // identifier is replaced.
  const { error: profileError } = await admin
    .from("profiles")
    .update({
      full_name: "Deleted User",
      email: deletedEmail,
      phone: null,
      avatar_url: null,
      headline: null,
      about: null,
      location: null,
      city: null,
      latitude: null,
      longitude: null,
      languages: [],
      hourly_rate: null,
      fixed_rate_from: null,
      cv_url: null,
      is_active: false,
      deleted_at: now,
    })
    .eq("id", userId);

  if (profileError) {
    console.error("Failed to anonymize profile:", profileError);
    return {
      error:
        "Could not delete your account. Please try again or contact support.",
    };
  }

  // Delete the auth user via our SECURITY DEFINER function. This clears
  // sessions, refresh tokens, identities, and the user row in one shot.
  // Calling GoTrue's admin API here is unreliable when the user has live
  // sessions, which is why we go direct to Postgres.
  const { error: rpcError } = await admin.rpc("admin_delete_user", {
    p_user_id: userId,
  });

  if (rpcError) {
    console.error("Failed to delete auth user:", rpcError);
    return {
      error:
        "Your profile was closed but the sign-in could not be removed. Please contact support.",
    };
  }

  // Clear the local session cookie as a belt-and-braces step.
  await supabase.auth.signOut();

  revalidatePath("/", "layout");

  return { success: true };
}
