/**
 * Blocking inline script so the first paint has the right theme + mode.
 * Mirrors lib/theme.ts (storage keys, fallbacks, legacy migration) —
 * keep both in sync. The bg map below matches --bg in globals.css.
 */
export function ThemeScript() {
  const code = `
    (function() {
      try {
        var root = document.documentElement;
        var theme = localStorage.getItem('tqi-theme');
        if (theme !== 'editorial' && theme !== 'peacock' && theme !== 'press') theme = 'editorial';
        var mode = localStorage.getItem('tqi-mode') || localStorage.getItem('jv-theme');
        if (mode !== 'light' && mode !== 'dark' && mode !== 'system') mode = 'system';
        var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        root.setAttribute('data-theme', theme);
        root.classList.toggle('dark', dark);
        root.style.colorScheme = dark ? 'dark' : 'light';
        var BG = {
          editorial: ['#ffffff', '#0c0a09'],
          peacock: ['#fafbfa', '#091213'],
          press: ['#faf7f1', '#151210']
        };
        var meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = BG[theme][dark ? 1 : 0];
        document.head.appendChild(meta);
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
