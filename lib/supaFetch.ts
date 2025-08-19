const BASE = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_BASE!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Json = Record<string, unknown> | unknown[];

export async function supaFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : ${BASE}/;
  const headers: HeadersInit = {
    ...(init.headers || {}),
    apikey: ANON,
    Authorization: \Bearer \eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1ZWJ4Z2xoYmVudWxiY2Z0emRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NjQwMjcsImV4cCI6MjA3MDU0MDAyN30.j7GjRfvZbG6RwUPAYbFr1czTzPNISFPubOLK-Ciq2ZU\,
  };

  const res = await fetch(url, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(\HTTP \ – \\);
  }
  const ct = res.headers.get("content-type") || "";
  return (ct.includes("application/json") ? res.json() : res.text()) as Promise<T>;
}