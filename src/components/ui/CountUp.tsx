'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  /** Formats the in-flight number — pass the same formatter used for the final value. */
  format: (value: number) => string;
  duration?: number;
  className?: string;
}

/**
 * Counts up once the number scrolls into view.
 *
 * The final value is what renders on the server and whenever animation is not
 * appropriate, so the number is never wrong — only animated. Every state update
 * happens inside the observer / animation-frame callback, never during the
 * effect body.
 */
export default function CountUp({ value, format, duration = 900, className }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((entry) => entry.isIntersecting)) return;
        started = true;
        observer.disconnect();

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const start = performance.now();
        setDisplay(0);
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(value * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  );
}
