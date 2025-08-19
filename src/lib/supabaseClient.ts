import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Vite exposes variables that start with VITE_
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_JWT     = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL) throw new Error("VITE_SUPABASE_URL is not set");
if (!ANON_JWT)     throw new Error("VITE_SUPABASE_ANON_KEY is not set");

let _client: SupabaseClient | undefined;

/** Singleton Supabase client. Includes headers so Edge Functions with verify_jwt=true accept requests. */
export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  _client = createClient(SUPABASE_URL, ANON_JWT, {
    global: {
      headers: {
        apikey: ANON_JWT,
        Authorization: `Bearer ${ANON_JWT}`, // MUST be a JWT
      },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return _client;
}

// Optional convenience export
export const supabase = getSupabase();