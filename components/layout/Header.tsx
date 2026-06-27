import Link from 'next/link';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { PRIMARY_NAV } from '@/lib/constants';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      {/* Main row — logo top-left, nav inline, utilities right */}
      <div className="container-page flex h-16 items-center gap-6">
        <Logo />

        {/* Inline primary nav — desktop, left-aligned next to logo */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-bg-muted hover:text-ink"
            >
              {item.label === 'Live' && (
                <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-breaking" />
              )}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions — pushed right */}
        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher className="hidden lg:block" />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>

      {/* Horizontal category strip — mobile only */}
      <nav className="border-t border-line/60 lg:hidden">
        <div className="container-page flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-bg-muted hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
