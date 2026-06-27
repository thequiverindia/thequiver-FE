import { notFound } from 'next/navigation';
import { CategoryHero } from '@/components/sections/CategoryHero';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { CATEGORIES } from '@/lib/constants';
import { ARTICLES } from '@/lib/mock-data';
import type { Category } from '@/lib/types';

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const page = Number(searchParams.page ?? 1);
  const articles = ARTICLES.filter((a) => a.category === (cat.slug as Category));
  return (
    <>
      <CategoryHero
        kicker={cat.label}
        title={cat.label}
        description={cat.description}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Categories', href: '/news' },
          { label: cat.label },
        ]}
        hero={articles[0]}
      />
      <CategoryGrid
        articles={articles.slice(1)}
        page={page}
        basePath={`/category/${cat.slug}`}
      />
    </>
  );
}
