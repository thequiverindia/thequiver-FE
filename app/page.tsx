import Link from 'next/link';
import { ArrowRight, Flame, Radio } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { PoliticianCard } from '@/components/cards/PoliticianCard';
import { VideoCard } from '@/components/cards/VideoCard';
import { PollCard } from '@/components/cards/PollCard';
import { FactCheckCard } from '@/components/cards/FactCheckCard';
import { PodcastCard } from '@/components/cards/PodcastCard';
import { NewsletterCTA } from '@/components/sections/NewsletterCTA';
import { TrendingTags } from '@/components/sections/TrendingTags';
import {
  ARTICLES,
  POLITICIANS,
  VIDEOS,
  POLLS,
  FACT_CHECKS,
  PODCASTS,
  LIVE_UPDATES,
  MOST_READ,
  EDITORS_PICKS,
  ELECTION_RESULTS_2024,
} from '@/lib/mock-data';
import { timeAgo, formatNumber } from '@/lib/utils';

export default function HomePage() {
  const hero = ARTICLES[0];
  const sub = [ARTICLES[1], ARTICLES[2], ARTICLES[5]];
  const politicsRow = [ARTICLES[3], ARTICLES[7], ARTICLES[9]];
  const opinionRow = [ARTICLES[10], ARTICLES[3]];
  const featuredVideo = VIDEOS[0];
  const sideVideos = VIDEOS.slice(1, 4);

  return (
    <>
      {/* HERO + RIGHT RAIL */}
      <Container as="section" className="py-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            <ArticleCard article={hero} variant="hero" />
            <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {sub.map((a) => (
                <ArticleCard key={a.id} article={a} variant="feature" />
              ))}
            </div>
          </div>

          {/* Right rail */}
          <aside className="space-y-6 lg:col-span-4 lg:space-y-8">
            <LiveSidebar />
            <MostReadList />
          </aside>
        </div>
      </Container>

      <Container>
        <TrendingTags />
      </Container>

      {/* POLITICS GRID */}
      <Container as="section" className="py-12 md:py-16">
        <SectionHeader
          kicker="Politics"
          title="Power, policy and the politics of nation-building"
          description="The stories shaping how India is governed — and who governs it."
          href="/politics"
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {politicsRow.map((a) => (
            <ArticleCard key={a.id} article={a} variant="standard" />
          ))}
        </div>
      </Container>

      {/* LEADERS */}
      <section className="border-y border-line bg-bg-subtle">
        <Container className="py-12 md:py-16">
          <SectionHeader
            kicker="Leader Index"
            title="Track every promise. Rate every leader."
            description="Bio, voting record, attendance, controversies — all in one place. Updated weekly."
            href="/leader"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {POLITICIANS.slice(0, 4).map((p) => (
              <PoliticianCard key={p.id} politician={p} />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              href="/leader"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-bg-muted"
            >
              Browse all leaders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ELECTIONS DASHBOARD STRIP */}
      <Container as="section" className="py-12 md:py-16">
        <SectionHeader
          kicker="Elections 2024"
          title="State of the nation, state by state"
          description="Live seat tally, vote share and constituency-level results across every state."
          href="/elections"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ELECTION_RESULTS_2024.slice(0, 8).map((r) => (
            <StateMiniCard key={r.state} result={r} />
          ))}
        </div>
      </Container>

      {/* VIDEO STRIP */}
      <section className="border-t border-line bg-ink text-bg">
        <Container className="py-12 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-saffron">
                Watch
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-bg md:text-3xl">
                Today on the TheQuiverIndia video desk
              </h2>
            </div>
            <Link
              href="/videos"
              className="hidden items-center gap-1.5 text-sm font-medium text-bg/70 hover:text-bg sm:inline-flex"
            >
              All videos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <VideoCard video={featuredVideo} variant="feature" />
            <div className="space-y-5">
              {sideVideos.map((v) => (
                <VideoCard key={v.id} video={v} variant="compact" />
              ))}
              <Link
                href="/videos"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-bg/70 hover:text-bg"
              >
                More videos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* FACT CHECK + POLL ROW */}
      <Container as="section" className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              kicker="Fact Check"
              title="What's true, what isn't — verified"
              description="Every claim sourced, rated and explained. Submit yours below."
              href="/fact-check"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {FACT_CHECKS.slice(0, 2).map((fc) => (
                <FactCheckCard key={fc.id} fc={fc} />
              ))}
            </div>
            <Link
              href="/fact-check"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
            >
              All fact checks <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="lg:col-span-5">
            <SectionHeader
              kicker="What India Thinks"
              title="Today's poll"
              href="/polls"
              hrefLabel="All polls"
            />
            <PollCard poll={POLLS[0]} showResults />
          </div>
        </div>
      </Container>

      {/* OPINION + EDITOR'S PICKS */}
      <section className="border-y border-line bg-bg-subtle">
        <Container className="py-12 md:py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHeader kicker="Opinion" title="The long view" href="/opinion" />
              <div className="space-y-2 divide-y divide-line">
                {opinionRow.map((a) => (
                  <ArticleCard key={a.id} article={a} variant="list" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <SectionHeader
                kicker="Editor's Picks"
                title="Hand-picked, this week"
                href="/trending"
              />
              <div className="space-y-1 divide-y divide-line">
                {EDITORS_PICKS.slice(0, 4).map((a) => (
                  <ArticleCard key={a.id} article={a} variant="inline" />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* PODCAST STRIP */}
      <Container as="section" className="py-12 md:py-16">
        <SectionHeader
          kicker="Listen"
          title="The podcast desk"
          description="Daily briefs, long-form interviews and reported audio stories."
          href="/podcasts"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PODCASTS.slice(0, 4).map((p) => (
            <PodcastCard key={p.id} podcast={p} />
          ))}
        </div>
      </Container>

      <NewsletterCTA />

      {/* MORE FROM THEQUIVERINDIA */}
      <Container as="section" className="py-12 md:py-16">
        <SectionHeader
          kicker="More From TheQuiverIndia"
          title="Keep reading"
          href="/news"
          hrefLabel="All news"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.slice(6, 12).map((a) => (
            <ArticleCard key={a.id} article={a} variant="standard" />
          ))}
        </div>
      </Container>
    </>
  );
}

function LiveSidebar() {
  return (
    <div className="rounded-2xl border border-line bg-bg p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-breaking">
          <Radio className="h-3.5 w-3.5 animate-pulse-dot" />
          Live now
        </span>
        <Link href="/live" className="text-xs font-medium text-ink-muted hover:text-ink">
          All updates →
        </Link>
      </div>
      <ol className="relative space-y-4 border-l border-line pl-4">
        {LIVE_UPDATES.slice(0, 5).map((u) => (
          <li key={u.id} className="relative">
            <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-saffron ring-4 ring-bg" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              {u.tag}
              {u.location && <> · {u.location}</>}
              <span className="mx-1.5 opacity-50">·</span>
              {timeAgo(u.time)}
            </p>
            <p className="mt-1 text-pretty text-sm leading-snug text-ink">{u.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MostReadList() {
  return (
    <div className="rounded-2xl border border-line bg-bg p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-saffron">
          <Flame className="h-3.5 w-3.5" />
          Most read
        </span>
        <Link
          href="/trending"
          className="text-xs font-medium text-ink-muted hover:text-ink"
        >
          See trending →
        </Link>
      </div>
      <ol className="space-y-4">
        {MOST_READ.map((a, i) => (
          <li key={a.id} className="flex gap-3">
            <span className="font-serif text-3xl font-semibold leading-none text-ink-subtle">
              {i + 1}
            </span>
            <Link href={`/article/${a.slug}`} className="group min-w-0 flex-1">
              <h4 className="line-clamp-2 text-balance font-serif text-sm font-semibold leading-snug text-ink group-hover:text-brand">
                {a.title}
              </h4>
              <p className="mt-1 text-xs text-ink-muted">
                {formatNumber(a.views)} views · {timeAgo(a.publishedAt)}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StateMiniCard({
  result,
}: {
  result: (typeof ELECTION_RESULTS_2024)[number];
}) {
  const top = result.results[0];
  return (
    <Link
      href={`/elections/${result.state.toLowerCase().replace(/\s+/g, '-')}`}
      className="group block overflow-hidden rounded-xl border border-line bg-bg p-5 transition hover:border-line-strong"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            State
          </p>
          <h3 className="mt-0.5 font-serif text-lg font-semibold text-ink group-hover:text-brand">
            {result.state}
          </h3>
        </div>
        <Badge tone="brand" className="shrink-0">
          {result.totalSeats} seats
        </Badge>
      </div>
      <div className="mt-4">
        <p className="text-xs text-ink-muted">Leading: <strong className="text-ink">{result.leading}</strong></p>
        <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-bg-muted">
          {result.results.map((p) => (
            <span
              key={p.party}
              style={{
                width: `${(p.seats / result.totalSeats) * 100}%`,
                background: p.partyColor,
              }}
              title={`${p.party}: ${p.seats} seats`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-ink-muted">
          {result.results.slice(0, 3).map((p) => (
            <span key={p.party} className="inline-flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: p.partyColor }}
              />
              {p.party} {p.seats}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
