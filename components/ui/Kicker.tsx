import { cn } from '@/lib/utils';

export function Kicker({
  children,
  className,
  tone = 'saffron',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'saffron' | 'brand' | 'breaking' | 'verified' | 'ink';
}) {
  const tones = {
    saffron: 'text-saffron',
    brand: 'text-brand',
    breaking: 'text-breaking',
    verified: 'text-verified',
    ink: 'text-ink',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]',
        tones[tone],
        className,
      )}
    >
      <span className="h-px w-5 bg-current opacity-60" />
      {children}
    </span>
  );
}
