import React from 'react';
import { GameId } from '../../engine/game-engine/types';
import { GAMES } from '../../engine/game-engine/game-registry';
import { useProgressStore } from '../../store/progress-store';
import { soundManager } from '../../lib/sound';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

interface ContinueTrainingProps {
  onPlayGame: (gameId: GameId) => void;
  onExploreGames: () => void;
}

export const ContinueTraining: React.FC<ContinueTrainingProps> = ({
  onPlayGame,
  onExploreGames
}) => {
  const { getRecentGames } = useProgressStore();
  const recent = getRecentGames(3);

  if (recent.length === 0) {
    return (
      <section className="my-10 p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center select-none shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Welcome to TrainMyBrain
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Your training journey starts here
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-sm mx-auto font-normal">
          Choose a game above and begin sharpening your mental processing speed.
        </p>
        <button
          onClick={() => {
            soundManager.playTap();
            onExploreGames();
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Explore 5 Brain Games</span>
        </button>
      </section>
    );
  }

  return (
    <section className="my-10 select-none">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-slate-400" />
          Continue Training
        </h3>
        <span className="text-xs font-mono font-medium text-slate-400">Recently Played</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {recent.map((item) => {
          const game = GAMES[item.gameId];
          return (
            <div
              key={item.gameId}
              className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${game.accentColor} text-white font-bold text-xs shadow-sm`}>
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
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1 active:scale-98"
              >
                <span>Continue</span>
                <Play className="w-2.5 h-2.5 fill-current" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
