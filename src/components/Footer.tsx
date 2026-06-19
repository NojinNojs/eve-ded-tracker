'use client';

import { Heart, Mail, Globe, ExternalLink, ShieldAlert } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useI18n } from '@/lib/i18n';
import Logo from '@/components/Logo';

export default function Footer() {
  const { t, locale, setLocale } = useI18n();

  return (
    <footer className="mt-auto border-t-3 border-[var(--nb-border)] bg-[var(--nb-surface)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 opacity-5 pointer-events-none">
        <Logo className="size-96" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b-2 border-[var(--nb-border)] pb-8">
          
          {/* Brand & Legal */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-cyan)] shadow-[2px_2px_0px_var(--nb-shadow)] transition-transform hover:rotate-12">
                <Logo className="size-6 text-black" />
              </div>
              <div>
                <p className="text-lg font-black uppercase tracking-tight text-[var(--nb-text)] leading-none">
                  DED Tracker
                </p>
                <p className="text-xs font-bold text-[var(--nb-text-muted)] mt-1">
                  {t('footer.sub')}
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--nb-text-muted)] max-w-xs leading-relaxed font-medium">
              {t('footer.desc')}
            </p>
          </div>

          {/* Support & Contact */}
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm font-black uppercase tracking-widest text-[var(--nb-text)]">
              {t('footer.support')}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-[var(--nb-hover-bg)] px-3 py-2 border-2 border-[var(--nb-border)] shadow-[2px_2px_0px_var(--nb-shadow)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--nb-shadow)] transition-all cursor-default">
                <Heart className="size-4 text-red-500" fill="currentColor" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-[var(--nb-text-muted)] leading-none">{t('footer.isk')}</span>
                  <span className="text-sm font-black text-[var(--nb-text)]">sankuuu</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[var(--nb-bg)] px-3 py-2 border-2 border-[var(--nb-border)] shadow-[2px_2px_0px_var(--nb-shadow)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--nb-shadow)] transition-all group cursor-default">
                <Mail className="size-4 text-[var(--nb-text-muted)] group-hover:text-[var(--nb-text)] transition-colors" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-[var(--nb-text-muted)] leading-none">{t('footer.mail')}</span>
                  <span className="text-sm font-black text-[var(--nb-text)]">sankuuu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings & Links */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-sm font-black uppercase tracking-widest text-[var(--nb-text)]">
              {t('footer.prefs')}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 border-2 border-[var(--nb-border)] bg-[var(--nb-bg)] p-1 shadow-[2px_2px_0px_var(--nb-shadow)]">
                <Globe className="size-4 text-[var(--nb-text-faint)] ml-2 hidden sm:block" strokeWidth={2} />
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
              <ThemeToggle />
            </div>
            
            <a href="https://janice.e-corp.ovh/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-[var(--nb-text-muted)] hover:text-[var(--nb-text)] transition-colors mt-2">
              <span>{t('footer.powered')}</span>
              <ExternalLink className="size-3" />
            </a>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left text-[10px] sm:text-xs text-[var(--nb-text-muted)] font-medium opacity-60 hover:opacity-100 transition-opacity">
          <ShieldAlert className="size-6 shrink-0 hidden sm:block" strokeWidth={1.5} />
          <p>
            EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. 
            All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos 
            and designs are the intellectual property of CCP hf. 
          </p>
        </div>
      </div>
    </footer>
  );
}
