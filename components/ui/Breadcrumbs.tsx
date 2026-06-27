import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Crumb = { label: string; href?: string; truncate?: boolean };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-1.5 overflow-hidden text-xs text-ink-muted"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const labelClass = cn(
          item.truncate || isLast ? 'truncate' : 'whitespace-nowrap',
          isLast && 'text-ink',
        );
        return (
          <span
            key={i}
            className={cn(
              'inline-flex items-center gap-1.5',
              item.truncate ? 'min-w-0 flex-1' : 'shrink-0',
            )}
          >
            {item.href ? (
              <Link href={item.href} className={cn('hover:text-ink', labelClass)}>
                {item.label}
              </Link>
            ) : (
              <span className={labelClass}>{item.label}</span>
            )}
            {!isLast && (
              <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
