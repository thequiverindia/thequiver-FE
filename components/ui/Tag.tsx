import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Tag({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const classes = cn(
    'inline-flex items-center rounded-full border border-line bg-bg px-3 py-1 text-xs text-ink-muted transition hover:border-line-strong hover:bg-bg-muted hover:text-ink',
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        #{children}
      </Link>
    );
  }
  return <span className={classes}>{children}</span>;
}
