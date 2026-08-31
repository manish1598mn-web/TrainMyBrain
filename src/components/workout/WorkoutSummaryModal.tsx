import React, { useEffect } from 'react';
import { GameResult, WorkoutPlan } from '../../engine/game-engine/types';
import { GAMES } from '../../engine/game-engine/game-registry';
import { fireLevelUpConfetti } from '../ui/Confetti';
import { soundManager } from '../../lib/sound';
import { Trophy, CheckCircle2, Home, RotateCcw, Flame } from 'lucide-react';
import { usePlayerStore } from '../../store/player-store';

interface WorkoutSummaryModalProps {
  plan: WorkoutPlan;
  results: GameResult[];
  totalScore: number;
  onFinish: () => void;
  onRestartWorkout: () => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  plan,
  results,
  totalScore,
  onFinish,
  onRestartWorkout
}) => {
  const { currentStreak, incrementWorkoutsCompleted } = usePlayerStore();

  useEffect(() => {
    fireLevelUpConfetti();
    soundManager.playLevelUp();
    incrementWorkoutsCompleted();
  }, [incrementWorkoutsCompleted]);

  const avgAccuracy = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length)
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xl text-center max-h-[90vh] overflow-y-auto">
        
        {/* Celebration Icon */}
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
          <Trophy className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Workout Complete
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-normal">
          {plan.name} finished successfully.
        </p>

        {/* Summary Metric Strip */}
        <div className="my-5 grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Points</p>
            <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">{totalScore}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Accuracy</p>
            <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">{avgAccuracy}%</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Streak</p>
            <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              {currentStreak}
            </p>
          </div>
        </div>

        {/* Games Breakdown List */}
        <div className="mb-5 space-y-1.5 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Trained Games:</p>
          {results.map((res, i) => {
            const g = GAMES[res.gameId];
            return (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br ${g.accentColor} text-white font-bold text-[10px]`}>
                    {g.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{g.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Lvl {res.newLevel ?? res.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">+{res.score}</span>
                  <p className="text-[10px] text-slate-400">{res.accuracy}%</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              soundManager.playTap();
              onFinish();
            }}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs sm:text-sm active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finish & Save</span>
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundManager.playTap();
                onRestartWorkout();
              }}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-medium text-xs active:scale-98 transition-all flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repeat</span>
            </button>
            <button
              onClick={() => {
                soundManager.playTap();
                onFinish();
              }}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-medium text-xs active:scale-98 transition-all flex items-center justify-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
