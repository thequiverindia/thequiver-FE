import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, MessageSquare, BarChart3, LogOut } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { UserNav } from '@/components/user/UserNav';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { auth, signOut, type ReaderSession } from '@/auth';
import { getReaderBookmarkedArticles, getReaderStats } from '@/lib/data/reader';

export const metadata = { title: 'Your profile' };

export default async function ProfilePage() {
  const session = (await auth()) as ReaderSession | null;
  if (!session?.user) redirect('/login');
  const readerId = session.readerId ?? null;
  const [stats, recentSaved] = readerId
    ? await Promise.all([
        getReaderStats(readerId),
        getReaderBookmarkedArticles(readerId).then((a) => a.slice(0, 3)),
      ])
    : [{ bookmarks: 0, comments: 0, votes: 0 }, []];

  return (
    <Container as="section" className="py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Your profile' }]} />

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <UserNav active="/profile" />
        </aside>

        <div className="lg:col-span-9">
          {/* Identity */}
          <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-bg p-6">
            <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-bg-muted text-xl font-medium text-ink-muted ring-1 ring-line">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="h-full w-full object-cover" />
              ) : (
                (session.user.name ?? 'R').slice(0, 1).toUpperCase()
              )}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-2xl font-semibold text-ink">
                {session.user.name ?? 'Reader'}
              </h1>
              <p className="text-sm text-ink-muted">{session.user.email}</p>
            </div>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-bg-muted active:bg-bg-muted focus-ring"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                Sign out
              </button>
            </form>
          </div>

          {/* Activity */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <StatCard Icon={Bookmark} label="Saved stories" value={stats.bookmarks} href="/bookmarks" />
            <StatCard Icon={MessageSquare} label="Comments" value={stats.comments} />
            <StatCard Icon={BarChart3} label="Poll votes" value={stats.votes} href="/polls" />
          </div>

          {/* Recent bookmarks */}
          <div className="mt-10">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-xl font-semibold text-ink">Recently saved</h2>
              <Link href="/bookmarks" className="text-sm font-medium text-ink-muted hover:text-ink">
                All bookmarks →
              </Link>
            </div>
            {recentSaved.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-line bg-bg-subtle p-6 text-center text-sm text-ink-muted">
                Tap <strong>Save</strong> on any story and it appears here.
              </p>
            ) : (
              <div className="mt-4 grid gap-6 md:grid-cols-3">
                {recentSaved.map((a) => (
                  <ArticleCard key={a.id} article={a} variant="compact" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

function StatCard({
  Icon,
  label,
  value,
  href,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  href?: string;
}) {
  const inner = (
    <>
      <Icon className="h-4 w-4 text-ink-muted" aria-hidden />
      <p className="mt-2 font-serif text-2xl font-semibold text-ink">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink-muted">{label}</p>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="rounded-xl border border-line bg-bg p-4 transition hover:border-line-strong focus-ring">
        {inner}
      </Link>
    );
  }
  return <div className="rounded-xl border border-line bg-bg p-4">{inner}</div>;
}
