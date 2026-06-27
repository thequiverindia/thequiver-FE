import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export function PageHero({
  kicker,
  title,
  description,
  breadcrumb,
}: {
  kicker?: string;
  title: string;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
}) {
  return (
    <header className="border-b border-line bg-bg-subtle">
      <Container className="py-10 md:py-14">
        <Breadcrumbs items={breadcrumb} />
        {kicker && <p className="kicker mt-6">{kicker}</p>}
        <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl font-semibold leading-tight text-ink md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-ink-muted">{description}</p>
        )}
      </Container>
    </header>
  );
}
