import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { GAMES } from '../../engine/game-engine/game-registry';
import { soundManager } from '../../lib/sound';

interface TodayWorkoutCardProps {
  onStartWorkout: (type: '5min') => void;
}

export const TodayWorkoutCard: React.FC<TodayWorkoutCardProps> = ({ onStartWorkout }) => {
  const workoutPlan = [
    { gameId: 'boggle', time: '1:00', focus: 'Visual Lexical Search' },
    { gameId: 'wordspeed', time: '1:00', focus: 'Verbal Processing Speed' },
    { gameId: 'anzan', time: '1:00', focus: 'Mental Arithmetic Buffer' },
    { gameId: 'sudoku', time: '1:00', focus: 'Constraint Recognition' },
    { gameId: 'zebra', time: '1:00', focus: 'Relational Structure' }
  ] as const;

  return (
    <section className="my-8">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Info */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Personalized Routine
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Today's Recommended Workout
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal leading-relaxed">
              5 focused micro-sessions targeting calculation agility, constraint logic, and visual scan speed.
            </p>
          </div>

          {/* Right Game Schedule List & Start Button */}
          <div className="flex-1 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3.5">
              {workoutPlan.map((item) => {
                const game = GAMES[item.gameId];
                return (
                  <div
                    key={item.gameId}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-5 w-5 rounded-md bg-gradient-to-br ${game.accentColor} text-white flex items-center justify-center font-bold text-[10px]`}>
                        {game.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{game.name}</p>
                        <p className="text-[10px] text-slate-400">{item.focus}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">{item.time}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                soundManager.playTap();
                onStartWorkout('5min');
              }}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Workout (5 Min)</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
