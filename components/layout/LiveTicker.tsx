import { LIVE_UPDATES } from '@/lib/mock-data';
import { Radio } from 'lucide-react';
import Link from 'next/link';

export function LiveTicker() {
  const items = LIVE_UPDATES.slice(0, 6);
  return (
    <div className="border-b border-line bg-ink text-bg">
      <div className="container-page flex items-center gap-3 py-2 text-xs">
        <Link
          href="/live"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-breaking px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white sm:text-xs"
        >
          <Radio className="h-3 w-3 animate-pulse-dot" />
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
            className="flex w-max animate-marquee gap-10 whitespace-nowrap sm:gap-12"
            style={{ animationDuration: '70s' }}
          >
            {[...items, ...items].map((u, i) => (
              <Link
                key={`${u.id}-${i}`}
                href="/live"
                className="inline-flex items-center gap-2 text-bg/80 transition hover:text-bg"
              >
                <span className="h-1 w-1 rounded-full bg-saffron" />
                <span className="font-medium uppercase tracking-wider text-saffron">
                  {u.tag}
                </span>
                <span aria-hidden>·</span>
                <span>{u.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
