import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { UserNav } from '@/components/user/UserNav';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getReaderBookmarkedArticles } from '@/lib/data/reader';
import { getReaderId } from '@/auth';

export const metadata = { title: 'Bookmarks' };

export default async function BookmarksPage() {
  const readerId = await getReaderId();
  const saved = readerId ? await getReaderBookmarkedArticles(readerId) : [];

  return (
    <Container as="section" className="py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Bookmarks' }]} />

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <UserNav active="/bookmarks" />
        </aside>

        <div className="lg:col-span-9">
          <h1 className="font-serif text-3xl font-semibold text-ink">Bookmarks</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Stories you saved with the <Bookmark className="inline h-3.5 w-3.5" aria-hidden />{' '}
            Save button — synced to your account.
          </p>

          {!readerId ? (
            <div className="mt-10">
              <EmptyState
                icon={<Bookmark className="h-5 w-5" />}
                title="Sign in to see your bookmarks"
                description="Your saved stories follow your account across devices."
              />
              <div className="mt-4 text-center">
                <Link
                  href="/login"
                  className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring"
                >
                  Sign in with Google
                </Link>
              </div>
            </div>
          ) : saved.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={<Bookmark className="h-5 w-5" />}
                title="Nothing saved yet"
                description="Tap the Save button on any story and it will appear here."
              />
              <div className="mt-4 text-center">
                <Link
                  href="/news"
                  className="inline-flex rounded-full border border-line-strong bg-bg px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-bg-muted focus-ring"
                >
                  Browse today&rsquo;s stories
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {saved.map((a) => (
                <ArticleCard key={a.id} article={a} variant="standard" />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
