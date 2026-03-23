'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('paylinkops-theme');
    const preferred =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

    setTheme(preferred);
    applyTheme(preferred);
    setReady(true);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    window.localStorage.setItem('paylinkops-theme', next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn"
      aria-label="Toggle dark mode"
      disabled={!ready}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
