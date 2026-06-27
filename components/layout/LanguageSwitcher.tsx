'use client';

import { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'mr', label: 'मराठी' },
  { code: 'te', label: 'తెలుగు' },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('en');

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onResize() {
      setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-ink-muted transition hover:bg-bg-muted hover:text-ink focus-ring"
      >
        <Globe className="h-3.5 w-3.5" />
        {LANGS.find((l) => l.code === active)?.label}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close language picker"
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-line bg-bg shadow-lg"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={l.code === active}
                onClick={() => {
                  setActive(l.code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-sm text-ink-muted transition hover:bg-bg-muted hover:text-ink"
              >
                {l.label}
                {l.code === active && <Check className="h-3.5 w-3.5 text-verified" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
