/** Inline SVG logo — crosshair + upward trend arrow = DED Runner tracker */
export default function Logo({ className = 'size-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer crosshair ring */}
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2.5" />
      {/* Crosshair lines */}
      <line x1="16" y1="2" x2="16" y2="8" stroke="currentColor" strokeWidth="2.5" />
      <line x1="16" y1="24" x2="16" y2="30" stroke="currentColor" strokeWidth="2.5" />
      <line x1="2" y1="16" x2="8" y2="16" stroke="currentColor" strokeWidth="2.5" />
      <line x1="24" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="2.5" />
      {/* Profit arrow going up-right through the center */}
      <path
        d="M10 22 L16 14 L20 17 L24 9"
        stroke="var(--nb-cyan, #22d3ee)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrowhead */}
      <path
        d="M21 9 L24 9 L24 12"
        stroke="var(--nb-cyan, #22d3ee)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
