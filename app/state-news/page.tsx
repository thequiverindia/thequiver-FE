import Link from 'next/link';
import { CategoryHero } from '@/components/sections/CategoryHero';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { ARTICLES } from '@/lib/mock-data';
import { STATES } from '@/lib/constants';

export const metadata = {
  title: 'State News — Stories from every corner of India',
};

export default function StateNewsPage() {
  const articles = ARTICLES.filter((a) => a.category === 'state-news');
  const all = articles.length > 0 ? articles : ARTICLES.slice(0, 8);
  return (
    <>
      <CategoryHero
        kicker="State News"
        title="Stories from every corner of India"
        description="Pick a state to read its local stories — from Bengaluru to Bhopal, Pune to Patna."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'State News' }]}
        hero={all[0]}
      />
      <Container as="section" className="py-12">
        <p className="kicker mb-4">Choose your state</p>
        <div className="flex flex-wrap gap-2">
          {STATES.map((s) => (
            <Link
              key={s}
              href={`/state-news?state=${encodeURIComponent(s)}`}
              className="rounded-full border border-line bg-bg px-4 py-2 text-sm text-ink-muted transition hover:border-line-strong hover:text-ink"
            >
              {s}
            </Link>
          ))}
        </div>
      </Container>
      <Container as="section" className="py-8">
        <h2 className="mb-6 font-serif text-2xl font-semibold text-ink md:text-3xl">
          Latest from the states
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {all.map((a) => (
            <ArticleCard key={a.id} article={a} variant="standard" />
          ))}
        </div>
      </Container>
    </>
  );
}
