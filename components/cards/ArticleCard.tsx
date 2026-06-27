import Link from 'next/link';
import { Share2 } from 'lucide-react';
import type { Article } from '@/lib/types';
import { cn, formatNumber, timeAgo } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

type Variant = 'hero' | 'feature' | 'standard' | 'compact' | 'list' | 'inline';

export function ArticleCard({
  article,
  variant = 'standard',
  showAuthor = true,
  className,
}: {
  article: Article;
  variant?: Variant;
  showAuthor?: boolean;
  className?: string;
}) {
  const href = `/article/${article.slug}`;

  if (variant === 'hero') {
    return (
      <article className={cn('group relative overflow-hidden rounded-2xl', className)}>
        <Link href={href} className="block">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-muted sm:aspect-[16/10] lg:aspect-[16/9]">
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {article.isBreaking && <Badge tone="breaking" withDot>Breaking</Badge>}
              {article.isExclusive && <Badge tone="saffron">Exclusive</Badge>}
              {article.kicker && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 sm:text-[11px]">
                  {article.kicker}
                </span>
              )}
            </div>
            <h2 className="text-balance font-serif text-[22px] font-semibold leading-[1.15] text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {article.title}
            </h2>
            <p className="mt-3 line-clamp-3 max-w-2xl text-pretty text-sm leading-relaxed text-white/85 sm:line-clamp-none sm:mt-4 md:text-base">
              {article.excerpt}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/75 sm:mt-5">
              <span>By {article.author.name}</span>
              <span aria-hidden>·</span>
              <span>{timeAgo(article.publishedAt)}</span>
              <span aria-hidden>·</span>
              <span>{article.readMinutes} min read</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'feature') {
    return (
      <article className={cn('group flex flex-col gap-4', className)}>
        <Link href={href} className="block overflow-hidden rounded-xl">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg-muted">
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            {article.isBreaking && (
              <Badge tone="breaking" withDot className="absolute left-3 top-3">
                Breaking
              </Badge>
            )}
          </div>
        </Link>
        <div className="space-y-2">
          {article.kicker && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-saffron">
              {article.kicker}
            </p>
          )}
          <Link href={href}>
            <h3 className="text-balance font-serif text-xl font-semibold leading-snug text-ink transition group-hover:text-brand md:text-2xl">
              {article.title}
            </h3>
          </Link>
          <p className="line-clamp-2 text-pretty text-sm text-ink-muted">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 pt-1 text-xs text-ink-muted">
            <span>{article.author.name}</span>
            <span aria-hidden>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{article.readMinutes} min</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className={cn('group', className)}>
        <Link href={href} className="block">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-bg-muted">
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          {article.kicker && (
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
              {article.kicker}
            </p>
          )}
          <h4 className="mt-1.5 text-balance font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-brand">
            {article.title}
          </h4>
          <p className="mt-2 text-xs text-ink-muted">
            {timeAgo(article.publishedAt)} · {article.readMinutes} min
          </p>
        </Link>
      </article>
    );
  }

  if (variant === 'list') {
    return (
      <article className={cn('group flex gap-4 py-5', className)}>
        <Link href={href} className="shrink-0">
          <div className="relative aspect-[4/3] w-32 overflow-hidden rounded-lg bg-bg-muted sm:w-40">
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="min-w-0 flex-1 space-y-1.5">
          {article.kicker && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
              {article.kicker}
            </p>
          )}
          <Link href={href}>
            <h3 className="text-balance font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-brand md:text-lg">
              {article.title}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm text-ink-muted">{article.excerpt}</p>
          <div className="flex items-center gap-3 pt-1 text-xs text-ink-muted">
            <span>{article.author.name}</span>
            <span aria-hidden>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{article.readMinutes} min</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'inline') {
    return (
      <article className={cn('group flex gap-3 py-3', className)}>
        <Link href={href} className="shrink-0">
          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-bg-muted">
            <img src={article.image} alt="" className="h-full w-full object-cover" />
          </div>
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={href}>
            <h4 className="line-clamp-2 text-balance font-serif text-sm font-semibold leading-snug text-ink transition group-hover:text-brand">
              {article.title}
            </h4>
          </Link>
          <p className="mt-1 text-xs text-ink-muted">
            {timeAgo(article.publishedAt)} · {formatNumber(article.views)} views
          </p>
        </div>
      </article>
    );
  }

  // standard
  return (
    <article
      className={cn(
        'group overflow-hidden rounded-xl border border-line bg-bg transition hover:border-line-strong',
        className,
      )}
    >
      <Link href={href} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg-muted">
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          {article.isBreaking && (
            <Badge tone="breaking" withDot className="absolute left-3 top-3">
              Breaking
            </Badge>
          )}
          {article.format === 'video' && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur">
              Video
            </span>
          )}
        </div>
      </Link>
      <div className="space-y-2 p-5">
        {article.kicker && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
            {article.kicker}
          </p>
        )}
        <Link href={href}>
          <h3 className="line-clamp-2 text-balance font-serif text-lg font-semibold leading-snug text-ink transition group-hover:text-brand">
            {article.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-ink-muted">{article.excerpt}</p>
        {showAuthor && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Avatar src={article.author.avatar} name={article.author.name} size="xs" />
              <span className="text-xs text-ink-muted">
                {article.author.name} · {timeAgo(article.publishedAt)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-ink-subtle">
              <button
                aria-label="Share"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-bg-muted hover:text-ink"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
