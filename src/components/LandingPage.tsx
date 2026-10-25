'use client';

import {
  ArrowRight, BarChart3, Check, HelpCircle, Lock, Search, ShieldCheck, Skull, Table2, Target, Zap,
} from 'lucide-react';
import Logo from '@/components/Logo';
import DemoLedger from '@/components/landing/DemoLedger';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/* ── Small pieces ───────────────────────────────────────── */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-[var(--nb-text-muted)]">
      <span className="inline-block size-1.5 bg-[var(--nb-amber)]" aria-hidden="true" />
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="max-w-2xl text-balance text-center text-3xl font-[900] uppercase leading-[0.95] tracking-tighter sm:text-4xl lg:text-[2.9rem]">
      {children}
    </h2>
  );
}

/** Renders **bold** markers from the dictionary as a highlighted span. */
function withBold(text: string) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="bg-[var(--nb-amber)] px-1 font-black">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

const PAIN_ICONS = [Skull, Target, HelpCircle];
const FEATURE_ICONS = [Search, Table2, BarChart3, ShieldCheck];

export default function LandingPage() {
  const { t } = useI18n();

  const pains = [
    { icon: PAIN_ICONS[0], title: t('pain.1.title'), desc: t('pain.1.desc'), color: 'bg-[var(--nb-pink)]' },
    { icon: PAIN_ICONS[1], title: t('pain.2.title'), desc: t('pain.2.desc'), color: 'bg-[var(--nb-amber)]' },
    { icon: PAIN_ICONS[2], title: t('pain.3.title'), desc: t('pain.3.desc'), color: 'bg-[var(--nb-cyan)]' },
  ];

  const features = [
    { icon: FEATURE_ICONS[0], title: t('sell.1.title'), desc: t('sell.1.desc'), badge: t('sell.1.badge') },
    { icon: FEATURE_ICONS[1], title: t('sell.2.title'), desc: t('sell.2.desc'), badge: t('sell.2.badge') },
    { icon: FEATURE_ICONS[2], title: t('sell.3.title'), desc: t('sell.3.desc'), badge: t('sell.3.badge') },
    { icon: FEATURE_ICONS[3], title: t('sell.4.title'), desc: t('sell.4.desc'), badge: t('sell.4.badge') },
  ];

  const ribbon = [
    { value: t('ribbon.1.val'), label: t('ribbon.1.label'), color: 'bg-[var(--nb-lime)]' },
    { value: t('ribbon.2.val'), label: t('ribbon.2.label'), color: 'bg-[var(--nb-cyan)]' },
    { value: t('ribbon.3.val'), label: t('ribbon.3.label'), color: 'bg-[var(--nb-amber)]' },
  ];

  const trust = ['Janice · Jita', 'EVE SSO', 'EN / ID', 'Dark mode'];

  return (
    <div className="flex flex-col items-center overflow-x-clip">
      {/* ── Marquee ───────────────────────────── */}
      <div className="marquee-strip w-full" aria-hidden="true">
        <div className="marquee-inner">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="mx-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-black"
            >
              <Zap className="size-3.5" strokeWidth={3} />
              {t('marquee.text')}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ──────────────────────────────── */}
      <section className="w-full max-w-5xl px-5 pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div className="flex flex-col items-center text-center">
          <span className="animate-fade-down inline-flex items-center gap-2 border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] shadow-[3px_3px_0px_var(--nb-shadow)]">
            <Logo className="size-3.5" />
            {t('hero.badge')}
          </span>

          <h1 className="animate-fade-up mt-7 text-balance text-[13vw] font-[900] uppercase leading-[0.86] tracking-tighter sm:text-6xl md:text-7xl lg:text-[5.25rem]">
            <span className="block">{t('hero.h1.line1')}</span>
            <span className="mt-1.5 inline-block -rotate-1 border-3 border-[var(--nb-border)] bg-[var(--nb-pink)] px-3 pb-1 pt-0.5 text-black shadow-[5px_5px_0px_var(--nb-shadow)]">
              {t('hero.h1.line2')}
            </span>
            <span className="mt-1.5 block text-[var(--nb-cyan)] drop-shadow-[3px_3px_0px_var(--nb-shadow)]">
              {t('hero.h1.line3')}
            </span>
          </h1>

          <p
            className="animate-fade-up mt-8 max-w-xl border-l-4 border-[var(--nb-amber)] pl-4 text-left text-base font-semibold leading-relaxed sm:text-lg"
            style={{ animationDelay: '80ms' }}
          >
            {withBold(t('hero.sub'))}
          </p>

          <div
            className="animate-fade-up mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
            style={{ animationDelay: '140ms' }}
          >
            <a
              href="/auth/login"
              className="flex items-center justify-center gap-2.5 border-3 border-[var(--nb-border)] bg-[var(--nb-cyan)] px-6 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-black shadow-[5px_5px_0px_var(--nb-shadow)] transition-transform hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_var(--nb-shadow)] active:translate-y-0.5 active:shadow-[2px_2px_0px_var(--nb-shadow)]"
            >
              <Logo className="size-4" />
              {t('hero.cta.primary')}
            </a>
            <a
              href="#demo"
              className="flex items-center justify-center gap-2 border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] px-5 py-3.5 text-sm font-black uppercase tracking-[0.12em] shadow-[5px_5px_0px_var(--nb-shadow)] transition-transform hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_var(--nb-shadow)] active:translate-y-0.5 active:shadow-[2px_2px_0px_var(--nb-shadow)]"
            >
              {t('hero.cta.secondary')}
              <ArrowRight className="size-4" strokeWidth={3} aria-hidden="true" />
            </a>
          </div>

          <ul
            className="animate-fade-up mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--nb-text-muted)]"
            style={{ animationDelay: '200ms' }}
          >
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="size-3 text-[var(--nb-lime)]" strokeWidth={3.5} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Value ribbon ──────────────────────── */}
      <section className="w-full border-y-3 border-[var(--nb-border)] bg-[var(--nb-surface-alt)]">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 px-5 py-6 sm:grid-cols-3 sm:gap-4">
          {ribbon.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] p-3 shadow-[4px_4px_0px_var(--nb-shadow)]"
            >
              <span
                aria-hidden="true"
                className={cn('size-9 shrink-0 border-3 border-[var(--nb-border)]', item.color)}
              />
              <div className="min-w-0">
                <p className="text-lg font-[900] uppercase leading-none tracking-tight">{item.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pain points ───────────────────────── */}
      <section className="w-full max-w-5xl px-5 py-16 sm:py-24">
        <Kicker>{t('pain.kicker')}</Kicker>
        <div className="mt-4 flex justify-center">
          <SectionTitle>{t('pain.title')}</SectionTitle>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {pains.map((pain) => (
            <div
              key={pain.title}
              className={cn(
                'flex flex-col border-3 border-[var(--nb-border)] p-5 shadow-[5px_5px_0px_var(--nb-shadow)]',
                pain.color
              )}
            >
              <span className="mb-4 flex size-10 items-center justify-center border-3 border-[var(--nb-border)] bg-white shadow-[3px_3px_0px_var(--nb-shadow)]">
                <pain.icon className="size-5 text-black" strokeWidth={3} aria-hidden="true" />
              </span>
              <h3 className="text-base font-[900] uppercase leading-tight tracking-tight text-black">
                {pain.title}
              </h3>
              <p className="mt-2 text-[13px] font-semibold leading-relaxed text-black/75">{pain.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sample ledger ─────────────────────── */}
      <section
        id="demo"
        className="w-full scroll-mt-20 border-y-3 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-5xl px-5">
          <Kicker>{t('demo.kicker')}</Kicker>
          <div className="mt-4 flex justify-center">
            <SectionTitle>{t('demo.title')}</SectionTitle>
          </div>

          <div className="mt-10">
            <DemoLedger />
          </div>

          <p className="mx-auto mt-8 max-w-xl text-center text-[13px] font-semibold leading-relaxed text-[var(--nb-text-muted)]">
            {t('demo.hint')}
          </p>
        </div>
      </section>

      {/* ── Features ──────────────────────────── */}
      <section id="features" className="w-full max-w-5xl scroll-mt-20 px-5 py-16 sm:py-24">
        <Kicker>{t('sell.kicker')}</Kicker>
        <div className="mt-4 flex justify-center">
          <SectionTitle>{t('sell.title')}</SectionTitle>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-4 border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] p-5 shadow-[5px_5px_0px_var(--nb-shadow)] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--nb-shadow)] sm:flex-row"
            >
              <span className="flex size-12 shrink-0 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-cyan)] shadow-[3px_3px_0px_var(--nb-shadow)] transition-transform group-hover:-rotate-3">
                <feature.icon className="size-6 text-black" strokeWidth={2.75} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-[900] uppercase leading-tight tracking-tight">
                    {feature.title}
                  </h3>
                  <span className="border-2 border-[var(--nb-border)] bg-[var(--nb-lime)] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-black">
                    {feature.badge}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold leading-relaxed text-[var(--nb-text-muted)]">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="relative w-full border-t-3 border-[var(--nb-border)] bg-[var(--nb-surface)] py-16 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, var(--nb-text) 1.5px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-balance text-3xl font-[900] uppercase leading-[0.95] tracking-tighter sm:text-5xl">
            {t('cta.title.1')}
            <br />
            <span className="text-[var(--nb-cyan)] drop-shadow-[3px_3px_0px_var(--nb-shadow)]">
              {t('cta.title.2')}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm font-semibold leading-relaxed text-[var(--nb-text-muted)] sm:text-base">
            {t('cta.sub')}
          </p>

          <a
            href="/auth/login"
            className="mx-auto mt-9 flex w-fit items-center gap-3 border-3 border-[var(--nb-border)] bg-[var(--nb-cyan)] px-7 py-4 text-base font-black uppercase tracking-[0.12em] text-black shadow-[6px_6px_0px_var(--nb-shadow)] transition-transform hover:-translate-y-1 hover:shadow-[9px_9px_0px_var(--nb-shadow)] active:translate-y-0.5 active:shadow-[2px_2px_0px_var(--nb-shadow)]"
          >
            <Logo className="size-5" />
            {t('cta.btn')}
          </a>

          <p className="mt-10 flex items-center justify-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[var(--nb-text-faint)]">
            <Lock className="size-3" strokeWidth={3} aria-hidden="true" />
            {t('cta.footer')}
          </p>
        </div>
      </section>
    </div>
  );
}
