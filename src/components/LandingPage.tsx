'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
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

const factionColor: Record<string, string> = {
  Guristas: 'border-l-[var(--nb-cyan)]',
  Sansha: 'border-l-[var(--nb-amber)]',
  'Angel Cartel': 'border-l-[var(--nb-pink)]',
  'Blood Raiders': 'border-l-red-500',
  Serpentis: 'border-l-[var(--nb-lime)]',
};

/* ── Framer Motion Variants ──────────────────── */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring' as const, bounce: 0.4 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const { t } = useI18n();
  const [activeRun, setActiveRun] = useState(0);

  const totalLoot = DEMO_RUNS.reduce((s, r) => s + r.loot, 0);
  const totalCost = DEMO_RUNS.reduce((s, r) => s + r.cost, 0);
  const totalProfit = totalLoot - totalCost;
  const avgPerRun = totalProfit / DEMO_RUNS.length;

  const painPoints = [
    { icon: Skull, title: t('pain.1.title'), desc: t('pain.1.desc'), color: 'bg-[var(--nb-pink)]', rotate: '-rotate-2' },
    { icon: Target, title: t('pain.2.title'), desc: t('pain.2.desc'), color: 'bg-[var(--nb-amber)]', rotate: 'rotate-1' },
    { icon: HelpCircle, title: t('pain.3.title'), desc: t('pain.3.desc'), color: 'bg-[var(--nb-cyan)]', rotate: '-rotate-1' },
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
      i % 2 === 1 ? <strong key={i} className="font-black text-[var(--nb-cyan)]">{part}</strong> : part
    );
  }

  return (
    <div className="flex flex-col items-center overflow-hidden">
      
      {/* ── Marquee ───────────────────────── */}
      <div className="marquee-strip w-full border-b-4 border-[var(--nb-border)]">
        <div className="marquee-inner">
          {Array.from({ length: 15 }).map((_, i) => (
            <span key={i} className="mx-6 text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
              <Zap className="size-4" />
              {t('marquee.text')}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ──────────────────────────── */}
      <section className="relative w-full max-w-6xl px-5 pt-16 pb-12 sm:pt-28 sm:pb-20">
        <motion.div 
          className="flex flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={popIn} className="relative z-10">
            <span className="inline-block border-3 border-[var(--nb-border)] bg-[var(--nb-lime)] px-4 py-1.5 font-black uppercase tracking-widest text-black shadow-[4px_4px_0px_var(--nb-shadow)] -rotate-2 hover:rotate-0 transition-transform">
              {t('hero.badge')}
            </span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="mt-8 text-5xl font-[900] uppercase leading-[0.9] tracking-tighter sm:text-7xl md:text-8xl lg:text-[7.5rem] select-none text-[var(--nb-text)]">
            {t('hero.h1.line1')}
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 px-2 text-white" style={{ WebkitTextStroke: '2px black' }}>{t('hero.h1.line2')}</span>
              <span className="absolute inset-0 bg-[var(--nb-pink)] border-4 border-[var(--nb-border)] shadow-[6px_6px_0px_var(--nb-shadow)] -z-0 -rotate-1" />
            </span>
            <br />
            <span className="text-[var(--nb-cyan)] drop-shadow-[4px_4px_0px_var(--nb-shadow)] mt-2 inline-block">{t('hero.h1.line3')}</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="mt-8 max-w-2xl text-lg sm:text-xl font-semibold leading-relaxed border-l-4 border-[var(--nb-amber)] pl-4 text-left">
            {renderBold(t('hero.sub'))}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-12 flex flex-col items-center gap-5 sm:flex-row">
            <a href="/auth/login" className="flex items-center gap-3 border-4 border-[var(--nb-border)] bg-[var(--nb-cyan)] px-8 py-4 font-black uppercase tracking-widest text-black shadow-[6px_6px_0px_var(--nb-shadow)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--nb-shadow)] active:translate-y-1 active:shadow-[0px_0px_0px_var(--nb-shadow)] text-lg">
              <Logo className="size-6 text-black" />
              {t('hero.cta.primary')}
            </a>
            <a href="#demo" className="flex items-center gap-2 border-4 border-transparent px-6 py-4 font-black uppercase tracking-widest text-[var(--nb-text-muted)] hover:text-[var(--nb-text)] hover:border-[var(--nb-border)] transition-all">
              {t('hero.cta.secondary')}
              <ArrowRight className="size-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 -z-10 opacity-20 hidden lg:block">
           <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="2"/></pattern></defs><rect width="200" height="200" fill="url(#grid)"/></svg>
        </div>
      </section>

      {/* ── Quick stats ribbon ────────────── */}
      <section className="w-full border-y-4 border-[var(--nb-border)] bg-[var(--nb-surface-alt)]">
        <motion.div 
          className="mx-auto max-w-6xl px-5 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 py-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            { icon: Rocket, label: t('ribbon.1.label'), val: t('ribbon.1.val'), color: 'bg-[var(--nb-pink)]', rotate: '-rotate-2' },
            { icon: Lock, label: t('ribbon.2.label'), val: t('ribbon.2.val'), color: 'bg-[var(--nb-cyan)]', rotate: 'rotate-1' },
            { icon: Users, label: t('ribbon.3.label'), val: t('ribbon.3.val'), color: 'bg-[var(--nb-amber)]', rotate: '-rotate-1' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className={cn("flex items-center gap-4 cursor-default select-none border-4 border-[var(--nb-border)] p-4 bg-[var(--nb-surface)] shadow-[6px_6px_0px_var(--nb-shadow)] hover:-translate-y-1 transition-transform", item.rotate)}>
              <div className={cn("flex size-14 shrink-0 items-center justify-center border-3 border-[var(--nb-border)] shadow-[3px_3px_0px_var(--nb-shadow)]", item.color)}>
                <item.icon className="size-6 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-[900] text-2xl uppercase tracking-tighter leading-none">{item.val}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--nb-text-muted)] mt-1">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Pain Points ──────────────────── */}
      <section className="w-full max-w-6xl px-5 py-20 sm:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} className="mb-4 text-center text-sm font-black uppercase tracking-[0.2em] text-[var(--nb-text-muted)]">
            {t('pain.kicker')}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="mb-12 text-center text-4xl font-[900] uppercase tracking-tight sm:text-5xl lg:text-6xl text-[var(--nb-text)]">
            {t('pain.title')}
          </motion.h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {painPoints.map((p, i) => (
              <motion.div key={i} variants={popIn} className={cn("border-4 border-[var(--nb-border)] p-6 sm:p-8 shadow-[8px_8px_0px_var(--nb-shadow)] hover:shadow-[12px_12px_0px_var(--nb-shadow)] transition-shadow", p.color, p.rotate)}>
                <div className="mb-5 flex size-14 items-center justify-center border-4 border-[var(--nb-border)] bg-white shadow-[4px_4px_0px_var(--nb-shadow)]">
                  <p.icon className="size-6 text-black" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-[900] uppercase tracking-tight text-black leading-tight mb-3">{p.title}</h3>
                <p className="font-semibold text-black/80 leading-relaxed text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Interactive Demo ──────────────── */}
      <section id="demo" className="w-full border-y-4 border-[var(--nb-border)] bg-[var(--nb-surface-alt)] py-20 sm:py-28 relative overflow-hidden">
        {/* Background diagonal stripes */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--nb-text) 0, var(--nb-text) 2px, transparent 2px, transparent 10px)' }} />
        
        <div className="mx-auto max-w-5xl px-5 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeInUp} className="mb-4 text-center text-sm font-black uppercase tracking-[0.2em] text-[var(--nb-text-muted)]">
              {t('demo.kicker')}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="mb-12 text-center text-4xl font-[900] uppercase tracking-tight sm:text-5xl lg:text-6xl text-[var(--nb-text)]">
              {t('demo.title')}
            </motion.h2>

            {/* Demo stat cards */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 mb-8">
              {[
                { label: t('net_profit'), value: `+${formatISK(totalProfit)}`, color: 'bg-[var(--nb-cyan)]', rotate: '-rotate-1' },
                { label: t('total_runs'), value: String(DEMO_RUNS.length), color: 'bg-[var(--nb-lime)]', rotate: 'rotate-2' },
                { label: t('avg_isk_run'), value: formatISK(avgPerRun), color: 'bg-[var(--nb-amber)]', rotate: '-rotate-2' },
                { label: t('best_faction'), value: 'Guristas', color: 'bg-[var(--nb-pink)]', rotate: 'rotate-1' },
              ].map((s, i) => (
                <div key={i} className={cn("border-4 border-[var(--nb-border)] p-4 sm:p-6 shadow-[6px_6px_0px_var(--nb-shadow)] flex flex-col justify-between", s.color, s.rotate)}>
                  <p className="text-xs font-black uppercase tracking-widest text-black/60 mb-2">{s.label}</p>
                  <p className="font-[900] text-2xl sm:text-3xl text-black leading-none drop-shadow-sm">
                    {s.value}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Demo run list (The "App" Window) */}
            <motion.div variants={fadeInUp} className="border-4 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[12px_12px_0px_var(--nb-shadow)] overflow-hidden">
              <div className="border-b-4 border-[var(--nb-border)] bg-[var(--nb-violet)] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full border-2 border-black bg-red-500" />
                    <div className="size-3 rounded-full border-2 border-black bg-yellow-500" />
                    <div className="size-3 rounded-full border-2 border-black bg-green-500" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest text-black ml-2">{t('demo.ledger')}</p>
                </div>
                <span className="border-2 border-black bg-[var(--nb-cyan)] text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  {t('demo.badge')}
                </span>
              </div>

              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-3/5 divide-y-2 divide-[var(--nb-border)] border-r-0 lg:border-r-4 border-[var(--nb-border)]">
                  {DEMO_RUNS.map((run, i) => {
                    const profit = run.loot - run.cost;
                    const isActive = activeRun === i;
                    return (
                      <motion.button
                        key={run.id}
                        onClick={() => setActiveRun(i)}
                        className={cn(
                          'w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer transition-colors relative',
                          isActive ? 'bg-[var(--nb-amber)]' : 'hover:bg-[var(--nb-hover-bg)]'
                        )}
                        whileHover={{ x: isActive ? 0 : 8 }}
                      >
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", factionColor[run.faction] || 'bg-transparent')} />
                        <div className="flex items-center gap-4 min-w-0 pl-2">
                          <span className={cn(
                            'flex h-10 w-14 shrink-0 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] font-[900] text-xs shadow-[3px_3px_0px_var(--nb-shadow)] transition-transform',
                            isActive && 'bg-[var(--nb-lime)] -rotate-3 scale-110'
                          )}>
                            {run.ded}
                          </span>
                          <div className="min-w-0">
                            <p className="text-base font-black truncate text-[var(--nb-text)]">{run.faction}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn(
                                'border-2 border-[var(--nb-border)] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-black',
                                run.bought ? 'bg-[var(--nb-pink)]' : 'bg-[var(--nb-lime)]'
                              )}>
                                {run.bought ? 'BOUGHT' : 'FREE'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-xs font-bold text-[var(--nb-text-muted)]">{formatISK(run.loot)}</p>
                            <p className={cn(
                              'font-[900] text-sm',
                              profit >= 0 ? 'text-green-500' : 'text-red-500'
                            )}>
                              {profit >= 0 ? '+' : ''}{formatISK(profit)}
                            </p>
                          </div>
                          <ChevronRight className={cn(
                            'size-5 text-[var(--nb-text-muted)] transition-transform duration-300',
                            isActive ? 'rotate-90 text-[var(--nb-text)]' : ''
                          )} />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Detail panel */}
                <div className="w-full lg:w-2/5 bg-[var(--nb-hover-bg)] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeRun}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-8 flex flex-col h-full justify-center"
                    >
                      {(() => {
                        const r = DEMO_RUNS[activeRun];
                        const profit = r.loot - r.cost;
                        return (
                          <div className="flex flex-col gap-6">
                            <div className="border-l-4 border-[var(--nb-cyan)] pl-4">
                              <p className="text-xs font-black uppercase tracking-widest text-[var(--nb-text-muted)] mb-1">{t('escalation')}</p>
                              <p className="text-2xl font-[900] text-[var(--nb-text)]">{r.ded} {r.faction}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <p className="text-xs font-black uppercase tracking-widest text-[var(--nb-text-muted)] mb-1">{t('loot_value')}</p>
                                <p className="font-mono text-lg font-bold text-[var(--nb-text)]">{formatISKFull(r.loot)}</p>
                              </div>
                              <div>
                                <p className="text-xs font-black uppercase tracking-widest text-[var(--nb-text-muted)] mb-1">{t('capital_cost')}</p>
                                <p className="font-mono text-lg font-bold text-[var(--nb-text)]">{r.cost > 0 ? formatISKFull(r.cost) : '—'}</p>
                              </div>
                            </div>
                            <div className="border-t-4 border-dashed border-[var(--nb-border)] pt-6 mt-2">
                              <p className="text-xs font-black uppercase tracking-widest text-[var(--nb-text-muted)] mb-1">{t('net_pnl')}</p>
                              <p className={cn(
                                'font-mono text-3xl font-[900] tracking-tighter drop-shadow-sm',
                                profit >= 0 ? 'text-green-500' : 'text-red-500'
                              )}>
                                {profit >= 0 ? '+' : ''}{formatISKFull(profit)}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            <motion.p variants={fadeInUp} className="mt-8 text-center text-sm font-bold text-[var(--nb-text-muted)] select-none">
              {t('demo.hint')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Selling Points ───────────────── */}
      <section id="features" className="w-full max-w-6xl px-5 py-20 sm:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} className="mb-4 text-center text-sm font-black uppercase tracking-[0.2em] text-[var(--nb-text-muted)]">
            {t('sell.kicker')}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="mb-16 text-center text-4xl font-[900] uppercase tracking-tight sm:text-5xl lg:text-6xl text-[var(--nb-text)]">
            {t('sell.title')}
          </motion.h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {sellingPoints.map((sp, i) => (
              <motion.div key={i} variants={fadeInUp} className="border-4 border-[var(--nb-border)] bg-[var(--nb-surface)] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-[6px_6px_0px_var(--nb-shadow)] hover:shadow-[10px_10px_0px_var(--nb-shadow)] transition-shadow">
                <div className="flex size-16 shrink-0 items-center justify-center border-4 border-[var(--nb-border)] bg-[var(--nb-cyan)] shadow-[4px_4px_0px_var(--nb-shadow)] -rotate-3">
                  <sp.icon className="size-8 text-black" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-[900] uppercase tracking-tight text-[var(--nb-text)] mb-2">{sp.title}</h3>
                  <span className="inline-block border-2 border-[var(--nb-border)] bg-[var(--nb-lime)] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-black mb-3">
                    {sp.badge}
                  </span>
                  <p className="text-sm font-semibold text-[var(--nb-text-muted)] leading-relaxed">{sp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ──────────────────────────── */}
      <section className="relative w-full border-t-4 border-[var(--nb-border)] bg-[#0f0f14] py-20 sm:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <motion.div 
          className="relative mx-auto max-w-4xl px-5 text-center z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-4xl font-[900] uppercase tracking-tighter text-white sm:text-6xl md:text-7xl">
            {t('cta.title.1')}
            <br />
            <span className="text-[var(--nb-cyan)]" style={{ WebkitTextStroke: '1px var(--nb-cyan)' }}>{t('cta.title.2')}</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-8 text-lg sm:text-xl font-medium text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('cta.sub')}
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <a href="/auth/login" className="flex items-center gap-3 border-4 border-black bg-[var(--nb-cyan)] px-10 py-5 font-black uppercase tracking-widest text-black shadow-[8px_8px_0px_rgba(255,255,255,0.1)] transition-transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(255,255,255,0.1)] active:translate-y-0 active:shadow-none text-xl">
              <Logo className="size-7 text-black" />
              {t('cta.btn')}
            </a>
          </motion.div>
          <motion.p variants={fadeInUp} className="mt-12 font-mono text-xs font-black uppercase tracking-[0.3em] text-gray-600 select-none">
            {t('cta.footer')}
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}
