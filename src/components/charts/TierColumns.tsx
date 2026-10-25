'use client';

import { formatISKShort, formatISKSigned } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { LevelBucket } from '@/lib/stats';

interface Props {
  buckets: LevelBucket[];
  /** Shown when the range has no runs. */
  emptyLabel: string;
}

/**
 * Diverging column chart: DED tiers ascend left to right, the zero line sits
 * where profit turns into loss, and each column is a hard-edged block.
 *
 * Columns are absolutely positioned against that zero line so a loss hangs
 * below it instead of pretending to be a short bar next to the wins.
 */
export default function TierColumns({ buckets, emptyLabel }: Props) {
  if (buckets.length === 0) {
    return (
      <p className="py-8 text-center font-mono text-xs font-bold uppercase tracking-wider text-[var(--nb-text-faint)]">
        {emptyLabel}
      </p>
    );
  }

  const profits = buckets.map((bucket) => Number(bucket.profit));
  const maxGain = Math.max(0, ...profits);
  const maxLoss = Math.abs(Math.min(0, ...profits));
  const spread = maxGain + maxLoss || 1;

  // The zero line sits where gains end and losses begin, measured from the top.
  // Gains own the space above it, so the share comes from maxGain — and it is
  // clamped so a lopsided dataset still leaves room for the losing side.
  const zeroTop = Math.min(85, Math.max(15, (maxGain / spread) * 100));

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[164px] w-full">
        {/* zero line */}
        <div
          className="absolute inset-x-0 border-t-2 border-dashed border-[var(--nb-border)]"
          style={{ top: `${zeroTop}%` }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex items-stretch gap-1.5 sm:gap-2">
          {buckets.map((bucket) => {
            const value = Number(bucket.profit);
            const positive = value >= 0;
            const magnitude = Math.abs(value) / spread;
            // Each side gets the space between the zero line and its own edge.
            const height = magnitude * (positive ? zeroTop : 100 - zeroTop);

            return (
              <div
                key={bucket.dedType}
                className="relative min-w-0 flex-1"
                title={`${bucket.dedType} · ${formatISKSigned(value)} · ${bucket.count}`}
              >
                <div
                  className={cn(
                    'absolute inset-x-0 border-2 border-[var(--nb-border)] transition-[height] duration-500 ease-out motion-reduce:transition-none',
                    positive ? 'bg-[var(--nb-lime)]' : 'bg-[var(--nb-red)]'
                  )}
                  style={{
                    height: `${Math.max(height, 1.5)}%`,
                    minHeight: 6,
                    ...(positive
                      ? { bottom: `${100 - zeroTop}%` }
                      : { top: `${zeroTop}%` }),
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* x-axis: tier + value */}
      <div className="flex items-stretch gap-1.5 sm:gap-2">
        {buckets.map((bucket) => {
          const value = Number(bucket.profit);
          return (
            <div key={bucket.dedType} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <span className="w-full border-2 border-[var(--nb-border)] bg-[var(--nb-text)] px-1 py-0.5 text-center font-mono text-xs font-black text-[var(--nb-surface)]">
                {bucket.dedType}
              </span>
              <span
                className={cn(
                  'w-full truncate text-center font-mono text-xs font-black',
                  value >= 0 ? 'text-profit' : 'text-loss'
                )}
                title={formatISKSigned(value)}
              >
                {value > 0 ? '+' : ''}
                {formatISKShort(value)}
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--nb-text-faint)]">
                ×{bucket.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
