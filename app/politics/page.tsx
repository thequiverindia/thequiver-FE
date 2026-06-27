import { CategoryHero } from '@/components/sections/CategoryHero';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { ARTICLES } from '@/lib/mock-data';

export const metadata = {
  title: 'Politics — Power, policy and the politics of nation-building',
};

export default function PoliticsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const articles = ARTICLES.filter((a) => a.category === 'politics');
  return (
    <>
      <CategoryHero
        kicker="Politics"
        title="Power, policy and the politics of nation-building"
        description="Parliament, party machinery, Centre-state relations, and the choices that shape India."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Politics' }]}
        hero={articles[0]}
      />
      <CategoryGrid articles={articles.slice(1)} page={page} basePath="/politics" />
    </>
  );
}
