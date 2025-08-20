import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Make env lookup work in three places:
 * - Vite browser/runtime:     import.meta.env.VITE_*
 * - CI / Vitest / Node:       process.env.VITE_*
 * - Tests (no env):           safe defaults
 */
const viteEnv: any = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
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
    // don’t touch real browser storage in unit tests
    persistSession: !isTest,
    autoRefreshToken: !isTest,
  },
});

// Optional: factory if some places prefer a getter
export function getSupabase(): SupabaseClient {
  return supabase;
}