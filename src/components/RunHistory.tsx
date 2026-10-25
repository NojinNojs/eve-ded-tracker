'use client';

import { useEffect, useMemo, useRef, useState, useTransition, useOptimistic } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, FileSearch, History, ScrollText } from 'lucide-react';
import { toast } from 'sonner';
import { deleteDedRun } from '@/app/actions/ded-runs';
import { buildRunsCsv, csvFilename, downloadCsv } from '@/lib/csv';
import { formatISKSigned } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { nextSortState, sortRuns, type SortKey, type SortState } from '@/lib/runSort';
import type { DedRun } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import HistoryFilters from '@/components/history/HistoryFilters';
import RunTable from '@/components/history/RunTable';
import RunCardList from '@/components/history/RunCardList';
import RunDetailDialog from '@/components/history/RunDetailDialog';
import RunEditDialog from '@/components/history/RunEditDialog';

interface Props {
  runs: DedRun[];
}

const PAGE_SIZE = 10;

export default function RunHistory({ runs }: Props) {
  const { t } = useI18n();

  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearchValue] = useState('');
  const [ded, setDedValue] = useState('all');
  const [faction, setFactionValue] = useState('all');
  const [sort, setSort] = useState<SortState>({ key: 'created_at', dir: 'desc' });
  const [page, setPage] = useState(1);

  const [detailRun, setDetailRun] = useState<DedRun | null>(null);
  const [editRun, setEditRun] = useState<DedRun | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DedRun | null>(null);

  const [isPending, startTransition] = useTransition();
  const [visibleRuns, removeRunOptimistically] = useOptimistic(runs, (state, id: string) =>
    state.filter((run) => run.id !== id)
  );

  const setSearch = (value: string) => {
    setSearchValue(value);
    setPage(1);
  };
  const setDed = (value: string) => {
    setDedValue(value);
    setPage(1);
  };
  const setFaction = (value: string) => {
    setFactionValue(value);
    setPage(1);
  };
  const handleSort = (key: SortKey) => {
    setSort((current) => nextSortState(current, key));
    setPage(1);
  };

  const filtersActive = search.trim() !== '' || ded !== 'all' || faction !== 'all';
  const resetFilters = () => {
    setSearchValue('');
    setDedValue('all');
    setFactionValue('all');
    setPage(1);
  };

  // `/` jumps to the search box, the way every ledger app should.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return visibleRuns.filter((run) => {
      if (ded !== 'all' && run.ded_type !== ded) return false;
      if (faction !== 'all' && run.faction !== faction) return false;
      if (!needle) return true;
      return `${run.faction} ${run.ded_type} ${run.janice_code ?? ''}`.toLowerCase().includes(needle);
    });
  }, [visibleRuns, ded, faction, search]);

  const sorted = useMemo(() => sortRuns(filtered, sort), [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRuns = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleExport() {
    if (sorted.length === 0) {
      toast.error(t('history.export.empty'));
      return;
    }
    downloadCsv(csvFilename(), buildRunsCsv(sorted));
    toast.success(t('history.export.done'), { description: `${sorted.length} ${t('history.runs')}` });
  }

  function handleDelete(run: DedRun) {
    setDeleteTarget(null);
    startTransition(async () => {
      removeRunOptimistically(run.id);
      const result = await deleteDedRun(run.id);
      if (result.success) {
        toast.success(t('history.delete.toast'));
      } else {
        toast.error(result.error ?? t('history.delete.failed'));
      }
    });
  }

  return (
    <section className="nb-card nb-card--static flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b-3 border-[var(--nb-border)] bg-[var(--nb-violet)] px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center border-3 border-[var(--nb-border)] bg-white shadow-[2px_2px_0px_var(--nb-shadow)]">
            <History className="size-4 text-black" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase leading-none tracking-tight text-black">
              {t('history.title')}
            </h2>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black/70">
              {visibleRuns.length} {visibleRuns.length === 1 ? t('history.run') : t('history.runs')}
              {filtersActive && ` · ${sorted.length} ${t('history.search').toLowerCase()}`}
            </p>
          </div>
        </div>
      </div>

      <HistoryFilters
        search={search}
        onSearch={setSearch}
        ded={ded}
        onDed={setDed}
        faction={faction}
        onFaction={setFaction}
        onReset={resetFilters}
        onExport={handleExport}
        canExport={sorted.length > 0}
        filtersActive={filtersActive}
        searchRef={searchRef}
      />

      {/* Body */}
      {pageRuns.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-hover-bg)] shadow-[3px_3px_0px_var(--nb-shadow)]">
            {visibleRuns.length === 0 ? (
              <ScrollText className="size-6 text-[var(--nb-text-faint)]" strokeWidth={2} aria-hidden="true" />
            ) : (
              <FileSearch className="size-6 text-[var(--nb-text-faint)]" strokeWidth={2} aria-hidden="true" />
            )}
          </div>
          <p className="text-base font-black uppercase tracking-wide">
            {visibleRuns.length === 0 ? t('history.empty.title') : t('history.no_match.title')}
          </p>
          <p className="max-w-xs text-xs font-medium text-[var(--nb-text-muted)]">
            {visibleRuns.length === 0 ? t('history.empty.sub') : t('history.no_match.sub')}
          </p>
          {visibleRuns.length > 0 && filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="nb-btn nb-btn-secondary mt-1 px-3 py-1.5 text-[10px]"
            >
              {t('history.reset')}
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="hidden sm:block">
            <RunTable
              runs={pageRuns}
              sort={sort}
              onSort={handleSort}
              onOpen={setDetailRun}
              onEdit={setEditRun}
              onDelete={setDeleteTarget}
            />
          </div>
          <div className="sm:hidden">
            <RunCardList
              runs={pageRuns}
              onOpen={setDetailRun}
              onEdit={setEditRun}
              onDelete={setDeleteTarget}
            />
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-auto flex items-center justify-between border-t-3 border-[var(--nb-border)] bg-[var(--nb-surface)] px-4 py-2.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--nb-text-muted)]">
            {t('history.page')} {currentPage} {t('history.of')} {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label={t('history.prev')}
              disabled={currentPage <= 1}
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-1.5 shadow-[2px_2px_0px_var(--nb-shadow)] transition-all hover-press enabled:hover:bg-[var(--nb-hover-bg)] disabled:opacity-40"
            >
              <ChevronLeft className="size-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={t('history.next')}
              disabled={currentPage >= totalPages}
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              className="border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] p-1.5 shadow-[2px_2px_0px_var(--nb-shadow)] transition-all hover-press enabled:hover:bg-[var(--nb-hover-bg)] disabled:opacity-40"
            >
              <ChevronRight className="size-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <RunDetailDialog run={detailRun} onOpenChange={(open) => !open && setDetailRun(null)} />

      {editRun && (
        <RunEditDialog
          key={editRun.id}
          run={editRun}
          open
          onOpenChange={(open) => !open && setEditRun(null)}
        />
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-none border-4 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[6px_6px_0px_var(--nb-shadow)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base font-black uppercase">
              <AlertTriangle className="size-5 text-red-600 dark:text-red-400" strokeWidth={2.5} aria-hidden="true" />
              {t('history.delete.title')}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-[var(--nb-text-muted)]">
              <span className="font-mono text-xs font-bold text-[var(--nb-text)]">
                {deleteTarget ? `${deleteTarget.ded_type} ${deleteTarget.faction} · ${formatISKSigned(Number(deleteTarget.net_profit))}` : ''}
              </span>
              <br />
              {t('history.delete.desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 border-t-0 bg-transparent p-0">
            <AlertDialogCancel className="nb-btn nb-btn-secondary py-2 text-xs">{t('history.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="nb-btn nb-btn-danger py-2 text-xs"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              disabled={isPending}
            >
              {isPending ? <span className="nb-spinner" /> : t('history.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
