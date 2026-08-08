import Link from 'next/link';
import { ArrowRight, Flame, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { PoliticianCard } from '@/components/cards/PoliticianCard';
import { VideoCard } from '@/components/cards/VideoCard';
import { PollCard } from '@/components/cards/PollCard';
import { FactCheckCard } from '@/components/cards/FactCheckCard';
import { NewsletterCTA } from '@/components/sections/NewsletterCTA';
import { TrendingTags } from '@/components/sections/TrendingTags';
import { AccountabilityLedger } from '@/components/sections/AccountabilityLedger';
import {
  getArticles,
  getFactChecks,
  getLeaders,
  getMostReadArticles,
  getPolls,
  getVideos,
} from '@/lib/data';
import { getReaderPollVotes } from '@/lib/data/reader';
import { getReaderId } from '@/auth';
import { ELECTION_RESULTS_2024 } from '@/lib/election-data';
import { timeAgo, formatNumber } from '@/lib/utils';
import type { Article } from '@/lib/types';

export default async function HomePage() {
  const readerId = await getReaderId();
  const pollVotes = readerId ? await getReaderPollVotes(readerId) : {};
  const [latest, politics, opinion, videos, polls, factChecks, leaders, mostRead] =
    await Promise.all([
      getArticles({ limit: 24 }),
      getArticles({ limit: 3, category: 'politics' }),
      getArticles({ limit: 2, category: 'opinion' }),
      getVideos({ limit: 4 }),
      getPolls(),
      getFactChecks({ limit: 2 }),
      getLeaders({}),
      getMostReadArticles(12),
    ]);

  const hero = latest.docs[0];
  const sub = latest.docs.slice(1, 4);
  const politicsRow = politics.docs;
  const opinionRow = opinion.docs;

  // Everything above the fold is already on screen — never repeat it further
  // down the page. Without this the homepage links the same handful of
  // stories a dozen times over.
  const shown = new Set<string>([hero?.id, ...sub.map((a) => a.id)].filter(Boolean) as string[]);
  const take = (list: Article[], n: number) => {
    const out: Article[] = [];
    for (const a of list) {
      if (out.length >= n) break;
      if (shown.has(a.id)) continue;
      shown.add(a.id);
      out.push(a);
    }
    return out;
  };

  const latestRail = take(latest.docs, 5);
  const mostReadRail = take(mostRead, 5);
  const exclusives = latest.docs.filter((a) => a.isExclusive);
  // "Editor's Picks" must be genuinely picked — never a silent copy of Most Read.
  const picks = take(exclusives, 4);
  const keepReading = take(latest.docs, 6);
  const featuredVideo = videos[0];
  const sideVideos = videos.slice(1, 4);

  return (
    <>
      <h1 className="sr-only">TheQuiverIndia — Politics. Power. People.</h1>

      {/* HERO + RIGHT RAIL */}
      <Container as="section" className="py-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            {hero && <ArticleCard article={hero} variant="hero" priority />}
            <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {sub.map((a) => (
                <ArticleCard key={a.id} article={a} variant="feature" />
              ))}
            </div>
          </div>

          {/* Right rail */}
          <aside className="space-y-6 lg:col-span-4 lg:space-y-8">
            {latestRail.length > 0 && <LatestList articles={latestRail} />}
            {mostReadRail.length > 0 && <MostReadList articles={mostReadRail} />}
          </aside>
        </div>
      </Container>

      <Container>
        <TrendingTags />
      </Container>

      {/* THE LEDGER — signature accountability scoreboard */}
      <AccountabilityLedger />

      {/* POLITICS GRID */}
      {politicsRow.length > 0 && (
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
      )}

      {/* LEADERS */}
      {leaders.length > 0 && (
        <section className="border-y border-line bg-bg-subtle">
          <Container className="py-12 md:py-16">
            <SectionHeader
              kicker="Leader Index"
              title="Track every promise. Rate every leader."
              description="Bio, voting record, attendance, controversies — all in one place. Updated weekly."
              href="/leader"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {leaders.slice(0, 4).map((p) => (
                <PoliticianCard key={p.id} politician={p} />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                href="/leader"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-bg-muted active:bg-bg-muted focus-ring"
              >
                Browse all leaders
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* ELECTIONS ARCHIVE STRIP */}
      <Container as="section" className="py-12 md:py-16">
        <SectionHeader
          kicker="Elections 2024"
          title="State of the nation, state by state"
          description="Seat tally, vote share and constituency-level results across every state."
          href="/elections"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ELECTION_RESULTS_2024.slice(0, 8).map((r) => (
            <StateMiniCard key={r.state} result={r} />
          ))}
        </div>
      </Container>

      {/* VIDEO STRIP */}
      {featuredVideo && (
        <section className="border-t border-line bg-ink text-bg">
          <Container className="py-12 md:py-16">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-bg/70">
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
                All videos <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <VideoCard video={featuredVideo} variant="feature" tone="inverse" />
              <div className="space-y-5">
                {sideVideos.map((v) => (
                  <VideoCard key={v.id} video={v} variant="compact" tone="inverse" />
                ))}
                <Link
                  href="/videos"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-bg/70 hover:text-bg"
                >
                  More videos <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* FACT CHECK + POLL ROW */}
      {(factChecks.length > 0 || polls.length > 0) && (
      <Container as="section" className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {factChecks.length > 0 && (
          <div className="lg:col-span-7">
            <SectionHeader
              kicker="Fact Check"
              title="What's true, what isn't — verified"
              description="Every claim sourced, rated and explained. Submit yours below."
              href="/fact-check"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {factChecks.map((fc) => (
                <FactCheckCard key={fc.id} fc={fc} />
              ))}
            </div>
            <Link
              href="/fact-check"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
            >
              All fact checks <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          )}
          {polls[0] && (
          <div className="lg:col-span-5">
            <SectionHeader
              kicker="What India Thinks"
              title="Reader poll"
              href="/polls"
              hrefLabel="All polls"
            />
            <PollCard
              poll={polls[0]}
              signedIn={Boolean(readerId)}
              votedOptionId={pollVotes[polls[0].id] ?? null}
            />
          </div>
          )}
        </div>
      </Container>
      )}

      {/* OPINION + EDITOR'S PICKS */}
      {(opinionRow.length > 0 || picks.length > 0) && (
      <section className="border-y border-line bg-bg-subtle">
        <Container className="py-12 md:py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            {opinionRow.length > 0 && (
            <div className="lg:col-span-7">
              <SectionHeader kicker="Opinion" title="The long view" href="/opinion" />
              <div className="space-y-2 divide-y divide-line">
                {opinionRow.map((a) => (
                  <ArticleCard key={a.id} article={a} variant="list" />
                ))}
              </div>
            </div>
            )}
            {picks.length > 0 && (
            <div className="lg:col-span-5">
              <SectionHeader
                kicker="Editor's Picks"
                title="Exclusives this week"
                href="/trending"
              />
              <div className="space-y-1 divide-y divide-line">
                {picks.map((a) => (
                  <ArticleCard key={a.id} article={a} variant="inline" />
                ))}
              </div>
            </div>
            )}
          </div>
        </Container>
      </section>
      )}

      <NewsletterCTA />

      {/* MORE FROM THEQUIVERINDIA */}
      {keepReading.length > 0 && (
        <Container as="section" className="py-12 md:py-16">
          <SectionHeader
            kicker="More From TheQuiverIndia"
            title="Keep reading"
            href="/news"
            hrefLabel="All news"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {keepReading.map((a) => (
              <ArticleCard key={a.id} article={a} variant="standard" />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}

function LatestList({ articles }: { articles: Article[] }) {
  return (
    <div className="rounded-2xl border border-line bg-bg p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          Latest
        </span>
        <Link href="/news" className="text-xs font-medium text-ink-muted hover:text-ink">
          All news →
        </Link>
      </div>
      <ol className="relative space-y-4 border-l border-line pl-4">
        {articles.map((a) => (
          <li key={a.id} className="relative">
            <span
              aria-hidden
              className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-bg"
            />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              {a.categoryLabel ?? a.category}
              <span className="mx-1.5 opacity-50">·</span>
              <time dateTime={a.publishedAt}>{timeAgo(a.publishedAt)}</time>
            </p>
            <Link href={`/article/${a.slug}`} className="group block focus-ring rounded-sm">
              <p className="mt-1 text-pretty text-sm font-medium leading-snug text-ink group-hover:text-brand">
                {a.title}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MostReadList({ articles }: { articles: Article[] }) {
  return (
    <div className="rounded-2xl border border-line bg-bg p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          <Flame className="h-3.5 w-3.5" aria-hidden />
          Most read
        </span>
        <Link href="/trending" className="text-xs font-medium text-ink-muted hover:text-ink">
          See trending →
        </Link>
      </div>
      <ol className="space-y-4">
        {articles.map((a, i) => (
          <li key={a.id} className="flex gap-3">
            <span aria-hidden className="font-serif text-3xl font-semibold leading-none text-ink-subtle">
              {i + 1}
            </span>
            <Link href={`/article/${a.slug}`} className="group min-w-0 flex-1 focus-ring rounded-sm">
              <h3 className="line-clamp-2 text-balance font-serif text-sm font-semibold leading-snug text-ink group-hover:text-brand">
                {a.title}
              </h3>
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
  return (
    <Link
      href={`/elections/${result.state.toLowerCase().replace(/\s+/g, '-')}`}
      className="group block overflow-hidden rounded-xl border border-line bg-bg p-5 transition hover:border-line-strong focus-ring"
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
        <p className="text-xs text-ink-muted">
          Leading: <strong className="text-ink">{result.leading}</strong>
        </p>
        <div
          role="img"
          aria-label={`Seat share: ${result.results.map((p) => `${p.party} ${p.seats}`).join(', ')}`}
          className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-bg-muted"
        >
          {result.results.map((p) => (
            <span
              key={p.party}
              style={{
                width: `${(p.seats / result.totalSeats) * 100}%`,
                background: p.partyColor,
              }}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-ink-muted">
          {result.results.slice(0, 3).map((p) => (
            <span key={p.party} className="inline-flex items-center gap-1">
              <span
                aria-hidden
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
