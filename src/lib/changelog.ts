export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  features: string[];
  fixes: string[];
}

export const changelog: ChangelogEntry[] = [
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
