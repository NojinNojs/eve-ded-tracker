'use client';

import { useState } from 'react';
import {
  ArrowRight, Zap, Search,
  BarChart3, Target, ShieldCheck, HelpCircle, Skull, ChevronRight,
  Lock, Rocket, Users,
} from 'lucide-react';
import Logo from '@/components/Logo';
import { formatISK, formatISKFull } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/* ── Fake demo data ──────────────────────────── */
const DEMO_RUNS = [
  { id: 1, ded: '10/10', faction: 'Guristas', loot: 2_340_000_000, cost: 180_000_000, bought: true },
  { id: 2, ded: '10/10', faction: 'Guristas', loot: 48_900_000, cost: 0, bought: false },
  { id: 3, ded: '8/10', faction: 'Sansha', loot: 890_000_000, cost: 120_000_000, bought: true },
  { id: 4, ded: '6/10', faction: 'Angel Cartel', loot: 340_000_000, cost: 0, bought: false },
  { id: 5, ded: '10/10', faction: 'Blood Raiders', loot: 1_780_000_000, cost: 200_000_000, bought: true },
];

/* ── Faction colors for visual flair ─────────── */
const factionColor: Record<string, string> = {
  Guristas: 'border-l-[var(--nb-cyan)]',
  Sansha: 'border-l-[var(--nb-amber)]',
  'Angel Cartel': 'border-l-[var(--nb-pink)]',
  'Blood Raiders': 'border-l-red-500',
  Serpentis: 'border-l-[var(--nb-lime)]',
};

export default function LandingPage() {
  const { t } = useI18n();
  const [activeRun, setActiveRun] = useState(0);

  const totalLoot = DEMO_RUNS.reduce((s, r) => s + r.loot, 0);
  const totalCost = DEMO_RUNS.reduce((s, r) => s + r.cost, 0);
  const totalProfit = totalLoot - totalCost;
  const avgPerRun = totalProfit / DEMO_RUNS.length;

  const painPoints = [
    { icon: Skull, title: t('pain.1.title'), desc: t('pain.1.desc'), color: 'var(--nb-pink)' },
    { icon: Target, title: t('pain.2.title'), desc: t('pain.2.desc'), color: 'var(--nb-amber)' },
    { icon: HelpCircle, title: t('pain.3.title'), desc: t('pain.3.desc'), color: 'var(--nb-cyan)' },
  ];

  const sellingPoints = [
    { icon: Search, title: t('sell.1.title'), desc: t('sell.1.desc'), badge: t('sell.1.badge') },
    { icon: BarChart3, title: t('sell.2.title'), desc: t('sell.2.desc'), badge: t('sell.2.badge') },
    { icon: Target, title: t('sell.3.title'), desc: t('sell.3.desc'), badge: t('sell.3.badge') },
    { icon: ShieldCheck, title: t('sell.4.title'), desc: t('sell.4.desc'), badge: t('sell.4.badge') },
  ];

  function renderBold(text: string) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-black">{part}</strong> : part
    );
  }

  return (
    <div className="flex flex-col items-center">

      {/* ── Marquee ───────────────────────── */}
      <div className="marquee-strip w-full">
        <div className="marquee-inner">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-6 text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
              <Zap className="size-4" />
              {t('marquee.text')}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ──────────────────────────── */}
      <section className="w-full max-w-5xl px-5 pt-14 pb-6 sm:pt-24 sm:pb-12">
        <div className="flex flex-col items-center text-center stagger">
          <span className="nb-badge bg-[var(--nb-lime)] mb-6 animate-bounce-subtle cursor-default select-none">
            {t('hero.badge')}
          </span>

          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl select-none">
            {t('hero.h1.line1')}
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">{t('hero.h1.line2')}</span>
              <span className="absolute bottom-0.5 left-0 right-0 h-[0.25em] bg-[var(--nb-cyan)] -z-0 sm:bottom-1 sm:h-[0.3em] transition-all hover:h-[0.5em]" />
            </span>
            <br />
            <span className="text-[var(--nb-text-faint)]">{t('hero.h1.line3')}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-[var(--nb-text-muted)] sm:text-lg leading-relaxed">
            {renderBold(t('hero.sub'))}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a href="/auth/login" className="nb-btn nb-btn-primary text-base px-8 py-3.5 hover-lift nb-focus group cursor-pointer">
              <Logo className="size-5 text-black transition-transform group-hover:rotate-12" />
              {t('hero.cta.primary')}
            </a>
            <a href="#demo" className="nb-btn nb-btn-secondary text-base hover-lift nb-focus group cursor-pointer">
              {t('hero.cta.secondary')}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Quick stats ribbon ────────────── */}
      <section className="w-full max-w-5xl px-5 pb-10 sm:pb-14">
        <div className="flex items-center justify-center gap-6 sm:gap-10 py-5 border-y-3 border-[var(--nb-border)] bg-[var(--nb-surface)] animate-fade-up">
          {[
            { icon: Rocket, label: t('ribbon.1.label'), val: t('ribbon.1.val') },
            { icon: Lock, label: t('ribbon.2.label'), val: t('ribbon.2.val') },
            { icon: Users, label: t('ribbon.3.label'), val: t('ribbon.3.val') },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 sm:gap-3 cursor-default select-none">
              <item.icon className="size-5 text-[var(--nb-text-faint)]" strokeWidth={2} />
              <div>
                <p className="font-mono text-base font-black sm:text-lg">{item.val}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--nb-text-faint)]">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pain Points ──────────────────── */}
      <section className="w-full max-w-5xl px-5 pb-16 sm:pb-20">
        <p className="mb-3 text-center text-xs font-black uppercase tracking-widest text-[var(--nb-text-faint)] animate-fade-up">
          {t('pain.kicker')}
        </p>
        <h2 className="mb-8 text-center text-2xl font-black uppercase tracking-tight sm:text-3xl animate-fade-up" style={{ animationDelay: '50ms' }}>
          {t('pain.title')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 stagger">
          {painPoints.map((p) => (
            <div key={p.title} className="nb-card hover-lift cursor-default p-5 sm:p-6" style={{ background: p.color }}>
              <div className="mb-3 flex size-11 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[2px_2px_0px_var(--nb-shadow)]">
                <p.icon className="size-5 text-[var(--nb-text)]" strokeWidth={2.5} />
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-black sm:text-lg">{p.title}</h3>
              <p className="mt-2 text-sm font-medium text-black/70 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive Demo ──────────────── */}
      <section id="demo" className="w-full border-y-3 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5">
          <p className="mb-2 text-center text-xs font-black uppercase tracking-widest text-[var(--nb-text-faint)]">
            {t('demo.kicker')}
          </p>
          <h2 className="mb-10 text-center text-2xl font-black uppercase tracking-tight sm:text-4xl">
            {t('demo.title')}
          </h2>

          {/* Demo stat cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 stagger mb-6">
            {[
              { label: t('net_profit'), value: `+${formatISK(totalProfit)}`, color: 'var(--nb-cyan)' },
              { label: t('total_runs'), value: String(DEMO_RUNS.length), color: 'var(--nb-lime)' },
              { label: t('avg_isk_run'), value: formatISK(avgPerRun), color: 'var(--nb-amber)' },
              { label: t('best_faction'), value: 'Guristas', color: 'var(--nb-pink)' },
            ].map((s) => (
              <div key={s.label} className="nb-card hover-lift cursor-default p-4 sm:p-5" style={{ background: s.color }}>
                <p className="text-[10px] font-black uppercase tracking-wider text-black/50">{s.label}</p>
                <p className="mt-1 font-mono text-xl font-black text-black sm:text-2xl animate-count-up">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Demo run list */}
          <div className="nb-card overflow-hidden animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="border-b-3 border-[var(--nb-border)] bg-[var(--nb-violet)] px-5 py-3 flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-tight text-black">{t('demo.ledger')}</p>
              <span className="nb-badge text-[9px]" style={{ background: 'var(--nb-cyan)', color: '#1a1a1a' }}>{t('demo.badge')}</span>
            </div>

            <div className="divide-y-2 divide-[var(--nb-border)]">
              {DEMO_RUNS.map((run, i) => {
                const profit = run.loot - run.cost;
                return (
                  <button
                    key={run.id}
                    type="button"
                    onClick={() => setActiveRun(i)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 text-left cursor-pointer',
                      'transition-all duration-200 border-l-4',
                      factionColor[run.faction] || 'border-l-transparent',
                      activeRun === i
                        ? 'bg-[var(--nb-amber)]'
                        : 'hover:bg-[var(--nb-hover-bg)] hover:pl-6'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn(
                        'flex h-8 w-12 shrink-0 items-center justify-center border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] font-mono text-[11px] font-black shadow-[2px_2px_0px_var(--nb-shadow)] transition-transform',
                        activeRun === i && 'rotate-2 scale-105 bg-[var(--nb-lime)]'
                      )}>
                        {run.ded}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-black truncate">{run.faction}</p>
                        <p className="text-[10px] font-bold text-[var(--nb-text-faint)] flex items-center gap-1.5 mt-0.5">
                          <span className={cn(
                            'nb-badge text-[8px] py-0',
                            run.bought ? 'bg-[var(--nb-amber)]' : 'bg-[var(--nb-lime)]'
                          )}>
                            {run.bought ? 'BOUGHT' : 'FREE'}
                          </span>
                          {run.bought && <span>Cost: {formatISK(run.cost)}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-bold text-[var(--nb-text-faint)]">{formatISK(run.loot)}</p>
                        <p className={cn(
                          'font-mono text-sm font-black',
                          profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        )}>
                          {profit >= 0 ? '+' : ''}{formatISK(profit)}
                        </p>
                      </div>
                      <ChevronRight className={cn(
                        'size-4 text-[var(--nb-text-faint)] transition-transform duration-200',
                        activeRun === i ? 'rotate-90 text-[var(--nb-text)]' : 'group-hover:translate-x-0.5'
                      )} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="border-t-3 border-[var(--nb-border)] bg-[var(--nb-hover-bg)] p-5 animate-fade-up" key={activeRun}>
              {(() => {
                const r = DEMO_RUNS[activeRun];
                const profit = r.loot - r.cost;
                return (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 stagger">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-faint)]">{t('escalation')}</p>
                      <p className="mt-0.5 text-lg font-black">{r.ded} {r.faction}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-faint)]">{t('loot_value')}</p>
                      <p className="mt-0.5 font-mono text-base font-bold">{formatISKFull(r.loot)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-faint)]">{t('capital_cost')}</p>
                      <p className="mt-0.5 font-mono text-base font-bold">{r.cost > 0 ? formatISKFull(r.cost) : '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-faint)]">{t('net_pnl')}</p>
                      <p className={cn(
                        'mt-0.5 font-mono text-lg font-black',
                        profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}>
                        {profit >= 0 ? '+' : ''}{formatISKFull(profit)}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[var(--nb-text-faint)] select-none">
            {t('demo.hint')}
          </p>
        </div>
      </section>

      {/* ── Selling Points ───────────────── */}
      <section id="features" className="w-full max-w-5xl px-5 py-14 sm:py-20">
        <p className="mb-2 text-center text-xs font-black uppercase tracking-widest text-[var(--nb-text-faint)]">
          {t('sell.kicker')}
        </p>
        <h2 className="mb-10 text-center text-2xl font-black uppercase tracking-tight sm:text-4xl">
          {t('sell.title')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 stagger">
          {sellingPoints.map((sp) => (
            <div key={sp.title} className="nb-card hover-lift cursor-default p-6 flex gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-cyan)] shadow-[3px_3px_0px_var(--nb-shadow)] transition-transform hover:rotate-6">
                <sp.icon className="size-6 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-tight">{sp.title}</h3>
                <span className="nb-badge bg-[var(--nb-lime)] text-[9px] mt-1 mb-2 inline-block">{sp.badge}</span>
                <p className="mt-1 text-sm text-[var(--nb-text-muted)] leading-relaxed">{sp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────── */}
      <section className="w-full border-t-3 border-[var(--nb-border)] bg-[#0f0f14] py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center stagger">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            {t('cta.title.1')}
            <br />
            <span className="text-[var(--nb-cyan)]">{t('cta.title.2')}</span>
          </h2>
          <p className="mt-4 text-base text-gray-400 sm:text-lg">
            {t('cta.sub')}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="/auth/login" className="nb-btn nb-btn-primary text-base px-10 py-3.5 hover-lift nb-focus group cursor-pointer">
              <Logo className="size-5 text-black transition-transform group-hover:rotate-12" />
              {t('cta.btn')}
            </a>
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-gray-600 select-none">
            {t('cta.footer')}
          </p>
        </div>
      </section>
    </div>
  );
}
