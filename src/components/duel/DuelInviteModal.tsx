import React from 'react';
import { DuelChallenge } from '../../lib/duel/types';
import { GAMES } from '../../engine/game-engine/game-registry';
import { formatTimeMs } from '../../engine/game-engine/timer';
import { soundManager } from '../../lib/sound';
import { Swords, X, Play, Target, Clock, Zap } from 'lucide-react';

interface DuelInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (duel: DuelChallenge) => void;
  duel: DuelChallenge | null;
}

export const DuelInviteModal: React.FC<DuelInviteModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  duel
}) => {
  if (!isOpen || !duel) return null;

  const game = GAMES[duel.gameId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Dismiss */}
        <button
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3">
          <Swords className="w-3.5 h-3.5" />
          <span>Head-to-Head Duel</span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Challenge from {duel.creatorName}!
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          You've been challenged to solve the exact same puzzle faster than {duel.creatorName}'s ghost.
        </p>

        {/* Duel Parameters Card */}
        <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${game?.accentColor} text-white flex items-center justify-center font-bold text-xs`}>
                {game?.name[0]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{game?.name}</h4>
                <p className="text-[10px] text-slate-400">{game?.subtitle}</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-mono font-bold">
              Level {duel.level}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-center">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold uppercase mb-0.5">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Target Time</span>
              </div>
              <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                {formatTimeMs(duel.creatorTimeMs)}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold uppercase mb-0.5">
                <Target className="w-3 h-3 text-emerald-500" />
                <span>Target Accuracy</span>
              </div>
              <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                {duel.creatorAccuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => {
            soundManager.playCorrect();
            onAccept(duel);
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Accept Challenge & Race Ghost</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="w-full py-2 mt-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Maybe Later
        </button>

      </div>
    </div>
  );
};
