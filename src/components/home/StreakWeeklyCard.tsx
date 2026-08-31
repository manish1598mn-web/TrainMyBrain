import React from 'react';
import { usePlayerStore, STREAK_MILESTONES } from '../../store/player-store';
import { Flame, Clock, CheckCircle2, Trophy, Sparkles, Zap, Target, Layers } from 'lucide-react';
import { NeuronActivityPulseBackground } from '../background/NeuronActivityPulseBackground';
import { soundManager } from '../../lib/sound';

export const StreakWeeklyCard: React.FC = () => {
  const { 
    totalTimeSpentMs, 
    totalProblemsSolved, 
    totalLevelsAchieved, 
    getTrainingTimeBreakdown,
    getDailyGoalProgress,
    setDailyFocusGoal,
    unlockedMilestones
  } = usePlayerStore();

  const { hours, minutes, seconds, formattedString, shortFormatted } = getTrainingTimeBreakdown();
  const totalMinutes = Math.floor((totalTimeSpentMs || 0) / 60000);
  const dailyGoal = getDailyGoalProgress();

  // Find active and next milestone
  const currentMilestone = STREAK_MILESTONES.slice().reverse().find(m => totalMinutes >= m.minutes);
  const nextMilestone = STREAK_MILESTONES.find(m => totalMinutes < m.minutes) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];

  const prevMinutes = currentMilestone ? currentMilestone.minutes : 0;
  const targetMinutes = nextMilestone ? nextMilestone.minutes : 60;
  const progressPercent = Math.min(100, Math.round(((totalMinutes - prevMinutes) / Math.max(1, targetMinutes - prevMinutes)) * 100));

  return (
    <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between select-none">
      
      {/* Brain Activity Pulse = Neuron System Background (Neural Plasticity) */}
      <NeuronActivityPulseBackground theme="neural-plasticity" />

      <div className="relative z-10">
        {/* Header Tag */}
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>Training Streak & Focus</span>
          </div>
          {currentMilestone && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono">
              {currentMilestone.badge} {currentMilestone.title}
            </span>
          )}
        </div>

        {/* Primary Streak Statement */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-3">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              Cumulative Active Mind Time
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight mt-0.5">
              Your Training Streak is{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                {formattedString}
              </span>
            </h3>
          </div>
        </div>

        {/* Daily Focus Goal Ring / Bar (Phase 3) */}
        <div className={`p-4 rounded-2xl border transition-all mb-4 ${
          dailyGoal.isGoalReached 
            ? 'bg-amber-500/10 border-amber-500/40 shadow-xs' 
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-700/60'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                dailyGoal.isGoalReached 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-teal-500/15 text-teal-600 dark:text-teal-400'
              }`}>
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                  <span>Today's Focus Goal</span>
                  {dailyGoal.isGoalReached && (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold">
                      Achieved ✨
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                  {dailyGoal.currentMinutes}m {dailyGoal.currentSeconds}s / {dailyGoal.targetMinutes}m target ({dailyGoal.progressPercent}%)
                </span>
              </div>
            </div>

            {/* Quick target goal switcher pills */}
            <div className="flex items-center gap-1">
              {[10, 15, 30, 45].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    soundManager.playTap();
                    setDailyFocusGoal(mins);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    dailyGoal.targetMinutes === mins
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Goal Progress Track */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                dailyGoal.isGoalReached
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-teal-500 to-indigo-500'
              }`}
              style={{ width: `${Math.max(2, dailyGoal.progressPercent)}%` }}
            />
          </div>
        </div>

        {/* 3 Measurable Output Pillars: Time Spent | Problems Solved | Levels Achieved */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          
          {/* Pillar 1: Time Spent */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                Time Spent
              </span>
              <p className="text-base font-black text-slate-900 dark:text-white font-mono">
                {shortFormatted}
              </p>
            </div>
          </div>

          {/* Pillar 2: Problems Solved */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                Problems Solved
              </span>
              <p className="text-base font-black text-slate-900 dark:text-white font-mono">
                {totalProblemsSolved || 0}
              </p>
            </div>
          </div>

          {/* Pillar 3: Levels Achieved */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                Levels Achieved
              </span>
              <p className="text-base font-black text-slate-900 dark:text-white font-mono">
                {totalLevelsAchieved || 0}
              </p>
            </div>
          </div>

        </div>

        {/* Milestone Progress Bar */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Next Milestone: <strong>{nextMilestone?.title}</strong> ({nextMilestone?.minutes} mins)</span>
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {totalMinutes} / {nextMilestone?.minutes}m
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
