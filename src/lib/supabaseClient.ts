import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

type EnvShape = { url?: string; anon?: string } | null;

let _client: SupabaseClient | null = null;
let _env: EnvShape = null;

// Read env for both Vite and Node/vitest
function readEnv(): EnvShape {
  if (_env) return _env;
  const viteEnv = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
  const url = viteEnv.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? _env?.url;
  const anon = viteEnv.VITE_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? _env?.anon;
  return { url, anon };
}

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const { url, anon } = readEnv() || {};
  if (!url || !anon) return null;
  _client = createClient(url, anon, {
    db: { schema: "app" },
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _client;
}

export async function invokeFn<T = unknown>(name: string, body?: unknown): Promise<T> {
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured (missing envs).");
  const opts = body === undefined ? undefined : { body };
  const { data, error } = await client.functions.invoke<T>(name, opts as any);
  if (error) throw error;
  return data as T;
}

// Test helpers
export function __setClientForTests(client: SupabaseClient | null) {
  _client = client;
}
export function __setEnvForTests(env: EnvShape) {
  _env = env;
  _client = null; // reset so next getSupabase() re-evaluates
}

// Optional compatibility export
export const supabase = getSupabase();
export default getSupabase;