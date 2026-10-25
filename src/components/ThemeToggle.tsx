'use client';

import { Sun, Moon } from 'lucide-react';

function currentTheme(): 'dark' | 'light' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * The `<html>` class is the single source of truth (set before first paint by the
 * inline script in the layout), so this button needs no React state at all —
 * which also keeps it hydration-safe and lint-clean.
 */
export default function ThemeToggle() {
  function toggle() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('ded-theme', next);
  }

  return (
    <button type="button" onClick={toggle} className="theme-toggle">
      <Sun
        aria-hidden="true"
        className="hidden size-4 text-amber-400 transition-transform hover:rotate-45 dark:block"
        strokeWidth={2.5}
      />
      <Moon
        aria-hidden="true"
        className="block size-4 transition-transform hover:-rotate-12 dark:hidden"
        strokeWidth={2.5}
      />
      <span className="sr-only dark:hidden">Switch to dark mode</span>
      <span className="sr-only hidden dark:inline">Switch to light mode</span>
    </button>
  );
}
