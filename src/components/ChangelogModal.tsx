'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { changelog, CURRENT_VERSION } from '@/lib/changelog';
import { Megaphone, Rocket, Wrench } from 'lucide-react';

export default function ChangelogModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen this version
    const lastSeen = localStorage.getItem('eve_ded_tracker_last_seen_version');
    
    if (lastSeen !== CURRENT_VERSION) {
      // Small delay to ensure smooth rendering before popping up
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      localStorage.setItem('eve_ded_tracker_last_seen_version', CURRENT_VERSION);
    }
  };

  const latestUpdate = changelog[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="border-4 border-[var(--nb-border)] bg-[var(--nb-surface)] p-0 shadow-[8px_8px_0px_var(--nb-shadow)] rounded-none max-w-md animate-scale-in max-h-[85vh] overflow-y-auto">
        <DialogHeader className="bg-[var(--nb-amber)] border-b-4 border-[var(--nb-border)] px-6 py-5 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center border-3 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] -rotate-6">
              <Megaphone className="size-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-black">
                Update: {latestUpdate.version}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold text-black/70">
                {latestUpdate.date} — {latestUpdate.title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 flex flex-col gap-6">
          {latestUpdate.features.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[var(--nb-text)]">
                <Rocket className="size-4 text-[var(--nb-cyan)]" strokeWidth={3} />
                New Features
              </h3>
              <ul className="flex flex-col gap-2">
                {latestUpdate.features.map((feature, i) => (
                  <li key={i} className="text-sm font-medium text-[var(--nb-text-muted)] flex items-start gap-2">
                    <span className="text-[var(--nb-cyan)] font-black mt-0.5">•</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {latestUpdate.fixes.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[var(--nb-text)]">
                <Wrench className="size-4 text-[var(--nb-pink)]" strokeWidth={3} />
                Fixes & Improvements
              </h3>
              <ul className="flex flex-col gap-2">
                {latestUpdate.fixes.map((fix, i) => (
                  <li key={i} className="text-sm font-medium text-[var(--nb-text-muted)] flex items-start gap-2">
                    <span className="text-[var(--nb-pink)] font-black mt-0.5">•</span> {fix}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 pt-2 pb-6 flex justify-end">
          <button
            onClick={() => handleClose(false)}
            className="nb-btn nb-btn-primary px-8 py-2 text-sm"
          >
            Got it!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
