import { LIVE_UPDATES } from '@/lib/mock-data';
import { Radio } from 'lucide-react';
import Link from 'next/link';

/**
 * Calm ticker on a normal surface — theme-proof in every palette/mode.
 * Marquee pauses on hover/focus and disables under prefers-reduced-motion
 * (see .marquee-pausable in globals.css). The duplicated half is hidden
 * from AT and keyboard so items are only announced once.
 */
export function LiveTicker() {
  const items = LIVE_UPDATES.slice(0, 6);
  return (
    <div className="border-b border-line bg-bg-subtle">
      <div className="container-page flex items-center gap-3 py-2 text-xs">
        <Link
          href="/live"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-breaking px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-on-media focus-ring sm:text-xs"
        >
          <Radio className="h-3 w-3 animate-pulse-dot" aria-hidden />
          Live
        </Link>
        <div
          className="relative flex-1 overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(90deg, transparent, #000 32px, #000 calc(100% - 32px), transparent)',
            WebkitMaskImage:
              'linear-gradient(90deg, transparent, #000 32px, #000 calc(100% - 32px), transparent)',
          }}
        >
          <div
            className="marquee-pausable flex w-max animate-marquee gap-10 whitespace-nowrap sm:gap-12"
            style={{ animationDuration: '70s' }}
          >
            {[...items, ...items].map((u, i) => {
              const isDuplicate = i >= items.length;
              return (
                <Link
                  key={`${u.id}-${i}`}
                  href="/live"
                  aria-hidden={isDuplicate || undefined}
                  tabIndex={isDuplicate ? -1 : undefined}
                  className="inline-flex items-center gap-2 text-ink-muted transition hover:text-ink"
                >
                  <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
                  <span className="font-medium uppercase tracking-wider text-accent">
                    {u.tag}
                  </span>
                  <span aria-hidden>·</span>
                  <span>{u.text}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
