/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LogOut, ChevronDown, Globe } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import type { User } from '@supabase/supabase-js';
import { useI18n } from '@/lib/i18n';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

export default function Header() {
  const { locale, setLocale, t } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  const characterName = user?.user_metadata?.character_name ?? user?.user_metadata?.full_name ?? 'Capsuleer';
  const characterId = user?.user_metadata?.character_id;
  const portraitUrl = characterId
    ? `https://images.evetech.net/characters/${characterId}/portrait?size=128`
    : undefined;

  return (
    <header className="nb-nav sticky top-0 z-50 animate-fade-down">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">

        {/* Brand */}
        <a href="/" className="group flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex size-10 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-cyan)] shadow-[3px_3px_0px_var(--nb-shadow)] transition-transform group-hover:rotate-12">
            <Logo className="size-6 text-black" />
          </div>
          <span className="text-xl font-black uppercase tracking-tight">
            {t('nav.brand')}
          </span>
        </a>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="flex items-center gap-1.5">
            <Globe className="size-4 text-[var(--nb-text-faint)] hidden sm:block" strokeWidth={2} />
            <div className="lang-switch" role="group" aria-label="Language">
              <button
                onClick={() => setLocale('en')}
                className={locale === 'en' ? 'active' : ''}
                aria-pressed={locale === 'en'}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('id')}
                className={locale === 'id' ? 'active' : ''}
                aria-pressed={locale === 'id'}
              >
                ID
              </button>
            </div>
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Auth */}
          {loading ? (
            <Skeleton className="h-10 w-28 border-3 border-[var(--nb-border)]" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="nb-btn nb-btn-secondary text-xs py-2 nb-focus">
                {portraitUrl && (
                  <img
                    src={portraitUrl}
                    alt=""
                    className="size-7 border-2 border-[var(--nb-border)] transition-transform hover:scale-110"
                  />
                )}
                <span className="hidden sm:inline font-black">{characterName}</span>
                <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[4px_4px_0px_var(--nb-shadow)] rounded-none animate-scale-in">
                <div className="flex items-center gap-3 px-3 py-3 border-b-2 border-[var(--nb-border)]">
                  {portraitUrl && (
                    <img src={portraitUrl} alt="" className="size-10 border-2 border-[var(--nb-border)]" />
                  )}
                  <div>
                    <p className="text-sm font-black">{characterName}</p>
                    <p className="text-xs text-[var(--nb-text-muted)] font-mono">{t('nav.capsuleer')}</p>
                  </div>
                </div>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    render={<a href="/auth/logout" />}
                    className="cursor-pointer gap-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-none transition-colors"
                  >
                    <LogOut className="size-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href="/auth/login" className="nb-btn nb-btn-primary nb-focus">
              {t('nav.signin')}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
