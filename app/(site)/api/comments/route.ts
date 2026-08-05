import { getPayload } from 'payload';
import config from '@payload-config';
import { getReaderId } from '@/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';

/** List approved comments for an article: /api/comments?article=<id> */
export async function GET(req: Request) {
  const articleId = new URL(req.url).searchParams.get('article');
  if (!articleId) return Response.json({ error: 'article required' }, { status: 400 });
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: 'comments',
    where: {
      and: [{ article: { equals: Number(articleId) } }, { status: { equals: 'approved' } }],
    },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
  });
  return Response.json({
    comments: res.docs.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt,
      reader:
        typeof c.reader === 'object' && c.reader
          ? { name: c.reader.name ?? 'Reader', avatarUrl: c.reader.avatarUrl ?? null }
          : { name: 'Reader', avatarUrl: null },
    })),
  });
}

/** Post a comment (signed-in readers; lands in the moderation queue). */
export async function POST(req: Request) {
  const readerId = await getReaderId();
  if (!readerId) return Response.json({ error: 'Sign in to comment' }, { status: 401 });
  if (!rateLimit(`comment:${readerId}:${clientIp(req)}`, 5, 60_000)) {
    return Response.json({ error: 'Too many comments — slow down a little' }, { status: 429 });
  }

  const payload = await getPayload({ config });
  const body = (await req.json().catch(() => null)) as
    | { article?: number | string; body?: string; website?: string }
    | null;
  // Honeypot: real forms never fill "website".
  if (!body || body.website) return Response.json({ error: 'Invalid request' }, { status: 400 });
  const text = (body.body ?? '').trim();
  if (text.length < 2 || text.length > 2000) {
    return Response.json({ error: 'Comment must be 2–2000 characters' }, { status: 400 });
  }
  const articleId = Number(body.article);
  if (!articleId) return Response.json({ error: 'article required' }, { status: 400 });

  const article = await payload.findByID({
    collection: 'articles',
    id: articleId,
    depth: 0,
  }).catch(() => null);
  if (!article) return Response.json({ error: 'Article not found' }, { status: 404 });

  await payload.create({
    collection: 'comments',
    data: { body: text, article: articleId, reader: readerId, status: 'pending' },
    context: { disableRevalidate: true },
  });
  return Response.json({ ok: true, status: 'pending' });
}
