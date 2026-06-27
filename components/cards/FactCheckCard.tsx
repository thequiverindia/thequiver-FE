import Link from 'next/link';
import type { FactCheck } from '@/lib/types';
import { cn, formatNumber, timeAgo } from '@/lib/utils';

const ratingMeta: Record<
  FactCheck['rating'],
  { label: string; color: string; bg: string; border: string }
> = {
  true: {
    label: 'True',
    color: '#15803D',
    bg: 'rgba(21,128,61,0.08)',
    border: 'rgba(21,128,61,0.2)',
  },
  'mostly-true': {
    label: 'Mostly True',
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.08)',
    border: 'rgba(22,163,74,0.2)',
  },
  misleading: {
    label: 'Misleading',
    color: '#EA580C',
    bg: 'rgba(234,88,12,0.08)',
    border: 'rgba(234,88,12,0.2)',
  },
  false: {
    label: 'False',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.08)',
    border: 'rgba(220,38,38,0.2)',
  },
  satire: {
    label: 'Satire',
    color: '#737373',
    bg: 'rgba(115,115,115,0.08)',
    border: 'rgba(115,115,115,0.2)',
  },
};

export function FactCheckCard({
  fc,
  variant = 'standard',
  className,
}: {
  fc: FactCheck;
  variant?: 'standard' | 'compact';
  className?: string;
}) {
  const meta = ratingMeta[fc.rating];

  if (variant === 'compact') {
    return (
      <Link
        href={`/fact-check/${fc.slug}`}
        className={cn(
          'group block rounded-lg border border-line bg-bg p-4 transition hover:border-line-strong',
          className,
        )}
      >
        <span
          className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
        >
          {meta.label}
        </span>
        <p className="mt-3 line-clamp-3 text-balance font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-brand">
          "{fc.claim}"
        </p>
        <p className="mt-3 text-xs text-ink-muted">
          {fc.claimant} · {timeAgo(fc.publishedAt)}
        </p>
      </Link>
    );
  }

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-xl border border-line bg-bg transition hover:border-line-strong',
        className,
      )}
    >
      <Link href={`/fact-check/${fc.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-muted">
          <img
            src={fc.image}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span
            className="absolute left-3 top-3 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ color: meta.color, background: meta.bg, borderColor: meta.border, backdropFilter: 'blur(8px)' }}
          >
            {meta.label}
          </span>
        </div>
        <div className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
            Fact Check
          </p>
          <h3 className="mt-2 line-clamp-3 text-balance font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-brand md:text-lg">
            "{fc.claim}"
          </h3>
          <p className="mt-3 text-xs text-ink-muted">
            Claim by {fc.claimant} · {timeAgo(fc.publishedAt)} · {formatNumber(fc.views)} views
          </p>
        </div>
      </Link>
    </article>
  );
}

export { ratingMeta };
