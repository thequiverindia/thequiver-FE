import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Brand mark.
 *
 * Uses a pre-resized WebP (13KB) rather than the 699KB source PNG — the header
 * mark is at most 40px, so shipping a 1025px original would dominate the page
 * weight on mobile. The wordmark hides below `sm` so the header stays on one
 * line on small phones; the mark alone still identifies the site.
 */
export function Logo({
  className,
  showWord = true,
  size = 'md',
}: {
  className?: string;
  showWord?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const mark = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  }[size];
  const wordSize = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
  }[size];

  return (
    <Link
      href="/"
      className={cn('group inline-flex shrink-0 items-center gap-2 focus-ring rounded-md', className)}
      aria-label="TheQuiverIndia — Home"
    >
      <span className={cn('relative shrink-0 overflow-hidden rounded-lg', mark)}>
        <Image
          src="/logo-256.webp"
          alt=""
          fill
          sizes="44px"
          priority
          className="object-contain transition group-hover:scale-105"
        />
      </span>
      {showWord && (
        <span
          className={cn(
            'hidden font-serif font-semibold tracking-tight text-ink sm:inline',
            wordSize,
          )}
        >
          TheQuiverIndia
        </span>
      )}
    </Link>
  );
}
