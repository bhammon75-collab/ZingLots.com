import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getEnv() {
  const url = import.meta.env?.VITE_SUPABASE_URL as string | undefined;
  const anon = import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined;
  return { url, anon };
}

let _client: SupabaseClient | null = null;

/**
 * Returns a live Supabase client or throws if not configured.
 * Lazily creates the client so importing this module never throws.
 */
export function ensureSupabase(): SupabaseClient {
  if (_client) return _client;
  const { url, anon } = getEnv();
  if (!url || !anon) {
    throw new Error("supabase is not configured");
  }
  _client = createClient(url, anon);
  return _client;
}

/**
 * Back-compat export that looks like a Supabase client, but resolves lazily.
 * Accessing any property/method will initialize (or throw if misconfigured).
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, _receiver) {
    return (ensureSupabase() as any)[prop];
  },
  apply(_target, thisArg, argArray) {
    return (ensureSupabase() as any).apply(thisArg, argArray);
  },
}) as SupabaseClient;
