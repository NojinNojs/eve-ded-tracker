'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** ms delay, for staggering siblings */
  delay?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Reveals its children once they scroll into view.
 *
 * The visibility flag is written straight onto the node's `data-reveal`
 * attribute instead of React state: the DOM is the external system here, and
 * that keeps the effect free of cascading renders. The animation itself lives
 * in CSS, so `prefers-reduced-motion` can switch it off.
 */
export default function Reveal({ children, delay = 0, className, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const show = () => element.setAttribute('data-reveal', 'visible');

    if (typeof IntersectionObserver === 'undefined') {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal="hidden"
      style={{ transitionDelay: `${delay}ms` }}
      className={className}
    >
      {children}
    </Tag>
  );
}
