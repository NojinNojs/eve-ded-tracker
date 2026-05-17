'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Check localStorage or system preference on mount
    const stored = localStorage.getItem('ded-theme');
    if (stored === 'dark') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDark(true);
      document.documentElement.classList.add('dark');
    } else if (stored === 'light') {
      setDark(false);
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ded-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ded-theme', 'light');
    }
  }

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? (
        <Sun className="size-4 text-amber-400 transition-transform hover:rotate-45" strokeWidth={2.5} />
      ) : (
        <Moon className="size-4 transition-transform hover:-rotate-12" strokeWidth={2.5} />
      )}
    </button>
  );
}
