import { MessageSquare, ThumbsUp } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { MockForm } from '@/components/ui/MockForm';

const MOCK_COMMENTS = [
  {
    id: 'c1',
    user: 'Anjali Subramaniam',
    role: 'Reader · Bengaluru',
    when: '2h ago',
    likes: 47,
    text:
      'The point on the electoral trust loophole is exactly what was missing from yesterday\'s coverage elsewhere. Thank you for catching it.',
  },
  {
    id: 'c2',
    user: 'Mukesh Pandey',
    role: 'Reader · Lucknow',
    when: '4h ago',
    likes: 31,
    text:
      'I disagree with the framing. The 14-day window IS a real change — saying "the most important thing is what stays the same" feels uncharitable.',
  },
  {
    id: 'c3',
    user: 'Reema Thomas',
    role: 'Member · Kochi',
    when: '6h ago',
    likes: 22,
    text:
      'Would be great to see a follow-up comparing this with the German party financing framework. The principles are similar.',
  },
];

export function CommentSection({ articleId }: { articleId: string }) {
  return (
    <section id="comments" className="mt-16 border-t border-line pt-12">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Reader response
        </h2>
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <MessageSquare className="h-3.5 w-3.5" />
          {MOCK_COMMENTS.length} comments
        </span>
      </div>
      <MockForm
        className="mt-6 rounded-xl border border-line bg-bg-subtle p-5"
      >
        <p className="text-sm font-medium text-ink">Add your perspective</p>
        <p className="mt-1 text-xs text-ink-muted">
          Comments are moderated. Be specific. Disagreement welcome — name-calling isn't.
        </p>
        <textarea
          rows={3}
          placeholder="What does this article get right, or get wrong?"
          className="mt-4 w-full rounded-lg border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-subtle focus-ring"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-ink-muted">
            Comments are limited to verified readers.{' '}
            <a href="/login" className="text-ink underline">
              Sign in
            </a>
          </span>
          <button
            type="submit"
            className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-bg hover:bg-ink/90"
          >
            Post comment
          </button>
        </div>
      </MockForm>
      <ul className="mt-10 divide-y divide-line">
        {MOCK_COMMENTS.map((c) => (
          <li key={c.id} className="flex gap-4 py-6">
            <Avatar name={c.user} size="md" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink">
                {c.user}{' '}
                <span className="ml-1 text-xs font-normal text-ink-muted">
                  {c.role} · {c.when}
                </span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{c.text}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-ink-muted">
                <button className="inline-flex items-center gap-1 hover:text-ink">
                  <ThumbsUp className="h-3 w-3" />
                  {c.likes}
                </button>
                <button className="hover:text-ink">Reply</button>
                <button className="hover:text-ink">Report</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
