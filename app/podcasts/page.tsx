import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Tabs } from '@/components/ui/Tabs';
import { PodcastCard } from '@/components/cards/PodcastCard';
import { PODCASTS } from '@/lib/mock-data';

export const metadata = {
  title: 'Podcasts — Listen on the go',
};

const SERIES = [...new Set(PODCASTS.map((p) => p.series))];

export default function PodcastsPage() {
  const featured = PODCASTS[0];
  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Podcasts' }]} />
          <p className="kicker mt-6">Podcasts</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-ink md:text-5xl">
            Listen on the go
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted">
            The TheQuiverIndia Daily, Long Form deep dives, weekly fact-check briefs, and voices
            from the ground.
          </p>
        </Container>
      </header>

      <Container as="section" className="py-12">
        <div className="overflow-hidden rounded-2xl border border-line bg-bg">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="aspect-square bg-bg-muted md:aspect-auto">
              <img src={featured.artwork} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-saffron">
                Featured · {featured.series} · Ep {featured.episode}
              </p>
              <h2 className="mt-3 text-balance font-serif text-3xl font-semibold leading-tight text-ink md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm text-ink-muted md:text-base">
                {featured.description}
              </p>
              <p className="mt-4 text-xs text-ink-muted">
                {featured.host} · {featured.duration}
              </p>
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <Tabs
          active="All"
          items={[
            { label: 'All', href: '/podcasts' },
            ...SERIES.map((s) => ({ label: s, href: `/podcasts?series=${s}` })),
          ]}
        />
      </Container>

      <Container as="section" className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PODCASTS.map((p) => (
            <PodcastCard key={p.id} podcast={p} />
          ))}
        </div>
      </Container>
    </>
  );
}
