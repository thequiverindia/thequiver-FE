import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { TRENDING_TAGS } from '@/lib/mock-data';

export function TrendingTags() {
  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-line py-4">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
        <TrendingUp className="h-3.5 w-3.5 text-saffron" />
        Trending
      </span>
      <div className="flex flex-wrap gap-2">
        {TRENDING_TAGS.map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="rounded-full border border-line bg-bg px-3 py-1 text-xs text-ink-muted transition hover:border-line-strong hover:text-ink"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
