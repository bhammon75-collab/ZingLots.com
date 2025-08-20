import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Read env from either Vite or Node (CI).
 */
function readEnv(key: string): string | undefined {
  try {
    // @ts-ignore – present in vite/vitest
    if (typeof import.meta !== "undefined" && import.meta.env && key in import.meta.env) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch {}
  return process.env?.[key];
}

const URL  = readEnv("VITE_SUPABASE_URL");
const ANON = readEnv("VITE_SUPABASE_ANON_KEY");

let _client: SupabaseClient | null = null;

/**
 * Lazily create the client iff env is present.
 * In CI (no env), this stays null and callers should handle it.
 */
export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  if (!URL || !ANON) return null;

  _client = createClient(URL, ANON, {
    auth: {
      // Safer for tests/SSR
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return _client;
}

/**
 * Helper to invoke an Edge Function with nice errors.
 */
export async function invokeFn<T = unknown>(name: string, body?: unknown): Promise<T> {
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured");
  const { data, error } = await client.functions.invoke(name, body ? { body } : undefined);
  if (error) throw error;
  return data as T;
}

/**
 * Optional: a lazy proxy for existing imports like `import { supabase } ...`
 * Accessing any property will resolve the real client or throw an explicit error.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const c = getSupabase();
    if (!c) throw new Error("Supabase not configured");
    // @ts-ignore
    const value = c[prop];
    return typeof value === "function" ? value.bind(c) : value;
  },
}) as SupabaseClient;