'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Monitor, Moon, Palette, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  applyTheme,
  readStored,
  MODE_KEY,
  THEME_KEY,
  THEMES,
  type Mode,
  type ThemeId,
} from '@/lib/theme';

const MODES: { id: Mode; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

/**
 * Theme family + mode picker. Also owns the global sync listeners:
 * cross-tab (storage) and OS preference changes while in system mode.
 */
export function ThemeMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>('editorial');
  const [mode, setMode] = useState<Mode>('system');
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stored = readStored();
    setTheme(stored.theme);
    setMode(stored.mode);

    function syncFromStorage(e: StorageEvent) {
      if (e.key !== THEME_KEY && e.key !== MODE_KEY) return;
      const next = readStored();
      setTheme(next.theme);
      setMode(next.mode);
      applyTheme(next.theme, next.mode);
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    function syncFromSystem() {
      const next = readStored();
      if (next.mode === 'system') applyTheme(next.theme, next.mode);
    }
    window.addEventListener('storage', syncFromStorage);
    media.addEventListener('change', syncFromSystem);
    return () => {
      window.removeEventListener('storage', syncFromStorage);
      media.removeEventListener('change', syncFromSystem);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function select(nextTheme: ThemeId, nextMode: Mode) {
    setTheme(nextTheme);
    setMode(nextMode);
    applyTheme(nextTheme, nextMode);
  }

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Choose theme"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-bg-muted hover:text-ink active:bg-bg-muted focus-ring"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div
            aria-hidden
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label="Theme settings"
            className="absolute right-0 z-30 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-bg p-2 shadow-lg shadow-ink/5"
          >
            <p className="px-2 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-subtle">
              Mode
            </p>
            <div className="grid grid-cols-3 gap-1">
              {MODES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={mode === id}
                  onClick={() => select(theme, id)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition focus-ring',
                    mode === id
                      ? 'bg-bg-muted text-ink'
                      : 'text-ink-muted hover:bg-bg-subtle hover:text-ink',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <p className="px-2 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-subtle">
              Theme
            </p>
            <div className="flex flex-col gap-1">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={theme === t.id}
                  onClick={() => select(t.id, mode)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition focus-ring',
                    theme === t.id ? 'bg-bg-muted' : 'hover:bg-bg-subtle',
                  )}
                >
                  <span className="flex shrink-0 -space-x-1" aria-hidden>
                    <span
                      className="h-4 w-4 rounded-full ring-2 ring-bg"
                      style={{ background: t.swatch[0] }}
                    />
                    <span
                      className="h-4 w-4 rounded-full ring-2 ring-bg"
                      style={{ background: t.swatch[1] }}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">{t.label}</span>
                    <span className="block text-[11px] text-ink-muted">
                      {t.description}
                    </span>
                  </span>
                  {theme === t.id && (
                    <Check className="h-4 w-4 shrink-0 text-verified" aria-hidden />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
