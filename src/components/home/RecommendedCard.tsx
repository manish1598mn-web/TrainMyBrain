import React from 'react';
import { GameId } from '../../engine/game-engine/types';
import { useProgressStore } from '../../store/progress-store';
import { soundManager } from '../../lib/sound';
import { Sparkles, Target, Play, ArrowRight } from 'lucide-react';
import { GAMES } from '../../engine/game-engine/game-registry';

interface RecommendedCardProps {
  onPlayGame: (gameId: GameId) => void;
}

export const RecommendedCard: React.FC<RecommendedCardProps> = ({ onPlayGame }) => {
  const { getWeakestGame } = useProgressStore();
  const recommendation = getWeakestGame();
  const game = GAMES[recommendation.gameId];

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Adaptive Recommendation
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Recommended for You
        </h3>

        <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
          <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <Target className="w-3.5 h-3.5 text-rose-500" />
            <span>Target Cognitive Area:</span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {recommendation.skillName}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-normal leading-relaxed">
            {recommendation.reason}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{game.name}</span>
          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">Level {recommendation.level}</span>
        </div>

        <button
          onClick={() => {
            soundManager.playTap();
            onPlayGame(recommendation.gameId);
          }}
          className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Train {game.name}</span>
        </button>
      </div>

    </div>
  );
};
