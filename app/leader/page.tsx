import Link from 'next/link';
import { Search, ArrowUpDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PoliticianCard } from '@/components/cards/PoliticianCard';
import { POLITICIANS, PARTIES } from '@/lib/mock-data';
import { STATES } from '@/lib/constants';

export const metadata = {
  title: 'Leader Index — Every promise tracked',
  description:
    'Searchable database of politicians: biographies, promises kept and broken, voting records, controversies.',
};

export default function LeadersPage() {
  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-12">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Leader Index' }]}
          />
          <p className="kicker mt-6">Leader Index</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-ink md:text-5xl">
            Every leader. Every promise. Tracked weekly.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted">
            Search 4,800+ politicians across India. See their bio, voting record,
            attendance, promises kept and broken — all in one place.
          </p>

          {/* Search */}
          <div className="mt-8 flex max-w-2xl items-center gap-2 rounded-full border border-line-strong bg-bg p-1 pl-5">
            <Search className="h-4 w-4 text-ink-muted" />
            <input
              type="search"
              placeholder="Search by name, constituency, party…"
              className="flex-1 bg-transparent py-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
            />
            <button className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-bg">
              Search
            </button>
          </div>
        </Container>
      </header>

      {/* Filters */}
      <div className="border-b border-line bg-bg/95 backdrop-blur">
        <Container className="flex items-center justify-between gap-4 py-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <FilterChip label="All" active />
            {PARTIES.map((p) => (
              <FilterChip key={p.id} label={p.short} color={p.color} />
            ))}
          </div>
          <button className="hidden shrink-0 items-center gap-1 text-ink-muted hover:text-ink sm:inline-flex">
            <ArrowUpDown className="h-3 w-3" />
            Sort by rating
          </button>
        </Container>
      </div>

      <Container as="section" className="py-12">
        <p className="mb-6 text-sm text-ink-muted">
          Showing {POLITICIANS.length} of 4,832 leaders
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {POLITICIANS.map((p) => (
            <PoliticianCard key={p.id} politician={p} />
          ))}
        </div>
      </Container>

      {/* By state */}
      <section className="border-y border-line bg-bg-subtle">
        <Container className="py-16">
          <h2 className="mb-2 font-serif text-2xl font-semibold text-ink md:text-3xl">
            Browse leaders by state
          </h2>
          <p className="mb-8 text-sm text-ink-muted">
            Every state has its own roster. Pick yours.
          </p>
          <div className="flex flex-wrap gap-2">
            {STATES.map((s) => (
              <Link
                key={s}
                href={`/state-news?state=${encodeURIComponent(s)}`}
                className="rounded-full border border-line bg-bg px-4 py-2 text-sm text-ink-muted transition hover:border-line-strong hover:text-ink"
              >
                {s}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function FilterChip({
  label,
  active,
  color,
}: {
  label: string;
  active?: boolean;
  color?: string;
}) {
  return (
    <button
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'border-ink bg-ink text-bg'
          : 'border-line bg-bg text-ink-muted hover:border-line-strong hover:text-ink'
      }`}
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
          aria-hidden
        />
      )}
      {label}
    </button>
  );
}
