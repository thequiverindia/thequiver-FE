import Link from 'next/link';
import { CategoryHero } from '@/components/sections/CategoryHero';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { ARTICLES } from '@/lib/mock-data';
import { STATES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'State News — Stories from every corner of India',
};

export default function StateNewsPage({
  searchParams,
}: {
  searchParams?: { state?: string };
}) {
  const activeState = searchParams?.state;
  const articles = ARTICLES.filter((a) => a.category === 'state-news');
  const all = articles.length > 0 ? articles : ARTICLES.slice(0, 8);
  const stateQuery = activeState?.toLowerCase();
  const filtered = stateQuery
    ? all.filter(
        (a) =>
          a.tags.some((t) => t.toLowerCase() === stateQuery) ||
          a.title.toLowerCase().includes(stateQuery),
      )
    : all;
  const hero = all[0];
  const gridArticles = filtered.filter((a) => a.id !== hero.id);

  return (
    <>
      <CategoryHero
        kicker="State News"
        title="Stories from every corner of India"
        description="Pick a state to read its local stories — from Bengaluru to Bhopal, Pune to Patna."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'State News' }]}
        hero={hero}
      />
      <Container as="section" className="py-12">
        <h2 className="kicker mb-4">Choose your state</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/state-news"
            className={cn(
              'rounded-full border px-4 py-2.5 text-sm transition focus-ring',
              !activeState
                ? 'border-ink bg-ink text-bg'
                : 'border-line bg-bg text-ink-muted hover:border-line-strong hover:text-ink',
            )}
          >
            All states
          </Link>
          {STATES.map((s) => (
            <Link
              key={s}
              href={`/state-news?state=${encodeURIComponent(s)}`}
              className={cn(
                'rounded-full border px-4 py-2.5 text-sm transition focus-ring',
                activeState === s
                  ? 'border-ink bg-ink text-bg'
                  : 'border-line bg-bg text-ink-muted hover:border-line-strong hover:text-ink',
              )}
            >
              {s}
            </Link>
          ))}
        </div>
      </Container>
      <Container as="section" className="py-8">
        <h2 className="mb-6 font-serif text-2xl font-semibold text-ink md:text-3xl">
          {activeState ? `Latest from ${activeState}` : 'Latest from the states'}
        </h2>
        {gridArticles.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-bg-subtle p-8 text-center text-sm text-ink-muted">
            No stories from {activeState} yet.{' '}
            <Link href="/state-news" className="font-medium text-ink underline">
              See all states
            </Link>
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {gridArticles.map((a) => (
              <ArticleCard key={a.id} article={a} variant="standard" />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
