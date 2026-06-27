import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import type { Poll } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';

export function PollCard({
  poll,
  variant = 'standard',
  showResults = false,
  className,
}: {
  poll: Poll;
  variant?: 'standard' | 'inline';
  showResults?: boolean;
  className?: string;
}) {
  const top = [...poll.options].sort((a, b) => b.votes - a.votes)[0];

  if (variant === 'inline') {
    return (
      <Link
        href={`/polls/${poll.slug}`}
        className={cn(
          'block rounded-xl border border-line bg-bg p-5 transition hover:border-line-strong',
          className,
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
          Daily Poll
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
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
          Live Poll · {poll.category}
        </span>
        <span className="text-xs text-ink-muted">
          {formatNumber(poll.totalVotes)} votes
        </span>
      </div>
      <Link href={`/polls/${poll.slug}`}>
        <h3 className="mt-3 text-balance font-serif text-lg font-semibold leading-snug text-ink hover:text-brand md:text-xl">
          {poll.question}
        </h3>
      </Link>
      {poll.description && (
        <p className="mt-2 text-sm text-ink-muted">{poll.description}</p>
      )}

      {showResults ? (
        <div className="mt-5 space-y-3">
          {poll.options
            .slice()
            .sort((a, b) => b.votes - a.votes)
            .map((opt) => {
              const pct = ((opt.votes / poll.totalVotes) * 100).toFixed(1);
              const isTop = opt.id === top.id;
              return (
                <div key={opt.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                      {isTop && <CheckCircle className="h-3.5 w-3.5 text-verified" />}
                      {opt.label}
                    </span>
                    <span className="text-ink-muted">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: opt.color ?? '#1E1B4B',
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {poll.options.map((opt) => (
            <Link
              key={opt.id}
              href={`/polls/${poll.slug}?vote=${opt.id}`}
              className="block rounded-lg border border-line px-4 py-3 text-sm font-medium text-ink transition hover:border-ink hover:bg-bg-muted"
            >
              {opt.label}
            </Link>
          ))}
        </div>
      )}

      <Link
        href={`/polls/${poll.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink"
      >
        See full results →
      </Link>
    </article>
  );
}
