'use client';

import {
  ArrowRight, BarChart3, Check, HelpCircle, Lock, Search, ShieldCheck, Skull, Table2, Target, Zap,
} from 'lucide-react';
import Logo from '@/components/Logo';
import DemoLedger from '@/components/landing/DemoLedger';
import RunTicket from '@/components/landing/RunTicket';
import CountUp from '@/components/ui/CountUp';
import Reveal from '@/components/ui/Reveal';
import { useI18n } from '@/lib/i18n';
import { computeInsights } from '@/lib/stats';
import { DEMO_RUNS } from '@/lib/demo';
import { formatISKSigned, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

/* ── Small pieces ───────────────────────────────────────── */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[var(--nb-text-muted)]">
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

const CTA_BASE =
  'flex min-h-13 items-center justify-center gap-2.5 border-3 border-[var(--nb-border)] px-6 py-3.5 text-base font-black uppercase tracking-[0.1em] shadow-[5px_5px_0px_var(--nb-shadow)] transition-transform hover:-translate-y-0.5 hover:shadow-[7px_7px_0px_var(--nb-shadow)] active:translate-y-0.5 active:shadow-[2px_2px_0px_var(--nb-shadow)]';

export default function LandingPage() {
  const { t } = useI18n();
  const insights = computeInsights(DEMO_RUNS);

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

  const steps = [t('hero.step.1'), t('hero.step.2'), t('hero.step.3')];
  const trust = ['Janice · Jita', 'EVE SSO', 'EN / ID', 'Dark mode'];

  const proof = [
    {
      value: insights.count,
      label: t('proof.runs'),
      format: (value: number) => String(Math.round(value)),
    },
    {
      value: insights.winRate,
      label: t('proof.winrate'),
      format: (value: number) => formatPercent(value, 0),
    },
    {
      value: insights.totalProfit,
      label: t('proof.net'),
      format: (value: number) => formatISKSigned(Math.round(value)),
    },
  ];

  return (
    <div className="flex flex-col items-center overflow-x-clip">
      {/* ── Marquee ───────────────────────────── */}
      <div className="marquee-strip w-full" aria-hidden="true">
        <div className="marquee-inner">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="mx-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-black"
            >
              <Zap className="size-4" strokeWidth={3} />
              {t('marquee.text')}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ──────────────────────────────── */}
      <section className="w-full max-w-6xl px-5 pb-12 pt-10 sm:pb-16 sm:pt-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="animate-fade-down inline-flex items-center gap-2 border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] shadow-[3px_3px_0px_var(--nb-shadow)]">
              <Logo className="size-4" />
              {t('hero.badge')}
            </span>

            <h1 className="animate-fade-up mt-6 text-balance text-[12.5vw] font-[900] uppercase leading-[0.9] tracking-tighter sm:text-6xl lg:text-[4.75rem]">
              <span className="block">{t('hero.h1.line1')}</span>
              <span className="mt-2 inline-block bg-[var(--nb-pink)] px-2 pb-1 text-black">
                {t('hero.h1.line2')}
              </span>
              <span className="mt-2 block border-b-8 border-[var(--nb-cyan)] pb-1">{t('hero.h1.line3')}</span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-xl border-l-4 border-[var(--nb-amber)] pl-4 text-left text-base font-semibold leading-relaxed sm:text-lg"
              style={{ animationDelay: '70ms' }}
            >
              {withBold(t('hero.sub'))}
            </p>

            <div
              className="animate-fade-up mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto"
              style={{ animationDelay: '130ms' }}
            >
              <a href="/auth/login" className={cn(CTA_BASE, 'bg-[var(--nb-cyan)] text-black')}>
                <Logo className="size-4" />
                {t('hero.cta.primary')}
              </a>
              <a href="#demo" className={cn(CTA_BASE, 'bg-[var(--nb-surface)] text-[var(--nb-text)]')}>
                {t('hero.cta.secondary')}
                <ArrowRight className="size-4" strokeWidth={3} aria-hidden="true" />
              </a>
            </div>

            {/* three steps — plain enough for a first-timer, tight enough for a regular */}
            <ol
              className="animate-fade-up mt-9 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-3"
              style={{ animationDelay: '190ms' }}
              aria-label={t('hero.steps.label')}
            >
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-2 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2.5 py-2 shadow-[2px_2px_0px_var(--nb-shadow)]"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-amber)] font-mono text-xs font-black text-black">
                    {index + 1}
                  </span>
                  <span className="text-left text-xs font-bold leading-tight">{step}</span>
                </li>
              ))}
            </ol>

            <ul
              className="animate-fade-up mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[var(--nb-text-muted)] lg:justify-start"
              style={{ animationDelay: '240ms' }}
            >
              {trust.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-profit" strokeWidth={3.5} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex w-full flex-col items-center gap-2.5 lg:sticky lg:top-24 lg:items-end">
            <span className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[var(--nb-text-muted)]">
              {t('hero.ticket.label')}
            </span>
            <Reveal delay={80} className="flex w-full justify-center lg:justify-end">
              <RunTicket />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Proof strip ───────────────────────── */}
      <section className="w-full border-y-3 border-[var(--nb-border)] bg-[var(--nb-surface-alt)]">
        <dl className="mx-auto grid max-w-5xl grid-cols-1 divide-y-2 divide-[var(--nb-border)] px-5 sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
          {proof.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 py-6 text-center sm:py-7">
              <dd className="font-mono text-3xl font-[900] leading-none tracking-tight sm:text-4xl">
                <CountUp value={item.value} format={item.format} />
              </dd>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--nb-text-muted)]">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Pain points ───────────────────────── */}
      <section className="w-full max-w-5xl px-5 py-16 sm:py-24">
        <Kicker>{t('pain.kicker')}</Kicker>
        <div className="mt-4 flex justify-center">
          <SectionTitle>{t('pain.title')}</SectionTitle>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {pains.map((pain, index) => (
            <Reveal key={pain.title} delay={index * 70}>
              <div
                className={cn(
                  'flex h-full flex-col border-3 border-[var(--nb-border)] p-5 shadow-[5px_5px_0px_var(--nb-shadow)]',
                  pain.color
                )}
              >
                <span className="mb-4 flex size-11 items-center justify-center border-3 border-[var(--nb-border)] bg-white shadow-[3px_3px_0px_var(--nb-shadow)]">
                  <pain.icon className="size-5 text-black" strokeWidth={3} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-[900] uppercase leading-tight tracking-tight text-black">
                  {pain.title}
                </h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-black/75">{pain.desc}</p>
              </div>
            </Reveal>
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

          <Reveal className="mt-10">
            <DemoLedger />
          </Reveal>

          <p className="mx-auto mt-8 max-w-xl text-center text-sm font-semibold leading-relaxed text-[var(--nb-text-muted)]">
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
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 60}>
              <div className="group flex h-full flex-col gap-4 border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] p-5 shadow-[5px_5px_0px_var(--nb-shadow)] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--nb-shadow)] sm:flex-row">
                <span className="flex size-12 shrink-0 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-cyan)] shadow-[3px_3px_0px_var(--nb-shadow)] transition-transform group-hover:-rotate-3">
                  <feature.icon className="size-6 text-black" strokeWidth={2.75} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-[900] uppercase leading-tight tracking-tight">
                      {feature.title}
                    </h3>
                    <span className="border-2 border-[var(--nb-border)] bg-[var(--nb-lime)] px-1.5 py-0.5 text-xs font-black uppercase tracking-[0.1em] text-black">
                      {feature.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--nb-text-muted)]">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </Reveal>
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
          <Reveal>
            <h2 className="text-balance text-3xl font-[900] uppercase leading-[0.95] tracking-tighter sm:text-5xl">
              {t('cta.title.1')}
              <br />
              <span className="text-[var(--nb-accent-text)] drop-shadow-[3px_3px_0px_var(--nb-shadow)]">
                {t('cta.title.2')}
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base font-semibold leading-relaxed text-[var(--nb-text-muted)]">
              {t('cta.sub')}
            </p>

            <a href="/auth/login" className={cn(CTA_BASE, 'mx-auto mt-8 w-fit bg-[var(--nb-cyan)] text-black')}>
              <Logo className="size-5" />
              {t('cta.btn')}
            </a>

            <p className="mt-9 flex items-center justify-center gap-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-[var(--nb-text-muted)]">
              <Lock className="size-3.5" strokeWidth={3} aria-hidden="true" />
              {t('cta.footer')}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
