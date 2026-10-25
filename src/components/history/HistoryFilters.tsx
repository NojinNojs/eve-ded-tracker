'use client';

import { Download, RotateCcw, Search } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { DED_TYPES, FACTIONS } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

interface Props {
  search: string;
  onSearch: (value: string) => void;
  ded: string;
  onDed: (value: string) => void;
  faction: string;
  onFaction: (value: string) => void;
  onReset: () => void;
  onExport: () => void;
  canExport: boolean;
  filtersActive: boolean;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

const selectContent =
  'border-3 border-[var(--nb-border)] rounded-none shadow-[4px_4px_0px_var(--nb-shadow)] bg-[var(--nb-surface)]';
const selectItem = 'font-mono text-xs font-bold rounded-none hover:bg-[var(--nb-amber)] transition-colors';

export default function HistoryFilters({
  search,
  onSearch,
  ded,
  onDed,
  faction,
  onFaction,
  onReset,
  onExport,
  canExport,
  filtersActive,
  searchRef,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-2 border-b-3 border-[var(--nb-border)] bg-[var(--nb-surface)] px-3 py-3 sm:px-4">
      <div className="relative min-w-0 basis-full flex-1 sm:basis-auto">
        <label htmlFor="history-search" className="sr-only">
          {t('history.search')}
        </label>
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--nb-text-faint)]"
          aria-hidden="true"
        />
        <input
          id="history-search"
          ref={searchRef}
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={t('history.search.placeholder')}
          className="nb-inset w-full py-1.5 pl-8 pr-2 font-mono text-xs font-bold placeholder:font-sans placeholder:font-semibold placeholder:text-[var(--nb-text-faint)] focus-visible:shadow-[4px_4px_0px_var(--nb-shadow)]"
        />
      </div>

      <div className="min-w-0 flex-1 sm:w-[7.5rem] sm:flex-none">
        <label htmlFor="filter-ded" className="sr-only">
          {t('form.ded_level')}
        </label>
        <Select value={ded} onValueChange={(value) => value && onDed(value)}>
          <SelectTrigger id="filter-ded" className="nb-select h-auto w-full rounded-none py-1.5 pr-6 font-mono text-xs font-bold">
            <span className="truncate">{ded === 'all' ? t('history.all_levels') : ded}</span>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} side="bottom" className={selectContent}>
            <SelectGroup>
              <SelectItem value="all" className={selectItem}>
                {t('history.all_levels')}
              </SelectItem>
              {DED_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value} className={selectItem}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0 flex-1 sm:w-[8.5rem] sm:flex-none">
        <label htmlFor="filter-faction" className="sr-only">
          {t('form.faction')}
        </label>
        <Select value={faction} onValueChange={(value) => value && onFaction(value)}>
          <SelectTrigger id="filter-faction" className="nb-select h-auto w-full rounded-none py-1.5 pr-6 font-mono text-xs font-bold">
            <span className="truncate">{faction === 'all' ? t('history.all_factions') : faction}</span>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} side="bottom" className={selectContent}>
            <SelectGroup>
              <SelectItem value="all" className={selectItem}>
                {t('history.all_factions')}
              </SelectItem>
              {FACTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className={selectItem}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filtersActive && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 border-2 border-[var(--nb-border)] bg-[var(--nb-surface)] px-2 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_var(--nb-shadow)] hover-press"
        >
          <RotateCcw className="size-3" strokeWidth={3} aria-hidden="true" />
          {t('history.reset')}
        </button>
      )}

      <button
        type="button"
        onClick={onExport}
        disabled={!canExport}
        className="nb-btn nb-btn-secondary ml-auto px-2.5 py-1.5 text-[10px] disabled:opacity-40"
      >
        <Download className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
        <span className="hidden sm:inline">{t('history.export')}</span>
      </button>
    </div>
  );
}
