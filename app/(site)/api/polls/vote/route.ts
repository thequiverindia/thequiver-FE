import { revalidateTag } from 'next/cache';
import { getPayload } from 'payload';
import config from '@payload-config';
import { getReaderId } from '@/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';

/** Cast a vote. Body: { poll: id, optionId: string }. One vote per reader per poll. */
export async function POST(req: Request) {
  const readerId = await getReaderId();
  if (!readerId) return Response.json({ error: 'Sign in to vote' }, { status: 401 });
  if (!rateLimit(`vote:${readerId}:${clientIp(req)}`, 10, 60_000)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as
    | { poll?: number | string; optionId?: string }
    | null;
  const pollId = Number(body?.poll);
  const optionId = body?.optionId;
  if (!pollId || !optionId) return Response.json({ error: 'poll and optionId required' }, { status: 400 });

  const payload = await getPayload({ config });
  const poll = await payload.findByID({ collection: 'polls', id: pollId, depth: 0 }).catch(() => null);
  if (!poll) return Response.json({ error: 'Poll not found' }, { status: 404 });
  if (new Date(poll.endsAt) < new Date()) {
    return Response.json({ error: 'This poll has closed' }, { status: 400 });
  }
  const option = (poll.options ?? []).find((o) => o.id === optionId);
  if (!option) return Response.json({ error: 'Invalid option' }, { status: 400 });

  const already = await payload.find({
    collection: 'poll-votes',
    where: { and: [{ reader: { equals: readerId } }, { poll: { equals: pollId } }] },
    limit: 1,
    depth: 0,
  });
  if (already.totalDocs > 0) {
    return Response.json({ error: 'You have already voted in this poll' }, { status: 409 });
  }

  await payload.create({
    collection: 'poll-votes',
    data: { poll: pollId, reader: readerId, optionId },
  });
  await payload.update({
    collection: 'polls',
    id: pollId,
    data: {
      options: (poll.options ?? []).map((o) =>
        o.id === optionId ? { ...o, votes: (o.votes ?? 0) + 1 } : o,
      ),
      totalVotes: (poll.totalVotes ?? 0) + 1,
    },
    context: { disableRevalidate: true },
  });
  revalidateTag('polls');
  return Response.json({ ok: true, optionId });
}
