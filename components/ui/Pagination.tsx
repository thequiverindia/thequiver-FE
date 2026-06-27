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
    <nav className="mt-12 flex items-center justify-between border-t border-line pt-6 text-sm">
      <PaginationLink href={prev} disabled={!prev}>
        <ChevronLeft className="h-4 w-4" /> Previous
      </PaginationLink>
      <span className="text-ink-muted">
        Page <strong className="text-ink">{page}</strong> of {totalPages}
      </span>
      <PaginationLink href={next} disabled={!next}>
        Next <ChevronRight className="h-4 w-4" />
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  disabled,
  children,
}: {
  href: string | null;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const cls = cn(
    'inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 transition',
    disabled
      ? 'pointer-events-none opacity-40'
      : 'hover:border-line-strong hover:bg-bg-muted',
  );
  if (disabled || !href) {
    return <span className={cls}>{children}</span>;
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
