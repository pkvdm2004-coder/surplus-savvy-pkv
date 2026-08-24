// Server-only client factory for the user's EXTERNAL Supabase project
// (the one holding inventory / predictions / waste_logs).
// This is separate from the built-in Lovable Cloud database, which stays
// untouched and keeps powering the Docs page.
// Never import this file from components or route modules — only from
// server-function handlers via `await import("./external-supabase.server")`.
import { createClient } from "@supabase/supabase-js";

export function externalSupabase() {
  // Read env inside the function: module scope ships to client bundles.
  const url = process.env["AURA_SUPABASE_URL"];
  const key = process.env["AURA_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    throw new Error(
      "External Supabase is not configured: AURA_SUPABASE_URL / AURA_SUPABASE_PUBLISHABLE_KEY missing.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Opaque sb_publishable_ keys are not JWTs: send only `apikey`,
      // never `Authorization: Bearer <key>` (PostgREST rejects it).
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
