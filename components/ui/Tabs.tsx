import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Tabs({
  items,
  active,
  className,
}: {
  items: { label: string; href: string; count?: number }[];
  active?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        '-mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 scrollbar-hide sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8',
        className,
      )}
    >
      {items.map((item) => {
        const isActive = active === item.href || active === item.label;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition focus-ring',
              isActive
                ? 'border-ink text-ink'
                : 'border-transparent text-ink-muted hover:border-line-strong hover:text-ink',
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="rounded-full bg-bg-muted px-1.5 py-0.5 text-[10px] text-ink-muted">
                {item.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
