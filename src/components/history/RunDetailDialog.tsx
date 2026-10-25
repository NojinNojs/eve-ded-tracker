'use client';

import { ExternalLink } from 'lucide-react';
import { formatISK, formatISKSigned, formatDate } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { janiceUrl, type DedRun } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  run: DedRun | null;
  onOpenChange: (open: boolean) => void;
}

const PRICING_LABEL: Record<string, string> = {
  buy: 'Buy order',
  sell: 'Sell order',
  split: 'Split',
};

/** Read-only breakdown of a single escalation run. */
export default function RunDetailDialog({ run, onOpenChange }: Props) {
  const { t, locale } = useI18n();
  const link = janiceUrl(run?.janice_code);

  const rows = run
    ? [
        { label: t('history.date'), value: formatDate(run.created_at, locale === 'id' ? 'id-ID' : 'en-US') },
        { label: t('history.source'), value: run.is_purchased ? t('history.bought') : t('history.free') },
        { label: t('history.capital'), value: formatISK(Number(run.capital_cost)) },
        { label: t('history.loot'), value: formatISK(Number(run.loot_value)) },
        {
          label: t('history.detail.price_mode'),
          value: `${PRICING_LABEL[run.pricing_mode] ?? run.pricing_mode} · ${run.pricing_percent}%`,
        },
      ]
    : [];

  return (
    <Dialog open={Boolean(run)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 rounded-none border-4 border-[var(--nb-border)] bg-[var(--nb-surface)] p-0 shadow-[8px_8px_0px_var(--nb-shadow)]">
        <DialogHeader className="border-b-4 border-[var(--nb-border)] bg-[var(--nb-violet)] px-5 py-4">
          <DialogTitle className="text-lg font-black uppercase tracking-tight text-black">
            {run ? `${run.ded_type} ${run.faction}` : t('history.detail.title')}
          </DialogTitle>
          <DialogDescription className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/70">
            {t('history.detail.title')}
          </DialogDescription>
        </DialogHeader>

        <dl className="divide-y-2 divide-[var(--nb-border)]">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-2.5">
              <dt className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
                {row.label}
              </dt>
              <dd className="font-mono text-xs font-bold">{row.value}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 bg-[var(--nb-hover-bg)] px-5 py-3">
            <dt className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--nb-text-muted)]">
              {t('history.pnl')}
            </dt>
            <dd
              className={`font-mono text-base font-black ${
                Number(run?.net_profit ?? 0) >= 0 ? 'text-profit' : 'text-loss'
              }`}
            >
              {run ? formatISKSigned(Number(run.net_profit)) : '—'}
            </dd>
          </div>
        </dl>

        <DialogFooter className="gap-2 border-t-4 border-[var(--nb-border)] bg-[var(--nb-surface)] p-4 sm:justify-between">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-blue-600 hover:underline dark:text-blue-400"
            >
              <ExternalLink className="size-3" />
              {t('form.janice_link')}
            </a>
          ) : (
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--nb-text-faint)]">
              no appraisal code
            </span>
          )}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="nb-btn nb-btn-secondary px-4 py-2 text-[11px]"
          >
            {t('history.detail.close')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
