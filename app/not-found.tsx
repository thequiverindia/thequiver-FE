import Link from 'next/link';
import { Search, Home, Compass } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { MOST_READ } from '@/lib/mock-data';

export default function NotFound() {
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
          className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-line bg-bg p-1 pl-4"
        >
          <Search className="h-4 w-4 text-ink-muted" />
          <input
            type="search"
            name="q"
            placeholder="Search TheQuiverIndia…"
            className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none"
          />
          <button className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-bg">
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
          {MOST_READ.slice(0, 3).map((a) => (
            <ArticleCard key={a.id} article={a} variant="standard" />
          ))}
        </div>
      </div>
    </Container>
  );
}
