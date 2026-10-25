'use client';

import { formatISKSigned } from '@/lib/format';
import type { LevelBucket } from '@/lib/stats';

interface Props {
  buckets: LevelBucket[];
}

/** Profit per DED tier as horizontal bars — readable at a glance, no axes needed. */
export default function LevelBars({ buckets }: Props) {
  if (buckets.length === 0) {
    return (
      <p className="py-6 text-center font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--nb-text-faint)]">
        No escalations in range
      </p>
    );
  }

  const maxAbs = Math.max(...buckets.map((b) => Math.abs(b.profit)), 1);

  return (
    <ul className="flex flex-col gap-2.5">
      {buckets.map((bucket) => {
        const width = Math.max(2, (Math.abs(bucket.profit) / maxAbs) * 100);
        const positive = bucket.profit >= 0;
        return (
          <li key={bucket.dedType} className="flex items-center gap-3">
            <span className="w-14 shrink-0 border-2 border-[var(--nb-border)] bg-[var(--nb-text)] px-1 py-0.5 text-center font-mono text-[10px] font-black text-[var(--nb-surface)]">
              {bucket.dedType}
            </span>
            <div className="relative h-5 flex-1 border-2 border-[var(--nb-border)] bg-[var(--nb-hover-bg)]">
              <div
                className="h-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
                style={{
                  width: `${width}%`,
                  background: positive ? 'var(--nb-lime)' : 'var(--nb-red)',
                }}
              />
            </div>
            <span
              className={`w-24 shrink-0 text-right font-mono text-[11px] font-black ${
                positive ? 'text-profit' : 'text-loss'
              }`}
            >
              {formatISKSigned(bucket.profit)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
