import { Bell, ShieldCheck, Vote, MessageSquare } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { UserNav } from '@/components/user/UserNav';
import { Tabs } from '@/components/ui/Tabs';
import { getArticles } from '@/lib/data';
import { timeAgo } from '@/lib/utils';

export const metadata = { title: 'Notifications' };

const TYPE_META = {
  alert: { Icon: Bell, color: 'text-breaking', bg: 'bg-breaking/10' },
  verify: { Icon: ShieldCheck, color: 'text-verified', bg: 'bg-verified/10' },
  election: { Icon: Vote, color: 'text-brand', bg: 'bg-brand/10' },
  reply: { Icon: MessageSquare, color: 'text-saffron', bg: 'bg-saffron/10' },
} as const;

async function buildNotifications() {
  // Placeholder notifications derived from recent stories until real
  // engagement notifications arrive with the accounts milestone.
  const { docs } = await getArticles({ limit: 8 });
  return docs.map((a, i) => ({
    id: a.id,
    type: (['alert', 'verify', 'election', 'reply'] as const)[i % 4],
    title: a.title,
    time: a.publishedAt,
    unread: i < 3,
  }));
}

export default async function NotificationsPage() {
  const NOTIFICATIONS = await buildNotifications();
  return (
    <Container as="section" className="py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Notifications' }]} />

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <UserNav active="/notifications" />
        </aside>

        <div className="lg:col-span-9">
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-3xl font-semibold text-ink">
              Notifications
            </h1>
            <button className="text-sm font-medium text-ink-muted hover:text-ink">
              Mark all as read
            </button>
          </div>
          <Tabs
            className="mt-6"
            active="All"
            items={[
              { label: 'All', href: '/notifications' },
              { label: 'Breaking', href: '/notifications?type=alert' },
              { label: 'Fact-checks', href: '/notifications?type=verify' },
              { label: 'Elections', href: '/notifications?type=election' },
              { label: 'Replies', href: '/notifications?type=reply' },
            ]}
          />
          <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-bg">
            {NOTIFICATIONS.map((n) => {
              const meta = TYPE_META[n.type];
              return (
                <li
                  key={n.id}
                  className={`flex gap-4 p-5 ${n.unread ? 'bg-bg-subtle' : ''}`}
                >
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.bg} ${meta.color}`}
                  >
                    <meta.Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink">{n.title}</p>
                    <p className="mt-1 text-xs text-ink-muted">{timeAgo(n.time)}</p>
                  </div>
                  {n.unread && (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-breaking" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Container>
  );
}
