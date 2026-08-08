import { revalidateTag } from 'next/cache';
import { getPayload } from 'payload';
import config from '@payload-config';
import { getReaderId } from '@/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';

/**
 * Cast a vote. Body: { poll: id, optionId: string }.
 *
 * One vote per reader per poll, enforced by the UNIQUE index on
 * (reader, poll) — the pre-check below is only a fast path, the index is the
 * real guarantee, so a lost race surfaces as a clean 409 rather than a 500.
 *
 * Tallies are recomputed by COUNTING the vote rows rather than incrementing
 * the previous value. Incrementing a stale read loses votes when two people
 * vote at once; counting is idempotent and self-healing.
 */
export async function POST(req: Request) {
  const readerId = await getReaderId();
  if (!readerId) return Response.json({ error: 'Sign in to vote' }, { status: 401 });
  if (!rateLimit(`vote:${readerId}`, 10, 60_000)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as
    | { poll?: number | string; optionId?: string }
    | null;
  const pollId = Number(body?.poll);
  const optionId = typeof body?.optionId === 'string' ? body.optionId : '';
  if (!Number.isInteger(pollId) || pollId <= 0 || !optionId) {
    return Response.json({ error: 'poll and optionId required' }, { status: 400 });
  }

  try {
    const payload = await getPayload({ config });
    const poll = await payload
      .findByID({ collection: 'polls', id: pollId, depth: 0 })
      .catch(() => null);
    if (!poll) return Response.json({ error: 'Poll not found' }, { status: 404 });
    if (new Date(poll.endsAt) < new Date()) {
      return Response.json({ error: 'This poll has closed' }, { status: 400 });
    }
    if (!(poll.options ?? []).some((o) => o.id === optionId)) {
      return Response.json({ error: 'Invalid option' }, { status: 400 });
    }

    // Fast path: already voted?
    const already = await payload.find({
      collection: 'poll-votes',
      where: { and: [{ reader: { equals: readerId } }, { poll: { equals: pollId } }] },
      limit: 1,
      depth: 0,
    });
    if (already.totalDocs > 0) {
      return Response.json({ error: 'You have already voted in this poll' }, { status: 409 });
    }

    try {
      await payload.create({
        collection: 'poll-votes',
        data: { poll: pollId, reader: readerId, optionId },
      });
    } catch (e) {
      // Lost the race against the unique index — that's a duplicate, not a fault.
      const msg = e instanceof Error ? e.message : '';
      if (/unique|duplicate/i.test(msg)) {
        return Response.json(
          { error: 'You have already voted in this poll' },
          { status: 409 },
        );
      }
      throw e;
    }

    // Recount from the source of truth so concurrent votes can't be lost.
    const counts = await Promise.all(
      (poll.options ?? []).map(async (o) => ({
        id: o.id,
        n: (
          await payload.count({
            collection: 'poll-votes',
            where: {
              and: [{ poll: { equals: pollId } }, { optionId: { equals: o.id } }],
            },
          })
        ).totalDocs,
      })),
    );
    const total = counts.reduce((s, c) => s + c.n, 0);

    await payload.update({
      collection: 'polls',
      id: pollId,
      data: {
        options: (poll.options ?? []).map((o) => ({
          ...o,
          votes: counts.find((c) => c.id === o.id)?.n ?? o.votes ?? 0,
        })),
        totalVotes: total,
      },
      context: { disableRevalidate: true },
    });

    revalidateTag('polls');
    return Response.json({ ok: true, optionId });
  } catch (e) {
    console.error('[polls/vote] failed', e);
    return Response.json({ error: 'Could not record your vote' }, { status: 500 });
  }
}
