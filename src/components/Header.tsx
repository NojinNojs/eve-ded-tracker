/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LogOut, ChevronDown, LogIn } from 'lucide-react';
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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-8 py-3">

        {/* Brand */}
        <a href="/" className="group flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center border-2 sm:border-3 border-[var(--nb-border)] bg-[var(--nb-cyan)] shadow-[2px_2px_0px_var(--nb-shadow)] sm:shadow-[3px_3px_0px_var(--nb-shadow)] transition-transform group-hover:rotate-12">
            <Logo className="size-5 sm:size-6 text-black" />
          </div>
          <span className="text-base sm:text-xl font-black uppercase tracking-tight whitespace-nowrap">
            {t('nav.brand')}
          </span>
        </a>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            <a href="/auth/login" className="nb-btn nb-btn-primary nb-focus flex items-center gap-2">
              <LogIn className="size-4" strokeWidth={3} />
              <span className="hidden sm:inline">EVE LOGIN</span>
              <span className="sm:hidden">LOGIN</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
