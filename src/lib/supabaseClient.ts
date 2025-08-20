import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const viteEnv: any =
  (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";

const supabaseUrl =
  viteEnv.VITE_SUPABASE_URL ||
  (typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : undefined) ||
  (isTest ? "https://test.supabase.local" : "");

const supabaseAnonKey =
  viteEnv.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== "undefined" ? process.env.VITE_SUPABASE_ANON_KEY : undefined) ||
  (isTest ? "test-anon-key" : "");

if (!supabaseUrl) throw new Error("supabaseUrl is required");
if (!supabaseAnonKey) throw new Error("supabaseAnonKey is required");

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: !isTest,
    autoRefreshToken: !isTest,
  },
});

export function getSupabase(): SupabaseClient {
  return supabase;
}

/**
 * Convenience helper for invoking Edge Functions.
 * Throws if Supabase is not configured, or if the function returns an error.
 */
export async function invokeFn<T = unknown>(
  fnName: string,
  body?: unknown
): Promise<T> {
  const get = (globalThis as any).getSupabase ?? getSupabase;
  const client: SupabaseClient | null | undefined = get();
  if (!client) throw new Error("Supabase not configured");

  const { data, error } = await client.functions.invoke<T>(
    fnName,
    body !== undefined ? { body } : undefined
  );
  if (error) throw error as Error;
  return data as T;
}