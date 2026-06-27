import { Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Tabs } from '@/components/ui/Tabs';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { PoliticianCard } from '@/components/cards/PoliticianCard';
import { FactCheckCard } from '@/components/cards/FactCheckCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ARTICLES, POLITICIANS, FACT_CHECKS } from '@/lib/mock-data';

export const metadata = { title: 'Search TheQuiverIndia' };

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const q = (searchParams.q ?? '').toLowerCase().trim();
  const matchedArticles = q
    ? ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      )
    : ARTICLES.slice(0, 6);
  const matchedLeaders = q
    ? POLITICIANS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.party.toLowerCase().includes(q) ||
          p.constituency.toLowerCase().includes(q),
      )
    : POLITICIANS.slice(0, 4);
  const matchedFacts = q
    ? FACT_CHECKS.filter(
        (f) =>
          f.claim.toLowerCase().includes(q) ||
          f.verdict.toLowerCase().includes(q),
      )
    : FACT_CHECKS.slice(0, 3);

  const total =
    matchedArticles.length + matchedLeaders.length + matchedFacts.length;

  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-10">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
          <form
            method="get"
            className="mt-6 flex items-center gap-2 rounded-full border border-line-strong bg-bg p-1 pl-5"
          >
            <Search className="h-5 w-5 text-ink-muted" />
            <input
              type="search"
              name="q"
              defaultValue={searchParams.q}
              placeholder="Search news, leaders, fact-checks…"
              className="flex-1 bg-transparent py-3 text-base text-ink placeholder:text-ink-subtle focus:outline-none"
            />
            <button className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-bg">
              Search
            </button>
          </form>
          <p className="mt-4 text-sm text-ink-muted">
            {q ? (
              <>
                <strong className="text-ink">{total}</strong> result
                {total !== 1 ? 's' : ''} for "<strong className="text-ink">{searchParams.q}</strong>"
              </>
            ) : (
              <>
                Try a term like{' '}
                <a href="/search?q=monsoon+session" className="text-ink underline">
                  monsoon session
                </a>
                ,{' '}
                <a href="/search?q=fact+check" className="text-ink underline">
                  fact check
                </a>
                , or{' '}
                <a href="/search?q=Maharashtra" className="text-ink underline">
                  Maharashtra
                </a>
                .
              </>
            )}
          </p>
        </Container>
      </header>

      <Container>
        <Tabs
          active="All"
          items={[
            { label: 'All', href: `/search?q=${q}`, count: total },
            { label: 'Articles', href: `/search?q=${q}&type=articles`, count: matchedArticles.length },
            { label: 'Leaders', href: `/search?q=${q}&type=leaders`, count: matchedLeaders.length },
            { label: 'Fact-checks', href: `/search?q=${q}&type=facts`, count: matchedFacts.length },
          ]}
        />
      </Container>

      {total === 0 ? (
        <Container className="py-16">
          <EmptyState
            icon={<Search className="h-5 w-5" />}
            title="No matches"
            description="Try a different query, broaden your terms, or browse the news index."
          />
        </Container>
      ) : (
        <Container as="section" className="space-y-16 py-12">
          {matchedArticles.length > 0 && (
            <div>
              <h2 className="mb-6 font-serif text-2xl font-semibold text-ink">
                Articles ({matchedArticles.length})
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {matchedArticles.slice(0, 9).map((a) => (
                  <ArticleCard key={a.id} article={a} variant="standard" />
                ))}
              </div>
            </div>
          )}
          {matchedLeaders.length > 0 && (
            <div>
              <h2 className="mb-6 font-serif text-2xl font-semibold text-ink">
                Leaders ({matchedLeaders.length})
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matchedLeaders.map((p) => (
                  <PoliticianCard key={p.id} politician={p} />
                ))}
              </div>
            </div>
          )}
          {matchedFacts.length > 0 && (
            <div>
              <h2 className="mb-6 font-serif text-2xl font-semibold text-ink">
                Fact-checks ({matchedFacts.length})
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {matchedFacts.map((f) => (
                  <FactCheckCard key={f.id} fc={f} />
                ))}
              </div>
            </div>
          )}
        </Container>
      )}
    </>
  );
}
