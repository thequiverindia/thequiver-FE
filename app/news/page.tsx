import { CategoryHero } from '@/components/sections/CategoryHero';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { TrendingTags } from '@/components/sections/TrendingTags';
import { Container } from '@/components/ui/Container';
import { ARTICLES } from '@/lib/mock-data';

export const metadata = {
  title: 'News — All stories from TheQuiverIndia',
  description: 'Everything we are reporting today. Sorted by recency.',
};

export default function NewsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return (
    <>
      <CategoryHero
        kicker="All News"
        title="Everything we're reporting today"
        description="Every story TheQuiverIndia has published, sorted by most recent. Use the filter or search to narrow down."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'News' }]}
        hero={sorted[0]}
      />
      <Container>
        <TrendingTags />
      </Container>
      <CategoryGrid articles={sorted.slice(1)} page={page} basePath="/news" />
    </>
  );
}
