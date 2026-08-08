import { getPayload } from 'payload';
import config from '@payload-config';
import { rateLimit, clientIp } from '@/lib/rate-limit';

/** Join the newsletter waitlist (store-only — nothing is sent in v1). */
export async function POST(req: Request) {
  if (!rateLimit(`waitlist:${clientIp(req)}`, 5, 60_000)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }
  const body = (await req.json().catch(() => null)) as
    | { email?: string; source?: string; website?: string }
    | null;
  if (!body || body.website) return Response.json({ error: 'Invalid request' }, { status: 400 });
  const email = (body.email ?? '').trim().toLowerCase();
  // Length cap matters: the regex alone accepts a megabyte-long "address".
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return Response.json({ error: 'Enter a valid email address' }, { status: 400 });
  }

  try {
    const payload = await getPayload({ config });
    const existing = await payload.find({
      collection: 'waitlist',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    });
    if (existing.totalDocs === 0) {
      try {
        await payload.create({
          collection: 'waitlist',
          data: { email, source: (body.source ?? 'site').slice(0, 40) },
        });
      } catch (e) {
        // Two identical submits race the unique index — "already on the list"
        // is the outcome the caller wanted, so don't turn it into a 500.
        const msg = e instanceof Error ? e.message : '';
        if (!/unique|duplicate/i.test(msg)) throw e;
      }
    }
    // Same response either way — no leaking who is already subscribed.
    return Response.json({ ok: true });
  } catch (e) {
    console.error('[waitlist] failed', e);
    return Response.json({ error: 'Could not save your email' }, { status: 500 });
  }
}
