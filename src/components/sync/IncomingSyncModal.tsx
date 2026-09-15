import React from 'react';
import { Smartphone, Check, X, ShieldAlert, ArrowRight, Trophy, Flame, Brain } from 'lucide-react';
import { ProgressData } from '../../lib/storage/progressStorage';
import { TransferSummary, applyDeviceSync } from '../../lib/storage/backupSync';
import { soundManager } from '../../lib/sound';

interface IncomingSyncModalProps {
  isOpen: boolean;
  data: ProgressData | null;
  summary: TransferSummary | null;
  onClose: () => void;
}

export const IncomingSyncModal: React.FC<IncomingSyncModalProps> = ({ isOpen, data, summary, onClose }) => {
  if (!isOpen || !data || !summary) return null;

  const handleConfirmSync = () => {
    soundManager.playCorrect();
    applyDeviceSync(data);
    onClose();
  };

  const gameNames: Record<string, string> = {
    wordspeed: '🔤Word Speed',
    anzan: '⚡Pro Calculations',
Boggle: '🎲Boggle',
    sudoku: '🧩Sudoku Reflex',
    zebra: '🕵️Reasoning Puzzles'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-teal-200 dark:border-teal-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 pb-4 text-center space-y-2 border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Smartphone className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Incoming Progress Transfer
          </h3>
          <p className="text-xs text-slate-400">
            A progress transfer link from another device was opened.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/60 text-center">
              <Brain className="w-4 h-4 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono font-bold uppercase text-teal-600/80">Mind Level</span>
              <p className="text-base font-black text-teal-700 dark:text-teal-300">{summary.overallMindLevel}</p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 text-center">
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono font-bold uppercase text-amber-600/80">Streak</span>
              <p className="text-base font-black text-amber-700 dark:text-amber-300">{summary.streakDays}d</p>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 text-center">
              <Trophy className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-600/80">Games</span>
              <p className="text-base font-black text-indigo-700 dark:text-indigo-300">{summary.gamesPlayed}</p>
            </div>
          </div>

          {/* Level Breakdown List */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Incoming Levels:</span>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
              {Object.entries(summary.gameLevels).map(([gid, lvl]) => (
                <div key={gid} className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-300">{gameNames[gid] || gid}</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">Lvl {lvl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Notice */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-200 font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Applying this sync will update this browser's local progress with the incoming data.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSync}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply Progress</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
