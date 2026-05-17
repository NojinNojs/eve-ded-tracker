'use client';

import { useState, useTransition } from 'react';
import { Trash2, History, FileText, AlertTriangle } from 'lucide-react';
import { formatISK, formatISKSigned, formatDate } from '@/lib/format';
import { deleteDedRun } from '@/app/actions/ded-runs';
import { useI18n } from '@/lib/i18n';
import { toast } from 'sonner';
import type { DedRun } from '@/lib/types';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface Props {
  runs: DedRun[];
  onRunDeleted: () => void;
}

export default function RunHistory({ runs, onRunDeleted }: Props) {
  const { t } = useI18n();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteDedRun(id);
      if (result.success) { toast.success('Run deleted.'); onRunDeleted(); }
      else { toast.error('Failed to delete.'); }
      setDeletingId(null);
    });
  }

  return (
    <div className="nb-card overflow-hidden animate-slide-right" style={{ animationDelay: '80ms' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-[var(--nb-border)] px-5 py-4 sm:px-6 bg-[var(--nb-violet)]">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[2px_2px_0px_var(--nb-shadow)] transition-transform hover:rotate-12">
            <History className="size-5" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-black">{t('history.title')}</h2>
            <p className="text-xs font-bold text-black/50">
              {runs.length} {runs.length !== 1 ? t('history.runs') : t('history.run')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {runs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 stagger">
          <div className="flex size-16 items-center justify-center border-3 border-[var(--nb-border)] bg-[var(--nb-hover-bg)] shadow-[3px_3px_0px_var(--nb-shadow)] animate-bounce-subtle">
            <FileText className="size-7 text-[var(--nb-text-faint)]" strokeWidth={2} />
          </div>
          <p className="text-lg font-black uppercase">{t('history.empty.title')}</p>
          <p className="text-sm text-[var(--nb-text-muted)] text-center max-w-xs">{t('history.empty.sub')}</p>
        </div>
      ) : (
        <div className="max-h-[560px] overflow-y-auto">
          {/* Mobile card view */}
          <div className="flex flex-col sm:hidden">
            {runs.map((run, i) => (
              <div
                key={run.id}
                className="animate-fade-in flex items-center justify-between border-b-2 border-[var(--nb-border)] px-4 py-3 hover:bg-[var(--nb-amber)] transition-all duration-200 hover:pl-5"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black">{run.ded_type}</span>
                    <span className="text-xs font-bold text-[var(--nb-text-muted)]">{run.faction}</span>
                    <span className={cn(
                      'nb-badge text-[9px]',
                      run.is_purchased ? 'bg-[var(--nb-amber)]' : 'bg-[var(--nb-lime)]'
                    )}>
                      {run.is_purchased ? t('history.bought') : t('history.free')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[var(--nb-text-faint)]">{formatDate(run.created_at)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'font-mono text-sm font-black',
                    run.net_profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  )}>
                    {formatISKSigned(run.net_profit)}
                  </span>
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
                <th className="text-left text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)] px-5 py-3">{t('history.date')}</th>
                <th className="text-left text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)] px-3 py-3">{t('history.escalation')}</th>
                <th className="text-left text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)] px-3 py-3">{t('history.source')}</th>
                <th className="text-right text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)] px-3 py-3">{t('history.loot')}</th>
                <th className="text-right text-[10px] font-black uppercase tracking-wider text-[var(--nb-text-muted)] px-3 py-3">{t('history.pnl')}</th>
                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {runs.map((run, i) => (
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
      )}
    </div>
  );
}
