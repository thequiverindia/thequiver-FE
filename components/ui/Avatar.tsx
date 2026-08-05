import { cn, initials } from '@/lib/utils';

export function Avatar({
  src,
  name,
  size = 'md',
  className,
}: {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-lg',
  };
  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-muted font-medium text-ink-muted ring-1 ring-line',
        sizes[size],
        className,
      )}
    >
      {src ? (
        // Remote SVG avatars can't go through next/image optimization;
        // they're tiny, so a lazy <img> with intrinsic size is the right call.
        <img
          src={src}
          alt={name}
          loading="lazy"
          width={80}
          height={80}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-label={name} role="img">
          {initials(name)}
        </span>
      )}
    </div>
  );
}
