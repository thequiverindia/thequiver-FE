import { Avatar } from '@/components/ui/Avatar';
import type { Author } from '@/lib/types';

export function AuthorByline({
  author,
  size = 'md',
}: {
  author: Author;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={author.avatar} name={author.name} size={size === 'sm' ? 'sm' : 'md'} />
      <div>
        <p className="text-sm font-medium text-ink">{author.name}</p>
        <p className="text-xs text-ink-muted">{author.role}</p>
      </div>
    </div>
  );
}

export function AuthorCard({ author }: { author: Author }) {
  return (
    <aside className="mt-12 flex items-start gap-4 rounded-2xl border border-line bg-bg-subtle p-6">
      <Avatar src={author.avatar} name={author.name} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="font-serif text-lg font-semibold text-ink">{author.name}</p>
        <p className="text-xs uppercase tracking-wider text-ink-muted">{author.role}</p>
        <p className="mt-2 text-sm text-ink-muted">{author.bio}</p>
        <a
          href={`/search?q=${encodeURIComponent(author.name)}`}
          className="mt-3 inline-flex text-xs font-medium text-ink hover:underline"
        >
          More from {author.name.split(' ')[0]} →
        </a>
      </div>
    </aside>
  );
}
