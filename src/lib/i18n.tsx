'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { LOCALE_COOKIE } from '@/lib/locale';
import type { Locale } from '@/lib/locale';

export type { Locale };

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
  'hero.badge': { en: 'Free · EVE SSO · No spreadsheet', id: 'Gratis · EVE SSO · Tanpa spreadsheet' },
  'hero.h1.line1': { en: 'Your DEDs pay.', id: 'DED lu bayar.' },
  'hero.h1.line2': { en: 'Do you know', id: 'Tapi tau' },
  'hero.h1.line3': { en: 'how much?', id: 'berapa?' },
  'hero.sub': {
    en: 'Paste your cargo, get Jita prices, log the run. **DED Tracker** keeps every escalation, every bookmark you bought, and every ISK of net profit in one ledger.',
    id: 'Paste cargo, dapet harga Jita, simpan run-nya. **DED Tracker** nyatet tiap eskalasi, tiap bookmark yang lu beli, dan tiap ISK profit bersih di satu ledger.',
  },
  'hero.cta.primary': { en: 'Sign in with EVE', id: 'Masuk dengan EVE' },
  'hero.cta.secondary': { en: 'See a sample ledger', id: 'Lihat contoh ledger' },

  /* ── Stats Ribbon ────────────────────── */
  'ribbon.1.val': { en: 'Janice', id: 'Janice' },
  'ribbon.1.label': { en: 'Jita appraisal', id: 'Harga Jita' },
  'ribbon.2.val': { en: 'EVE SSO', id: 'EVE SSO' },
  'ribbon.2.label': { en: 'no new password', id: 'tanpa password baru' },
  'ribbon.3.val': { en: 'Free', id: 'Gratis' },
  'ribbon.3.label': { en: 'never paywalled', id: 'nggak dipagari' },

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
  'demo.kicker': { en: 'Sample ledger', id: 'Contoh ledger' },
  'demo.title': { en: 'The numbers a DED runner actually checks.', id: 'Angka yang beneran dicek DED runner.' },
  'demo.hint': {
    en: 'Click any row. Same app, same maths — this sample goes through the identical calculation the signed-in dashboard uses.',
    id: 'Klik row mana aja. App yang sama, hitungan yang sama — sampel ini lewat jalur kalkulasi yang persis dipakai dashboard setelah login.',
  },
  'demo.badge': { en: 'SAMPLE DATA', id: 'DATA SAMPEL' },
  'demo.ledger': { en: 'Ledger', id: 'Ledger' },
  'demo.bought': { en: 'BOUGHT', id: 'BELI' },
  'demo.free': { en: 'FREE', id: 'GRATIS' },

  /* ── Selling Points ──────────────────── */
  'sell.kicker': { en: 'What is inside', id: 'Isinya apa' },
  'sell.title': { en: 'Built for people who run these daily', id: 'Dibikin buat yang nge-run tiap hari' },
  'sell.1.title': { en: 'Paste cargo, get a price', id: 'Paste cargo, langsung ada harga' },
  'sell.1.desc': {
    en: 'Copy the loot from your cargo hold, paste it in, and Janice prices it against Jita. Buying, selling or split — your call. Or type the ISK yourself.',
    id: 'Copy loot dari cargo, paste, Janice kasih harga Jita. Mode beli, jual, atau split — terserah lu. Atau ketik ISK-nya sendiri.',
  },
  'sell.1.badge': { en: 'Janice API', id: 'Janice API' },
  'sell.2.title': { en: 'A ledger you can work in', id: 'Ledger yang bisa diajak kerja' },
  'sell.2.desc': {
    en: 'Search by faction, tier or Janice code. Filter, sort any column, fix a wrong number without re-logging the run, and export exactly what you are looking at to CSV.',
    id: 'Cari pakai faksi, tier, atau kode Janice. Filter, sort kolom apa aja, benerin angka yang salah tanpa log ulang, dan ekspor yang lagi lu lihat ke CSV.',
  },
  'sell.2.badge': { en: 'CSV export', id: 'Ekspor CSV' },
  'sell.3.title': { en: 'Numbers that agree with each other', id: 'Angka yang nggak saling bertengkar' },
  'sell.3.desc': {
    en: 'Net PNL, win rate, profit factor, return on bookmarks, cumulative curve, profit per tier. One run list, one calculation — every card reads from it.',
    id: 'PNL bersih, win rate, profit factor, balik modal bookmark, kurva kumulatif, profit per tier. Satu daftar run, satu hitungan — semua kartu baca dari situ.',
  },
  'sell.3.badge': { en: 'One source of truth', id: 'Satu sumber angka' },
  'sell.4.title': { en: 'Your ledger, nobody else’s', id: 'Ledger lu, bukan orang lain' },
  'sell.4.desc': {
    en: 'Sign in with EVE SSO — no new password. Row-level security in Postgres means another capsuleer cannot read your runs, even if they guess the endpoint.',
    id: 'Masuk pakai EVE SSO — nggak perlu password baru. Row-level security di Postgres bikin capsuleer lain nggak bisa baca run lu, walau mereka nebak endpoint-nya.',
  },
  'sell.4.badge': { en: 'EVE SSO', id: 'EVE SSO' },

  /* ── CTA ──────────────────────────────── */
  'cta.title.1': { en: 'See what this month actually paid', id: 'Lihat bulan ini beneran bayar berapa' },
  'cta.title.2': { en: 'from DEDs.', id: 'dari DED.' },
  'cta.sub': {
    en: 'Sign in with your EVE character and log the next run you finish. Thirty seconds, and the ledger starts paying attention.',
    id: 'Masuk pakai character EVE lu, terus log run berikutnya. Tiga puluh detik, dan ledger mulai merhatiin.',
  },
  'cta.btn': { en: 'Start tracking', id: 'Mulai tracking' },
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
  'stat.range.today': { en: 'Today', id: 'Hari ini' },
  'stat.range.3d': { en: '3d', id: '3h' },
  'stat.range.1w': { en: '1w', id: '1m' },
  'stat.range.1m': { en: '1m', id: '1b' },
  'stat.range.all': { en: 'All time', id: 'Semua' },
  'stat.range.label': { en: 'Range', id: 'Rentang' },
  'stat.trend': { en: 'Cumulative PNL', id: 'PNL Kumulatif' },
  'stat.trend.sub': { en: 'Straight line means steady income', id: 'Garis lurus berarti income stabil' },
  'stat.win_rate': { en: 'Win rate', id: 'Win rate' },
  'stat.capital': { en: 'Capital spent', id: 'Modal keluar' },
  'stat.profit_factor': { en: 'Profit factor', id: 'Profit factor' },
  'stat.best_run_single': { en: 'Best single run', id: 'Run terbaik' },
  'stat.worst_run': { en: 'Worst run', id: 'Run terburuk' },
  'stat.by_level': { en: 'Profit by level', id: 'Profit per level' },
  'stat.source_split': { en: 'Bought vs free', id: 'Beli vs gratis' },
  'stat.roi': { en: 'Return on bookmarks', id: 'Balik modal bookmark' },
  'stat.roi.hint': { en: 'net ISK / bookmarks bought', id: 'ISK bersih / bookmark dibeli' },
  'stat.no_loss': { en: 'no losing run yet', id: 'belum ada run rugi' },
  'stat.no_data': { en: 'No escalations in this range', id: 'Belum ada eskalasi di rentang ini' },
  'stat.no_data.sub': {
    en: 'Log a run above, or widen the time range. Your old runs are still in the ledger.',
    id: 'Log run di atas, atau lebarin rentang waktunya. Run lama lu masih aman di ledger.',
  },
  'stat.by_site': { en: 'Average per site', id: 'Rata-rata per site' },
  'stat.by_site.hint': { en: 'faction + tier, avg net ISK', id: 'faksi + tier, rata-rata ISK bersih' },
  'stat.by_level.hint': { en: 'net ISK per tier', id: 'ISK bersih per tier' },

  /* ── Form ─────────────────────────────── */
  'form.title': { en: 'Log Escalation', id: 'Log Eskalasi' },
  'form.ded_level': { en: 'DED Level', id: 'Level DED' },
  'form.ded_level.placeholder': { en: 'Select level', id: 'Pilih level' },
  'form.faction': { en: 'Faction', id: 'Faksi' },
  'form.faction.placeholder': { en: 'Select faction', id: 'Pilih faksi' },
  'form.purchased.on': { en: '💰 Purchased Escalation', id: '💰 Eskalasi Dibeli' },
  'form.purchased.off': { en: '🎲 Free Escalation', id: '🎲 Eskalasi Gratis' },
  'form.purchased.on.sub': { en: 'Bought from contract/market', id: 'Dibeli dari kontrak/market' },
  'form.purchased.off.sub': { en: 'Natural escalation drop', id: 'Drop eskalasi natural' },
  'form.capital': { en: 'Capital Cost (ISK)', id: 'Modal (ISK)' },
  'form.capital.placeholder': { en: 'e.g. 150m, 1.5b, 250.000.000', id: 'mis. 150m, 1,5b, 250.000.000' },
  'form.loot': { en: 'Loot Text', id: 'Teks Loot' },
  'form.loot_source': { en: 'Loot source', id: 'Sumber loot' },
  'form.header.sub': { en: 'Jita prices · Janice appraisal', id: 'Harga Jita · appraisal Janice' },
  'form.pricing': { en: 'Pricing', id: 'Harga' },
  'form.loot.placeholder': { en: 'Pith X-Type Shield Booster 1\nDread Guristas Missile Guidance Computer 2', id: 'Pith X-Type Shield Booster 1\nDread Guristas Missile Guidance Computer 2' },
  'form.price_mode': { en: 'Price Mode', id: 'Mode Harga' },
  'form.percent': { en: 'Percent', id: 'Persen' },
  'form.location': { en: 'Location', id: 'Lokasi' },
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
  'form.manual.placeholder': { en: 'e.g. 2.34b, 890m, 1.780.000.000', id: 'mis. 2,34b, 890m, 1.780.000.000' },
  'form.items': { en: 'items', id: 'item' },
  'form.janice_link': { en: 'Janice link', id: 'Link Janice' },
  'form.stale': {
    en: 'Price settings changed — appraise again to refresh the total.',
    id: 'Setting harga berubah — appraise ulang biar totalnya akurat.',
  },
  'form.hint.loot': { en: 'Loot value must be above zero.', id: 'Nilai loot harus di atas nol.' },
  'form.error.missing_selection': { en: 'Pick a DED level and a faction first.', id: 'Pilih level DED dan faksi dulu.' },
  'form.toast.paste_first': { en: 'Paste your loot text first.', id: 'Paste teks loot dulu.' },
  'form.toast.network': { en: 'Network error — try again.', id: 'Error jaringan — coba lagi.' },
  'form.toast.logged': { en: 'Run logged.', id: 'Run tersimpan.' },
  'form.toast.failed': { en: 'Could not save the run.', id: 'Gagal menyimpan run.' },
  'form.toast.unexpected': { en: 'Something broke. Try again.', id: 'Ada yang rusak. Coba lagi.' },

  /* ── History ──────────────────────────── */
  'history.title': { en: 'Run History', id: 'Riwayat Run' },
  'history.runs': { en: 'runs', id: 'run' },
  'history.run': { en: 'run', id: 'run' },
  'history.empty.title': { en: 'No runs yet', id: 'Belum ada run' },
  'history.empty.sub': { en: 'Submit your first escalation to start tracking.', id: 'Kirim eskalasi pertama untuk mulai tracking.' },
  'history.no_match.title': { en: 'Nothing matches', id: 'Nggak ada yang cocok' },
  'history.no_match.sub': { en: 'Try a different search or reset the filters.', id: 'Coba kata kunci lain atau reset filter.' },
  'history.delete.title': { en: 'Delete this run?', id: 'Hapus run ini?' },
  'history.delete.confirm': { en: 'Delete', id: 'Hapus' },
  'history.delete.desc': { en: 'This removes the run from your PNL for good.', id: 'Run ini bakal hilang dari PNL lu permanen.' },
  'history.delete.toast': { en: 'Run deleted.', id: 'Run dihapus.' },
  'history.delete.failed': { en: 'Delete failed.', id: 'Gagal menghapus.' },
  'history.cancel': { en: 'Cancel', id: 'Batal' },
  'history.bought': { en: 'BOUGHT', id: 'BELI' },
  'history.free': { en: 'FREE', id: 'GRATIS' },
  'history.date': { en: 'Date', id: 'Tanggal' },
  'history.escalation': { en: 'Escalation', id: 'Eskalasi' },
  'history.source': { en: 'Source', id: 'Sumber' },
  'history.loot': { en: 'Loot', id: 'Loot' },
  'history.pnl': { en: 'PNL', id: 'PNL' },
  'history.capital': { en: 'Capital', id: 'Modal' },
  'history.search': { en: 'Search', id: 'Cari' },
  'history.search.placeholder': { en: 'Search…', id: 'Cari…' },
  'history.all_levels': { en: 'All levels', id: 'Semua level' },
  'history.all_factions': { en: 'All factions', id: 'Semua faksi' },
  'history.reset': { en: 'Reset', id: 'Reset' },
  'history.export': { en: 'Export CSV', id: 'Ekspor CSV' },
  'history.export.empty': { en: 'Nothing to export.', id: 'Nggak ada yang bisa diekspor.' },
  'history.export.done': { en: 'CSV downloaded.', id: 'CSV terunduh.' },
  'history.page': { en: 'Page', id: 'Halaman' },
  'history.of': { en: 'of', id: 'dari' },
  'history.prev': { en: 'Previous page', id: 'Halaman sebelumnya' },
  'history.next': { en: 'Next page', id: 'Halaman berikutnya' },
  'history.expand': { en: 'Show run detail', id: 'Lihat detail run' },
  'history.delete.run': { en: 'Delete run', id: 'Hapus run' },
  'history.edit': { en: 'Edit', id: 'Edit' },
  'history.edit.title': { en: 'Edit run', id: 'Edit run' },
  'history.edit.sub': { en: 'Fix a typo in loot or cost — the PNL updates itself.', id: 'Benerin loot atau modal yang salah — PNL ikut update.' },
  'history.edit.save': { en: 'Save changes', id: 'Simpan perubahan' },
  'history.edit.saving': { en: 'Saving...', id: 'Menyimpan...' },
  'history.edit.saved': { en: 'Run updated.', id: 'Run diperbarui.' },
  'history.edit.failed': { en: 'Update failed.', id: 'Gagal memperbarui.' },
  'history.detail.title': { en: 'Run detail', id: 'Detail run' },
  'history.detail.close': { en: 'Close', id: 'Tutup' },
  'history.detail.price_mode': { en: 'Pricing', id: 'Harga' },
  'history.detail.closed': { en: 'Dismiss', id: 'Tutup' },

  /* ── Changelog ────────────────────────── */
  'changelog.new': { en: 'New features', id: 'Fitur baru' },
  'changelog.fixes': { en: 'Fixes & improvements', id: 'Perbaikan' },
  'changelog.got_it': { en: 'Got it', id: 'Oke' },

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

  /* ── Footer ─────────────────────────────── */
  'footer.sub': { en: 'PVE Analytics for Capsuleers', id: 'Analitik PVE untuk Capsuleer' },
  'footer.desc': {
    en: 'Maximize your ISK/hour with data-driven DED escalation tracking. Evaluated instantly via the Janice Appraiser.',
    id: 'Maksimalkan ISK/jam lu pake data eskalasi DED yang akurat. Harga dihitung otomatis via Janice Appraiser.',
  },
  'footer.support': { en: 'Support', id: 'Dukungan' },
  'footer.isk': { en: 'ISK Donation', id: 'Donasi ISK' },
  'footer.mail': { en: 'In-game Mail / Feedback', id: 'Mail In-game / Feedback' },
  'footer.prefs': { en: 'Preferences', id: 'Preferensi' },
  'footer.powered': { en: 'Powered by Janice', id: 'Ditenagai oleh Janice' },
  'footer.language': { en: 'Language', id: 'Bahasa' },
  'footer.theme': { en: 'Theme', id: 'Tema' },
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

export function I18nProvider({
  children,
  initialLocale = 'en',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  /** Persist to a cookie so the server can render the right language on first paint. */
  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

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
