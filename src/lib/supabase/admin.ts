import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only admin client. Uses the service role key and bypasses RLS.
// Never import this from a "use client" file. The `server-only` package
// causes a build error if that happens.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "Add them to your environment variables before calling admin APIs.",
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
