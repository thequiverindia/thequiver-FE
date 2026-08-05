import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { getTrendingTags } from '@/lib/data';

/** Tags ranked by how often they appear on recent stories. */
export async function TrendingTags() {
  const tags = await getTrendingTags(10);
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-line py-4">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
        <TrendingUp className="h-3.5 w-3.5 text-accent" aria-hidden />
        Trending
      </span>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="rounded-full border border-line bg-bg px-3 py-1.5 text-xs text-ink-muted transition hover:border-line-strong hover:text-ink focus-ring"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
