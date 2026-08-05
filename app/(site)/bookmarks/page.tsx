import { Bookmark, Folder } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { UserNav } from '@/components/user/UserNav';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getArticles } from '@/lib/data';

export const metadata = { title: 'Bookmarks' };

const COLLECTIONS = [
  { label: 'All saved', count: 28 },
  { label: 'Read later', count: 14 },
  { label: 'Elections research', count: 7 },
  { label: 'Fact-checks', count: 5 },
  { label: 'Long form', count: 2 },
];

export default async function BookmarksPage() {
  const saved = (await getArticles({ limit: 6 })).docs;
  return (
    <Container as="section" className="py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Bookmarks' }]} />

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <UserNav active="/bookmarks" />
          <div className="mt-6 rounded-2xl border border-line bg-bg p-2">
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Collections
            </p>
            <ul className="space-y-1">
              {COLLECTIONS.map((c, i) => (
                <li key={c.label}>
                  <button
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                      i === 0
                        ? 'bg-bg-muted font-medium text-ink'
                        : 'text-ink-muted hover:bg-bg-subtle hover:text-ink'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Folder className="h-3.5 w-3.5" />
                      {c.label}
                    </span>
                    <span className="rounded-full bg-bg px-1.5 py-0.5 text-[10px] text-ink-muted">
                      {c.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="kicker">Bookmarks</p>
              <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">
                All saved articles
              </h1>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-4 py-2 text-sm font-medium text-ink hover:bg-bg-muted">
              + New collection
            </button>
          </div>

          {saved.length === 0 ? (
            <EmptyState
              icon={<Bookmark className="h-5 w-5" />}
              title="No bookmarks yet"
              description="Hit the bookmark icon on any article to save it for later. Your reading list lives here."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
