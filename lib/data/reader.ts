/**
 * Per-reader queries — deliberately UNCACHED (each reader sees their own
 * data; caching would leak it between users). Only used on dynamic,
 * session-gated pages.
 */
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Article as PArticle } from '@/payload-types';
import type { Article } from '@/lib/types';
import { mapArticle } from './index';

const db = () => getPayload({ config });

/** pollId -> optionId for everything this reader has voted on. */
export async function getReaderPollVotes(
  readerId: number,
): Promise<Record<string, string>> {
  const payload = await db();
  const res = await payload.find({
    collection: 'poll-votes',
    where: { reader: { equals: readerId } },
    limit: 200,
    depth: 0,
  });
  const map: Record<string, string> = {};
  for (const v of res.docs) {
    map[String(typeof v.poll === 'object' ? v.poll.id : v.poll)] = v.optionId;
  }
  return map;
}

export async function getReaderBookmarkedArticles(readerId: number): Promise<Article[]> {
  const payload = await db();
  const res = await payload.find({
    collection: 'bookmarks',
    where: { reader: { equals: readerId } },
    sort: '-createdAt',
    limit: 100,
    depth: 3,
  });
  return res.docs
    .map((b) => (typeof b.article === 'object' && b.article ? b.article : null))
    .filter((a): a is PArticle => Boolean(a))
    .map((a) => mapArticle(a));
}

export async function getReaderStats(readerId: number) {
  const payload = await db();
  const [bookmarks, comments, votes] = await Promise.all([
    payload.count({ collection: 'bookmarks', where: { reader: { equals: readerId } } }),
    payload.count({ collection: 'comments', where: { reader: { equals: readerId } } }),
    payload.count({ collection: 'poll-votes', where: { reader: { equals: readerId } } }),
  ]);
  return {
    bookmarks: bookmarks.totalDocs,
    comments: comments.totalDocs,
    votes: votes.totalDocs,
  };
}
