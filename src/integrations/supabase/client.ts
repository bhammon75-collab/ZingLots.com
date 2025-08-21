import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Read env in both Vite (browser) and test/CI.
 */
function readEnv() {
  // Vite injects import.meta.env.* at build time
  // @ts-expect-error - import.meta may not exist in tests
  const viteEnv = typeof import.meta !== "undefined" ? (import.meta as any).env : undefined;

  const url =
    viteEnv?.VITE_SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL;

  const anon =
    viteEnv?.VITE_SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY;

  return { url, anon };
}

let _client: SupabaseClient | null = null;

/**
 * Lazy singleton. Returns null if envs are missing (keeps tests/CI from crashing).
 */
export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;

  const { url, anon } = readEnv();
  if (!url || !anon) return null;

  _client = createClient(url, anon, {
    db: { schema: "app" },
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _client;
}

/**
 * Convenience helper to invoke Edge Functions with basic error handling.
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

/**
 * Compatibility export for modules that import { supabase } directly.
 * (Will be `null` if envs are not defined; callers should handle that.)
 */
export const supabase = getSupabase();

export default getSupabase;
