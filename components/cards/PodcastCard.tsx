import Link from 'next/link';
import { Headphones, Play } from 'lucide-react';
import type { Podcast } from '@/lib/types';
import { cn, formatNumber, timeAgo } from '@/lib/utils';

export function PodcastCard({
  podcast,
  variant = 'standard',
  className,
}: {
  podcast: Podcast;
  variant?: 'standard' | 'inline';
  className?: string;
}) {
  const href = `/podcasts/${podcast.slug}`;

  if (variant === 'inline') {
    return (
      <Link
        href={href}
        className={cn(
          'group flex items-center gap-4 rounded-lg border border-line bg-bg p-3 transition hover:border-line-strong',
          className,
        )}
      >
        <div className="relative h-16 w-16 overflow-hidden rounded-md bg-bg-muted">
          <img src={podcast.artwork} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
            {podcast.series} · Ep {podcast.episode}
          </p>
          <h4 className="mt-1 line-clamp-2 text-balance font-serif text-sm font-semibold leading-snug text-ink transition group-hover:text-brand">
            {podcast.title}
          </h4>
          <p className="mt-1 text-xs text-ink-muted">
            {podcast.duration} · {formatNumber(podcast.plays)} plays
          </p>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-muted text-ink transition group-hover:bg-ink group-hover:text-bg">
          <Play className="h-4 w-4 fill-current" />
        </span>
      </Link>
    );
  }

  return (
    <Link href={href} className={cn('group block', className)}>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-bg-muted">
        <img
          src={podcast.artwork}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 flex items-end p-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-lg transition group-hover:scale-110">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
          <Headphones className="h-3 w-3" />
          {podcast.duration}
        </span>
      </div>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
        {podcast.series} · Ep {podcast.episode}
      </p>
      <h3 className="mt-1.5 line-clamp-2 text-balance font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-brand">
        {podcast.title}
      </h3>
      <p className="mt-2 text-xs text-ink-muted">
        {podcast.host} · {timeAgo(podcast.publishedAt)} · {formatNumber(podcast.plays)} plays
      </p>
    </Link>
  );
}
