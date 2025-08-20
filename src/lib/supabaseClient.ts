import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase as baseClient } from "@/integrations/supabase/client";

const singletonClient: SupabaseClient | null = baseClient as SupabaseClient;

export function getSupabase(): SupabaseClient | null {
  return singletonClient;
}

export async function invokeFn<T = unknown>(name: string, body?: unknown): Promise<T> {
  const client = getSupabase();
  if (!client) throw new Error("Supabase not configured");
  const { data, error } = await client.functions.invoke<T>(name, { body });
  if (error) throw error;
  return data as T;
}