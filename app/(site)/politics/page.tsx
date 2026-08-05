import { CategoryHero } from '@/components/sections/CategoryHero';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { getArticles } from '@/lib/data';

export const metadata = {
  title: 'Politics — Power, policy and the politics of nation-building',
};

export default async function PoliticsPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page ?? 1);
  const { docs } = await getArticles({ limit: 100, category: 'politics' });
  return (
    <>
      <CategoryHero
        kicker="Politics"
        title="Power, policy and the politics of nation-building"
        description="Parliament, party machinery, Centre-state relations, and the choices that shape India."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Politics' }]}
        hero={docs[0]}
      />
      <CategoryGrid articles={docs.slice(1)} page={page} basePath="/politics" />
    </>
  );
}
