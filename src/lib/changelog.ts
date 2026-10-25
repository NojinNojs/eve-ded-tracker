export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  features: string[];
  fixes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: 'v1.7.0',
    date: '2026-10-25',
    title: 'Readable By Everyone, Loud For Nobody',
    features: [
      'New hero: the pitch on the left, a logged run on the right. You can see what the product does before scrolling.',
      'Three steps under the CTA — paste the cargo, read the Jita price, log the run.',
      'The sample numbers count up when they scroll into view, and the sections fade in with a short reveal.',
      'Every label moved off 9–10px type onto a 12px floor, and body copy to 16px, so it reads at arm’s length on a phone or a laptop.',
    ],
    fixes: [
      'Text that sat below WCAG AA is gone: cyan headings, muted labels and profit/loss figures now use dedicated text tokens.',
      'Touch targets clear 44px on finger-driven screens; the language switch, history actions and pagination were the worst offenders.',
      'The headline drops the stacked sticker treatments for one accent and one underline.',
      'Animations respect prefers-reduced-motion — reveals resolve instantly and counters jump to their final value.',
    ],
  },
  {
    version: 'v1.6.0',
    date: '2026-10-25',
    title: 'A Straighter Face',
    features: [
      'Profit per tier is a column chart now: tiers climb left to right, zero sits on the axis, and losses hang below it.',
      'New mark: one solid block whose edge steps up like an escalation ladder. It also lives in the favicon.',
      'The landing page shows a real sample ledger — the same maths as the signed-in dashboard, not a screenshot.',
      'Unit tests for the money paths: ISK parsing, sorting, PNL aggregation, CSV escaping and the sample data.',
      '`bun run verify` runs lint, tests and the build; `bun run test:smoke` boots the build and checks the page renders.',
    ],
    fixes: [
      'Profit and loss text now clears WCAG AA on the cream background.',
      'Tier labels use compact ISK so six columns fit a phone without ellipses.',
      'Removed the faded logo watermark in the footer that read as a stray grey block.',
      'The chart no longer overflows its plot when one tier dwarfs the rest.',
    ],
  },
  {
    version: 'v1.5.0',
    date: '2026-10-25',
    title: 'Ledger That Works For You',
    features: [
      'Export the ledger to CSV. Filter first, then export exactly what you filtered.',
      'Edit a run instead of deleting it. Fat-fingered the loot paste? Fix the number, the PNL recalculates.',
      'New numbers under the stat cards: win rate, ISK spent on bookmarks, profit factor, and return on bookmarks.',
      'Cumulative PNL sparkline and profit-per-DED-tier bars, both scoped to the range you pick.',
      'Search by faction, tier, or Janice code. Press / to jump straight into the box.',
      'Run detail popup: capital, loot, pricing mode, and the Janice appraisal link in one place.',
    ],
    fixes: [
      'Language choice persists now — stored in a cookie, so no English flash on first paint.',
      'Best Run shows the single best escalation again. It was quietly reporting a faction + tier total.',
      'Changing price mode or percentage after an appraisal no longer leaves a stale loot value on screen.',
      'Sort headers are real buttons, so keyboard and screen reader users can sort the table.',
      'Dark mode is applied before the first paint. No more white flash on load.',
      'Fixed the footer panels with no background, and the account chevron that never rotated.',
      'Typing 1,234,567 no longer collapses to a wrong number; both separator styles parse correctly.',
      'Added reduced-motion support, visible focus rings, and properly labelled form fields.',
      'Every hardcoded English string is translated now, including toasts and empty states.',
    ],
  },
  {
    version: 'v1.4.5',
    date: '2026-06-19',
    title: 'Hotfix: Legacy Auth Data Restoration',
    features: [
      'Fixed a critical issue where legacy users appeared to lose their data after re-logging.',
      'Restored backward compatibility for original authentication identities.',
    ],
    fixes: []
  },
  {
    version: 'v1.4.4',
    date: '2026-06-19',
    title: 'Data Reliability & Security Hotfix',
    features: [],
    fixes: [
      'Eliminated Supabase RPC dependency for Dashboard stats calculation to prevent missing data bugs due to database schema caching issues.',
      'Upgraded data aggregation security to strictly enforce server-side authenticated sessions.',
      'Removed unused migration files.'
    ]
  },
  {
    version: 'v1.4.3',
    date: '2026-06-19',
    title: 'Clean CTA Design',
    features: [],
    fixes: [
      'Refined the Light Mode CTA section to remove excessive decorative shapes, opting for a cleaner, high-contrast Neo-Brutalist typography look',
    ]
  },
  {
    version: 'v1.4.2',
    date: '2026-06-19',
    title: 'Light Mode Adaptability',
    features: [],
    fixes: [
      'Fixed the bottom CTA section to correctly adapt to light mode instead of using hardcoded dark colors',
      'Fixed the bottom CTA button shadow visibility in light mode by using theme variables instead of white rgba',
    ]
  },
  {
    version: 'v1.4.1',
    date: '2026-06-19',
    title: 'Visual Consistency',
    features: [],
    fixes: [
      'Updated Landing Page CTA buttons to use cyan instead of lime green to match the primary branding concept',
    ]
  },
  {
    version: 'v1.4.0',
    date: '2026-06-19',
    title: 'UI/UX Overhaul & Auth Stability',
    features: [
      'Complete redesign of the application Footer with more informative layout and CCP trademark disclaimer',
      'Improved navigation bar layout with condensed SSO login button',
      'Enhanced error toast notification system for better UX on authentication failures',
      'Added full English and Indonesian translation support for new Footer and History views',
    ],
    fixes: [
      'Fixed double-login bug caused by ENOTFOUND network errors improperly triggering signups',
      'Fixed poor text contrast on language and timeframe switcher buttons during Dark Mode',
      'Fixed "ilang ilangan" bug where Landing Page animated items would disappear when changing languages',
      'Fixed "Best Run" calculation in Stats Dashboard to correctly prioritize the most recent run on tied profits',
      'Removed unused default Next.js SVG assets to clean up the public directory',
    ]
  },
  {
    version: 'v1.3.0',
    date: '2026-06-16',
    title: 'Janice API v2 Integration',
    features: [
      'Full Janice API v2 integration with real-time appraisals',
      'Per-item loot breakdown with buy/sell/split prices',
      'Janice appraisal link stored and displayed in run details',
      'Enabled Janice tab in loot input (previously disabled)',
    ],
    fixes: [
      'Migrated from deprecated Janice v1 endpoint to official v2 API',
      'Server-side API key management for improved security',
    ]
  },
  {
    version: 'v1.2.1',
    date: '2026-06-16',
    title: 'Faction Logging Fixes & UI Polish',
    features: [
      'Fixed an issue where some DED run logs were failing to save for certain factions.',
      'Improved the dropdown menus for DED Level and Faction to be more intuitive.',
      'General under-the-hood stability improvements for a smoother tracking experience.'
    ],
    fixes: [
      'Resolved a critical bug preventing the submission of non-Guristas DED runs.'
    ]
  },
  {
    version: 'v1.2.0',
    date: '2026-06-16',
    title: 'Production Readiness & Security Audit',
    features: [
      'Automatic Changelog Update System (You are looking at it!)',
      'Version bump for production deployment'
    ],
    fixes: [
      'Comprehensive security review of Server Actions and API boundaries',
      'Resolved unused import lint warnings',
      'Verified Janice API payload constraints and error handling'
    ]
  },
  {
    version: 'v1.1.0',
    date: '2026-06-16',
    title: 'UI/UX Overhaul & Specific Averages',
    features: [
      'Redesigned "Specific Averages" into a detailed Neobrutalist grid of cards',
      'Unified form toggles into a singular compact block',
      'Added Jita Location badge'
    ],
    fixes: [
      'Fixed hard-to-read text contrasts on neon cards in Dark Mode',
      'Fixed low contrast for Sortie Ledger subtitle',
      'Optimized layout padding for mobile view in Run History'
    ]
  },
  {
    version: 'v1.0.0',
    date: '2026-06-10',
    title: 'Initial Release',
    features: [
      'Basic DED Tracker functionality',
      'Run History log',
      'Janice API Integration'
    ],
    fixes: []
  }
];

export const CURRENT_VERSION = changelog[0].version;
