import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ShareBar({
  className,
  orientation = 'horizontal',
}: {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}) {
  const buttons = [
    { Icon: Headphones, label: 'Listen', tone: 'ink' as const },
    { Icon: Twitter, label: 'Tweet', tone: 'ink' as const },
    { Icon: Facebook, label: 'Facebook', tone: 'ink' as const },
    { Icon: Linkedin, label: 'LinkedIn', tone: 'ink' as const },
    { Icon: LinkIcon, label: 'Copy link', tone: 'ink' as const },
    { Icon: Share2, label: 'Share', tone: 'ink' as const },
  ];
  return (
    <div
      className={cn(
        'flex gap-1',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className,
      )}
    >
      {buttons.map(({ Icon, label }) => (
        <button
          key={label}
          type="button"
          title={label}
          aria-label={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg text-ink-muted transition hover:border-line-strong hover:bg-bg-muted hover:text-ink"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
