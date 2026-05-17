'use client';

import { useEffect, useState } from 'react';

/**
 * Pure CSS animated star field — no canvas, no deps.
 * Renders ~100 star particles with randomized twinkle.
 */
interface StarParticle {
  id: number;
  left: string;
  top: string;
  dur: string;
  delay: string;
  minOp: string;
  maxOp: string;
  bright: boolean;
}

export default function StarField() {
  const [stars, setStars] = useState<StarParticle[]>([]);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 120; i++) {
      const isBright = Math.random() > 0.85;
      arr.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        dur: `${3 + Math.random() * 5}s`,
        delay: `${Math.random() * 5}s`,
        minOp: `${0.05 + Math.random() * 0.2}`,
        maxOp: `${0.4 + Math.random() * 0.5}`,
        bright: isBright,
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(arr);
  }, []);

  return (
    <div className="stars-container" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className={`star ${s.bright ? 'bright' : ''}`}
          style={{
            left: s.left,
            top: s.top,
            '--dur': s.dur,
            '--delay': s.delay,
            '--min-op': s.minOp,
            '--max-op': s.maxOp,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
