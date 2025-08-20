import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Lazy Supabase client for the browser (Vite).
 * - Safe in tests: returns null if envs are missing.
 * - Targets the `app` schema by default.
 */
let _client: SupabaseClient | null = null;
let _envOverride: { url?: string; anon?: string } | null = null;

/** Test-only: override env seen by getSupabase() */
export function __setEnvForTests(env: { url?: string; anon?: string } | null) {
  _envOverride = env;
  _client = null;
}

/** Test-only: inject a fake client / reset */
export function __setClientForTests(client: SupabaseClient | null) {
  _client = client;
}

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;

  const url  = (_envOverride?.url  ?? (import.meta as any)?.env?.VITE_SUPABASE_URL);
  const anon = (_envOverride?.anon ?? (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY);

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
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured (missing envs).");

  const opts = body === undefined ? undefined : { body };
  const { data, error } = await client.functions.invoke(name, opts as any);

  if (error) {
    const msg = (error as any)?.message ?? String(error);
    throw new Error(msg);
  }

  return data as T;
}
