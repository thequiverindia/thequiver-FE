import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Tabs } from '@/components/ui/Tabs';
import { PodcastCard } from '@/components/cards/PodcastCard';
import { PODCASTS } from '@/lib/mock-data';

export const metadata = {
  title: 'Podcasts — Listen on the go',
};

const SERIES = [...new Set(PODCASTS.map((p) => p.series))];

export default async function PodcastsPage(
  props: {
    searchParams?: Promise<{ series?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const series = searchParams?.series;
  const filtered = series ? PODCASTS.filter((p) => p.series === series) : PODCASTS;
  const featured = filtered[0] ?? PODCASTS[0];
  const grid = filtered.filter((p) => p.id !== featured.id);

  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Podcasts' }]} />
          <p className="kicker mt-6">Podcasts</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
            Listen on the go
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
            The TheQuiverIndia Daily, Long Form deep dives, weekly fact-check briefs, and voices
            from the ground.
          </p>
        </Container>
      </header>

      <Container as="section" className="py-12">
        <Link
          href={`/podcasts/${featured.slug}`}
          className="group block overflow-hidden rounded-2xl border border-line bg-bg transition hover:border-line-strong focus-ring"
        >
          <div className="grid gap-0 md:grid-cols-2">
            <div className="relative aspect-square bg-bg-muted md:aspect-auto md:min-h-[320px]">
              <Image
                src={featured.artwork}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="absolute bottom-4 left-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-black shadow-lg transition group-hover:scale-110">
                <Play className="h-5 w-5 fill-current" aria-hidden />
              </span>
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                Featured · {featured.series} · Ep {featured.episode}
              </p>
              <h2 className="mt-3 text-balance font-serif text-2xl font-semibold leading-tight text-ink transition group-hover:text-brand sm:text-3xl md:text-4xl">
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
        </Link>
      </Container>

      <Container>
        <Tabs
          active={series ?? 'All'}
          items={[
            { label: 'All', href: '/podcasts' },
            ...SERIES.map((s) => ({
              label: s,
              href: `/podcasts?series=${encodeURIComponent(s)}`,
            })),
          ]}
        />
      </Container>

      <Container as="section" className="py-12">
        {grid.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-bg-subtle p-8 text-center text-sm text-ink-muted">
            Only one episode in this series so far — it&rsquo;s featured above.{' '}
            <Link href="/podcasts" className="font-medium text-ink underline">
              Browse all podcasts
            </Link>
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {grid.map((p) => (
              <PodcastCard key={p.id} podcast={p} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
