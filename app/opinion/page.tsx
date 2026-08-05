import { CategoryHero } from '@/components/sections/CategoryHero';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { AUTHORS, ARTICLES } from '@/lib/mock-data';
import { Avatar } from '@/components/ui/Avatar';

export const metadata = {
  title: 'Opinion — The long view',
  description: 'Sharp commentary from columnists across the spectrum.',
};

export default function OpinionPage() {
  const articles = ARTICLES.filter((a) => a.category === 'opinion');
  return (
    <>
      <CategoryHero
        kicker="Opinion"
        title="The long view"
        description="Columns, essays and arguments — from voices across the political spectrum. Read, disagree, respond."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Opinion' }]}
        hero={articles[0]}
      />
      <Container as="section" className="py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="space-y-2 divide-y divide-line">
              {articles.slice(1).map((a) => (
                <ArticleCard key={a.id} article={a} variant="list" />
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-line bg-bg p-6 lg:sticky lg:top-24">
              <p className="kicker mb-4">Our columnists</p>
              <ul className="space-y-4">
                {AUTHORS.filter((a) =>
                  /column|editor|chief/i.test(a.role),
                ).map((a) => (
                  <li key={a.id} className="flex items-center gap-3">
                    <Avatar src={a.avatar} name={a.name} size="md" />
                    <div>
                      <p className="text-sm font-medium text-ink">{a.name}</p>
                      <p className="text-xs text-ink-muted">{a.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
