import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Tabs } from '@/components/ui/Tabs';
import { VideoCard } from '@/components/cards/VideoCard';
import { VIDEOS } from '@/lib/mock-data';

export const metadata = {
  title: 'Videos — Watch the news',
  description: 'Documentaries, interviews, explainers and daily briefs from the TheQuiverIndia video desk.',
};

const SERIES = [...new Set(VIDEOS.map((v) => v.series).filter(Boolean))] as string[];

export default function VideosPage({
  searchParams,
}: {
  searchParams?: { series?: string };
}) {
  const series = searchParams?.series;
  const filtered = series ? VIDEOS.filter((v) => v.series === series) : VIDEOS;
  const featured = filtered[0] ?? VIDEOS[0];
  const grid = filtered.filter((v) => v.id !== featured.id);

  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Videos' }]} />
          <p className="kicker mt-6">Videos</p>
          <h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
            Watch the news. Long takes, short explainers.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
            Daily briefs, documentaries, in-conversation interviews and data-driven
            explainers — all in one place.
          </p>
        </Container>
      </header>

      <Container as="section" className="py-12">
        <VideoCard video={featured} variant="feature" />
      </Container>

      <Container className="pt-2">
        <Tabs
          active={series ?? 'All'}
          items={[
            { label: 'All', href: '/videos' },
            ...SERIES.map((s) => ({
              label: s,
              href: `/videos?series=${encodeURIComponent(s)}`,
            })),
          ]}
        />
      </Container>

      <Container as="section" className="py-12">
        {grid.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-bg-subtle p-8 text-center text-sm text-ink-muted">
            Only one video in this series so far — it&rsquo;s featured above.{' '}
            <Link href="/videos" className="font-medium text-ink underline">
              Browse all videos
            </Link>
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {grid.map((v) => (
              <VideoCard key={v.id} video={v} variant="standard" />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
