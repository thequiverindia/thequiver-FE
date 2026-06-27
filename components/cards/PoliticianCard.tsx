import Link from 'next/link';
import { Star, Users } from 'lucide-react';
import type { Politician } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

export function PoliticianCard({
  politician,
  variant = 'standard',
  className,
}: {
  politician: Politician;
  variant?: 'standard' | 'compact' | 'wide';
  className?: string;
}) {
  const href = `/leader/${politician.slug}`;
  const promiseStats = {
    kept: politician.promises.filter((p) => p.status === 'kept').length,
    progress: politician.promises.filter((p) => p.status === 'in-progress').length,
    broken: politician.promises.filter((p) => p.status === 'broken').length,
  };
  const total = politician.promises.length;

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className={cn(
          'group flex items-center gap-3 rounded-lg border border-line bg-bg p-3 transition hover:border-line-strong',
          className,
        )}
      >
        <Avatar src={politician.image} name={politician.name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-sm font-semibold text-ink">
            {politician.name}
          </p>
          <p className="truncate text-xs text-ink-muted">
            <span style={{ color: politician.partyColor }}>●</span> {politician.partyShort} ·{' '}
            {politician.constituency}
          </p>
        </div>
        <div className="text-right">
          <p className="font-serif text-sm font-semibold text-ink">{politician.rating}</p>
          <p className="text-[10px] uppercase tracking-wider text-ink-subtle">rating</p>
        </div>
      </Link>
    );
  }

  if (variant === 'wide') {
    return (
      <Link
        href={href}
        className={cn(
          'group block overflow-hidden rounded-xl border border-line bg-bg transition hover:border-line-strong',
          className,
        )}
      >
        <div
          className="h-2 w-full"
          style={{ background: politician.partyColor }}
          aria-hidden
        />
        <div className="flex gap-5 p-5">
          <Avatar src={politician.image} name={politician.name} size="xl" />
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: politician.partyColor }}
            >
              {politician.partyShort}
            </p>
            <h3 className="mt-1 font-serif text-lg font-semibold text-ink transition group-hover:text-brand">
              {politician.name}
            </h3>
            <p className="text-xs text-ink-muted">
              {politician.position} · {politician.constituency}
            </p>
            <div className="mt-4 flex items-center gap-5 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3 w-3 text-saffron" />
                <strong className="text-ink">{politician.rating}</strong> /10
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3 w-3" />
                {formatNumber(politician.followers)} following
              </span>
            </div>
            <div className="mt-3">
              <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-subtle">
                Promises ({total})
              </p>
              <PromiseBar stats={promiseStats} total={total} />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // standard
  return (
    <Link
      href={href}
      className={cn(
        'group block overflow-hidden rounded-xl border border-line bg-bg transition hover:border-line-strong',
        className,
      )}
    >
      <div className="h-1.5 w-full" style={{ background: politician.partyColor }} aria-hidden />
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar src={politician.image} name={politician.name} size="lg" />
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: politician.partyColor }}
            >
              {politician.partyShort}
            </p>
            <h3 className="mt-1 truncate font-serif text-lg font-semibold text-ink transition group-hover:text-brand">
              {politician.name}
            </h3>
            <p className="truncate text-xs text-ink-muted">
              {politician.constituency}, {politician.state}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
          <div>
            <p className="font-serif text-lg font-semibold text-ink">{politician.rating}</p>
            <p className="text-[10px] uppercase tracking-wider text-ink-subtle">Rating</p>
          </div>
          <div>
            <p className="font-serif text-lg font-semibold text-ink">
              {formatNumber(politician.followers)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-ink-subtle">Followers</p>
          </div>
          <div>
            <p className="font-serif text-lg font-semibold text-ink">
              {promiseStats.kept}/{total}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-ink-subtle">Kept</p>
          </div>
        </div>
        <div className="mt-3">
          <PromiseBar stats={promiseStats} total={total} />
        </div>
      </div>
    </Link>
  );
}

function PromiseBar({
  stats,
  total,
}: {
  stats: { kept: number; progress: number; broken: number };
  total: number;
}) {
  if (total === 0) {
    return <div className="h-1.5 w-full rounded-full bg-bg-muted" />;
  }
  const k = (stats.kept / total) * 100;
  const p = (stats.progress / total) * 100;
  const b = (stats.broken / total) * 100;
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-bg-muted">
      <span style={{ width: `${k}%` }} className="bg-verified" />
      <span style={{ width: `${p}%` }} className="bg-saffron" />
      <span style={{ width: `${b}%` }} className="bg-breaking" />
    </div>
  );
}
