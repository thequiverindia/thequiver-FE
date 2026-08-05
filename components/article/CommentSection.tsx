import { MessageSquare } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';
import config from '@payload-config';
import { CommentForm } from '@/components/engagement/CommentForm';
import { timeAgo } from '@/lib/utils';

const getApprovedComments = unstable_cache(
  async (articleId: string) => {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'comments',
      where: {
        and: [
          { article: { equals: Number(articleId) } },
          { status: { equals: 'approved' } },
        ],
      },
      sort: '-createdAt',
      limit: 50,
      depth: 1,
    });
    return res.docs.map((c) => ({
      id: String(c.id),
      body: c.body,
      createdAt: c.createdAt,
      name:
        typeof c.reader === 'object' && c.reader ? c.reader.name ?? 'Reader' : 'Reader',
      avatarUrl:
        typeof c.reader === 'object' && c.reader ? c.reader.avatarUrl ?? null : null,
    }));
  },
  ['approved-comments'],
  { tags: ['comments'] },
);

/** Real reader comments: approved list + moderated submission form. */
export async function CommentSection({ articleId }: { articleId: string }) {
  const comments = await getApprovedComments(articleId);

  return (
    <section id="comments" className="mt-16 border-t border-line pt-10">
      <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-ink">
        <MessageSquare className="h-5 w-5 text-ink-muted" aria-hidden />
        {comments.length === 0
          ? 'Join the discussion'
          : `${comments.length} comment${comments.length === 1 ? '' : 's'}`}
      </h2>

      <CommentForm articleId={articleId} />

      {comments.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-line bg-bg-subtle p-6 text-center text-sm text-ink-muted">
          No comments yet — be the first to weigh in.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-muted text-xs font-medium text-ink-muted ring-1 ring-line">
                {c.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  (c.name ?? 'R').slice(0, 1).toUpperCase()
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium text-ink">{c.name}</span>{' '}
                  <span className="text-xs text-ink-subtle">
                    · <time dateTime={c.createdAt}>{timeAgo(c.createdAt)}</time>
                  </span>
                </p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                  {c.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
