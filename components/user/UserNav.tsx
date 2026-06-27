import Link from 'next/link';
import { cn } from '@/lib/utils';

const ITEMS = [
  { label: 'Profile', href: '/profile' },
  { label: 'Bookmarks', href: '/bookmarks' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Settings', href: '/settings' },
];

export function UserNav({ active }: { active: string }) {
  return (
    <nav className="rounded-2xl border border-line bg-bg p-2">
      <ul className="space-y-1">
        {ITEMS.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm transition',
                active === i.href
                  ? 'bg-bg-muted font-medium text-ink'
                  : 'text-ink-muted hover:bg-bg-subtle hover:text-ink',
              )}
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
