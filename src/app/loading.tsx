'use client';

import { useI18n } from '@/lib/i18n';

export default function Loading() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[calc(100dvh-60px)] items-center justify-center">
      <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
        <div className="nb-spinner !size-10 !border-[3px]" />
        <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[var(--nb-text-muted)]">
          {t('loading')}
        </p>
      </div>
    </div>
  );
}
