import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase as baseClient } from "@/integrations/supabase/client";

// Test injection hooks (undefined means no override; null means force-null)
let injectedClient: SupabaseClient | null | undefined = undefined;
let _injectedEnv: { url?: string; anon?: string } | null = null;

export function __setClientForTests(client: SupabaseClient | null) {
  injectedClient = client;
}

export function __setEnvForTests(env: { url?: string; anon?: string } | null) {
  _injectedEnv = env;
}

export function getSupabase(): SupabaseClient | null {
  if (injectedClient !== undefined) return injectedClient;
  return (baseClient as unknown as SupabaseClient) || null;
}

export async function invokeFn<T = unknown>(name: string, body?: unknown): Promise<T> {
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured (missing envs).");
  const opts = body === undefined ? undefined : { body };
  const { data, error } = await client.functions.invoke<T>(name, opts as any);
  if (error) throw error;
  return data as T;
}