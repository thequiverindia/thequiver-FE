import { cn } from '@/lib/utils';

type Tone =
  | 'neutral'
  | 'breaking'
  | 'verified'
  | 'saffron'
  | 'brand'
  | 'success'
  | 'warn'
  | 'danger'
  | 'live';

const tones: Record<Tone, string> = {
  neutral: 'bg-bg-muted text-ink-muted border border-line',
  breaking: 'bg-breaking text-white border border-breaking',
  verified: 'bg-verified/10 text-verified border border-verified/20',
  saffron: 'bg-saffron/10 text-saffron border border-saffron/20',
  brand: 'bg-brand/10 text-brand border border-brand/20',
  success: 'bg-verified/10 text-verified border border-verified/20',
  warn: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20',
  danger: 'bg-breaking/10 text-breaking border border-breaking/20',
  live: 'bg-breaking text-white border border-breaking',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
  withDot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  withDot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide',
        tones[tone],
        className,
      )}
    >
      {withDot && (
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-pulse-dot rounded-full bg-current" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
