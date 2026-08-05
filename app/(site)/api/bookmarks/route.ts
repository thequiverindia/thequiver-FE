import { getPayload } from 'payload';
import config from '@payload-config';
import { getReaderId } from '@/auth';

/** Is this article bookmarked by the current reader? /api/bookmarks?article=<id> */
export async function GET(req: Request) {
  const readerId = await getReaderId();
  const articleId = Number(new URL(req.url).searchParams.get('article'));
  if (!readerId || !articleId) return Response.json({ bookmarked: false, signedIn: !!readerId });
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: 'bookmarks',
    where: { and: [{ reader: { equals: readerId } }, { article: { equals: articleId } }] },
    limit: 1,
    depth: 0,
  });
  return Response.json({ bookmarked: res.totalDocs > 0, signedIn: true });
}

/** Toggle a bookmark. Body: { article: id } */
export async function POST(req: Request) {
  const readerId = await getReaderId();
  if (!readerId) return Response.json({ error: 'Sign in to save stories' }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { article?: number | string } | null;
  const articleId = Number(body?.article);
  if (!articleId) return Response.json({ error: 'article required' }, { status: 400 });

  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: 'bookmarks',
    where: { and: [{ reader: { equals: readerId } }, { article: { equals: articleId } }] },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) {
    await payload.delete({ collection: 'bookmarks', id: existing.docs[0].id });
    return Response.json({ bookmarked: false });
  }
  await payload.create({
    collection: 'bookmarks',
    data: { reader: readerId, article: articleId },
  });
  return Response.json({ bookmarked: true });
}
