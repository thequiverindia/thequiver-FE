import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Verification } from '@/lib/types';

export function VerificationBadge({
  level,
  sources,
  className,
}: {
  level: Verification;
  sources?: number;
  className?: string;
}) {
  const meta = {
    verified: {
      label: 'Verified',
      Icon: ShieldCheck,
      classes: 'text-verified bg-verified/10 border-verified/20',
    },
    sourced: {
      label: 'Sourced',
      Icon: CheckCircle2,
      classes: 'text-brand bg-brand/10 border-brand/20',
    },
    developing: {
      label: 'Developing',
      Icon: AlertCircle,
      classes: 'text-saffron bg-saffron/10 border-saffron/20',
    },
  }[level];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        meta.classes,
        className,
      )}
    >
      <meta.Icon className="h-3 w-3" />
      {meta.label}
      {sources !== undefined && <span className="text-current/70">· {sources} sources</span>}
    </span>
  );
}
