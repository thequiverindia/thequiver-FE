/**
 * Best-effort rate limiting.
 *
 * Two things this deliberately gets right:
 *
 * 1. The client identifier is NOT taken from the *first* X-Forwarded-For entry.
 *    That entry is supplied by the caller, so a spammer could rotate it and get
 *    a fresh bucket per request. On Vercel the trustworthy value is the
 *    platform header (`x-vercel-forwarded-for`) or the LAST hop of XFF.
 *
 * 2. Buckets are per-instance (serverless), so this is a speed bump, not a
 *    guarantee. The authoritative protections are the DB unique indexes and
 *    comment moderation. Swap in a Redis-backed limiter when there's budget.
 */
const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;
let lastSweep = 0;

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const list = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (list.length >= max) {
    hits.set(key, list);
    return false;
  }
  list.push(now);
  hits.set(key, list);

  // Sweep at most once a minute so a high-cardinality key attack can't turn
  // the cleanup itself into the CPU sink.
  if (hits.size > MAX_KEYS && now - lastSweep > 60_000) {
    lastSweep = now;
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }
  return true;
}

export function clientIp(req: Request): string {
  // Vercel sets this itself and it cannot be spoofed by the caller.
  const vercel = req.headers.get('x-vercel-forwarded-for');
  if (vercel) return vercel.split(',')[0]!.trim();

  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();

  // Fall back to the LAST hop, which is the one our own proxy appended.
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const hops = xff.split(',').map((h) => h.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1]!;
  }
  return 'unknown';
}
