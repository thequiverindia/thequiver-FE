import { notFound } from 'next/navigation';
import { Play, ThumbsUp, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Avatar } from '@/components/ui/Avatar';
import { VideoCard } from '@/components/cards/VideoCard';
import { CommentSection } from '@/components/article/CommentSection';
import { VIDEOS, findVideo, AUTHORS } from '@/lib/mock-data';
import { formatNumber, timeAgo } from '@/lib/utils';

export async function generateStaticParams() {
  return VIDEOS.map((v) => ({ slug: v.slug }));
}

export default function VideoPage({ params }: { params: { slug: string } }) {
  const v = findVideo(params.slug);
  if (!v) notFound();
  const others = VIDEOS.filter((x) => x.id !== v.id);
  const host = AUTHORS.find((a) => a.name === v.host) ?? AUTHORS[0];

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
          {/* Player */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink">
            <img
              src={v.thumbnail}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <span className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition hover:scale-105">
              <Play className="h-9 w-9 fill-current" />
            </span>
            <span className="absolute bottom-4 right-4 rounded-md bg-ink/80 px-2 py-1 text-xs font-medium text-white backdrop-blur">
              {v.duration}
            </span>
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-saffron">
            {v.series ?? 'TheQuiverIndia'}
          </p>
          <h1 className="mt-2 text-balance font-serif text-3xl font-semibold leading-tight text-ink md:text-4xl">
            {v.title}
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            {formatNumber(v.views)} views · {timeAgo(v.publishedAt)}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-y border-line py-3">
            <Avatar src={host.avatar} name={host.name} size="sm" />
            <div>
              <p className="text-sm font-medium text-ink">{host.name}</p>
              <p className="text-[11px] text-ink-muted">Host · {host.role}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <IconBtn Icon={ThumbsUp} label="2.4K" />
              <IconBtn Icon={MessageSquare} label="312" />
              <IconBtn Icon={Bookmark} />
              <IconBtn Icon={Share2} />
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
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label?: string;
}) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-medium text-ink-muted hover:bg-bg-muted hover:text-ink">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
