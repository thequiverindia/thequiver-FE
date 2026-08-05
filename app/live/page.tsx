import { Radio, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Tabs } from '@/components/ui/Tabs';
import { LIVE_UPDATES, ARTICLES } from '@/lib/mock-data';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { cn, formatDateTime, timeAgo } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
  title: 'Live Updates — Breaking news as it happens',
};

const TAG_STYLES: Record<string, { dot: string; chip: string }> = {
  breaking: { dot: 'bg-danger', chip: 'text-danger bg-danger/10' },
  parliament: { dot: 'bg-brand', chip: 'text-brand bg-brand/10' },
  election: { dot: 'bg-success', chip: 'text-success bg-success/10' },
  statement: { dot: 'bg-warn', chip: 'text-warn bg-warn/10' },
  developing: { dot: 'bg-ink-subtle', chip: 'text-ink-muted bg-bg-muted' },
};
const FALLBACK_TAG = TAG_STYLES.developing;

const TAG_LABELS: Record<string, string> = {
  breaking: 'Breaking',
  parliament: 'Parliament',
  election: 'Elections',
  statement: 'Statements',
};

export default function LivePage({
  searchParams,
}: {
  searchParams?: { tag?: string };
}) {
  const tag = searchParams?.tag;
  const filtered = tag ? LIVE_UPDATES.filter((u) => u.tag === tag) : LIVE_UPDATES;
  const groups = groupByDay(filtered);
  const latest = LIVE_UPDATES[0];

  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-10 md:py-14">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Live' },
            ]}
          />
          <div className="mt-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-breaking px-3 py-1 text-xs font-semibold uppercase tracking-wider text-on-media">
              <Radio className="h-3 w-3 animate-pulse-dot" />
              Live
            </span>
            {latest && (
              <span className="text-sm text-ink-muted">
                Last update {timeAgo(latest.time)}
              </span>
            )}
          </div>
          <h1 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl md:text-5xl">
            Breaking news, as it happens
          </h1>
          <p className="mt-3 max-w-2xl text-base text-ink-muted sm:text-lg">
            Every newsworthy moment, time-stamped and sourced. Bookmark this page during big
            news days.
          </p>
        </Container>
      </header>

      <Container>
        <Tabs
          active={tag ? TAG_LABELS[tag] ?? 'All' : 'All'}
          items={[
            { label: 'All', href: '/live', count: LIVE_UPDATES.length },
            { label: 'Breaking', href: '/live?tag=breaking' },
            { label: 'Parliament', href: '/live?tag=parliament' },
            { label: 'Elections', href: '/live?tag=election' },
            { label: 'Statements', href: '/live?tag=statement' },
          ]}
        />
      </Container>

      <Container as="section" className="py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {filtered.length === 0 && (
              <p className="rounded-xl border border-dashed border-line bg-bg-subtle p-8 text-center text-sm text-ink-muted">
                No updates under this tag yet.{' '}
                <Link href="/live" className="font-medium text-ink underline">
                  See all updates
                </Link>
              </p>
            )}
            {Object.entries(groups).map(([day, items]) => (
              <div key={day} className="mb-10">
                <h2 className="kicker mb-4">{day}</h2>
                <ol className="relative space-y-6 border-l border-line pl-6">
                  {items.map((u) => {
                    const style = TAG_STYLES[u.tag] ?? FALLBACK_TAG;
                    return (
                      <li key={u.id} className="relative">
                        <span
                          aria-hidden
                          className={cn(
                            'absolute -left-[31px] top-1 inline-flex h-3 w-3 rounded-full ring-4 ring-bg',
                            style.dot,
                          )}
                        />
                        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                              style.chip,
                            )}
                          >
                            {u.tag}
                          </span>
                          <time dateTime={u.time}>{formatDateTime(u.time)}</time>
                          {u.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" aria-hidden />
                              {u.location}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-pretty text-lg leading-snug text-ink">
                          {u.text}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-line bg-bg p-6">
                <p className="kicker mb-3">Related coverage</p>
                <div className="space-y-4">
                  {ARTICLES.slice(0, 3).map((a) => (
                    <ArticleCard key={a.id} article={a} variant="inline" />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
                <p className="kicker mb-3">Push alerts</p>
                <p className="font-serif text-lg leading-snug text-ink">
                  Get a notification only for breaking news. No spam, no fluff.
                </p>
                <Link
                  href="/notifications"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring"
                >
                  Enable push alerts
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

function groupByDay(updates: typeof LIVE_UPDATES) {
  const sorted = [...updates].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );
  const groups: Record<string, typeof updates> = {};
  for (const u of sorted) {
    const d = new Date(u.time);
    const key = d.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    groups[key] = groups[key] ?? [];
    groups[key].push(u);
  }
  return groups;
}
