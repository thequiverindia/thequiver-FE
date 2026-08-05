import { CategoryHero } from '@/components/sections/CategoryHero';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { ARTICLES } from '@/lib/mock-data';

export const metadata = {
  title: 'International — India in the world',
};

export default async function InternationalPage(
  props: {
    searchParams: Promise<{ page?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page ?? 1);
  const articles = ARTICLES.filter((a) => a.category === 'international');
  const hero = articles[0] ?? ARTICLES[0];
  return (
    <>
      <CategoryHero
        kicker="International"
        title="India in the world. The world in India."
        description="Diplomacy, foreign policy, and the global stories with consequences at home."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'International' }]}
        hero={hero}
      />
      <CategoryGrid
        articles={articles.filter((a) => a.id !== hero.id)}
        page={page}
        basePath="/international"
      />
    </>
  );
}
