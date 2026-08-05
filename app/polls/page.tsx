import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Tabs } from '@/components/ui/Tabs';
import { PollCard } from '@/components/cards/PollCard';
import { POLLS } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';

export const metadata = {
  title: 'Polls — What India thinks',
};

const CAT_TAB_LABELS: Record<string, string> = {
  politics: 'Politics',
  elections: 'Elections',
  opinion: 'Opinion',
  trending: 'Trending',
};

export default function PollsPage({
  searchParams,
}: {
  searchParams?: { cat?: string };
}) {
  const cat = searchParams?.cat;
  const polls = cat
    ? POLLS.filter((p) => p.category.toLowerCase() === cat)
    : POLLS;
  const totalVotes = POLLS.reduce((a, p) => a + p.totalVotes, 0);
  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Polls' }]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="kicker">Polls & Surveys</p>
              <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
                What India thinks, in numbers
              </h1>
              <p className="mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
                Daily opinion polls on the issues that matter. Vote in seconds, see results
                live. Polls are open to verified readers only.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:col-span-4">
              <div className="rounded-xl border border-line bg-bg p-5">
                <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                  Active polls
                </p>
                <p className="mt-2 font-serif text-3xl font-semibold text-ink">
                  {POLLS.length}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-bg p-5">
                <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                  Total votes
                </p>
                <p className="mt-2 font-serif text-3xl font-semibold text-ink">
                  {formatNumber(totalVotes)}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </header>

      <Container>
        <Tabs
          active={cat ? CAT_TAB_LABELS[cat] ?? 'All' : 'All'}
          items={[
            { label: 'All', href: '/polls', count: POLLS.length },
            { label: 'Politics', href: '/polls?cat=politics' },
            { label: 'Elections', href: '/polls?cat=elections' },
            { label: 'Opinion', href: '/polls?cat=opinion' },
            { label: 'Trending', href: '/polls?cat=trending' },
          ]}
        />
      </Container>

      <Container as="section" className="py-12">
        {polls.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-bg-subtle p-8 text-center text-sm text-ink-muted">
            No polls in this category yet — check the other tabs.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {polls.map((p) => (
              <PollCard key={p.id} poll={p} showResults />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
