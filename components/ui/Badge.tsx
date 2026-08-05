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
  breaking: 'bg-breaking text-on-media border border-breaking',
  verified: 'bg-verified/10 text-verified border border-verified/20',
  saffron: 'bg-accent/10 text-accent border border-accent/20',
  brand: 'bg-brand/10 text-brand border border-brand/20',
  success: 'bg-success/10 text-success border border-success/20',
  warn: 'bg-warn/10 text-warn border border-warn/25',
  danger: 'bg-danger/10 text-danger border border-danger/20',
  live: 'bg-breaking text-on-media border border-breaking',
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
