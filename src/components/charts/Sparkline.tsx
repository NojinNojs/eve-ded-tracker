'use client';

import { useId } from 'react';

interface Props {
  /** Oldest → newest cumulative values. */
  values: number[];
  /** Accessible description of the series. */
  label: string;
}

/**
 * Hand-rolled SVG sparkline — no chart library, no runtime cost.
 * Scales to its container, and the stroke stays 2px thanks to
 * `vector-effect: non-scaling-stroke`.
 */
export default function Sparkline({ values, label }: Props) {
  const gradientId = useId();

  if (values.length < 2) {
    return (
      <div className="flex h-full min-h-[120px] items-center justify-center border-3 border-dashed border-[var(--nb-border)]/40">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--nb-text-faint)]">
          Not enough runs to plot
        </span>
      </div>
    );
  }

  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;
  const n = values.length;

  const toX = (i: number) => (i / (n - 1)) * 100;
  const toY = (v: number) => 100 - ((v - min) / span) * 100;

  const line = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(2)},${toY(v).toFixed(2)}`).join(' ');
  const zeroY = toY(0);
  const area = `${line} L100,${zeroY.toFixed(2)} L0,${zeroY.toFixed(2)} Z`;

  const last = values[n - 1];
  const positive = last >= 0;
  const fill = positive ? 'var(--nb-lime)' : 'var(--nb-red)';

  return (
    <figure className="relative h-full min-h-[120px] w-full">
      <svg
        className="nb-spark"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="img"
        aria-label={label}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity="0.55" />
            <stop offset="100%" stopColor={fill} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <path d={area} fill={`url(#${gradientId})`} stroke="none" />

        <line
          x1="0"
          x2="100"
          y1={zeroY}
          y2={zeroY}
          stroke="var(--nb-border)"
          strokeWidth="1"
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
          opacity="0.7"
        />

        <path
          d={line}
          fill="none"
          stroke={positive ? 'var(--nb-text)' : 'var(--nb-red)'}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </figure>
  );
}
