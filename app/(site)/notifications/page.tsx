import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Bell, MessageSquare, Bookmark } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { UserNav } from '@/components/user/UserNav';
import { auth } from '@/auth';

export const metadata = { title: 'Notifications' };

/**
 * Notifications are not built yet.
 *
 * This page previously FABRICATED them: it took the latest articles, assigned
 * each a random type ("breaking alert", "reply to your comment"), marked three
 * as unread, and showed the identical list to every visitor — including
 * signed-out ones — with filter tabs that did nothing. On a site whose brand
 * is verification, inventing "someone replied to you" is the worst kind of
 * fake. It now tells the truth and points to what does work.
 */
export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <Container as="section" className="py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Notifications' }]} />

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <UserNav active="/notifications" />
        </aside>

        <div className="lg:col-span-9">
          <h1 className="font-serif text-3xl font-semibold text-ink">Notifications</h1>

          <div className="mt-6 rounded-2xl border border-dashed border-line bg-bg-subtle p-10 text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-bg text-ink-muted ring-1 ring-line">
              <Bell className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-5 font-serif text-xl font-semibold text-ink">
              Nothing to notify you about yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
              We&rsquo;ll use this space when there&rsquo;s something genuinely for you —
              a reply to your comment, or a fact-check on a story you saved. We
              don&rsquo;t send anything by email.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/bookmarks"
              className="flex items-start gap-3 rounded-xl border border-line bg-bg p-5 transition hover:border-line-strong focus-ring"
            >
              <Bookmark className="mt-0.5 h-4 w-4 text-ink-muted" aria-hidden />
              <span>
                <span className="block text-sm font-medium text-ink">Your bookmarks</span>
                <span className="block text-xs text-ink-muted">Stories you saved to read later</span>
              </span>
            </Link>
            <Link
              href="/news"
              className="flex items-start gap-3 rounded-xl border border-line bg-bg p-5 transition hover:border-line-strong focus-ring"
            >
              <MessageSquare className="mt-0.5 h-4 w-4 text-ink-muted" aria-hidden />
              <span>
                <span className="block text-sm font-medium text-ink">Join the discussion</span>
                <span className="block text-xs text-ink-muted">Comment on today&rsquo;s stories</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
