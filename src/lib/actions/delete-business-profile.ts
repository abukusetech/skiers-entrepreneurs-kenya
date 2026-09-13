"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type DeleteBusinessProfileState = {
  error?: string;
  success?: boolean;
} | null;

export async function deleteBusinessProfile(
  prevState: DeleteBusinessProfileState,
  formData: FormData,
): Promise<DeleteBusinessProfileState> {
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

  // Call the SECURITY DEFINER function. It handles the delete, cascade,
  // and profile unlink atomically.
  const { error: rpcError } = await supabase.rpc(
    "delete_business_profile_for_user",
    { p_user_id: user.id },
  );

  if (rpcError) {
    console.error("Failed to delete business:", rpcError.message);
    return {
      error: "Could not delete the business profile. Please try again.",
    };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/services");
  revalidatePath("/dashboard/listings");

  return { success: true };
}
