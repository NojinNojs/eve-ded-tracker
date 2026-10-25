'use client';

import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { formatISK, formatISKSigned } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import CountUp from '@/components/ui/CountUp';

/**
 * A single logged run, drawn as a physical ledger slip. It answers "what does
 * this thing actually do?" in one glance, without a screenshot or a video.
 */
export default function RunTicket() {
  const { t } = useI18n();

  const loot = 2_340_000_000;
  const capital = 180_000_000;
  const profit = loot - capital;

  return (
    <div className="relative w-full max-w-sm">
      <article className="relative border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[7px_7px_0px_var(--nb-shadow)]">
        {/* header */}
        <header className="flex items-center justify-between gap-3 border-b-3 border-[var(--nb-border)] bg-[var(--nb-violet)] px-4 py-2.5">
          <p className="font-mono text-sm font-black uppercase tracking-wider text-black">
            10/10 · Guristas
          </p>
          <span className="border-2 border-black bg-[var(--nb-cyan)] px-1.5 py-0.5 text-[11px] font-black uppercase tracking-[0.12em] text-black">
            {t('demo.badge')}
          </span>
        </header>

        {/* rows */}
        <dl className="divide-y-2 divide-[var(--nb-border)]">
          <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
            <dt className="text-[13px] font-black uppercase tracking-[0.1em] text-[var(--nb-text-muted)]">
              {t('history.loot')}
            </dt>
            <dd className="font-mono text-base font-bold">{formatISK(loot)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
            <dt className="text-[13px] font-black uppercase tracking-[0.1em] text-[var(--nb-text-muted)]">
              {t('history.capital')}
            </dt>
            <dd className="font-mono text-base font-bold">{formatISK(capital)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 px-4 py-2.5">
            <dt className="text-[13px] font-black uppercase tracking-[0.1em] text-[var(--nb-text-muted)]">
              {t('form.price_mode')}
            </dt>
            <dd className="font-mono text-base font-bold">Split · 100%</dd>
          </div>
        </dl>

        {/* the number that matters */}
        <div className="flex items-center justify-between gap-3 border-t-3 border-[var(--nb-border)] bg-[var(--nb-lime)] px-4 py-3">
          <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-black">
            <TrendingUp className="size-4" strokeWidth={3} aria-hidden="true" />
            {t('history.pnl')}
          </span>
          <span className="font-mono text-xl font-black text-black">
            <CountUp value={profit} format={(value) => formatISKSigned(Math.round(value))} />
          </span>
        </div>

        {/* footer */}
        <footer className="flex items-center justify-between gap-2 border-t-3 border-[var(--nb-border)] px-4 py-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--nb-text-muted)]">
            Janice · abc123
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-black uppercase tracking-wider text-[var(--nb-text)]">
            {t('stat.by_level')}
            <ArrowUpRight className="size-3" strokeWidth={3} aria-hidden="true" />
          </span>
        </footer>
      </article>
    </div>
  );
}
