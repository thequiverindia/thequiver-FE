import Link from 'next/link';
import Image from 'next/image';
import type { FactCheck } from '@/lib/types';
import { cn, formatNumber, timeAgo, isUnoptimizableImage } from '@/lib/utils';

/**
 * Rating → token classes. Everything flows through the theme's status ramp
 * so verdicts stay legible in every theme and mode.
 */
const ratingMeta: Record<
  FactCheck['rating'],
  { label: string; text: string; chip: string; panel: string; dot: string }
> = {
  true: {
    label: 'True',
    text: 'text-success',
    chip: 'text-success bg-success/10 border-success/25',
    panel: 'bg-success/5 border-success/30',
    dot: 'bg-success',
  },
  'mostly-true': {
    label: 'Mostly True',
    text: 'text-success',
    chip: 'text-success bg-success/10 border-success/25',
    panel: 'bg-success/5 border-success/30',
    dot: 'bg-success/70',
  },
  misleading: {
    label: 'Misleading',
    text: 'text-warn',
    chip: 'text-warn bg-warn/10 border-warn/25',
    panel: 'bg-warn/5 border-warn/30',
    dot: 'bg-warn',
  },
  false: {
    label: 'False',
    text: 'text-danger',
    chip: 'text-danger bg-danger/10 border-danger/25',
    panel: 'bg-danger/5 border-danger/30',
    dot: 'bg-danger',
  },
  satire: {
    label: 'Satire',
    text: 'text-ink-muted',
    chip: 'text-ink-muted bg-bg-muted border-line-strong',
    panel: 'bg-bg-muted/50 border-line-strong',
    dot: 'bg-ink-subtle',
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
          'group block rounded-lg border border-line bg-bg p-4 transition hover:border-line-strong focus-ring',
          className,
        )}
      >
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
            meta.chip,
          )}
        >
          {meta.label}
        </span>
        <p className="mt-3 line-clamp-3 text-balance font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-brand">
          &ldquo;{fc.claim}&rdquo;
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
      <Link href={`/fact-check/${fc.slug}`} className="block focus-ring">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-muted">
          {fc.image ? (
            <Image
              src={fc.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={isUnoptimizableImage(fc.image)}
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div aria-hidden className="h-full w-full bg-bg-muted" />
          )}
          <span
            className={cn(
              'stamp absolute left-3 top-3 border-2 bg-bg/90 px-2 py-0.5 text-xs backdrop-blur',
              meta.text,
            )}
          >
            {meta.label}
          </span>
        </div>
        <div className="p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
            Fact Check
          </p>
          <h3 className="mt-2 line-clamp-3 text-balance font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-brand md:text-lg">
            &ldquo;{fc.claim}&rdquo;
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
