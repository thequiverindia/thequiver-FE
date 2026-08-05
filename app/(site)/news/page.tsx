import { CategoryHero } from '@/components/sections/CategoryHero';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { TrendingTags } from '@/components/sections/TrendingTags';
import { Container } from '@/components/ui/Container';
import { getArticles } from '@/lib/data';

export const metadata = {
  title: 'News — All stories from TheQuiverIndia',
  description: 'Everything we are reporting today. Sorted by recency.',
};

export default async function NewsPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page ?? 1);
  const { docs } = await getArticles({ limit: 100 });
  return (
    <>
      <CategoryHero
        kicker="All News"
        title="Everything we're reporting today"
        description="Every story TheQuiverIndia has published, sorted by most recent. Use the filter or search to narrow down."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'News' }]}
        hero={docs[0]}
      />
      <Container>
        <TrendingTags />
      </Container>
      <CategoryGrid articles={docs.slice(1)} page={page} basePath="/news" />
    </>
  );
}
