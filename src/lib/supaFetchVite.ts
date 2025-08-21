const BASE = import.meta.env.VITE_SUPABASE_FUNCTIONS_BASE
  ?? "https://huebxglhbenulbcftzdq.functions.supabase.co/functions/v1";
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export async function supaFetch<T=unknown>(path: string, init: RequestInit = {}): Promise<T> {
  if (!ANON) throw new Error("VITE_SUPABASE_ANON_KEY missing");
  const url = path.startsWith("http") ? path : `${BASE}/${path}`;
  const headers = {
    ...(init.headers || {}),
    apikey: ANON,
    Authorization: `Bearer ${ANON}`,
  } as HeadersInit;

  const res = await fetch(url, { ...init, headers, cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.headers.get("content-type")?.includes("json")
    ? (await res.json() as T)
    : (await res.text() as unknown as T);
}