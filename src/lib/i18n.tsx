'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Locale = 'en' | 'id';

/* ──────────────────────────────────────────────────────────
 *  Translation dictionary
 * ────────────────────────────────────────────────────────── */
const dict = {
  /* ── Navbar ──────────────────────────── */
  'nav.brand': { en: 'DED Tracker', id: 'DED Tracker' },
  'nav.signin': { en: 'Sign in with EVE', id: 'Masuk dengan EVE' },
  'nav.logout': { en: 'Log Out', id: 'Keluar' },
  'nav.capsuleer': { en: 'Capsuleer', id: 'Capsuleer' },

  /* ── Marquee ─────────────────────────── */
  'marquee.text': {
    en: 'EVERY ISK COUNTS — TRACK YOUR LOOT — KNOW YOUR PROFIT',
    id: 'SETIAP ISK BERHARGA — LACAK LOOT LU — KETAHUI PROFIT LU',
  },

  /* ── Hero ─────────────────────────────── */
  'hero.badge': { en: '⚡ Free & Open Source', id: '⚡ Gratis & Open Source' },
  'hero.h1.line1': { en: 'Stop guessing.', id: 'Berhenti nebak.' },
  'hero.h1.line2': { en: 'Start counting', id: 'Mulai hitung' },
  'hero.h1.line3': { en: 'your ISK.', id: 'ISK lu.' },
  'hero.sub': {
    en: "You run DEDs every day but never actually know your real profit. **DED Tracker** logs all your loot, costs, and PNL — clean and organized.",
    id: "Lu run DED tiap hari tapi gak pernah tau berapa profit sebenarnya. **DED Tracker** catat semua loot, cost, dan PNL lu — rapi dan terukur.",
  },
  'hero.cta.primary': { en: 'Start Tracking ISK', id: 'Mulai Tracking ISK' },
  'hero.cta.secondary': { en: 'See Demo', id: 'Lihat Demo' },

  /* ── Stats Ribbon ────────────────────── */
  'ribbon.1.val': { en: 'Instant', id: 'Instan' },
  'ribbon.1.label': { en: 'Loot Appraisal', id: 'Harga Loot' },
  'ribbon.2.val': { en: 'Secure', id: 'Aman' },
  'ribbon.2.label': { en: 'EVE Login', id: 'Login EVE' },
  'ribbon.3.val': { en: '100%', id: '100%' },
  'ribbon.3.label': { en: 'Free Forever', id: 'Gratis Selamanya' },

  /* ── Pain Points ─────────────────────── */
  'pain.kicker': { en: 'Sound familiar?', id: 'Pernah ngalamin?' },
  'pain.title': { en: 'DED Runner Problems', id: 'Masalah DED Runner' },
  'pain.1.title': { en: "Don't know which DED is profitable", id: 'Gak tau DED mana yang profit' },
  'pain.1.desc': {
    en: "You've run Guristas 10/10 fifty times but never tracked the results. Is it actually profitable, or are you just wasting time?",
    id: 'Lu udah run Guristas 10/10 lima puluh kali tapi gak pernah track. Sebenernya profitable gak sih, atau cuma buang waktu?',
  },
  'pain.2.title': { en: 'Buying escalations at a loss', id: 'Beli eskalasi tapi buntung' },
  'pain.2.desc': {
    en: "Bought a bookmark for 200M, loot only 48M. Without tracking, you'll never know you've lost billions.",
    id: 'Beli bookmark 200M, loot cuma 48M. Tanpa tracking, lu gak bakal sadar udah rugi miliaran.',
  },
  'pain.3.title': { en: 'Profit or loss? No idea', id: 'Untung atau rugi? Gak tau' },
  'pain.3.desc': {
    en: '"I think I\'m making good ISK from DEDs." Thinking ≠ data. We show your real PNL per run so you can make smarter decisions.',
    id: '"Kayaknya untung deh dari DED." Kayaknya ≠ data. Kita tampilin PNL asli tiap run biar lu bisa ambil keputusan lebih smart.',
  },

  /* ── Demo ─────────────────────────────── */
  'demo.kicker': { en: 'Try it yourself', id: 'Coba sendiri' },
  'demo.title': { en: "Here's what you get", id: 'Ini yang lu dapet' },
  'demo.hint': {
    en: '↑ Click any row to see details. Your data will look like this after signing in.',
    id: '↑ Klik row mana aja buat liat detail. Data lu bakal kayak gini setelah login.',
  },
  'demo.badge': { en: 'SAMPLE DATA', id: 'DATA SAMPEL' },
  'demo.ledger': { en: 'Sortie Ledger (Demo)', id: 'Sortie Ledger (Demo)' },

  /* ── Selling Points ──────────────────── */
  'sell.kicker': { en: 'Why DED Tracker?', id: 'Kenapa DED Tracker?' },
  'sell.title': { en: 'Features that make you profit', id: 'Fitur yang bikin lu untung' },
  'sell.1.title': { en: 'Paste Loot → Instant Price', id: 'Paste Loot → Langsung Ada Harga' },
  'sell.1.desc': {
    en: 'Copy loot from your cargo, paste into the form — get Jita prices in seconds. Or enter your ISK manually.',
    id: 'Copy loot dari cargo, paste ke form — dapet harga Jita dalam hitungan detik. Atau ketik ISK manual.',
  },
  'sell.1.badge': { en: 'Auto-appraisal', id: 'Auto-appraisal' },
  'sell.2.title': { en: 'PNL Per Run, Per Faction, Per Level', id: 'PNL Per Run, Per Faction, Per Level' },
  'sell.2.desc': {
    en: 'Know exactly how much net profit each run generates. See which factions and DED levels pay the most.',
    id: 'Tau persis berapa net profit tiap run. Lihat faction dan level DED mana yang paling menghasilkan.',
  },
  'sell.2.badge': { en: 'Detailed breakdown', id: 'Breakdown lengkap' },
  'sell.3.title': { en: 'Track Bought vs Free Escalations', id: 'Track Beli vs Free Eskalasi' },
  'sell.3.desc': {
    en: 'Separate purchased vs natural escalations. Know if your capital investment is paying off.',
    id: 'Bedakan eskalasi beli vs drop sendiri. Tau capital cost lu balik atau gak.',
  },
  'sell.3.badge': { en: 'Capital tracking', id: 'Tracking modal' },
  'sell.4.title': { en: 'Login with EVE, Data Secured', id: 'Login Pake EVE, Data Aman' },
  'sell.4.desc': {
    en: 'Sign in with your EVE character. Your data is private — nobody else can see it.',
    id: 'Login pake character EVE lu. Data tersimpan di akun lu, gak ada yang bisa liat.',
  },
  'sell.4.badge': { en: 'Secure & private', id: 'Aman & privat' },

  /* ── CTA ──────────────────────────────── */
  'cta.title.1': { en: 'Ready to see your real profit', id: 'Siap lihat profit asli lu' },
  'cta.title.2': { en: 'from DEDs this month?', id: 'dari DED bulan ini?' },
  'cta.sub': {
    en: 'Sign in with your EVE character, log your first run — it takes 30 seconds. Free, no strings attached.',
    id: 'Login pake character EVE lu, log run pertama — cuma 30 detik. Gratis, tanpa embel-embel.',
  },
  'cta.btn': { en: 'Start Now', id: 'Mulai Sekarang' },
  'cta.footer': { en: 'Fly safe. Track smarter.', id: 'Fly safe. Track smarter.' },

  /* ── Stats ────────────────────────────── */
  'stat.net_pnl': { en: 'NET PNL', id: 'PNL BERSIH' },
  'stat.total_runs': { en: 'TOTAL RUNS', id: 'TOTAL RUN' },
  'stat.avg_isk': { en: 'AVG ISK/RUN', id: 'RATA-RATA ISK/RUN' },
  'stat.best_run': { en: 'BEST RUN', id: 'RUN TERBAIK' },
  'stat.net_pnl.sub': { en: 'Total profit across all runs', id: 'Total profit dari semua run' },
  'stat.total_runs.sub': { en: 'DED escalations completed', id: 'Eskalasi DED yang selesai' },
  'stat.avg_isk.sub': { en: 'Average profit per run', id: 'Rata-rata profit per run' },
  'stat.best_run.sub': { en: 'No runs recorded', id: 'Belum ada run' },
  'stat.avg_isk_per_run': { en: 'AVG PROFIT / RUN', id: 'RATA-RATA PROFIT / RUN' },
  'stat.avg_isk_per_run.sub': { en: 'Average net profit per run', id: 'Rata-rata keuntungan bersih per run' },
  'stat.specific_avg': { en: 'Specific Averages', id: 'Rata-rata Spesifik' },

  /* ── Form ─────────────────────────────── */
  'form.title': { en: 'Log Escalation', id: 'Log Eskalasi' },
  'form.ded_level': { en: 'DED Level', id: 'Level DED' },
  'form.faction': { en: 'Faction', id: 'Faksi' },
  'form.purchased.on': { en: '💰 Purchased Escalation', id: '💰 Eskalasi Dibeli' },
  'form.purchased.off': { en: '🎲 Free Escalation', id: '🎲 Eskalasi Gratis' },
  'form.purchased.on.sub': { en: 'Bought from contract/market', id: 'Dibeli dari kontrak/market' },
  'form.purchased.off.sub': { en: 'Natural escalation drop', id: 'Drop eskalasi natural' },
  'form.capital': { en: 'Capital Cost (ISK)', id: 'Modal (ISK)' },
  'form.loot': { en: 'Loot Text', id: 'Teks Loot' },
  'form.price_mode': { en: 'Price Mode', id: 'Mode Harga' },
  'form.percent': { en: 'Percent', id: 'Persen' },
  'form.fetch': { en: 'Fetch via Janice', id: 'Ambil via Janice' },
  'form.scanning': { en: 'Scanning...', id: 'Memindai...' },
  'form.loot_value': { en: 'Loot Value', id: 'Nilai Loot' },
  'form.net_pnl': { en: 'Net PNL', id: 'PNL Bersih' },
  'form.submit': { en: 'Submit Run', id: 'Kirim Run' },
  'form.submitting': { en: 'Submitting...', id: 'Mengirim...' },
  'form.manual': { en: 'Manual', id: 'Manual' },
  'form.manual.hint': {
    en: 'Enter total loot value using shortcuts like 2.34b, 890m, or type the full number.',
    id: 'Masukkan total nilai loot pake shortcut kayak 2.34b, 890m, atau ketik angka lengkapnya.',
  },
  'form.error.missing_selection': { en: 'Please select DED Level and Faction.', id: 'Pilih Level DED dan Faksi.' },

  /* ── History ──────────────────────────── */
  'history.title': { en: 'Sortie Ledger', id: 'Sortie Ledger' },
  'history.runs': { en: 'runs', id: 'run' },
  'history.run': { en: 'run', id: 'run' },
  'history.empty.title': { en: 'No runs yet', id: 'Belum ada run' },
  'history.empty.sub': { en: 'Submit your first escalation to start tracking.', id: 'Kirim eskalasi pertama untuk mulai tracking.' },
  'history.delete.title': { en: 'Delete this run?', id: 'Hapus run ini?' },
  'history.delete.confirm': { en: 'Delete', id: 'Hapus' },
  'history.cancel': { en: 'Cancel', id: 'Batal' },
  'history.bought': { en: 'BOUGHT', id: 'BELI' },
  'history.free': { en: 'FREE', id: 'GRATIS' },
  'history.date': { en: 'Date', id: 'Tanggal' },
  'history.escalation': { en: 'Escalation', id: 'Eskalasi' },
  'history.source': { en: 'Source', id: 'Sumber' },
  'history.loot': { en: 'Loot', id: 'Loot' },
  'history.pnl': { en: 'PNL', id: 'PNL' },

  /* ── Misc ─────────────────────────────── */
  'loading': { en: 'Loading...', id: 'Memuat...' },
  'net_profit': { en: 'Net Profit', id: 'Profit Bersih' },
  'total_runs': { en: 'Total Runs', id: 'Total Run' },
  'avg_isk_run': { en: 'Avg ISK/Run', id: 'Rata-rata ISK/Run' },
  'best_faction': { en: 'Best Faction', id: 'Faksi Terbaik' },
  'escalation': { en: 'Escalation', id: 'Eskalasi' },
  'loot_value': { en: 'Loot Value', id: 'Nilai Loot' },
  'capital_cost': { en: 'Capital Cost', id: 'Modal' },
  'net_pnl': { en: 'Net PNL', id: 'PNL Bersih' },
} as const;

export type TranslationKey = keyof typeof dict;

/* ──────────────────────────────────────────────────────────
 *  Context
 * ────────────────────────────────────────────────────────── */
interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useCallback(
    (key: TranslationKey): string => {
      const entry = dict[key];
      if (!entry) return key;
      return entry[locale] ?? entry.en ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
