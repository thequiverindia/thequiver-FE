import Link from 'next/link';
import { Play } from 'lucide-react';
import type { Video } from '@/lib/types';
import { cn, formatNumber, timeAgo } from '@/lib/utils';

export function VideoCard({
  video,
  variant = 'standard',
  className,
}: {
  video: Video;
  variant?: 'standard' | 'feature' | 'compact';
  className?: string;
}) {
  const href = `/videos/${video.slug}`;

  if (variant === 'feature') {
    return (
      <Link href={href} className={cn('group block', className)}>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-bg-muted">
          <img
            src={video.thumbnail}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          <span className="absolute right-3 top-3 rounded-md bg-ink/80 px-2 py-1 text-xs font-medium text-white backdrop-blur">
            {video.duration}
          </span>
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-saffron px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            {video.series ?? 'Featured'}
          </span>
          <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-ink transition group-hover:scale-110">
            <Play className="h-7 w-7 fill-current" />
          </span>
        </div>
        <h3 className="mt-4 text-balance font-serif text-xl font-semibold leading-snug text-ink transition group-hover:text-brand md:text-2xl">
          {video.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{video.description}</p>
        <p className="mt-3 text-xs text-ink-muted">
          {video.host} · {timeAgo(video.publishedAt)} · {formatNumber(video.views)} views
        </p>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className={cn('group flex gap-3', className)}>
        <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-md bg-bg-muted">
          <img src={video.thumbnail} alt="" className="h-full w-full object-cover" />
          <span className="absolute bottom-1.5 right-1.5 rounded bg-ink/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {video.duration}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-balance font-serif text-sm font-semibold leading-snug text-ink transition group-hover:text-brand">
            {video.title}
          </h4>
          <p className="mt-1 text-xs text-ink-muted">
            {formatNumber(video.views)} views · {timeAgo(video.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  // standard
  return (
    <Link
      href={href}
      className={cn('group block overflow-hidden rounded-xl', className)}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-bg-muted">
        <img
          src={video.thumbnail}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-3 right-3 rounded-md bg-ink/80 px-2 py-1 text-xs font-medium text-white backdrop-blur">
          {video.duration}
        </span>
        <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-ink opacity-0 transition group-hover:opacity-100">
          <Play className="h-5 w-5 fill-current" />
        </span>
      </div>
      <div className="pt-3">
        {video.series && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
            {video.series}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 text-balance font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-brand">
          {video.title}
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          {video.host} · {timeAgo(video.publishedAt)} · {formatNumber(video.views)} views
        </p>
      </div>
    </Link>
  );
}
