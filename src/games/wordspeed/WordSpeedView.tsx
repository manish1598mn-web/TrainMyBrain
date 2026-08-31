import React, { useState, useEffect, useRef } from 'react';
import { generateWordSpeedChallenge, WordSpeedChallenge, WordSpeedQuestion } from './generator';
import { GameTimer } from '../../engine/game-engine/timer';
import { calculateGameScore } from '../../engine/scoring-engine/scoring';
import { soundManager } from '../../lib/sound';
import { Sparkles, Flame, Zap, Eye, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

interface WordSpeedViewProps {
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

export const WordSpeedView: React.FC<WordSpeedViewProps> = ({
  level,
  timer,
  isReady,
  isPaused,
  customSeed,
  onComplete
}) => {
  const [challenge, setChallenge] = useState<WordSpeedChallenge>(() => generateWordSpeedChallenge(level, customSeed));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [combo, setCombo] = useState(0);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  
  // Memory Recall Stream State
  const [memoryPhase, setMemoryPhase] = useState<'stream' | 'question'>('question');
  const [streamIndex, setStreamIndex] = useState(0);

  const questionStartTimeRef = useRef<number>(0);

  useEffect(() => {
    const ch = generateWordSpeedChallenge(level, customSeed);
    setChallenge(ch);
    setQuestionIndex(0);
    setMistakes(0);
    setReactionTimes([]);
    setCombo(0);
    setLastLatency(null);
    setMemoryPhase('question');
    questionStartTimeRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
  }, [level, customSeed]);

  const currentQ: WordSpeedQuestion | undefined = challenge.questions[questionIndex];
  const totalQuestions = challenge.totalQuestions;

  // Handle Memory Stream Presentation if opCode === 'WS-20'
  useEffect(() => {
    if (!currentQ || !isReady || isPaused) return;

    if (currentQ.opCode === 'WS-20' && currentQ.memoryStream && currentQ.memoryStream.length > 0) {
      setMemoryPhase('stream');
      setStreamIndex(0);

      const interval = setInterval(() => {
        setStreamIndex(idx => {
          if (idx + 1 >= currentQ.memoryStream!.length) {
            clearInterval(interval);
            setTimeout(() => {
              setMemoryPhase('question');
              questionStartTimeRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
            }, 600);
            return idx;
          }
          return idx + 1;
        });
      }, 750);

      return () => clearInterval(interval);
    } else {
      setMemoryPhase('question');
      questionStartTimeRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
    }
  }, [questionIndex, isReady, isPaused]);

  const handleSelectOption = (option: string) => {
    if (!isReady || isPaused || !currentQ || memoryPhase === 'stream') return;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = Math.round(now - questionStartTimeRef.current);
    setReactionTimes(prev => [...prev, duration]);
    setLastLatency(duration);

    const isCorrect = option.toUpperCase() === currentQ.correctAnswer.toUpperCase();

    if (isCorrect) {
      soundManager.playCorrect();
      setCombo(c => c + 1);
    } else {
      soundManager.playMistake();
      setMistakes(m => m + 1);
      setCombo(0);
    }

    const nextIdx = questionIndex + 1;
    if (nextIdx >= totalQuestions) {
      const elapsed = timer.getElapsedMs();
      const finalMistakes = isCorrect ? mistakes : mistakes + 1;
      const correctCount = totalQuestions - finalMistakes;
      const accuracy = Math.round((Math.max(0, correctCount) / totalQuestions) * 100);

      const score = calculateGameScore('wordspeed' as any, level, {
        accuracy,
        timeMs: elapsed,
        mistakes: finalMistakes,
        totalAttempts: totalQuestions,
        difficultyScore: 30 + level * 3,
        consistencyScore: Math.max(0, 100 - finalMistakes * 10),
        level
      });

      onComplete({
        accuracy,
        timeMs: elapsed,
        score,
        mistakes: finalMistakes,
        mode: `${currentQ.modeBadge}`
      });
    } else {
      setQuestionIndex(nextIdx);
    }
  };

  if (!currentQ) return null;

  // Grid layout columns calculation based on option count
  const optionCount = currentQ.options.length;
  let gridColsClass = 'grid-cols-2 sm:grid-cols-3';
  if (optionCount > 24) {
    gridColsClass = 'grid-cols-3 sm:grid-cols-5';
  } else if (optionCount > 14) {
    gridColsClass = 'grid-cols-2 sm:grid-cols-4';
  }

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-2xl select-none py-1 px-2">
      
      {/* 1. Header Bar: Progress & Mode Badge */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold text-[11px] uppercase font-mono tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {currentQ.modeBadge}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {optionCount} Options
          </span>
          {combo >= 3 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 text-xs font-bold font-mono animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {combo}x
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold text-slate-400">
          {lastLatency !== null && (
            <span className="text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {(lastLatency / 1000).toFixed(2)}s
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {questionIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* 2. Stimulus Card */}
      {memoryPhase === 'stream' && currentQ.memoryStream ? (
        <div className="relative w-full aspect-[4/2] max-h-44 flex flex-col items-center justify-center rounded-3xl bg-slate-950 text-white border border-sky-500/40 shadow-xl mb-3 p-4 animate-in zoom-in-95">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-1.5">
            MEMORIZE WORD ({streamIndex + 1}/{currentQ.memoryStream.length})
          </span>
          <span className="text-3xl sm:text-4xl font-black tracking-widest text-white animate-pulse">
            {currentQ.memoryStream[streamIndex]}
          </span>
        </div>
      ) : (
        <div className="relative w-full flex flex-col items-center justify-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md mb-3 p-4 text-center">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono mb-1">
            {currentQ.prompt}
          </h3>

          {currentQ.targetWord && (
            <div className="my-1.5 px-6 py-2 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black tracking-widest text-slate-900 dark:text-white font-mono">
                {currentQ.targetWord}
              </span>
            </div>
          )}

          {currentQ.subPrompt && (
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium italic mt-1 max-w-lg px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              {currentQ.subPrompt}
            </p>
          )}
        </div>
      )}

      {/* 3. Decision Options Grid (10 to 35 Options) */}
      <div className={`grid ${gridColsClass} gap-2 w-full max-h-[46vh] overflow-y-auto p-1`}>
        {currentQ.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C...
          return (
            <button
              key={`${opt}-${idx}`}
              onClick={() => handleSelectOption(opt)}
              disabled={!isReady || isPaused || memoryPhase === 'stream'}
              className="relative py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-sky-50/70 text-slate-800 dark:bg-slate-850 dark:hover:bg-sky-950/40 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 hover:border-sky-400 dark:hover:border-sky-600 shadow-xs active:scale-95 transition-all flex items-center justify-between group"
            >
              <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-sky-500 px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                {letter}
              </span>
              <span className="font-mono tracking-wide text-center flex-1 truncate px-1">{opt}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[10px] text-slate-400 text-center font-normal">
        Quick Semantic Decision • Tap the correct option
      </p>

    </div>
  );
};
