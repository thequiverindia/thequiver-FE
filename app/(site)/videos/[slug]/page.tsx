import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Play, ThumbsUp, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Avatar } from '@/components/ui/Avatar';
import { VideoCard } from '@/components/cards/VideoCard';
import { CommentSection } from '@/components/article/CommentSection';
import { getAuthors, getVideoBySlug, getVideos, listSlugs } from '@/lib/data';
import { formatNumber, timeAgo } from '@/lib/utils';

export async function generateStaticParams() {
  const slugs = await listSlugs('videos');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const v = await getVideoBySlug(decodeURIComponent(params.slug));
  if (!v) return { title: 'Video not found' };
  return { title: v.title, description: v.description };
}

export default async function VideoPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const v = await getVideoBySlug(decodeURIComponent(params.slug));
  if (!v) notFound();
  const [allVideos, authors] = await Promise.all([getVideos({}), getAuthors()]);
  const others = allVideos.filter((x) => x.id !== v.id);
  const host = authors.find((a) => a.name === v.host) ?? authors[0];

  return (
    <Container as="section" className="py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Videos', href: '/videos' },
          { label: v.title.slice(0, 40) + '…' },
        ]}
      />
      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* Player — real YouTube embed once the video has a channel ID */}
          {v.youtubeId ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                title={v.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
              {v.thumbnail && (
                <Image
                  src={v.thumbnail}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover opacity-60"
                />
              )}
              <span className="absolute inset-0 m-auto flex h-fit w-fit items-center rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-on-media">
                <Play className="mr-2 h-4 w-4 fill-current" aria-hidden />
                Video arriving soon on our YouTube channel
              </span>
              {v.duration && (
                <span className="absolute bottom-4 right-4 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-on-media backdrop-blur">
                  {v.duration}
                </span>
              )}
            </div>
          )}

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            {v.series ?? 'TheQuiverIndia'}
          </p>
          <h1 className="mt-2 text-balance font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl md:text-4xl">
            {v.title}
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            {formatNumber(v.views)} views · <time dateTime={v.publishedAt}>{timeAgo(v.publishedAt)}</time>
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-y border-line py-3">
            {host && (
              <>
                <Avatar src={host.avatar} name={host.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-ink">{host.name}</p>
                  <p className="text-[11px] text-ink-muted">Host · {host.role}</p>
                </div>
              </>
            )}
            <div className="ml-auto flex items-center gap-1">
              <IconBtn Icon={ThumbsUp} label="2.4K" srLabel="Like this video" />
              <IconBtn Icon={MessageSquare} label="312" srLabel="Jump to comments" />
              <IconBtn Icon={Bookmark} srLabel="Save to bookmarks" />
              <IconBtn Icon={Share2} srLabel="Share this video" />
            </div>
          </div>

          <p className="prose-article mt-6">{v.description}</p>

          <CommentSection articleId={v.id} />
        </div>

        <aside className="lg:col-span-4">
          <p className="kicker mb-4">More from the video desk</p>
          <div className="space-y-4">
            {others.slice(0, 6).map((x) => (
              <VideoCard key={x.id} video={x} variant="compact" />
            ))}
          </div>
        </aside>
      </div>
    </Container>
  );
}

function IconBtn({
  Icon,
  label,
  srLabel,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label?: string;
  srLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={srLabel}
      className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-2 text-xs font-medium text-ink-muted transition hover:bg-bg-muted hover:text-ink active:bg-bg-muted focus-ring"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </button>
  );
}
