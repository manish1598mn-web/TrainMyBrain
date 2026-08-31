import React, { useState, useEffect } from 'react';
import { generateReasoningPuzzles, ReasoningPuzzle, PuzzleOption } from './generator';
import { GameTimer } from '../../engine/game-engine/timer';
import { calculateGameScore } from '../../engine/scoring-engine/scoring';
import { soundManager } from '../../lib/sound';
import { CheckCircle2, XCircle, Cog, Scale, Users, Layers, HelpCircle, Network, ArrowRight, Clock, ShieldCheck, Tag } from 'lucide-react';

interface ZebraViewProps {
  level: number;
  timer: GameTimer;
  isReady: boolean;
  isPaused: boolean;
  customSeed?: string | number;
  onComplete: (data: {
    accuracy: number;
    timeMs: number;
    score: number;
    mistakes: number;
    mode?: string;
  }) => void;
}

export const ZebraView: React.FC<ZebraViewProps> = ({
  level,
  timer,
  isReady,
  isPaused,
  customSeed,
  onComplete
}) => {
  const [puzzles, setPuzzles] = useState<ReasoningPuzzle[]>(() => generateReasoningPuzzles(level, customSeed));
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [timeRemainingSec, setTimeRemainingSec] = useState(() => puzzles[0]?.timeAllowedSec || 60);

  useEffect(() => {
    const pz = generateReasoningPuzzles(level, customSeed);
    setPuzzles(pz);
    setPuzzleIndex(0);
    setMistakes(0);
    setFeedback(null);
    setTimeRemainingSec(pz[0]?.timeAllowedSec || 60);
  }, [level, customSeed]);

  const currentPuzzle: ReasoningPuzzle | undefined = puzzles[puzzleIndex];

  // Dynamic countdown timer based on level time specification
  useEffect(() => {
    if (!isReady || isPaused || !currentPuzzle) return;

    const interval = window.setInterval(() => {
      setTimeRemainingSec(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady, isPaused, puzzleIndex, currentPuzzle]);

  const handleSelectOption = (opt: PuzzleOption) => {
    if (!isReady || isPaused || !currentPuzzle || feedback !== null) return;

    const isCorrect = opt.isCorrect;

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playMistake();
      setMistakes(m => m + 1);
    }

    setFeedback({
      isCorrect,
      explanation: currentPuzzle.explanation
    });

    setTimeout(() => {
      setFeedback(null);
      const nextIdx = puzzleIndex + 1;
      if (nextIdx >= puzzles.length) {
        const elapsed = timer.getElapsedMs();
        const total = puzzles.length;
        const correctCount = total - (isCorrect ? mistakes : mistakes + 1);
        const accuracy = Math.round((Math.max(0, correctCount) / total) * 100);

        const score = calculateGameScore('zebra', level, {
          accuracy,
          timeMs: elapsed,
          mistakes: isCorrect ? mistakes : mistakes + 1,
          totalAttempts: total,
          difficultyScore: 35 + level * 2,
          consistencyScore: Math.max(0, 100 - (isCorrect ? mistakes : mistakes + 1) * 20),
          level
        });

        onComplete({
          accuracy,
          timeMs: elapsed,
          score,
          mistakes: isCorrect ? mistakes : mistakes + 1,
          mode: `${currentPuzzle.complexityTitle}`
        });
      } else {
        setPuzzleIndex(nextIdx);
        if (puzzles[nextIdx]) {
          setTimeRemainingSec(puzzles[nextIdx].timeAllowedSec);
        }
      }
    }, 1300);
  };

  // Keyboard shortcut listener (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isReady || isPaused || !currentPuzzle || feedback !== null) return;
      const keyIdx = parseInt(e.key, 10) - 1;
      if (keyIdx >= 0 && keyIdx < currentPuzzle.options.length) {
        handleSelectOption(currentPuzzle.options[keyIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady, isPaused, currentPuzzle, feedback]);

  if (!currentPuzzle) return null;

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-xl select-none py-1 px-2">
      
      {/* 1. Header: Complexity Tier & Timer */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono uppercase tracking-wider">
            {currentPuzzle.categoryBadge}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {currentPuzzle.entitiesCount} Entities • {currentPuzzle.variablesCount} Var
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          <span className="text-slate-400">
            {puzzleIndex + 1} / {puzzles.length}
          </span>
          <span className={`px-2.5 py-0.5 rounded-md font-black flex items-center gap-1 ${
            timeRemainingSec <= 15
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            <Clock className="w-3 h-3" />
            {timeRemainingSec}s
          </span>
        </div>
      </div>

      {/* 2. Stimulus & Clues Container */}
      <div className="relative w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md p-5 mb-4 flex flex-col items-center min-h-[220px]">
        
        {/* Complexity Title Tag */}
        <div className="flex items-center gap-1.5 mb-2 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            {currentPuzzle.complexityTitle}
          </span>
        </div>

        {/* Premises & Clues Box */}
        <div className="w-full rounded-2xl bg-slate-50 dark:bg-slate-850 p-4 border border-slate-200/60 dark:border-slate-800 mb-3.5 space-y-1.5">
          {currentPuzzle.premises.map((premise, idx) => (
            <p key={idx} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {premise}
            </p>
          ))}
        </div>

        {/* Question Prompt */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white text-center mt-1">
          {currentPuzzle.question}
        </h3>

        {/* Evaluation Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 rounded-3xl flex flex-col items-center justify-center p-5 text-center animate-in fade-in zoom-in-95 z-20">
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
            ) : (
              <XCircle className="w-12 h-12 text-rose-500 mb-2" />
            )}
            <span className={`text-xl font-bold ${feedback.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md font-medium leading-relaxed">
              {feedback.explanation}
            </p>
          </div>
        )}

      </div>

      {/* 3. Decision Options Grid */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {currentPuzzle.options.map((opt, idx) => (
          <button
            key={opt.id}
            onClick={() => handleSelectOption(opt)}
            disabled={!isReady || isPaused || feedback !== null}
            className="py-3 px-4 rounded-2xl font-bold text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 shadow-xs active:scale-95 transition-all flex items-center justify-between group disabled:opacity-40"
          >
            <span className="font-mono tracking-wide">{opt.label}</span>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
              {idx + 1}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-2 text-[10px] text-slate-400 text-center font-normal">
        Analyze premises • Press keys 1, 2, 3, 4 or tap
      </p>

    </div>
  );
};
