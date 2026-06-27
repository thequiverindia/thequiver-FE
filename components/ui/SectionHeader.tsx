import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Kicker } from './Kicker';

export function SectionHeader({
  kicker,
  title,
  description,
  href,
  hrefLabel = 'View all',
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-8',
        className,
      )}
    >
      <div className="min-w-0 max-w-2xl">
        {kicker && <Kicker className="mb-3">{kicker}</Kicker>}
        <h2 className="text-balance font-serif text-2xl font-semibold leading-tight text-ink md:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-pretty text-sm text-ink-muted md:text-base">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink sm:inline-flex"
        >
          {hrefLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
