import Link from 'next/link';
import type { Poll } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';
import { PollVoting } from '@/components/engagement/PollVoting';

export function PollCard({
  poll,
  variant = 'standard',
  votedOptionId = null,
  signedIn = false,
  className,
}: {
  poll: Poll;
  variant?: 'standard' | 'inline';
  /** The current reader's vote (pass from a session-aware page). */
  votedOptionId?: string | null;
  /** Whether a reader session exists (pass from a session-aware page). */
  signedIn?: boolean;
  className?: string;
}) {
  const top = [...poll.options].sort((a, b) => b.votes - a.votes)[0];

  if (variant === 'inline') {
    return (
      <Link
        href={`/polls/${poll.slug}`}
        className={cn(
          'block rounded-xl border border-line bg-bg p-5 transition hover:border-line-strong focus-ring',
          className,
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
          Reader Poll
        </p>
        <h4 className="mt-2 text-balance font-serif text-base font-semibold leading-snug text-ink">
          {poll.question}
        </h4>
        <p className="mt-3 text-xs text-ink-muted">
          {formatNumber(poll.totalVotes)} votes · Leading: {top.label}
        </p>
      </Link>
    );
  }

  return (
    <article
      className={cn(
        'rounded-2xl border border-line bg-bg p-6 transition hover:border-line-strong',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
          Reader Poll · {poll.category}
        </span>
        <span className="text-xs text-ink-muted">
          {formatNumber(poll.totalVotes)} votes
        </span>
      </div>
      <Link href={`/polls/${poll.slug}`} className="focus-ring block rounded-sm">
        <h3 className="mt-3 text-balance font-serif text-lg font-semibold leading-snug text-ink hover:text-brand md:text-xl">
          {poll.question}
        </h3>
      </Link>
      {poll.description && (
        <p className="mt-2 text-sm text-ink-muted">{poll.description}</p>
      )}

      <div className="mt-5">
        <PollVoting poll={poll} votedOptionId={votedOptionId} signedIn={signedIn} />
      </div>

      <Link
        href={`/polls/${poll.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink"
      >
        See full results →
      </Link>
    </article>
  );
}
