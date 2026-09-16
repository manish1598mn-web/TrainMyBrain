import React, { useState, useEffect, useRef } from 'react';
import { generateWordSpeedChallenge, WordSpeedChallenge, WordSpeedQuestion } from './generator';
import { GameTimer } from '../../engine/game-engine/timer';
import { calculateGameScore } from '../../engine/scoring-engine/scoring';
import { soundManager } from '../../lib/sound';
import { useVocabularyStore } from '../../store/vocabulary-store';
import { 
  Sparkles, Flame, Zap, CheckCircle2, AlertCircle, BookOpen, 
  Clock, Award, HelpCircle, ChevronRight 
} from 'lucide-react';

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
  const [score, setScore] = useState(0);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [speedBonus, setSpeedBonus] = useState(false);

  // Selected Option & Feedback state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [feedbackRule, setFeedbackRule] = useState<string | null>(null);

  // Per-question speed bar (3.5 seconds countdown)
  const [timeLeftMs, setTimeLeftMs] = useState(3500);

  const questionStartTimeRef = useRef<number>(0);
  const isHandlingAnswerRef = useRef<boolean>(false);

  useEffect(() => {
    const ch = generateWordSpeedChallenge(level, customSeed);
    setChallenge(ch);
    setQuestionIndex(0);
    setMistakes(0);
    setReactionTimes([]);
    setCombo(0);
    setScore(0);
    setLastLatency(null);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setFeedbackRule(null);
    setSpeedBonus(false);
    setTimeLeftMs(3500);
    isHandlingAnswerRef.current = false;
  }, [level, customSeed]);

  const currentQ: WordSpeedQuestion | undefined = challenge.questions[questionIndex];
  const totalQuestions = challenge.totalQuestions;

  // Reset question timer & states on question advance
  useEffect(() => {
    if (!currentQ || !isReady || isPaused) return;

    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setFeedbackRule(null);
    setSpeedBonus(false);
    setTimeLeftMs(3500);
    isHandlingAnswerRef.current = false;
    questionStartTimeRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
  }, [questionIndex, isReady, isPaused]);

  // Smooth speed bar countdown ticker
  useEffect(() => {
    if (!isReady || isPaused || isAnswerRevealed) return;

    const interval = setInterval(() => {
      setTimeLeftMs(prev => Math.max(0, prev - 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isReady, isPaused, isAnswerRevealed]);

  const handleSelectOption = (option: string) => {
    if (!isReady || isPaused || !currentQ || isHandlingAnswerRef.current) return;
    isHandlingAnswerRef.current = true;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = Math.round(now - questionStartTimeRef.current);
    setReactionTimes(prev => [...prev, duration]);
    setLastLatency(duration);
    setSelectedOption(option);
    setIsAnswerRevealed(true);

    const isCorrect = option.toUpperCase() === currentQ.correctAnswer.toUpperCase();
    const isRapid = duration <= 1500; // Under 1.5s triggers lightning speed bonus!

    if (isCorrect) {
      soundManager.playCorrect();
      setCombo(c => c + 1);

      // Score calculation: base 100 + streak multiplier + lightning speed bonus
      const streakMult = combo >= 3 ? 1.5 : 1;
      const speedPts = isRapid ? 50 : 0;
      const pts = Math.round((100 * streakMult) + speedPts);
      setScore(s => s + pts);
      setSpeedBonus(isRapid);

      // Record any primary words to the Vocabulary Vault
      if (currentQ.primaryWords && currentQ.primaryWords.length > 0) {
        currentQ.primaryWords.forEach(w => {
          if (w.length >= 3) {
            useVocabularyStore.getState().recordWord(w, 'wordspeed');
          }
        });
      }

      // Quick advance on correct after 400ms flash
      setTimeout(() => {
        advanceNextQuestion(true);
      }, 400);
    } else {
      soundManager.playMistake();
      setMistakes(m => m + 1);
      setCombo(0);
      setSpeedBonus(false);
      setFeedbackRule(currentQ.explanation);

      // Give 1.4s to read the educational rule explanation
      setTimeout(() => {
        advanceNextQuestion(false);
      }, 1400);
    }
  };

  const advanceNextQuestion = (wasCorrect: boolean) => {
    const nextIdx = questionIndex + 1;
    if (nextIdx >= totalQuestions) {
      const elapsed = timer.getElapsedMs();
      const finalMistakes = wasCorrect ? mistakes : mistakes + 1;
      const correctCount = totalQuestions - finalMistakes;
      const accuracy = Math.round((Math.max(0, correctCount) / totalQuestions) * 100);

      const finalScore = calculateGameScore('wordspeed' as any, level, {
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
        score: Math.max(score, finalScore),
        mistakes: finalMistakes,
        mode: `${currentQ?.modeBadge || 'Grammar Speed'}`
      });
    } else {
      setQuestionIndex(nextIdx);
    }
  };

  // Keyboard shortcut listener: 1-5 or A-E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isReady || isPaused || !currentQ || isHandlingAnswerRef.current) return;

      const key = e.key.toUpperCase();
      let optionIndex = -1;

      if (key === '1' || key === 'A') optionIndex = 0;
      else if (key === '2' || key === 'B') optionIndex = 1;
      else if (key === '3' || key === 'C') optionIndex = 2;
      else if (key === '4' || key === 'D') optionIndex = 3;
      else if (key === '5' || key === 'E') optionIndex = 4;

      if (optionIndex >= 0 && optionIndex < currentQ.options.length) {
        e.preventDefault();
        handleSelectOption(currentQ.options[optionIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, isReady, isPaused]);

  if (!currentQ) return null;

  const speedPercent = Math.round((timeLeftMs / 3500) * 100);

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-2xl select-none py-1 px-2">
      
      {/* 1. Header Bar: Mode Badge, Tier, Streak & Latency */}
      <div className="glass-hud w-full flex items-center justify-between px-4 py-2.5 rounded-2xl shadow-sm mb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {currentQ.modeBadge}
          </span>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
            {challenge.tierDescription}
          </span>
          {combo >= 2 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 text-xs font-bold font-mono animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {combo}x
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          {speedBonus && (
            <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-500 text-[10px] animate-pulse flex items-center gap-0.5">
              <Zap className="w-3 h-3 fill-current" /> +50 Speed!
            </span>
          )}
          {lastLatency !== null && (
            <span className="text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {(lastLatency / 1000).toFixed(2)}s
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {questionIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Speed Bonus Countdown Bar */}
      <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-2.5 overflow-hidden">
        <div 
          className={`h-full transition-all duration-100 rounded-full ${
            speedPercent > 40 
              ? 'bg-gradient-to-r from-sky-500 to-teal-400' 
              : 'bg-gradient-to-r from-amber-500 to-rose-500'
          }`}
          style={{ width: `${speedPercent}%` }}
        />
      </div>

      {/* 2. Stimulus Card (Prompt & Context) */}
      <div className="relative w-full flex flex-col items-center justify-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md mb-3 p-4 sm:p-5 text-center min-h-[7rem]">
        
        {/* Category Prompt */}
        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono mb-2">
          {currentQ.prompt}
        </h3>

        {/* Sub-Prompt / Sentence Context with Glowing Blank */}
        {currentQ.subPrompt && (
          <p className="text-sm sm:text-base text-slate-800 dark:text-white font-semibold leading-relaxed max-w-xl">
            {currentQ.subPrompt.split('_____').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-block px-3 py-0.5 mx-1 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-300 font-mono font-black border border-sky-300 dark:border-sky-700 shadow-xs animate-pulse">
                    _____
                  </span>
                )}
              </React.Fragment>
            ))}
          </p>
        )}

        {/* Target Word if applicable */}
        {currentQ.targetWord && (
          <div className="mt-1 px-5 py-1.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 shadow-xs">
            <span className="text-xl sm:text-2xl font-black tracking-widest text-slate-900 dark:text-white font-mono">
              {currentQ.targetWord}
            </span>
          </div>
        )}
      </div>

      {/* 3. Standardized 5-Option Tactile Layout (A, B, C, D, E) */}
      <div className="flex flex-col gap-2 w-full max-w-xl">
        {currentQ.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D, E
          const isSelected = selectedOption === opt;
          const isCorrectAnswer = opt.toUpperCase() === currentQ.correctAnswer.toUpperCase();

          let cardStyle = 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-600/80 border-b-4 border-b-slate-300 dark:border-b-slate-900 hover:border-sky-400 dark:hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-slate-700/80 active:border-b-2 active:translate-y-0.5 shadow-xs';

          if (isAnswerRevealed) {
            if (isCorrectAnswer) {
              cardStyle = 'bg-emerald-600 text-white border-b-4 border-b-emerald-800 ring-2 ring-emerald-400/50 shadow-md animate-in zoom-in-95';
            } else if (isSelected && !isCorrectAnswer) {
              cardStyle = 'bg-rose-600 text-white border-b-4 border-b-rose-800 ring-2 ring-rose-400/50 animate-shake';
            } else {
              cardStyle = 'bg-slate-100 dark:bg-slate-900/80 text-slate-400 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 opacity-40';
            }
          }

          return (
            <button
              key={`${opt}-${idx}`}
              onClick={() => handleSelectOption(opt)}
              disabled={!isReady || isPaused || isAnswerRevealed}
              className={`relative py-3 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-between shadow-xs transition-all ${cardStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center ${
                  isAnswerRevealed && isCorrectAnswer
                    ? 'bg-emerald-700 text-white'
                    : isAnswerRevealed && isSelected
                    ? 'bg-rose-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold border border-slate-200/80 dark:border-slate-600'
                }`}>
                  {letter}
                </span>
                <span className="font-medium tracking-wide text-left">{opt}</span>
              </div>

              {isAnswerRevealed && isCorrectAnswer && (
                <CheckCircle2 className="w-5 h-5 text-white animate-in zoom-in-95 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Educational Feedback Toast / Rule Card (Shown on mistake) */}
      {feedbackRule && (
        <div className="w-full mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Grammar Rule:
            </span>
            <p className="text-xs text-amber-900 dark:text-amber-100 mt-0.5 leading-relaxed font-medium">
              {feedbackRule}
            </p>
          </div>
        </div>
      )}

      {/* Footer: Keyboard instruction hint */}
      <p className="mt-3 text-[10px] text-slate-400 text-center font-normal">
        Hotkeys: Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold">1–5</kbd> or <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold">A–E</kbd> for lightning speed
      </p>

    </div>
  );
};
