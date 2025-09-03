export function checkOrigin(req: Request, site: string | null): Response | null {
  if (!site) return null;
  const origin = req.headers.get('origin') || '';
  if (origin && !origin.startsWith(site)) {
    return new Response(JSON.stringify({ error: 'Forbidden origin' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }
  return null;
}

// Simple in-memory rate limiter per function instance (replace with KV/DB in prod)
// key: string => timestamps
const bucket = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = bucket.get(key) || [];
  const recent = arr.filter(ts => now - ts < windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  bucket.set(key, recent);
  return true;
}

export function requireAuth(req: Request): string | null {
  const jwt = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || null;
  return jwt; // In real impl, verify and return user id/claims
}

const idem = new Map<string, number>();
export function idempotencyAccept(key: string, ttlMs: number): boolean {
  if (!key) return true;
  const now = Date.now();
  const ts = idem.get(key) || 0;
  if (now - ts < ttlMs) return false;
  idem.set(key, now);
  return true;
}

