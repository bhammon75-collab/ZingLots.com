import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Lazy Supabase client for the browser (Vite).
 * - Safe in tests: returns null if envs are missing.
 * - Targets the `app` schema by default.
 */
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;

  const url = import.meta.env?.VITE_SUPABASE_URL as string | undefined;
  const anon = import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anon) {
    // Don't throw at import time — callers already guard against null
    return null;
  }

  _client = createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true },
    db: { schema: "app" },
  });
  return _client;
}

/**
 * Small helper to call Edge Functions with basic error handling.
 * Tests mock this in `src/__tests__/supabaseClient.test.ts`.
 */
export async function invokeFn<T = unknown, B = unknown>(
  name: string,
  body?: B
): Promise<T> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured (missing envs).");
  const { data, error } = await sb.functions.invoke(name, { body });
  if (error) throw error;
  return data as T;
}