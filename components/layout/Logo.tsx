import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  showWord = true,
  size = 'md',
}: {
  className?: string;
  showWord?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const wordSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2', className)}
      aria-label="TheQuiverIndia — Home"
    >
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-ink text-bg transition group-hover:bg-brand">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M4 14c0-4 3-7 8-7s8 3 8 7" />
          <path d="M8 14v3" />
          <path d="M12 14v5" />
          <path d="M16 14v3" />
        </svg>
      </span>
      {showWord && (
        <span className={cn('font-serif font-semibold tracking-tight text-ink', wordSize)}>
          TheQuiverIndia
        </span>
      )}
    </Link>
  );
}
