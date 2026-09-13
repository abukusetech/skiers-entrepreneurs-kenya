"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type DeleteOrganizationProfileState = {
  error?: string;
  success?: boolean;
} | null;

export async function deleteOrganizationProfile(
  prevState: DeleteOrganizationProfileState,
  formData: FormData,
): Promise<DeleteOrganizationProfileState> {
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

  const { error: rpcError } = await supabase.rpc(
    "delete_organization_profile_for_user",
    { p_user_id: user.id },
  );

  if (rpcError) {
    console.error("Failed to delete organization:", rpcError.message);
    return {
      error: "Could not delete the organization profile. Please try again.",
    };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/jobs");
  revalidatePath("/dashboard/projects");

  return { success: true };
}
