import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { CategoryHero } from '@/components/sections/CategoryHero';
import { TrendingTags } from '@/components/sections/TrendingTags';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { getMostReadArticles } from '@/lib/data';
import { formatNumber } from '@/lib/utils';

export const metadata = {
  title: 'Trending — What India is reading right now',
};

export default async function TrendingPage() {
  const sortedByViews = await getMostReadArticles(14);
  // The hero is #1 and the river starts at #2, so the sidebar must skip both
  // — otherwise every story on the page appears twice.
  const mostRead = sortedByViews.slice(9, 14);
  return (
    <>
      <CategoryHero
        kicker="Trending"
        title="What India is reading right now"
        description="The stories our readers are opening most right now."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Trending' }]}
        hero={sortedByViews[0]}
      />
      <Container>
        <TrendingTags />
      </Container>
      <Container as="section" className="py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Hero above is #01, so the ranked river starts at #02 */}
          <ol className="lg:col-span-7 space-y-6">
            {sortedByViews.slice(1, 9).map((a, i) => (
              <li
                key={a.id}
                className="flex items-start gap-3 border-b border-line pb-6 last:border-0 sm:gap-5"
              >
                <span
                  aria-hidden
                  className="shrink-0 font-serif text-3xl font-semibold leading-none text-ink-subtle sm:text-5xl md:text-6xl"
                >
                  {String(i + 2).padStart(2, '0')}
                </span>
                <ArticleCard article={a} variant="list" className="min-w-0 flex-1 py-0" />
              </li>
            ))}
          </ol>
          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-line bg-bg p-6 lg:sticky lg:top-24">
              <p className="kicker mb-4">Also being read</p>
              <ol className="space-y-4">
                {mostRead.map((a, i) => (
                  <li key={a.id} className="flex gap-3 border-b border-line pb-3 last:border-0">
                    <span aria-hidden className="font-serif text-2xl font-semibold text-ink-subtle">
                      {i + 1}
                    </span>
                    <Link href={`/article/${a.slug}`} className="group min-w-0 flex-1 focus-ring rounded-sm">
                      <p className="line-clamp-2 font-serif text-sm font-semibold text-ink transition group-hover:text-brand">
                        {a.title}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {formatNumber(a.views)} reads
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
