import React, { useEffect } from 'react';
import { GameResult } from '../../engine/game-engine/types';
import { GAMES } from '../../engine/game-engine/game-registry';
import { formatTimeMs } from '../../engine/game-engine/timer';
import { fireLevelUpConfetti } from '../ui/Confetti';
import { soundManager } from '../../lib/sound';
import { ArrowRight, RotateCcw, Home, Sparkles, TrendingUp, CheckCircle2, Award, Zap } from 'lucide-react';

interface ResultModalProps {
  result: GameResult;
  leveledUp: boolean;
  onTrainNextLevel: (newLevel: number) => void;
  onReplayLevel: (level: number) => void;
  onHome: () => void;
  onNextInWorkout?: () => void;
  onChallengeFriend?: () => void;
  duelComparison?: {
    isDuel: boolean;
    creatorName: string;
    creatorTimeMs: number;
    creatorAccuracy: number;
    playerTimeMs: number;
    playerAccuracy: number;
    verdict: 'VICTORY' | 'DEFEAT' | 'TIED';
    timeDeltaMs: number;
    accuracyDelta: number;
  };
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  leveledUp,
  onTrainNextLevel,
  onReplayLevel,
  onHome,
  onNextInWorkout,
  onChallengeFriend,
  duelComparison
}) => {
  const game = GAMES[result.gameId];
  const nextLevel = result.newLevel ?? result.level + 1;
  const currentLevel = result.previousLevel ?? result.level;

  useEffect(() => {
    if (leveledUp || duelComparison?.verdict === 'VICTORY') {
      fireLevelUpConfetti();
      soundManager.playLevelUp();
    } else {
      soundManager.playCorrect();
    }
  }, [leveledUp, duelComparison?.verdict]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-2xl overflow-hidden text-center max-h-[90vh] overflow-y-auto">
        
        {/* Head-to-Head Duel Comparison Card (if in Duel mode) */}
        {duelComparison && duelComparison.isDuel && (
          <div className={`mb-4 p-4 rounded-xl border text-center animate-in zoom-in-95 ${
            duelComparison.verdict === 'VICTORY'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono block text-slate-500 dark:text-slate-400">
              Head-to-Head Duel
            </span>
            <h3 className="text-xl font-black mt-1 flex items-center justify-center gap-1.5 font-mono">
              {duelComparison.verdict === 'VICTORY' && '🏆 YOU WON THE DUEL!'}
              {duelComparison.verdict === 'DEFEAT' && '⚔️ CHALLENGER WON'}
              {duelComparison.verdict === 'TIED' && '🤝 DEAD HEAT TIED!'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
              {duelComparison.verdict === 'VICTORY' && (
                `You solved this puzzle ${Math.abs(duelComparison.timeDeltaMs / 1000).toFixed(1)}s faster than ${duelComparison.creatorName}!`
              )}
              {duelComparison.verdict === 'DEFEAT' && (
                `${duelComparison.creatorName} was ${Math.abs(duelComparison.timeDeltaMs / 1000).toFixed(1)}s faster (${duelComparison.creatorAccuracy}% acc).`
              )}
              {duelComparison.verdict === 'TIED' && `Exact matching performance!`}
            </p>
          </div>
        )}

        {/* Header Tag */}
        {leveledUp ? (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs uppercase tracking-wider animate-bounce" style={{ animationDuration: '2s' }}>
            <Sparkles className="w-4 h-4 fill-teal-500 text-teal-600" />
            <span>🎉 LEVEL UP • Level {currentLevel} → Level {nextLevel}</span>
          </div>
        ) : (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Level {currentLevel} • {result.mastery}% Mastery ({result.masteryDelta >= 0 ? `+${result.masteryDelta}%` : `${result.masteryDelta}%`})</span>
          </div>
        )}

        {/* Primary Story: Speed & Baseline Improvement */}
        <div className="my-2">
          {result.baselineImprovementPercent > 0 ? (
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 font-mono">
                <TrendingUp className="w-6 h-6" />
                +{result.baselineImprovementPercent}%
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Faster than your baseline • <span className="text-slate-800 dark:text-slate-200 font-semibold">{result.speedAccuracySummary}</span>
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-mono">
                {formatTimeMs(result.timeMs)}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Pace Rating: <span className="font-semibold text-slate-800 dark:text-slate-200">{result.speedAccuracySummary || 'Completed'}</span>
              </p>
            </div>
          )}
        </div>

        {/* Performance Score Matrix (Layer 1 Formula) */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
              Performance Score
            </span>
            <span className="text-base font-black font-mono text-slate-900 dark:text-white">
              {result.performanceScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className="p-1 rounded-lg bg-white dark:bg-slate-900/60">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">{result.accuracy}%</span>
            </div>
            <div className="p-1 rounded-lg bg-white dark:bg-slate-900/60">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Speed</span>
              <span className="text-xs font-black font-mono text-sky-600 dark:text-sky-400">{result.speedScore}%</span>
            </div>
            <div className="p-1 rounded-lg bg-white dark:bg-slate-900/60">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Difficulty</span>
              <span className="text-xs font-black font-mono text-purple-600 dark:text-purple-400">{result.difficultyScore}</span>
            </div>
            <div className="p-1 rounded-lg bg-white dark:bg-slate-900/60">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Consistency</span>
              <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400">{result.consistencyScore}</span>
            </div>
          </div>
        </div>

        {/* Cognitive Insight */}
        {result.insight && (
          <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-left">
            <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Cognitive Insight:
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {result.insight}
            </p>
          </div>
        )}

        {/* Action CTA Buttons */}
        <div className="flex flex-col gap-2">
          
          {onNextInWorkout ? (
            <button
              onClick={onNextInWorkout}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Next Workout Segment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : leveledUp ? (
            <button
              onClick={() => onTrainNextLevel(nextLevel)}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Start Level {nextLevel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onReplayLevel(currentLevel)}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Continue Training Level {currentLevel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Challenge a Friend Button */}
          {onChallengeFriend && (
            <button
              onClick={onChallengeFriend}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Challenge a Friend (Share This Puzzle)</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => onReplayLevel(currentLevel)}
              className="py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Level</span>
            </button>

            <button
              onClick={onHome}
              className="py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
