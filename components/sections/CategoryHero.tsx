import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ArticleCard } from '@/components/cards/ArticleCard';
import type { Article } from '@/lib/types';

export function CategoryHero({
  kicker,
  title,
  description,
  breadcrumb,
  hero,
}: {
  kicker: string;
  title: string;
  description: string;
  breadcrumb: { label: string; href?: string }[];
  hero?: Article;
}) {
  return (
    <header className="border-b border-line bg-bg-subtle">
      <Container className="py-10 md:py-14">
        <Breadcrumbs items={breadcrumb} />
        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="kicker">{kicker}</p>
            <h1 className="mt-3 text-balance font-serif text-4xl font-semibold leading-tight text-ink md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-muted">{description}</p>
          </div>
          {hero && (
            <div className="lg:col-span-6">
              <ArticleCard article={hero} variant="feature" />
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
