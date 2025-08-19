import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getEnv() {
  const url = import.meta.env?.VITE_SUPABASE_URL as string | undefined;
  const anon = import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined;
  const mode = (import.meta as any)?.env?.MODE ?? process.env.NODE_ENV;
  return { url, anon, mode };
}

let _client: SupabaseClient | null = null;

/** Lazily returns a Supabase client.
 * - In test mode, falls back to placeholders if env missing.
 * - Otherwise, throws exactly 'Supabase not configured' if missing.
 */
export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  let { url, anon, mode } = getEnv();

  const isTest = String(mode).toLowerCase() === "test";
  if ((!url || !anon) && isTest) {
    // test-safe placeholders; lets tests run without real env
    url = "http://localhost:54321";
    anon = "test-anon-key";
  }

  if (!url || !anon) {
    throw new Error("Supabase not configured");
  }
  _client = createClient(url, anon);
  return _client;
}

/** Back-compat alias */
export function ensureSupabase(): SupabaseClient {
  return getSupabase();
}

/**
 * Invoke a Supabase Edge Function by name, optionally with a JSON body.
 * - Honors a test override: (globalThis as any).getSupabase
 * - Throws exactly 'Supabase not configured' if client unavailable.
 */
export async function invokeFn<T = unknown>(
  name: string,
  body?: unknown
): Promise<T> {
  const override = (globalThis as any)?.getSupabase as (() => SupabaseClient | null | undefined) | undefined;
  const client = (override?.() ?? (() => {
    try { return getSupabase(); } catch { return null; }
  })());

  if (!client) {
    throw new Error("Supabase not configured");
  }

  const opts = body === undefined ? undefined : { body };
  const { data, error } = await client.functions.invoke<T>(name, opts as any);
  if (error) throw error;
  return data as T;
}

/** Proxy that initializes on first property access. */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_t, p) { return (getSupabase() as any)[p]; },
  apply(_t, thisArg, args) { return (getSupabase() as any).apply(thisArg, args); },
}) as SupabaseClient;
