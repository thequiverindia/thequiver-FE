import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? `${basePath}?page=${page - 1}` : null;
  const next = page < totalPages ? `${basePath}?page=${page + 1}` : null;
  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm"
    >
      <PaginationLink href={prev} rel="prev">
        <ChevronLeft className="h-4 w-4" aria-hidden /> Previous
      </PaginationLink>
      <span className="text-ink-muted">
        Page <strong className="text-ink">{page}</strong> of {totalPages}
      </span>
      <PaginationLink href={next} rel="next">
        Next <ChevronRight className="h-4 w-4" aria-hidden />
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  rel,
  children,
}: {
  href: string | null;
  rel: 'prev' | 'next';
  children: React.ReactNode;
}) {
  const cls = cn(
    'inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2.5 transition',
    !href
      ? 'cursor-not-allowed opacity-40'
      : 'hover:border-line-strong hover:bg-bg-muted active:bg-bg-muted focus-ring',
  );
  if (!href) {
    return (
      <span aria-disabled="true" className={cls}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} rel={rel} className={cls}>
      {children}
    </Link>
  );
}
