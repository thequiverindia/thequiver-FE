import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Tabs } from '@/components/ui/Tabs';
import { VideoCard } from '@/components/cards/VideoCard';
import { VIDEOS } from '@/lib/mock-data';

export const metadata = {
  title: 'Videos — Watch the news',
  description: 'Documentaries, interviews, explainers and daily briefs from the TheQuiverIndia video desk.',
};

const SERIES = [...new Set(VIDEOS.map((v) => v.series).filter(Boolean))];

export default function VideosPage() {
  const featured = VIDEOS[0];
  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Videos' }]} />
          <p className="kicker mt-6">Videos</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-ink md:text-5xl">
            Watch the news. Long takes, short explainers.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted">
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
          active="All"
          items={[
            { label: 'All', href: '/videos' },
            ...SERIES.map((s) => ({ label: s as string, href: `/videos?series=${s}` })),
          ]}
        />
      </Container>

      <Container as="section" className="py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((v) => (
            <VideoCard key={v.id} video={v} variant="standard" />
          ))}
        </div>
      </Container>
    </>
  );
}
