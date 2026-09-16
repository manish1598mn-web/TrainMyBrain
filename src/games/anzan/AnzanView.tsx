import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateAnzanChallenge, AnzanChallenge, AnzanRound, AnzanStep } from './generator';
import { GameTimer } from '../../engine/game-engine/timer';
import { calculateGameScore } from '../../engine/scoring-engine/scoring';
import { soundManager } from '../../lib/sound';
import { Delete, Check, Zap, Percent, Divide } from 'lucide-react';

interface AnzanViewProps {
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

type AnzanPhase = 'idle' | 'flashing' | 'input' | 'feedback';

export const AnzanView: React.FC<AnzanViewProps> = ({
  level,
  timer,
  isReady,
  isPaused,
  customSeed,
  onComplete
}) => {
  const [challenge, setChallenge] = useState<AnzanChallenge>(() => generateAnzanChallenge(level, customSeed));
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState<AnzanPhase>('idle');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [currentStep, setCurrentStep] = useState<AnzanStep | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [roundFeedback, setRoundFeedback] = useState<{ isCorrect: boolean; expected: number; equation: string } | null>(null);
  const [correctRounds, setCorrectRounds] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const activeTimeoutsRef = useRef<number[]>([]);
  const isRunningRef = useRef(false);

  const clearAllTimeouts = useCallback(() => {
    activeTimeoutsRef.current.forEach(t => clearTimeout(t));
    activeTimeoutsRef.current = [];
  }, []);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    activeTimeoutsRef.current.push(id);
    return id;
  }, []);

  // Level reset
  useEffect(() => {
    const ch = generateAnzanChallenge(level, customSeed);
    setChallenge(ch);
    setRoundIndex(0);
    setPhase('idle');
    setActiveStepIndex(-1);
    setCurrentStep(null);
    setUserAnswer('');
    setRoundFeedback(null);
    setCorrectRounds(0);
    setMistakes(0);
    clearAllTimeouts();
    isRunningRef.current = false;
  }, [level, customSeed, clearAllTimeouts]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  const currentRound: AnzanRound | undefined = challenge.rounds[roundIndex] || challenge.rounds[0];

  // Start Flash Sequence for the active round
  const startRoundFlash = useCallback((round: AnzanRound) => {
    clearAllTimeouts();
    setPhase('flashing');
    setActiveStepIndex(-1);
    setCurrentStep(null);
    setUserAnswer('');
    setRoundFeedback(null);
    isRunningRef.current = true;

    // Initial 400ms buffer before first flash
    addTimeout(() => {
      let step = 0;

      const flashNext = () => {
        if (!isRunningRef.current) return;

        if (step < round.steps.length) {
          const currentItem = round.steps[step];
          setActiveStepIndex(step);
          setCurrentStep(currentItem);
          soundManager.playFlash();
          step++;

          // Display duration (longer for advanced operators like *, /, %)
          addTimeout(() => {
            if (!isRunningRef.current) return;
            // Blank gap duration
            setCurrentStep(null);

            addTimeout(() => {
              if (!isRunningRef.current) return;
              flashNext();
            }, round.pauseBetweenMs);

          }, round.flashDurationMs);

        } else {
          // Flash sequence finished -> Enter input phase
          isRunningRef.current = false;
          setActiveStepIndex(-1);
          setCurrentStep(null);
          setPhase('input');
        }
      };

      flashNext();
    }, 400);
  }, [addTimeout, clearAllTimeouts]);

  // Trigger flash when ready and round changes
  useEffect(() => {
    if (isReady && !isPaused && phase === 'idle' && currentRound && !isRunningRef.current) {
      startRoundFlash(currentRound);
    }
  }, [isReady, isPaused, phase, currentRound, startRoundFlash]);

  // Pause / Resume handling
  useEffect(() => {
    if (isPaused) {
      clearAllTimeouts();
      isRunningRef.current = false;
    }
  }, [isPaused, clearAllTimeouts]);

  const handleSubmitAnswer = () => {
    if (phase !== 'input' || !userAnswer || !currentRound) return;

    const numAnswer = parseInt(userAnswer, 10);
    const isCorrect = numAnswer === currentRound.expectedTotal;

    if (isCorrect) {
      soundManager.playCorrect();
      setCorrectRounds(c => c + 1);
    } else {
      soundManager.playMistake();
      setMistakes(m => m + 1);
    }

    const equationStr = currentRound.steps.map(s => s.displayString).join('  ');

    setPhase('feedback');
    setRoundFeedback({
      isCorrect,
      expected: currentRound.expectedTotal,
      equation: equationStr
    });

    addTimeout(() => {
      setRoundFeedback(null);
      setUserAnswer('');

      const nextRound = roundIndex + 1;
      if (nextRound >= challenge.totalRounds) {
        const elapsed = timer.getElapsedMs();
        const total = challenge.totalRounds;
        const finalCorrect = isCorrect ? correctRounds + 1 : correctRounds;
        const accuracy = Math.round((finalCorrect / total) * 100);

        const score = calculateGameScore('anzan', level, {
          accuracy,
          timeMs: elapsed,
          mistakes: isCorrect ? mistakes : mistakes + 1,
          totalAttempts: total,
          difficultyScore: 30 + level,
          consistencyScore: Math.max(0, 100 - (isCorrect ? mistakes : mistakes + 1) * 25),
          level
        });

        onComplete({
          accuracy,
          timeMs: elapsed,
          score,
          mistakes: isCorrect ? mistakes : mistakes + 1,
          mode: `${currentRound.steps.length} Terms (${currentRound.flashDurationMs}ms)`
        });
      } else {
        setRoundIndex(nextRound);
        setPhase('idle');
      }
    }, 1500);
  };

  const handleKeypadPress = (val: string) => {
    if (phase !== 'input') return;

    soundManager.playTap();
    if (val === 'CLEAR') {
      setUserAnswer('');
    } else if (val === 'BACK') {
      setUserAnswer(prev => prev.slice(0, -1));
    } else if (val === '-') {
      setUserAnswer(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
    } else {
      if (userAnswer.length < 6) {
        setUserAnswer(prev => prev + val);
      }
    }
  };

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'input' || !isReady || isPaused) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeypadPress('BACK');
      } else if (e.key === '-' || e.key === 'Subtract') {
        e.preventDefault();
        handleKeypadPress('-');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isReady, isPaused, userAnswer]);

  if (!currentRound) return null;

  const getOperatorColor = (op?: string) => {
    switch (op) {
      case '*': return 'text-amber-500 dark:text-amber-400';
      case '/': return 'text-sky-500 dark:text-sky-400';
      case '%': return 'text-emerald-500 dark:text-emerald-400';
      case '-': return 'text-rose-500 dark:text-rose-400';
      default: return 'text-slate-900 dark:text-white';
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-sm select-none py-1">
      
      {/* Top Round Information Banner */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase font-mono">
            Round {roundIndex + 1} of {challenge.totalRounds}
          </span>
          {currentRound.hasAdvancedOperators && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold font-mono border border-amber-300 dark:border-amber-700/60">
              +, -, ×, ÷, %
            </span>
          )}
        </div>
        <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
          {currentRound.steps.length} Terms • {currentRound.digitCount}-Digit
        </div>
      </div>

      {/* Stream Flash Screen */}
      <div className="relative w-full aspect-[16/9] flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm mb-4 overflow-hidden">
        
        {/* Term Progression Indicator Dots */}
        <div className="absolute top-3 flex gap-1">
          {currentRound.steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeStepIndex >= 0 && i <= activeStepIndex
                  ? 'w-3.5 bg-amber-500 dark:bg-amber-400'
                  : 'w-1.5 bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* 1. Actively Flashing Number with Multi-Operator Highlighting */}
        {phase === 'flashing' && currentStep && (
          <div className={`text-5xl sm:text-6xl font-black font-mono tracking-tight animate-in zoom-in-90 duration-100 ${getOperatorColor(currentStep.operator)}`}>
            {currentStep.displayString}
          </div>
        )}

        {/* 2. Micro-pause between numbers in stream */}
        {phase === 'flashing' && !currentStep && (
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
        )}

        {/* 3. Preparing next round buffer */}
        {phase === 'idle' && (
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping mb-2" />
            <p className="text-xs font-medium text-slate-400 font-mono">Get Ready...</p>
          </div>
        )}

        {/* 4. User Answer Input Prompt */}
        {phase === 'input' && (
          <div className="flex flex-col items-center animate-in fade-in">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Final Accumulated Total
            </p>
            <div className="text-4xl sm:text-5xl font-bold font-mono text-slate-900 dark:text-white min-h-[3rem] flex items-center justify-center">
              {userAnswer ? (
                <span>{userAnswer}</span>
              ) : (
                <span className="text-slate-300 dark:text-slate-700 animate-pulse">_</span>
              )}
            </div>
          </div>
        )}

        {/* 5. Instant Evaluation Feedback with Calculation Trail */}
        {phase === 'feedback' && roundFeedback && (
          <div className="flex flex-col items-center px-3 text-center animate-in zoom-in-95">
            <span className={`text-2xl font-bold mb-1 ${roundFeedback.isCorrect ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {roundFeedback.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </span>
            <p className="text-xs text-slate-400">
              Expected Total: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{roundFeedback.expected}</span>
            </p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 max-w-xs truncate">
              {roundFeedback.equation} = {roundFeedback.expected}
            </p>
          </div>
        )}

      </div>

      {/* Touch Keypad */}
      <div className="w-full grid grid-cols-3 gap-1.5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'BACK'].map((key) => (
          <button
            key={key}
            onClick={() => handleKeypadPress(key)}
            disabled={phase !== 'input' || !isReady || isPaused}
            className={`
              h-11 sm:h-12 rounded-xl font-mono font-bold text-base transition-all active:scale-98 flex items-center justify-center
              ${key === 'BACK'
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-600 shadow-xs'
              }
              disabled:opacity-30 disabled:pointer-events-none
            `}
          >
            {key === 'BACK' ? <Delete className="w-4 h-4" /> : key}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitAnswer}
        disabled={phase !== 'input' || !userAnswer || !isReady || isPaused}
        className="mt-2.5 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none"
      >
        <Check className="w-4 h-4 stroke-[2.5]" />
        <span>Submit Total</span>
      </button>

    </div>
  );
};
