function computeFunctionsBase(): string {
  // @ts-expect-error import.meta may be undefined in some runtimes
  const viteEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  const explicit = viteEnv?.VITE_SUPABASE_FUNCTIONS_BASE as string | undefined;
  if (explicit && explicit.trim()) return explicit;
  const projectUrl = viteEnv?.VITE_SUPABASE_URL as string | undefined;
  if (projectUrl) {
    try {
      const u = new URL(projectUrl);
      const isLocal = /localhost|127\.0\.0\.1/.test(u.hostname);
      if (isLocal) {
        return `${u.origin}/functions/v1`;
      }
      const projectRef = u.hostname.split('.')[0];
      return `https://${projectRef}.functions.supabase.co/functions/v1`;
    } catch {
      // fall through
    }
  }
  // Last resort; may work if reverse-proxied
  return "/functions/v1";
}

const BASE = computeFunctionsBase();
const ANON = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY as string;

export async function supaFetch<T=unknown>(path: string, init: RequestInit = {}): Promise<T> {
  if (!ANON) throw new Error("VITE_SUPABASE_ANON_KEY missing");
  const url = path.startsWith("http") ? path : `${BASE}/${path}`;
  const defaultHeaders = {
    apikey: ANON,
    Authorization: `Bearer ${ANON}`,
  } as HeadersInit;
  // Allow caller to override Authorization/apikey by specifying headers
  const headers = { ...defaultHeaders, ...(init.headers || {}) } as HeadersInit;

  const res = await fetch(url, { ...init, headers, cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.headers.get("content-type")?.includes("json")
    ? (await res.json() as T)
    : (await res.text() as unknown as T);
}