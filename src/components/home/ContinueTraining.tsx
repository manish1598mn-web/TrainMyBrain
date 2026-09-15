import React from 'react';
import { GameId } from '../../engine/game-engine/types';
import { GAMES } from '../../engine/game-engine/game-registry';
import { useProgressStore } from '../../store/progress-store';
import { soundManager } from '../../lib/sound';
import { Play, RotateCcw } from 'lucide-react';

interface ContinueTrainingProps {
  onPlayGame: (gameId: GameId) => void;
  onExploreGames: () => void;
}

export const ContinueTraining: React.FC<ContinueTrainingProps> = ({
  onPlayGame
}) => {
  const { getRecentGames } = useProgressStore();
  const recent = getRecentGames(3);

  // Clean UI: Suppress empty placeholder when no games played yet
  if (recent.length === 0) {
    return null;
  }

  return (
    <section className="my-8 select-none animate-in fade-in">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Continue Training</span>
        </h3>
        <span className="text-[11px] font-mono font-medium text-slate-400">Recently Played</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recent.map((item) => {
          const game = GAMES[item.gameId];
          return (
            <div
              key={item.gameId}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${game.accentColor} text-white font-bold text-xs shadow-sm shrink-0`}>
                  {game.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {game.name}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400">
                    Level {item.level}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playTap();
                  onPlayGame(item.gameId);
                }}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-xs active:scale-95"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Play</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
