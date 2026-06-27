import { Radio, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { LIVE_UPDATES, ARTICLES } from '@/lib/mock-data';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { formatDateTime, timeAgo } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
  title: 'Live Updates — Breaking news as it happens',
};

const TAG_COLORS = {
  breaking: '#DC2626',
  parliament: '#1E1B4B',
  election: '#15803D',
  statement: '#EA580C',
  developing: '#737373',
} as const;

export default function LivePage() {
  const groups = groupByDay(LIVE_UPDATES);
  return (
    <>
      <header className="border-b border-line bg-ink text-bg">
        <Container className="py-10 md:py-14">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Live' },
            ]}
          />
          <div className="mt-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-breaking px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              <Radio className="h-3 w-3 animate-pulse-dot" />
              Live
            </span>
            <span className="text-sm text-bg/70">Last update {timeAgo(LIVE_UPDATES[0].time)}</span>
          </div>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Breaking news, as it happens
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-bg/80">
            Every newsworthy moment, time-stamped and sourced. Bookmark this page during big
            news days.
          </p>
        </Container>
      </header>

      <Container>
        <Tabs
          active="All"
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
            {Object.entries(groups).map(([day, items]) => (
              <div key={day} className="mb-10">
                <p className="kicker mb-4">{day}</p>
                <ol className="relative space-y-6 border-l border-line pl-6">
                  {items.map((u) => (
                    <li key={u.id} className="relative">
                      <span
                        className="absolute -left-[31px] top-1 inline-flex h-3 w-3 rounded-full ring-4 ring-bg"
                        style={{ background: TAG_COLORS[u.tag] ?? '#737373' }}
                      />
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                          style={{
                            color: TAG_COLORS[u.tag],
                            background: TAG_COLORS[u.tag] + '15',
                          }}
                        >
                          {u.tag}
                        </span>
                        <span>{formatDateTime(u.time)}</span>
                        {u.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {u.location}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-pretty text-lg leading-snug text-ink">
                        {u.text}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="rounded-2xl border border-line bg-bg p-6">
                <p className="kicker mb-3">Related coverage</p>
                <div className="space-y-4">
                  {ARTICLES.slice(0, 3).map((a) => (
                    <ArticleCard key={a.id} article={a} variant="inline" />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-saffron/30 bg-saffron/5 p-6">
                <p className="kicker mb-3">Push alerts</p>
                <p className="font-serif text-lg leading-snug text-ink">
                  Get a notification only for breaking news. No spam, no fluff.
                </p>
                <Link
                  href="/notifications"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg hover:bg-ink/90"
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
  const groups: Record<string, typeof updates> = {};
  for (const u of updates) {
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
