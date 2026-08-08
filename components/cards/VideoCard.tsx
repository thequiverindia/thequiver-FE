import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import type { Video } from '@/lib/types';
import { cn, formatNumber, timeAgo } from '@/lib/utils';

export function VideoCard({
  video,
  variant = 'standard',
  tone = 'default',
  className,
}: {
  video: Video;
  variant?: 'standard' | 'feature' | 'compact';
  /** 'inverse' for cards placed on a dark (bg-ink) band. */
  tone?: 'default' | 'inverse';
  className?: string;
}) {
  const href = `/videos/${video.slug}`;
  const titleColor =
    tone === 'inverse' ? 'text-bg group-hover:text-bg/80' : 'text-ink group-hover:text-brand';
  const mutedColor = tone === 'inverse' ? 'text-bg/70' : 'text-ink-muted';

  if (variant === 'feature') {
    return (
      <Link href={href} className={cn('group block focus-ring rounded-xl', className)}>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-bg-muted">
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div aria-hidden className="h-full w-full bg-bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-on-media backdrop-blur">
            {video.duration}
          </span>
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-on-media">
            {video.series ?? 'Featured'}
          </span>
          <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-black transition group-hover:scale-110">
            <Play className="h-7 w-7 fill-current" aria-hidden />
          </span>
        </div>
        <h3
          className={cn(
            'mt-4 text-balance font-serif text-xl font-semibold leading-snug transition md:text-2xl',
            titleColor,
          )}
        >
          {video.title}
        </h3>
        <p className={cn('mt-2 line-clamp-2 text-sm', mutedColor)}>{video.description}</p>
        <p className={cn('mt-3 text-xs', mutedColor)}>
          {video.host} · {timeAgo(video.publishedAt)} · {formatNumber(video.views)} views
        </p>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className={cn('group flex gap-3 focus-ring rounded-md', className)}>
        <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-md bg-bg-muted">
          {video.thumbnail ? (
            <Image src={video.thumbnail} alt="" fill sizes="144px" className="object-cover" />
          ) : (
            <div aria-hidden className="h-full w-full bg-bg-muted" />
          )}
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-on-media">
            {video.duration}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h4
            className={cn(
              'line-clamp-2 text-balance font-serif text-sm font-semibold leading-snug transition',
              titleColor,
            )}
          >
            {video.title}
          </h4>
          <p className={cn('mt-1 text-xs', mutedColor)}>
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
      className={cn('group block overflow-hidden rounded-xl focus-ring', className)}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-bg-muted">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="h-full w-full bg-bg-muted" />
        )}
        <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-on-media backdrop-blur">
          {video.duration}
        </span>
        <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-black opacity-0 transition group-hover:opacity-100">
          <Play className="h-5 w-5 fill-current" aria-hidden />
        </span>
      </div>
      <div className="pt-3">
        {video.series && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
            {video.series}
          </p>
        )}
        <h3
          className={cn(
            'mt-1 line-clamp-2 text-balance font-serif text-base font-semibold leading-snug transition',
            titleColor,
          )}
        >
          {video.title}
        </h3>
        <p className={cn('mt-2 text-xs', mutedColor)}>
          {video.host} · {timeAgo(video.publishedAt)} · {formatNumber(video.views)} views
        </p>
      </div>
    </Link>
  );
}
