import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { cn, timeAgo, formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

type Variant = 'hero' | 'feature' | 'standard' | 'compact' | 'list' | 'inline';

/**
 * Hero images are optional in the CMS. An empty string passed to next/image
 * renders <img src="">, which browsers resolve to the CURRENT PAGE URL —
 * firing a duplicate full-page request per card. Always render a neutral
 * placeholder instead.
 */
function CardImage({
  src,
  sizes,
  priority,
  className,
}: {
  src?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        aria-hidden
        className="flex h-full w-full items-center justify-center bg-bg-muted"
      >
        <span className="font-serif text-2xl font-semibold text-ink-subtle/50">TQ</span>
      </div>
    );
  }
  return (
    <Image src={src} alt="" fill priority={priority} sizes={sizes} className={className} />
  );
}

export function ArticleCard({
  article,
  variant = 'standard',
  showAuthor = true,
  priority = false,
  className,
}: {
  article: Article;
  variant?: Variant;
  showAuthor?: boolean;
  /** Set on the LCP image (e.g. the homepage hero) so it loads eagerly. */
  priority?: boolean;
  className?: string;
}) {
  const href = `/article/${article.slug}`;
  // Devanagari inside an English document needs marking, or screen readers
  // read Hindi with an English voice.
  const lang = article.language === 'hi' ? 'hi' : undefined;

  if (variant === 'hero') {
    return (
      <article className={cn('group relative overflow-hidden rounded-2xl', className)}>
        <Link href={href} className="block focus-ring">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-muted sm:aspect-[16/10] lg:aspect-[16/9]">
            <CardImage
              src={article.image}
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            {/* Scrim stays dark in every theme — it sits on a photo, not a surface */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {article.isExclusive && <Badge tone="saffron">Exclusive</Badge>}
              {article.kicker && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-on-media/80 sm:text-[11px]">
                  {article.kicker}
                </span>
              )}
            </div>
            <h2 lang={lang} className="text-balance font-serif text-[22px] font-semibold leading-[1.15] text-on-media transition group-hover:underline group-hover:decoration-on-media/40 group-hover:underline-offset-4 sm:text-3xl md:text-4xl lg:text-5xl">
              {article.title}
            </h2>
            <p className="mt-3 line-clamp-3 max-w-2xl text-pretty text-sm leading-relaxed text-on-media/85 sm:mt-4 sm:line-clamp-none md:text-base">
              {article.excerpt}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-media/75 sm:mt-5">
              <span>By {article.author.name}</span>
              <span aria-hidden>·</span>
              <time dateTime={article.publishedAt}>{timeAgo(article.publishedAt)}</time>
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
        <Link href={href} tabIndex={-1} aria-hidden className="block overflow-hidden rounded-xl">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg-muted">
            <CardImage
              src={article.image}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </Link>
        <div className="space-y-2">
          {article.kicker && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              {article.kicker}
            </p>
          )}
          <Link href={href} className="focus-ring block rounded-sm">
            <h3 lang={lang} className="text-balance font-serif text-xl font-semibold leading-snug text-ink transition group-hover:text-brand md:text-2xl">
              {article.title}
            </h3>
          </Link>
          <p className="line-clamp-2 text-pretty text-sm text-ink-muted">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 pt-1 text-xs text-ink-muted">
            <span>{article.author.name}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.publishedAt}>{timeAgo(article.publishedAt)}</time>
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
        <Link href={href} className="focus-ring block rounded-lg">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-bg-muted">
            <CardImage
              src={article.image}
              sizes="(max-width: 640px) 100vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          {article.kicker && (
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              {article.kicker}
            </p>
          )}
          <h4 lang={lang} className="mt-1.5 text-balance font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-brand">
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
        <Link href={href} tabIndex={-1} aria-hidden className="shrink-0">
          <div className="relative aspect-[4/3] w-28 overflow-hidden rounded-lg bg-bg-muted sm:w-40">
            <CardImage
              src={article.image}
              sizes="160px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="min-w-0 flex-1 space-y-1.5">
          {article.kicker && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              {article.kicker}
            </p>
          )}
          <Link href={href} className="focus-ring block rounded-sm">
            <h3 lang={lang} className="text-balance font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-brand md:text-lg">
              {article.title}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm text-ink-muted">{article.excerpt}</p>
          <div className="flex items-center gap-3 pt-1 text-xs text-ink-muted">
            <span>{article.author.name}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.publishedAt}>{timeAgo(article.publishedAt)}</time>
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
        <Link href={href} tabIndex={-1} aria-hidden className="shrink-0">
          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-bg-muted">
            <CardImage src={article.image} sizes="64px" className="object-cover" />
          </div>
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={href} className="focus-ring block rounded-sm">
            <h4 lang={lang} className="line-clamp-2 text-balance font-serif text-sm font-semibold leading-snug text-ink transition group-hover:text-brand">
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
      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg-muted">
          <CardImage
            src={article.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="space-y-2 p-5">
        {article.kicker && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
            {article.kicker}
          </p>
        )}
        <Link href={href} className="focus-ring block rounded-sm">
          <h3 lang={lang} className="line-clamp-2 text-balance font-serif text-lg font-semibold leading-snug text-ink transition group-hover:text-brand">
            {article.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-ink-muted">{article.excerpt}</p>
        {showAuthor && (
          <div className="flex items-center gap-2 pt-2">
            <Avatar src={article.author.avatar} name={article.author.name} size="xs" />
            <span className="text-xs text-ink-muted">
              {article.author.name} · {timeAgo(article.publishedAt)}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
