'use client';

import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { applyTheme, readStored } from '@/lib/theme';

/**
 * Quick light/dark switch. Icons are CSS-swapped via the `dark:` variant so
 * the first paint is always correct (no useEffect flash). Theme family is
 * chosen in ThemeMenu; this only flips the mode.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const { theme } = readStored();
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(theme, isDark ? 'light' : 'dark');
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-bg-muted hover:text-ink active:bg-bg-muted focus-ring',
        className,
      )}
    >
      <Moon className="h-4 w-4 dark:hidden" />
      <Sun className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
