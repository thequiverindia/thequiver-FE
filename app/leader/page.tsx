import Link from 'next/link';
import { Search, ArrowUpDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PoliticianCard } from '@/components/cards/PoliticianCard';
import { POLITICIANS, PARTIES } from '@/lib/mock-data';
import { STATES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Leader Index — Every promise tracked',
  description:
    'Searchable database of politicians: biographies, promises kept and broken, voting records, controversies.',
};

function buildHref(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `/leader?${s}` : '/leader';
}

export default function LeadersPage({
  searchParams,
}: {
  searchParams?: { q?: string; party?: string; sort?: string; state?: string };
}) {
  const q = searchParams?.q?.trim().toLowerCase();
  const party = searchParams?.party;
  const state = searchParams?.state;
  const sortByRating = searchParams?.sort === 'rating';

  let leaders = POLITICIANS.filter((p) => {
    if (party && p.partyShort !== party) return false;
    if (state && p.state !== state) return false;
    if (
      q &&
      !p.name.toLowerCase().includes(q) &&
      !p.constituency.toLowerCase().includes(q) &&
      !p.party.toLowerCase().includes(q) &&
      !p.partyShort.toLowerCase().includes(q)
    )
      return false;
    return true;
  });
  if (sortByRating) leaders = [...leaders].sort((a, b) => b.rating - a.rating);

  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-12">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Leader Index' }]}
          />
          <p className="kicker mt-6">Leader Index</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
            Every leader. Every promise. Tracked weekly.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
            Search politicians across India. See their bio, voting record,
            attendance, promises kept and broken — all in one place.
          </p>

          {/* Search */}
          <form
            action="/leader"
            role="search"
            className="mt-8 flex max-w-2xl items-center gap-2 rounded-full border border-line-strong bg-bg p-1 pl-5 transition focus-within:border-brand"
          >
            <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
            <input
              type="search"
              name="q"
              defaultValue={searchParams?.q ?? ''}
              aria-label="Search leaders by name, constituency or party"
              placeholder="Search by name, constituency, party…"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring"
            >
              Search
            </button>
          </form>
        </Container>
      </header>

      {/* Filters */}
      <div className="border-b border-line bg-bg/95 backdrop-blur lg:sticky lg:top-16 lg:z-30">
        <Container className="flex items-center justify-between gap-4 py-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <FilterChip
              label="All parties"
              active={!party}
              href={buildHref({ q: searchParams?.q, sort: searchParams?.sort, state })}
            />
            {PARTIES.map((p) => (
              <FilterChip
                key={p.id}
                label={p.short}
                color={p.color}
                active={party === p.short}
                href={buildHref({
                  q: searchParams?.q,
                  sort: searchParams?.sort,
                  state,
                  party: p.short,
                })}
              />
            ))}
          </div>
          <Link
            href={buildHref({
              q: searchParams?.q,
              party,
              state,
              sort: sortByRating ? undefined : 'rating',
            })}
            className={cn(
              'hidden shrink-0 items-center gap-1 rounded-full px-3 py-2 transition focus-ring sm:inline-flex',
              sortByRating ? 'bg-bg-muted text-ink' : 'text-ink-muted hover:text-ink',
            )}
          >
            <ArrowUpDown className="h-3 w-3" aria-hidden />
            {sortByRating ? 'Sorted by rating' : 'Sort by rating'}
          </Link>
        </Container>
      </div>

      <Container as="section" className="py-12">
        <p className="mb-6 text-sm text-ink-muted">
          Showing {leaders.length} of {POLITICIANS.length} tracked leaders
          {state && <> in {state}</>}
          {party && <> from {party}</>}
        </p>
        {leaders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-bg-subtle p-8 text-center text-sm text-ink-muted">
            No leaders match this search.{' '}
            <Link href="/leader" className="font-medium text-ink underline">
              Clear filters
            </Link>
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {leaders.map((p) => (
              <PoliticianCard key={p.id} politician={p} />
            ))}
          </div>
        )}
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
                href={buildHref({ state: s })}
                className={cn(
                  'rounded-full border px-4 py-2.5 text-sm transition focus-ring',
                  state === s
                    ? 'border-ink bg-ink text-bg'
                    : 'border-line bg-bg text-ink-muted hover:border-line-strong hover:text-ink',
                )}
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
  href,
}: {
  label: string;
  active?: boolean;
  color?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition focus-ring',
        active
          ? 'border-ink bg-ink text-bg'
          : 'border-line bg-bg text-ink-muted hover:border-line-strong hover:text-ink',
      )}
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
          aria-hidden
        />
      )}
      {label}
    </Link>
  );
}
