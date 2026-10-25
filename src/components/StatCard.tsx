'use client';

import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  /** Any CSS color / var() for the card face. */
  color: string;
  compact?: boolean;
}

/**
 * The loud tier of the dashboard: solid neon face, hard border, hard shadow.
 * Numbers are mono so columns of ISK line up between cards.
 */
export default function StatCard({ label, value, sub, icon: Icon, color, compact }: Props) {
  // "647.06M ISK" → number and unit, so the unit can shrink instead of wrapping.
  const [, number = value, unit = ''] = value.match(/^(.*?)\s*(ISK)?$/) ?? [];

  return (
    <div
      className="flex h-full w-full flex-col justify-between border-3 border-[var(--nb-border)] p-4 text-black shadow-[5px_5px_0px_var(--nb-shadow)] sm:p-5"
      style={{ background: color }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="text-xs font-black uppercase leading-tight tracking-[0.12em] opacity-70 sm:text-xs">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:size-8"
        >
          <Icon className="size-4" strokeWidth={2.5} />
        </span>
      </div>

      <p className="animate-count-up whitespace-nowrap font-mono font-black leading-none">
        <span className={compact ? 'text-lg sm:text-2xl' : 'text-2xl sm:text-3xl'}>{number}</span>
        {unit && (
          <span className="ml-1 align-baseline text-[0.5em] font-black tracking-wider opacity-70">
            {unit}
          </span>
        )}
      </p>

      <p className="mt-2 text-xs font-semibold leading-snug opacity-60">{sub}</p>
    </div>
  );
}
