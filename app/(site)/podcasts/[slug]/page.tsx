import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Play, SkipBack, SkipForward, Bookmark, Share2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PodcastCard } from '@/components/cards/PodcastCard';
import { PODCASTS, findPodcast } from '@/lib/mock-data';
import { formatNumber, timeAgo } from '@/lib/utils';

export async function generateStaticParams() {
  return PODCASTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const p = findPodcast(params.slug);
  if (!p) return { title: 'Episode not found' };
  return {
    title: `${p.title} — ${p.series} Ep ${p.episode}`,
    description: p.description,
  };
}

export default async function PodcastEpisodePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const p = findPodcast(params.slug);
  if (!p) notFound();
  const others = PODCASTS.filter((x) => x.id !== p.id);

  return (
    <Container as="section" className="py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Podcasts', href: '/podcasts' },
          { label: p.title.slice(0, 40) + '…' },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-line bg-bg">
            <div className="grid gap-0 md:grid-cols-5">
              <div className="relative aspect-square md:col-span-2">
                <Image
                  src={p.artwork}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:col-span-3 md:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  {p.series} · Episode {p.episode}
                </p>
                <h1 className="mt-2 text-balance font-serif text-2xl font-semibold text-ink md:text-3xl">
                  {p.title}
                </h1>
                <p className="mt-3 text-sm text-ink-muted">
                  Hosted by {p.host} · {p.duration} · {formatNumber(p.plays)} plays
                </p>

                <div className="mt-6">
                  <div className="h-1.5 w-full rounded-full bg-bg-muted">
                    <div className="h-full w-[18%] rounded-full bg-ink" />
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-ink-muted">
                    <span>3:48</span>
                    <span>{p.duration}</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label="Skip back 15 seconds"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition hover:bg-bg-muted hover:text-ink active:bg-bg-muted focus-ring"
                  >
                    <SkipBack className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={`Play ${p.title}`}
                    className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring"
                  >
                    <Play className="h-6 w-6 fill-current" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Skip forward 15 seconds"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition hover:bg-bg-muted hover:text-ink active:bg-bg-muted focus-ring"
                  >
                    <SkipForward className="h-5 w-5" aria-hidden />
                  </button>
                  <div className="ml-3 flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Save episode to bookmarks"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition hover:bg-bg-muted hover:text-ink active:bg-bg-muted focus-ring"
                    >
                      <Bookmark className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label="Share this episode"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition hover:bg-bg-muted hover:text-ink active:bg-bg-muted focus-ring"
                    >
                      <Share2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="prose-article mt-10">
            <h2>Episode notes</h2>
            <p>{p.description}</p>
            <p>
              Published {timeAgo(p.publishedAt)}. Available on Apple Podcasts, Spotify, and
              all major podcast apps. Subscribe to never miss an episode.
            </p>
            <h3>Listen elsewhere</h3>
            <ul>
              <li>Apple Podcasts</li>
              <li>Spotify</li>
              <li>Google Podcasts</li>
              <li>Amazon Music</li>
              <li>RSS</li>
            </ul>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <p className="kicker mb-4">More episodes</p>
          <div className="space-y-3">
            {others.slice(0, 5).map((o) => (
              <PodcastCard key={o.id} podcast={o} variant="inline" />
            ))}
          </div>
        </aside>
      </div>
    </Container>
  );
}
