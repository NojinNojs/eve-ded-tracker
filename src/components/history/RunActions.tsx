'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { DedRun } from '@/lib/types';

interface Props {
  run: DedRun;
  onEdit: (run: DedRun) => void;
  onDelete: (run: DedRun) => void;
}

const buttonClass =
  'p-1.5 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] shadow-[2px_2px_0px_var(--nb-shadow)] hover-press transition-all';

/** Edit + delete controls, shared by the table row and the mobile card. */
export default function RunActions({ run, onEdit, onDelete }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onEdit(run)}
        aria-label={`${t('history.edit')} — ${run.ded_type} ${run.faction}`}
        title={t('history.edit')}
        className={`${buttonClass} hover:bg-[var(--nb-hover-bg)]`}
      >
        <Pencil className="size-3.5" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(run)}
        aria-label={`${t('history.delete.run')} — ${run.ded_type} ${run.faction}`}
        title={t('history.delete.run')}
        className={`${buttonClass} hover:bg-red-100 dark:hover:bg-red-900/30`}
      >
        <Trash2 className="size-3.5 text-red-600 dark:text-red-400" strokeWidth={2.5} />
      </button>
    </div>
  );
}
