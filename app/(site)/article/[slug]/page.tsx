import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { VerificationBadge } from '@/components/ui/Verification';
import { MetaBar } from '@/components/ui/MetaBar';
import { ArticleBody } from '@/components/article/ArticleBody';
import { ShareBar } from '@/components/article/ShareBar';
import { BookmarkButton } from '@/components/engagement/BookmarkButton';
import { AuthorByline, AuthorCard } from '@/components/article/AuthorByline';
import { ReadingProgress } from '@/components/article/ReadingProgress';
import { BackToTop } from '@/components/article/BackToTop';
import { CommentSection } from '@/components/article/CommentSection';
import { ArticleCard } from '@/components/cards/ArticleCard';
import {
  getArticleBySlug,
  getArticles,
  getMostReadArticles,
  getRelatedArticles,
  listSlugs,
} from '@/lib/data';
import { formatDateTime } from '@/lib/utils';

export async function generateStaticParams() {
  const slugs = await listSlugs('articles');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const article = await getArticleBySlug(decodeURIComponent(params.slug));
  if (!article) return { title: 'Article not found' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
    alternates: article.translationOf
      ? {
          languages: {
            [article.translationOf.language === 'hi' ? 'hi-IN' : 'en-IN']:
              `/article/${article.translationOf.slug}`,
            [article.language === 'hi' ? 'hi-IN' : 'en-IN']: `/article/${article.slug}`,
          },
        }
      : undefined,
  };
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const article = await getArticleBySlug(decodeURIComponent(params.slug));
  if (!article) notFound();
  const related = (await getRelatedArticles(article, 3)) ?? [];
  const mostRead = await getMostReadArticles(5);
  // "Read next" must not repeat the sidebar's related list.
  const { docs: latest } = await getArticles({ limit: 9, excludeSlug: article.slug });
  const readNext = latest
    .filter((a) => !related.some((r) => r.id === a.id))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: [article.image],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { '@type': 'Person', name: article.author.name },
    publisher: { '@type': 'NewsMediaOrganization', name: 'TheQuiverIndia' },
    inLanguage: article.language === 'hi' ? 'hi-IN' : 'en-IN',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <BackToTop />

      {/* Hero */}
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-8 md:py-14">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              {
                label: article.category.replace(/-/g, ' '),
                href: `/${article.category}`,
              },
              { label: article.title, truncate: true },
            ]}
          />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {article.isExclusive && <Badge tone="saffron">Exclusive</Badge>}
            {article.translationOf && (
              <Link
                href={`/article/${article.translationOf.slug}`}
                lang={article.translationOf.language === 'hi' ? 'hi' : 'en'}
                className="inline-flex items-center rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-medium text-brand transition hover:bg-brand/10 focus-ring"
              >
                {article.translationOf.language === 'hi'
                  ? 'यह लेख हिन्दी में पढ़ें →'
                  : 'Read this story in English →'}
              </Link>
            )}
            {article.kicker && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-saffron">
                {article.kicker}
              </span>
            )}
          </div>
          <h1
            lang={article.language === 'hi' ? 'hi' : undefined}
            className="mt-3 max-w-4xl text-balance font-serif text-[28px] font-semibold leading-[1.15] text-ink sm:text-4xl md:text-5xl"
          >
            {article.title}
          </h1>
          <p
            lang={article.language === 'hi' ? 'hi' : undefined}
            className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg md:text-xl"
          >
            {article.excerpt}
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <AuthorByline author={article.author} />
              <span className="hidden h-8 w-px bg-line sm:block" />
              <MetaBar
                publishedAt={article.publishedAt}
                readMinutes={article.readMinutes}
                views={article.views}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge level={article.verification} sources={article.sourceCount} />
              <BookmarkButton articleId={article.id} />
              <ShareBar />
            </div>
          </div>
        </Container>
      </header>

      {/* Image */}
      <figure className="border-b border-line bg-bg-subtle">
        <div className="mx-auto max-w-5xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-muted">
            <Image
              src={article.image}
              alt={article.imageCaption ?? article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
          {article.imageCaption && (
            <figcaption className="mx-auto max-w-prose px-4 py-3 text-xs text-ink-muted">
              {article.imageCaption}
            </figcaption>
          )}
        </div>
      </figure>

      {/* Body */}
      <Container as="article" className="py-10 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-24">
              <ShareBar orientation="vertical" />
            </div>
          </div>
          <div
            lang={article.language === 'hi' ? 'hi' : undefined}
            className="mx-auto w-full min-w-0 max-w-prose lg:col-span-8"
          >
            <ArticleBody body={article.body} />

            {article.factCheckSlug && (
              <aside className="mt-12 rounded-2xl border border-verified/30 bg-verified/5 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-verified">
                  Linked Fact Check
                </p>
                <p className="mt-2 font-serif text-lg text-ink">
                  This story includes a claim that we have independently verified.
                </p>
                <Link
                  href={`/fact-check/${article.factCheckSlug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-verified hover:underline"
                >
                  Read the full fact-check trail →
                </Link>
              </aside>
            )}

            <div className="mt-12 flex flex-wrap items-center gap-2">
              {article.tags.map((tag) => (
                <Tag key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                  {tag}
                </Tag>
              ))}
            </div>

            <AuthorCard author={article.author} />

            <div className="mt-6 text-xs text-ink-subtle">
              Published: {formatDateTime(article.publishedAt)}
              {article.updatedAt && (
                <> · Updated: {formatDateTime(article.updatedAt)}</>
              )}
            </div>

            <CommentSection articleId={article.id} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:col-span-3">
            {related.length > 0 && (
            <div className="rounded-xl border border-line bg-bg p-5">
              <p className="kicker mb-3">More on this story</p>
              <ul className="space-y-3 divide-y divide-line">
                {related.map((a) => (
                  <li key={a.id} className="pt-3 first:pt-0">
                    <Link
                      href={`/article/${a.slug}`}
                      className="group block"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
                        {a.kicker}
                      </p>
                      <p className="mt-1 line-clamp-3 text-balance font-serif text-sm font-semibold leading-snug text-ink group-hover:text-brand">
                        {a.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            )}
            <div className="rounded-xl border border-line bg-bg p-5">
              <p className="kicker mb-3">Most read</p>
              <ul className="space-y-3">
                {mostRead.map((a, i) => (
                  <li key={a.id} className="flex gap-3">
                    <span className="font-serif text-2xl font-semibold leading-none text-ink-subtle">
                      {i + 1}
                    </span>
                    <Link
                      href={`/article/${a.slug}`}
                      className="group min-w-0 flex-1"
                    >
                      <p className="line-clamp-2 text-balance font-serif text-sm font-semibold leading-snug text-ink group-hover:text-brand">
                        {a.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>

      {/* Read next — distinct from the sidebar's related list */}
      {readNext.length > 0 && (
        <section className="border-t border-line bg-bg-subtle">
          <Container className="py-16">
            <h2 className="mb-8 font-serif text-2xl font-semibold text-ink md:text-3xl">
              Read next
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {readNext.map((a) => (
                <ArticleCard key={a.id} article={a} variant="standard" />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
