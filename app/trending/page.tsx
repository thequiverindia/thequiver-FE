import { Container } from '@/components/ui/Container';
import { CategoryHero } from '@/components/sections/CategoryHero';
import { TrendingTags } from '@/components/sections/TrendingTags';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { ARTICLES, MOST_READ } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';

export const metadata = {
  title: 'Trending — What India is reading right now',
};

export default function TrendingPage() {
  const sortedByViews = [...ARTICLES].sort((a, b) => b.views - a.views);
  return (
    <>
      <CategoryHero
        kicker="Trending"
        title="What India is reading right now"
        description="Stories ranked by how many people read, shared and saved them in the last 24 hours."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Trending' }]}
        hero={sortedByViews[0]}
      />
      <Container>
        <TrendingTags />
      </Container>
      <Container as="section" className="py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <ol className="lg:col-span-7 space-y-6">
            {sortedByViews.slice(0, 8).map((a, i) => (
              <li
                key={a.id}
                className="flex items-start gap-5 border-b border-line pb-6 last:border-0"
              >
                <span className="shrink-0 font-serif text-5xl font-semibold leading-none text-ink-subtle md:text-6xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <ArticleCard article={a} variant="list" className="flex-1" />
              </li>
            ))}
          </ol>
          <aside className="lg:col-span-5">
            <div className="sticky top-32 rounded-2xl border border-line bg-bg p-6">
              <p className="kicker mb-4">Most read this week</p>
              <ol className="space-y-4">
                {MOST_READ.map((a, i) => (
                  <li key={a.id} className="flex gap-3 border-b border-line pb-3 last:border-0">
                    <span className="font-serif text-2xl font-semibold text-ink-subtle">
                      {i + 1}
                    </span>
                    <div>
                      <p className="line-clamp-2 font-serif text-sm font-semibold text-ink">
                        {a.title}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {formatNumber(a.views)} reads
                      </p>
                    </div>
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
