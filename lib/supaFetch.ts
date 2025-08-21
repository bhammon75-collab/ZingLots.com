const BASE = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_BASE!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Json = Record<string, unknown> | unknown[];

export async function supaFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE}/${path}`;
  const headers: HeadersInit = {
    ...(init.headers || {}),
    apikey: ANON,
    Authorization: `Bearer ${ANON}`,
  };

  const res = await fetch(url, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const ct = res.headers.get("content-type") || "";
  return (ct.includes("application/json") ? res.json() : res.text()) as Promise<T>;
}