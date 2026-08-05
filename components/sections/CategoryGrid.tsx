import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Newspaper } from 'lucide-react';
import type { Article } from '@/lib/types';

export function CategoryGrid({
  articles,
  page = 1,
  perPage = 9,
  basePath = '/news',
}: {
  articles: Article[];
  page?: number;
  perPage?: number;
  basePath?: string;
}) {
  if (articles.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<Newspaper className="h-5 w-5" />}
          title="No articles yet in this section"
          description="Our editors are working on it. Check back soon, or browse another section."
        />
      </Container>
    );
  }
  const totalPages = Math.ceil(articles.length / perPage);
  const start = (page - 1) * perPage;
  const visible = articles.slice(start, start + perPage);

  // Page 1 opens with a two-up feature row so listings have rhythm
  // instead of a uniform card wall.
  const useLeadRow = page === 1 && visible.length > 3;
  const lead = useLeadRow ? visible.slice(0, 2) : [];
  const rest = useLeadRow ? visible.slice(2) : visible;

  return (
    <Container as="section" className="py-12">
      {useLeadRow && (
        <div className="mb-10 grid gap-8 border-b border-line pb-10 md:grid-cols-2">
          {lead.map((a) => (
            <ArticleCard key={a.id} article={a} variant="feature" />
          ))}
        </div>
      )}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <ArticleCard key={a.id} article={a} variant="standard" />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} basePath={basePath} />
    </Container>
  );
}
