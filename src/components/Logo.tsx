/**
 * DED Tracker mark — a solid block whose top edge climbs like an escalation
 * ladder. One silhouette, no hairlines: it still reads at 20px in the header
 * chip and as a 16px favicon.
 *
 * The shape is deliberately monolithic so it sits next to 3px borders without
 * looking lighter than the UI around it.
 */
export default function Logo({ className = 'size-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d="M3 19H10V11H17V3H29V29H3Z" />
    </svg>
  );
}
