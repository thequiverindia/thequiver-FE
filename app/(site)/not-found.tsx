import Link from 'next/link';
import { Home, Compass, Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';

/**
 * Branded 404 body.
 *
 * KNOWN ISSUE: in this Next 15.4 layout (both route groups own a root layout,
 * as Payload requires), `notFound()` renders this page but the response status
 * stays 200 — verified with and without this file, sync and async, and with
 * error.tsx disabled, so it is framework-level rather than page-level. Truly
 * unmatched URLs do return 404 correctly. Tracked in BUGS.md; the likely fixes
 * are a Next upgrade or serving unknown slugs through a route handler.
 *
 * Keep this component synchronous — no data fetching in a 404.
 */
export default function NotFound() {
  return (
    <Container as="section" className="py-20 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-ink-muted">
          Error · 404
        </p>
        <h1 className="mt-4 text-balance font-serif text-4xl font-semibold text-ink md:text-6xl">
          This page didn&rsquo;t make it past our editors
        </h1>
        <p className="mt-5 text-pretty text-base text-ink-muted md:text-lg">
          The link may be broken, the page may have moved, or it may never have
          existed. Either way — let&rsquo;s get you back to the news.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-ink/90 focus-ring"
          >
            <Home className="h-4 w-4" aria-hidden />
            Go to homepage
          </Link>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-bg-muted focus-ring"
          >
            <Compass className="h-4 w-4" aria-hidden />
            Browse all news
          </Link>
        </div>

        <form
          action="/search"
          method="get"
          role="search"
          className="mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full border border-line bg-bg p-1 pl-4 transition focus-within:border-line-strong"
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
            className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-medium text-bg transition hover:bg-ink/90 focus-ring"
          >
            Search
          </button>
        </form>
      </div>
    </Container>
  );
}
