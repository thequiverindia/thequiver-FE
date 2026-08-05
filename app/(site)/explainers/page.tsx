import { CategoryHero } from '@/components/sections/CategoryHero';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { getArticles } from '@/lib/data';

export const metadata = {
  title: 'Explainers — The story behind the headlines',
};

export default async function ExplainersPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page ?? 1);
  const { docs } = await getArticles({ limit: 100, category: 'explainers' });
  return (
    <>
      <CategoryHero
        kicker="Explainers"
        title="The story behind the headlines"
        description="Plain-language guides to the policies, processes and institutions shaping India today."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Explainers' }]}
        hero={docs[0]}
      />
      <CategoryGrid articles={docs.slice(1)} page={page} basePath="/explainers" />
    </>
  );
}
