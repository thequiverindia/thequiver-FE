'use client';

/**
 * Theme runtime — the single source of truth for theme state.
 *
 * Two independent axes, persisted separately:
 *   theme  (palette family) -> data-theme attribute on <html>
 *   mode   (light|dark|system) -> .dark class on <html>
 *
 * components/layout/ThemeScript.tsx mirrors this logic inline so the
 * first paint is correct; keep the two in sync when editing.
 */

export const THEME_KEY = 'tqi-theme';
export const MODE_KEY = 'tqi-mode';
/** Pre-rebrand storage key, migrated on first read. */
export const LEGACY_KEY = 'jv-theme';

export type ThemeId = 'royal' | 'editorial' | 'peacock' | 'press';
export type Mode = 'light' | 'dark' | 'system';

export const THEMES: {
  id: ThemeId;
  label: string;
  description: string;
  /** [brand, accent] preview swatches. */
  swatch: [string, string];
}[] = [
  {
    id: 'royal',
    label: 'Royal',
    description: 'Violet & gold',
    swatch: ['#371D51', '#E3C237'],
  },
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'Indigo & marigold',
    swatch: ['#1E1B4B', '#A16207'],
  },
  {
    id: 'peacock',
    label: 'Peacock',
    description: 'Teal & gold',
    swatch: ['#0E5E63', '#8F6B0B'],
  },
  {
    id: 'press',
    label: 'Ivory Press',
    description: 'Paper & oxblood',
    swatch: ['#7A2E2E', '#92640D'],
  },
];

const THEME_IDS = THEMES.map((t) => t.id);

export function systemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

export function resolveDark(mode: Mode): boolean {
  return mode === 'dark' || (mode === 'system' && systemPrefersDark());
}

export function readStored(): { theme: ThemeId; mode: Mode } {
  let theme: ThemeId = 'royal';
  let mode: Mode = 'system';
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t && (THEME_IDS as string[]).includes(t)) theme = t as ThemeId;
    const m = localStorage.getItem(MODE_KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (m === 'light' || m === 'dark' || m === 'system') mode = m;
  } catch {}
  return { theme, mode };
}

/** Applies theme + mode to the DOM, persists them, and syncs browser chrome color. */
export function applyTheme(theme: ThemeId, mode: Mode) {
  const root = document.documentElement;
  const dark = resolveDark(mode);
  root.dataset.theme = theme;
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';
  try {
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(MODE_KEY, mode);
  } catch {}
  // Sync <meta name="theme-color"> with the actual rendered background.
  requestAnimationFrame(() => {
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]:not([media])',
    );
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = getComputedStyle(document.body).backgroundColor;
  });
}
