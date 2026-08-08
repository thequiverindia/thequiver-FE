import { getPayload } from 'payload';
import config from '@payload-config';
import { getReaderId } from '@/auth';
import { rateLimit } from '@/lib/rate-limit';

/** Is this article bookmarked by the current reader? /api/bookmarks?article=<id> */
export async function GET(req: Request) {
  const readerId = await getReaderId();
  const articleId = Number(new URL(req.url).searchParams.get('article'));
  if (!readerId || !Number.isInteger(articleId) || articleId <= 0) {
    return Response.json({ bookmarked: false, signedIn: Boolean(readerId) });
  }
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'bookmarks',
      where: { and: [{ reader: { equals: readerId } }, { article: { equals: articleId } }] },
      limit: 1,
      depth: 0,
    });
    return Response.json({ bookmarked: res.totalDocs > 0, signedIn: true });
  } catch (e) {
    console.error('[bookmarks] GET failed', e);
    return Response.json({ bookmarked: false, signedIn: true });
  }
}

/** Toggle a bookmark. Body: { article: id } */
export async function POST(req: Request) {
  const readerId = await getReaderId();
  if (!readerId) return Response.json({ error: 'Sign in to save stories' }, { status: 401 });
  if (!rateLimit(`bookmark:${readerId}`, 30, 60_000)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as { article?: number | string } | null;
  const articleId = Number(body?.article);
  // Guard the range too: a huge number reaches Postgres and errors as int overflow.
  if (!Number.isInteger(articleId) || articleId <= 0 || articleId > 2_147_483_647) {
    return Response.json({ error: 'A valid article is required' }, { status: 400 });
  }

  try {
    const payload = await getPayload({ config });

    // The article must exist, or the insert dies on a foreign-key error.
    const article = await payload
      .findByID({ collection: 'articles', id: articleId, depth: 0 })
      .catch(() => null);
    if (!article) return Response.json({ error: 'Article not found' }, { status: 404 });

    const existing = await payload.find({
      collection: 'bookmarks',
      where: { and: [{ reader: { equals: readerId } }, { article: { equals: articleId } }] },
      limit: 1,
      depth: 0,
    });

    if (existing.docs[0]) {
      // A double-click can delete the same row twice — treat "already gone" as success.
      await payload
        .delete({ collection: 'bookmarks', id: existing.docs[0].id })
        .catch(() => null);
      return Response.json({ bookmarked: false });
    }

    try {
      await payload.create({
        collection: 'bookmarks',
        data: { reader: readerId, article: articleId },
      });
    } catch (e) {
      // Lost the race against the unique index — the bookmark exists, which is
      // exactly what the caller asked for.
      const msg = e instanceof Error ? e.message : '';
      if (!/unique|duplicate/i.test(msg)) throw e;
    }
    return Response.json({ bookmarked: true });
  } catch (e) {
    console.error('[bookmarks] POST failed', e);
    return Response.json({ error: 'Could not update your bookmark' }, { status: 500 });
  }
}
