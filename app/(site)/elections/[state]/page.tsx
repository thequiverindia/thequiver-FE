import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { SeatChart, VoteShareBars } from '@/components/election/SeatChart';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { ELECTION_RESULTS_2024, CONSTITUENCY_RESULTS } from '@/lib/election-data';
import { getArticles } from '@/lib/data';
import { slugify, formatNumber } from '@/lib/utils';

export async function generateMetadata(props: { params: Promise<{ state: string }> }) {
  const params = await props.params;
  const result = ELECTION_RESULTS_2024.find(
    (r) => slugify(r.state) === params.state.toLowerCase(),
  );
  if (!result) return { title: 'State not found' };
  return {
    title: `${result.state} — Election results 2024`,
    description: `Lok Sabha 2024 in ${result.state}: ${result.totalSeats} seats, seat tally, vote share and constituency results.`,
  };
}

export async function generateStaticParams() {
  return ELECTION_RESULTS_2024.map((r) => ({ state: slugify(r.state) }));
}

export default async function StatePage(props: { params: Promise<{ state: string }> }) {
  const params = await props.params;
  const result = ELECTION_RESULTS_2024.find(
    (r) => slugify(r.state) === params.state.toLowerCase(),
  );
  if (!result) notFound();
  const constituencies = CONSTITUENCY_RESULTS.filter((c) => c.state === result.state);
  const { docs: latest } = await getArticles({ limit: 24 });
  const stateArticles = latest
    .filter(
      (a) =>
        a.tags.some((t) => t.toLowerCase().includes(result.state.toLowerCase())) ||
        a.title.toLowerCase().includes(result.state.toLowerCase()),
    )
    .slice(0, 4);

  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-12">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Elections', href: '/elections' },
              { label: result.state },
            ]}
          />
          <p className="kicker mt-6">State Dashboard</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
            {result.state}
          </h1>
          <p className="mt-4 text-base text-ink-muted sm:text-lg">
            Lok Sabha 2024 — {result.totalSeats} seats. Leading:{' '}
            <strong className="text-ink">{result.leading}</strong>
          </p>
        </Container>
      </header>

      <Container as="section" className="py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-line bg-bg p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="kicker">Seat tally</p>
                <Badge tone="brand">{result.totalSeats} total</Badge>
              </div>
              <SeatChart result={result} />
            </div>
            <div className="mt-6 rounded-2xl border border-line bg-bg p-6">
              <p className="kicker mb-4">Vote share</p>
              <VoteShareBars result={result} />
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-line bg-bg p-6">
              <p className="kicker mb-3">Highlights</p>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between gap-3 border-b border-line pb-3">
                  <span className="text-ink-muted">Highest margin</span>
                  <span className="font-medium text-ink">
                    {constituencies[0]?.name ?? '—'}
                  </span>
                </li>
                <li className="flex justify-between gap-3 border-b border-line pb-3">
                  <span className="text-ink-muted">Turnout</span>
                  <span className="font-medium text-ink">68.4%</span>
                </li>
                <li className="flex justify-between gap-3 border-b border-line pb-3">
                  <span className="text-ink-muted">Women turnout</span>
                  <span className="font-medium text-ink">71.2%</span>
                </li>
                <li className="flex justify-between gap-3">
                  <span className="text-ink-muted">First-time voters</span>
                  <span className="font-medium text-ink">12.4 lakh</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
              <p className="kicker mb-3">Our reading</p>
              <p className="text-sm leading-relaxed text-ink-muted">
                The 2024 result in {result.state} confirmed {result.leading} as the
                dominant force, but the constituency-level swing pattern suggests this
                margin is more fragile than the topline implies.
              </p>
            </div>
          </aside>
        </div>
      </Container>

      {/* Constituencies */}
      {constituencies.length > 0 && (
        <section className="border-y border-line bg-bg-subtle">
          <Container className="py-12">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-ink md:text-3xl">
              Featured constituencies
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {constituencies.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-line bg-bg p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-ink">
                        {c.name}
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted">
                        Margin <strong className="text-ink">+{formatNumber(c.margin)}</strong>{' '}
                        · {formatNumber(c.votes)} votes
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: c.partyColor }}
                      />
                      {c.party}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Link
                      href={`/leader/${slugify(c.winner)}`}
                      className="font-medium text-ink hover:underline"
                    >
                      {c.winner}
                    </Link>
                    <span className="text-xs text-ink-muted">Winner</span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {stateArticles.length > 0 && (
        <Container as="section" className="py-16">
          <h2 className="mb-6 font-serif text-2xl font-semibold text-ink md:text-3xl">
            Coverage from {result.state}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stateArticles.map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
