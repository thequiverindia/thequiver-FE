import Link from 'next/link';
import { ArrowRight, Radio, TrendingUp, Vote, Map } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { SeatChart } from '@/components/election/SeatChart';
import {
  ELECTION_RESULTS_2024,
  CONSTITUENCY_RESULTS,
  ARTICLES,
  PARTIES,
} from '@/lib/mock-data';
import { formatNumber, slugify } from '@/lib/utils';

export const metadata = {
  title: 'Elections — Live results, constituency data, seat-by-seat analysis',
  description: 'India\'s most detailed election dashboard. Track every seat, every party, every state.',
};

export default function ElectionsPage() {
  const totalSeats = ELECTION_RESULTS_2024.reduce((a, b) => a + b.totalSeats, 0);
  const partyTotals: Record<string, { seats: number; color: string }> = {};
  for (const state of ELECTION_RESULTS_2024) {
    for (const r of state.results) {
      const cur = partyTotals[r.party] ?? { seats: 0, color: r.partyColor };
      partyTotals[r.party] = { seats: cur.seats + r.seats, color: r.partyColor };
    }
  }
  const partyArr = Object.entries(partyTotals)
    .map(([party, v]) => ({ party, ...v }))
    .sort((a, b) => b.seats - a.seats);

  const electionArticles = ARTICLES.filter(
    (a) => a.category === 'elections' || a.tags.some((t) => /elect|poll/i.test(t)),
  ).slice(0, 4);

  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-8 md:py-12">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Elections' }]} />
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge tone="breaking" withDot>Live</Badge>
            <p className="kicker">Elections 2024 · Lok Sabha</p>
          </div>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl md:text-5xl">
            The most detailed election dashboard in India
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted md:text-lg">
            Live seat tally, vote share by state, constituency-level results, and exit-poll
            comparison — all in one place.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-4">
            <KPI label="Total seats" value={formatNumber(totalSeats)} Icon={Vote} />
            <KPI label="States covered" value={ELECTION_RESULTS_2024.length.toString()} Icon={Map} />
            <KPI label="Turnout" value="65.8%" Icon={TrendingUp} />
            <KPI label="Updates" value="Live" Icon={Radio} tone="breaking" />
          </div>
        </Container>
      </header>

      {/* National seat tally */}
      <Container as="section" className="py-16">
        <SectionHeader
          kicker="National seat tally"
          title="Where the seats actually went"
          description={`${totalSeats} seats counted across ${ELECTION_RESULTS_2024.length} states`}
        />
        <div className="rounded-2xl border border-line bg-bg p-6 md:p-8">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-bg-muted">
            {partyArr.map((p) => (
              <span
                key={p.party}
                style={{
                  width: `${(p.seats / totalSeats) * 100}%`,
                  background: p.color,
                }}
                title={`${p.party}: ${p.seats}`}
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            {partyArr.map((p) => (
              <div
                key={p.party}
                className="flex items-center gap-2 rounded-lg border border-line bg-bg-subtle px-3 py-2"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: p.color }}
                />
                <span className="font-medium text-ink">{p.party}</span>
                <span className="ml-auto text-ink-muted">{p.seats}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* State by state */}
      <section className="border-y border-line bg-bg-subtle">
        <Container className="py-16">
          <SectionHeader
            kicker="State by state"
            title="Drill into any state"
            description="Click a state to see vote share, swing, and seat-by-seat results."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {ELECTION_RESULTS_2024.map((r) => (
              <Link
                key={r.state}
                href={`/elections/${slugify(r.state)}`}
                className="group block rounded-xl border border-line bg-bg p-6 transition hover:border-line-strong"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                      State
                    </p>
                    <h3 className="mt-0.5 font-serif text-xl font-semibold text-ink group-hover:text-brand">
                      {r.state}
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted">
                      Leading: <strong className="text-ink">{r.leading}</strong>
                    </p>
                  </div>
                  <Badge tone="brand">{r.totalSeats} seats</Badge>
                </div>
                <div className="mt-5">
                  <SeatChart result={r} />
                </div>
                <p className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-ink-muted group-hover:text-ink">
                  Open full dashboard <ArrowRight className="h-3 w-3" />
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Constituencies */}
      <Container as="section" className="py-16">
        <SectionHeader
          kicker="Constituencies"
          title="Featured seat-by-seat results"
        />
        <div
          tabIndex={0}
          role="region"
          aria-label="Constituency results table, scrolls horizontally"
          className="overflow-x-auto rounded-xl border border-line focus-ring"
        >
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">
              Featured constituency results: winner, margin and total votes
            </caption>
            <thead className="bg-bg-subtle">
              <tr className="text-left text-xs uppercase tracking-wider text-ink-muted">
                <th scope="col" className="px-4 py-3 font-medium">Constituency</th>
                <th scope="col" className="px-4 py-3 font-medium">State</th>
                <th scope="col" className="px-4 py-3 font-medium">Winner</th>
                <th scope="col" className="px-4 py-3 font-medium">Margin</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Total votes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {CONSTITUENCY_RESULTS.map((c) => (
                <tr key={c.name} className="bg-bg">
                  <td className="px-4 py-4 font-serif font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-4 text-ink-muted">{c.state}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-full"
                        style={{ background: c.partyColor }}
                      />
                      <span className="text-ink">{c.winner}</span>
                      <span className="text-xs text-ink-muted">({c.party})</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-ink-muted">+{formatNumber(c.margin)}</td>
                  <td className="px-4 py-4 text-right text-ink-muted">
                    {formatNumber(c.votes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* Parties */}
      <section className="border-t border-line bg-bg-subtle">
        <Container className="py-16">
          <SectionHeader
            kicker="Parties"
            title="Compare parties at a glance"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PARTIES.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-xl border border-line bg-bg"
              >
                <div className="h-1.5 w-full" style={{ background: p.color }} aria-hidden />
                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ background: p.color }}
                    />
                    {p.short}
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs text-ink-muted">Founded {p.founded}</p>
                  <p className="mt-3 font-serif text-3xl font-semibold text-ink">
                    {p.seats}
                  </p>
                  <p className="text-xs text-ink-muted">Lok Sabha seats</p>
                  <p className="mt-3 text-xs text-ink-muted">
                    Led by <strong className="text-ink">{p.leader}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container as="section" className="py-16">
        <SectionHeader
          kicker="From the desk"
          title="Election reporting"
          href="/category/elections"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {electionArticles.map((a) => (
            <ArticleCard key={a.id} article={a} variant="compact" />
          ))}
        </div>
      </Container>
    </>
  );
}

function KPI({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
  tone?: 'breaking';
}) {
  return (
    <div className="rounded-xl border border-line bg-bg p-5">
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
          tone === 'breaking' ? 'bg-breaking/10 text-breaking' : 'bg-bg-muted text-ink-muted'
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 font-serif text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">{label}</p>
    </div>
  );
}
