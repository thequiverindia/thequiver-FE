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

const TYPE_TAB_LABELS: Record<string, string> = {
  articles: 'Articles',
  leaders: 'Leaders',
  facts: 'Fact-checks',
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const rawQ = (searchParams.q ?? '').trim();
  const q = rawQ.toLowerCase();
  const enc = encodeURIComponent(rawQ);
  const type = searchParams.type;

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

  const showArticles = (!type || type === 'articles') && matchedArticles.length > 0;
  const showLeaders = (!type || type === 'leaders') && matchedLeaders.length > 0;
  const showFacts = (!type || type === 'facts') && matchedFacts.length > 0;
  const visibleArticles = matchedArticles.slice(0, type === 'articles' ? 30 : 9);

  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-10">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
          <h1 className="sr-only">Search TheQuiverIndia</h1>
          <form
            method="get"
            role="search"
            className="mt-6 flex items-center gap-2 rounded-full border border-line-strong bg-bg p-1 pl-5 transition focus-within:border-brand"
          >
            <Search className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden />
            <input
              type="search"
              name="q"
              defaultValue={searchParams.q}
              aria-label="Search news, leaders and fact-checks"
              placeholder="Search news, leaders, fact-checks…"
              className="min-w-0 flex-1 bg-transparent py-3 text-base text-ink placeholder:text-ink-subtle focus-visible:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring"
            >
              Search
            </button>
          </form>
          <p className="mt-4 text-sm text-ink-muted">
            {q ? (
              <>
                <strong className="text-ink">{total}</strong> result
                {total !== 1 ? 's' : ''} for &ldquo;
                <strong className="text-ink">{rawQ}</strong>&rdquo;
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
          active={type ? TYPE_TAB_LABELS[type] ?? 'All' : 'All'}
          items={[
            { label: 'All', href: `/search?q=${enc}`, count: total },
            { label: 'Articles', href: `/search?q=${enc}&type=articles`, count: matchedArticles.length },
            { label: 'Leaders', href: `/search?q=${enc}&type=leaders`, count: matchedLeaders.length },
            { label: 'Fact-checks', href: `/search?q=${enc}&type=facts`, count: matchedFacts.length },
          ]}
        />
      </Container>

      {!showArticles && !showLeaders && !showFacts ? (
        <Container className="py-16">
          <EmptyState
            icon={<Search className="h-5 w-5" />}
            title="No matches"
            description="Try a different query, broaden your terms, or browse the news index."
          />
        </Container>
      ) : (
        <Container as="section" className="space-y-16 py-12">
          {showArticles && (
            <div>
              <h2 className="mb-6 font-serif text-2xl font-semibold text-ink">
                Articles{' '}
                <span className="text-ink-muted">
                  ({visibleArticles.length < matchedArticles.length
                    ? `showing ${visibleArticles.length} of ${matchedArticles.length}`
                    : matchedArticles.length})
                </span>
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} variant="standard" />
                ))}
              </div>
            </div>
          )}
          {showLeaders && (
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
          {showFacts && (
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
