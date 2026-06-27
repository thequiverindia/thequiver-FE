'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchBar({
  className,
  variant = 'compact',
  placeholder = 'Search news, leaders, fact-checks…',
}: {
  className?: string;
  variant?: 'compact' | 'full';
  placeholder?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = q.trim();
    router.push(v ? `/search?q=${encodeURIComponent(v)}` : '/search');
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        'group relative flex items-center',
        variant === 'compact' ? 'w-full max-w-xs' : 'w-full',
        className,
      )}
      role="search"
    >
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-ink-subtle" />
      <input
        type="search"
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className={cn(
          'w-full rounded-full border border-line bg-bg-subtle py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-subtle transition focus:border-line-strong focus:bg-bg focus:outline-none',
          variant === 'full' && 'py-3 pl-11 text-base',
        )}
      />
    </form>
  );
}
