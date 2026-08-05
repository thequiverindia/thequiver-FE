import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <Container as="section" className="py-12">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-bg-muted" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-bg-muted"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="aspect-[16/10] w-full rounded-lg bg-bg-muted" />
      <div className="h-4 w-2/3 rounded bg-bg-muted" />
      <div className="h-3 w-full rounded bg-bg-muted" />
      <div className="h-3 w-5/6 rounded bg-bg-muted" />
    </div>
  );
}
