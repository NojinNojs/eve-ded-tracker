export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  features: string[];
  fixes: string[];
}

export const changelog: ChangelogEntry[] = [
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
