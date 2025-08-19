import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Match test expectation: throw before using the client if misconfigured
if (!url || !anon) {
  throw new Error("supabase is not configured");
}

export const supabase: SupabaseClient = createClient(url, anon);
