'use client';

import { useState, useTransition, useOptimistic } from 'react';
import { Trash2, History, FileText, AlertTriangle, ArrowUpDown, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { formatISK, formatISKSigned, formatDate } from '@/lib/format';
import { deleteDedRun } from '@/app/actions/ded-runs';
import { useI18n } from '@/lib/i18n';
import { toast } from 'sonner';
import { DED_TYPES, FACTIONS } from '@/lib/types';
import type { DedRun } from '@/lib/types';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Props {
  runs: DedRun[];
}

type SortKey = 'created_at' | 'ded_type' | 'net_profit' | 'loot_value';
type SortDir = 'asc' | 'desc';

export default function RunHistory({ runs }: Props) {
  const { t } = useI18n();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [filterDed, setFilterDed] = useState<string>('all');
  const [filterFaction, setFilterFaction] = useState<string>('all');

  const [optimisticRuns, optimisticDelete] = useOptimistic(
    runs,
    (state, idToRemove: string) => state.filter((r) => r.id !== idToRemove)
  );

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      optimisticDelete(id);
      const result = await deleteDedRun(id);
      setDeletingId(null);
      if (result.success) { setTimeout(() => toast.success('Run deleted.'), 50); }
      else { setTimeout(() => toast.error('Failed to delete.'), 50); }
    });
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const filteredRuns = optimisticRuns.filter((r) => {
    if (filterDed !== 'all' && r.ded_type !== filterDed) return false;
    if (filterFaction !== 'all' && r.faction !== filterFaction) return false;
    return true;
  });

  const sortedRuns = [...filteredRuns].sort((a, b) => {
    let valA: string | number = a[sortKey] as string | number;
    let valB: string | number = b[sortKey] as string | number;
    if (sortKey === 'ded_type') {
      valA = parseInt(a.ded_type.split('/')[0]);
      valB = parseInt(b.ded_type.split('/')[0]);
    } else if (sortKey === 'created_at') {
      valA = new Date(a.created_at).getTime();
      valB = new Date(b.created_at).getTime();
    }
    
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRuns.length / pageSize));
  
  // Ensure currentPage is within valid bounds
  let validPage = currentPage;
  if (validPage > totalPages) validPage = totalPages;
  if (validPage < 1) validPage = 1;

  const startIndex = (validPage - 1) * pageSize;
  const currentRuns = sortedRuns.slice(startIndex, startIndex + pageSize);

  const renderSortIcon = (column: SortKey) => {
    if (sortKey !== column) return <ArrowUpDown className="size-3 text-[var(--nb-text-faint)] ml-1 inline-block" />;
    return sortDir === 'asc' ? <ArrowUp className="size-3 text-black dark:text-white ml-1 inline-block" /> : <ArrowDown className="size-3 text-black dark:text-white ml-1 inline-block" />;
  };

  return (
    <div className="nb-card overflow-hidden animate-slide-right flex flex-col" style={{ animationDelay: '80ms', height: '100%', maxHeight: '680px' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-[var(--nb-border)] px-5 py-4 sm:px-6 bg-[var(--nb-violet)]">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center border-3 border-[var(--nb-border)] bg-white shadow-[2px_2px_0px_var(--nb-shadow)] transition-transform hover:rotate-12">
            <History className="size-5 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-black">{t('history.title')}</h2>
            <p className="text-xs font-bold text-black/70">
              {optimisticRuns.length} {optimisticRuns.length !== 1 ? t('history.runs') : t('history.run')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--nb-surface)] border-b-3 border-[var(--nb-border)] px-5 py-3 sm:px-6 flex items-center gap-3">
        <div className="w-32">
          <Select value={filterDed} onValueChange={(v) => { if (v) setFilterDed(v); setCurrentPage(1); }}>
            <SelectTrigger className="nb-select w-full font-mono text-xs font-bold py-1.5 h-auto rounded-none"><SelectValue /></SelectTrigger>
            <SelectContent alignItemWithTrigger={false} side="bottom" className="border-3 border-[var(--nb-border)] rounded-none shadow-[4px_4px_0px_var(--nb-shadow)] bg-[var(--nb-surface)]">
              <SelectGroup>
                <SelectItem value="all" className="font-mono text-xs font-bold rounded-none hover:bg-[var(--nb-amber)] transition-colors">All Levels</SelectItem>
                {DED_TYPES.map(d => <SelectItem key={d.value} value={d.value} className="font-mono text-xs font-bold rounded-none hover:bg-[var(--nb-amber)] transition-colors">{d.label}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-36">
          <Select value={filterFaction} onValueChange={(v) => { if (v) setFilterFaction(v); setCurrentPage(1); }}>
            <SelectTrigger className="nb-select w-full font-mono text-xs font-bold py-1.5 h-auto rounded-none"><SelectValue /></SelectTrigger>
            <SelectContent alignItemWithTrigger={false} side="bottom" className="border-3 border-[var(--nb-border)] rounded-none shadow-[4px_4px_0px_var(--nb-shadow)] bg-[var(--nb-surface)]">
              <SelectGroup>
                <SelectItem value="all" className="font-mono text-xs font-bold rounded-none hover:bg-[var(--nb-amber)] transition-colors">All Factions</SelectItem>
                {FACTIONS.map(f => <SelectItem key={f.value} value={f.value} className="font-mono text-xs font-bold rounded-none hover:bg-[var(--nb-amber)] transition-colors">{f.label}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {filteredRuns.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 stagger flex-grow">
          <div className="flex size-16 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-hover-bg)] shadow-[3px_3px_0px_var(--nb-shadow)] animate-bounce-subtle">
            <FileText className="size-7 text-[var(--nb-text-faint)]" strokeWidth={2} />
          </div>
          <p className="text-lg font-black uppercase">
            {optimisticRuns.length === 0 ? t('history.empty.title') : 'No matching runs'}
          </p>
          <p className="text-sm text-[var(--nb-text-muted)] text-center max-w-xs">
            {optimisticRuns.length === 0 ? t('history.empty.sub') : 'Try changing your filters.'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-y-auto flex-grow">
            {/* Mobile card view */}
            <div className="flex flex-col sm:hidden gap-3 px-4 py-2">
              {currentRuns.map((run, i) => (
                <div
                  key={run.id}
                  className="animate-fade-in flex flex-col border-3 border-[var(--nb-border)] p-3 bg-[var(--nb-surface)] shadow-[3px_3px_0px_var(--nb-shadow)] hover-lift transition-all duration-200"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider bg-[var(--nb-text)] text-[var(--nb-surface)] px-1.5 py-0.5">{run.ded_type}</span>
                      <span className={cn(
                        'text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 border-2 border-[var(--nb-border)]',
                        run.is_purchased ? 'bg-[var(--nb-amber)] text-black' : 'bg-[var(--nb-lime)] text-black'
                      )}>
                        {run.is_purchased ? t('history.bought') : t('history.free')}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[var(--nb-text-faint)]">{formatDate(run.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold uppercase text-[var(--nb-text)]">{run.faction}</span>
                    {run.janice_code && (
                      <a
                        href={`https://janice.e-351.com/a/${run.janice_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 inline-flex items-center text-[9px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        title="View on Janice"
                      >
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                    <span className={cn(
                      'font-mono text-base font-black',
                      run.net_profit >= 0 ? 'text-profit' : 'text-loss'
                    )}>
                      {formatISKSigned(run.net_profit)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-end mt-3 border-t-2 border-[var(--nb-border)] pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger
                        className="p-1.5 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[2px_2px_0px_var(--nb-shadow)] hover:bg-red-100 dark:hover:bg-red-900/30 hover-press transition-all"
                        disabled={isPending && deletingId === run.id}
                      >
                        {isPending && deletingId === run.id
                          ? <span className="nb-spinner" />
                          : <Trash2 className="size-3.5 text-red-600 dark:text-red-400" strokeWidth={2.5} />
                        }
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-3 border-[var(--nb-border)] rounded-none shadow-[6px_6px_0px_var(--nb-shadow)] animate-scale-in bg-[var(--nb-surface)]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-lg font-black uppercase">
                            <AlertTriangle className="size-5 text-red-600 dark:text-red-400" strokeWidth={2.5} />
                            {t('history.delete.title')}
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-medium text-[var(--nb-text-muted)]">
                            {run.ded_type} {run.faction} ({formatISKSigned(run.net_profit)})
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="nb-btn nb-btn-secondary py-2 text-xs">{t('history.cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(run.id)}
                            className="nb-btn nb-btn-danger py-2 text-xs"
                          >
                            {t('history.delete.confirm')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b-3 border-[var(--nb-border)] bg-[var(--nb-hover-bg)]">
                  <th 
                    className="text-left text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)] px-5 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => handleSort('created_at')}
                  >
                    {t('history.date')} {renderSortIcon('created_at')}
                  </th>
                  <th 
                    className="text-left text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)] px-3 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => handleSort('ded_type')}
                  >
                    {t('history.escalation')} {renderSortIcon('ded_type')}
                  </th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)] px-3 py-3">
                    {t('history.source')}
                  </th>
                  <th 
                    className="text-right text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)] px-3 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => handleSort('loot_value')}
                  >
                    {t('history.loot')} {renderSortIcon('loot_value')}
                  </th>
                  <th 
                    className="text-right text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)] px-3 py-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => handleSort('net_profit')}
                  >
                    {t('history.pnl')} {renderSortIcon('net_profit')}
                  </th>
                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {currentRuns.map((run, i) => (
                  <tr
                    key={run.id}
                    className="group nb-row animate-fade-in"
                    style={{ animationDelay: `${i * 20}ms` }}
                  >
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs font-bold text-[var(--nb-text-faint)]">
                      {formatDate(run.created_at)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-sm font-black">{run.ded_type}</span>
                      <span className="ml-2 text-sm font-bold text-[var(--nb-text-muted)]">{run.faction}</span>
                      {run.janice_code && (
                        <a
                          href={`https://janice.e-351.com/a/${run.janice_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400 hover:underline align-middle"
                          title="View on Janice"
                        >
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn(
                        'nb-badge text-[9px]',
                        run.is_purchased ? 'bg-[var(--nb-amber)]' : 'bg-[var(--nb-lime)]'
                      )}>
                        {run.is_purchased ? t('history.bought') : t('history.free')}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-sm font-bold text-[var(--nb-text-muted)]">
                      {formatISK(run.loot_value)}
                    </td>
                    <td className={cn(
                      'px-3 py-3 text-right font-mono text-sm font-black',
                      run.net_profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {formatISKSigned(run.net_profit)}
                    </td>
                    <td className="px-3 py-3">
                      <AlertDialog>
                        <AlertDialogTrigger
                          className="p-1.5 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[2px_2px_0px_var(--nb-shadow)] opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 hover-press transition-all"
                          disabled={isPending && deletingId === run.id}
                        >
                          {isPending && deletingId === run.id
                            ? <span className="nb-spinner" />
                            : <Trash2 className="size-4 text-red-600 dark:text-red-400" strokeWidth={2.5} />
                          }
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-3 border-[var(--nb-border)] rounded-none shadow-[6px_6px_0px_var(--nb-shadow)] animate-scale-in bg-[var(--nb-surface)]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-lg font-black uppercase">
                              <AlertTriangle className="size-5 text-red-600 dark:text-red-400" strokeWidth={2.5} />
                              {t('history.delete.title')}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="font-medium text-[var(--nb-text-muted)]">
                              {run.ded_type} {run.faction} ({formatISKSigned(run.net_profit)})
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="nb-btn nb-btn-secondary py-2 text-xs">{t('history.cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(run.id)}
                              className="nb-btn nb-btn-danger py-2 text-xs"
                            >
                              {t('history.delete.confirm')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t-3 border-[var(--nb-border)] bg-[var(--nb-surface)] px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--nb-text-muted)] uppercase tracking-wider">
                Page {validPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  className="p-1.5 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[2px_2px_0px_var(--nb-shadow)] disabled:opacity-50 hover-press transition-all enabled:hover:bg-[var(--nb-hover-bg)]"
                  disabled={validPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  <ChevronLeft className="size-4 text-[var(--nb-text)]" strokeWidth={2.5} />
                </button>
                <button
                  className="p-1.5 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[2px_2px_0px_var(--nb-shadow)] disabled:opacity-50 hover-press transition-all enabled:hover:bg-[var(--nb-hover-bg)]"
                  disabled={validPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  <ChevronRight className="size-4 text-[var(--nb-text)]" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
