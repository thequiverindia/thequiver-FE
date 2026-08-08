import { getPayload } from 'payload';
import config from '@payload-config';
import { rateLimit, clientIp } from '@/lib/rate-limit';

/**
 * View counting.
 *
 * Deliberately simple and cheap:
 *  - fire-and-forget from the client after the article renders
 *  - writes are BUFFERED in memory and flushed in batches, so a busy article
 *    costs one UPDATE every few seconds instead of one per reader
 *  - never revalidates caches (a view must not regenerate the page)
 *
 * Without this, `views` stays 0 forever and "Most read" can only ever show
 * whatever was seeded.
 */
const buffer = new Map<number, number>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_MS = 10_000;

async function flush() {
  flushTimer = null;
  if (buffer.size === 0) return;
  const batch = [...buffer.entries()];
  buffer.clear();
  try {
    const payload = await getPayload({ config });
    for (const [id, n] of batch) {
      const doc = await payload
        .findByID({ collection: 'articles', id, depth: 0 })
        .catch(() => null);
      if (!doc) continue;
      await payload
        .update({
          collection: 'articles',
          id,
          data: { views: (doc.views ?? 0) + n },
          context: { disableRevalidate: true },
        })
        .catch(() => null);
    }
  } catch (e) {
    console.error('[views] flush failed', e);
  }
}

export async function POST(req: Request) {
  // Generous: this is analytics, not a write the reader depends on.
  if (!rateLimit(`view:${clientIp(req)}`, 60, 60_000)) {
    return Response.json({ ok: true });
  }
  const body = (await req.json().catch(() => null)) as { article?: number | string } | null;
  const id = Number(body?.article);
  if (!Number.isInteger(id) || id <= 0 || id > 2_147_483_647) {
    return Response.json({ ok: true });
  }

  buffer.set(id, (buffer.get(id) ?? 0) + 1);
  if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_MS);

  return Response.json({ ok: true });
}
