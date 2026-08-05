import Link from 'next/link';
import { Search, Home, Compass } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { getMostReadArticles } from '@/lib/data';

export default async function NotFound() {
  const mostRead = await getMostReadArticles(3);
  return (
    <Container as="section" className="py-20 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-sm text-ink-muted">Error · 404</p>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-ink md:text-7xl">
          This page didn't make it past our editors
        </h1>
        <p className="mt-5 text-pretty text-lg text-ink-muted">
          The link may be broken, the page may have moved, or it may never have existed.
          Either way — let's get you back to the news.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg hover:bg-ink/90"
          >
            <Home className="h-4 w-4" />
            Go to homepage
          </Link>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg px-5 py-2.5 text-sm font-medium text-ink hover:bg-bg-muted"
          >
            <Compass className="h-4 w-4" />
            Browse all news
          </Link>
        </div>

        <form
          action="/search"
          method="get"
          role="search"
          className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-line bg-bg p-1 pl-4 transition focus-within:border-line-strong"
        >
          <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
          <input
            type="search"
            name="q"
            aria-label="Search TheQuiverIndia"
            placeholder="Search TheQuiverIndia…"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm focus-visible:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mx-auto mt-16 max-w-5xl">
        <p className="kicker mb-6 text-center">While you're here</p>
        <h2 className="mb-8 text-center font-serif text-2xl font-semibold text-ink">
          The most-read stories on TheQuiverIndia right now
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {mostRead.map((a) => (
            <ArticleCard key={a.id} article={a} variant="standard" />
          ))}
        </div>
      </div>
    </Container>
  );
}
