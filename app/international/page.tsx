import { CategoryHero } from '@/components/sections/CategoryHero';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { ARTICLES } from '@/lib/mock-data';

export const metadata = {
  title: 'International — India in the world',
};

export default function InternationalPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const articles = ARTICLES.filter((a) => a.category === 'international');
  return (
    <>
      <CategoryHero
        kicker="International"
        title="India in the world. The world in India."
        description="Diplomacy, foreign policy, and the global stories with consequences at home."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'International' }]}
        hero={articles[0] ?? ARTICLES[0]}
      />
      <CategoryGrid articles={articles} page={page} basePath="/international" />
    </>
  );
}
