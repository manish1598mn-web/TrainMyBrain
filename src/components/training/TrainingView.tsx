import React, { useState, useEffect, useCallback } from 'react';
import {
  generateTrainingSession,
  TrainingProblem,
  TrainingSessionConfig,
  loadTrainingProgress,
  saveTrainingProgress,
  TrainingProgress,
  TRAINING_DIFFICULTY_TABLE
} from '../../engine/level-engine/training-engine';
import { questionHistory } from '../../engine/level-engine/question-history';
import { soundManager } from '../../lib/sound';
import { 
  Dumbbell, CheckCircle2, XCircle, Zap, Sparkles, Trophy, 
  ArrowRight, RotateCcw, ShieldCheck, Flame, Layers 
} from 'lucide-react';

interface TrainingViewProps {
  initialLevel?: number;
  onExit: () => void;
  onLaunchMainGame?: (gameId: string, level: number) => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({
  initialLevel = 1,
  onExit,
  onLaunchMainGame
}) => {
  const [progress, setProgress] = useState<TrainingProgress>(loadTrainingProgress);
  const [currentLevel, setCurrentLevel] = useState<number>(initialLevel);
  const [session, setSession] = useState<TrainingSessionConfig>(() => 
    generateTrainingSession(currentLevel, progress.weaknessFacultyScores)
  );
  const [problemIndex, setProblemIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [completedAccuracy, setCompletedAccuracy] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  // Reload session when level changes
  useEffect(() => {
    const s = generateTrainingSession(currentLevel, progress.weaknessFacultyScores);
    setSession(s);
    setProblemIndex(0);
    setMistakes(0);
    setCorrectCount(0);
    setFeedback(null);
    setSessionCompleted(false);
    setStartTime(Date.now());
  }, [currentLevel]);

  const currentProblem: TrainingProblem | undefined = session.problems[problemIndex];
  const diffInfo = TRAINING_DIFFICULTY_TABLE[currentLevel] || TRAINING_DIFFICULTY_TABLE[1];

  const handleSelectOption = (opt: string | number) => {
    if (!currentProblem || feedback !== null || sessionCompleted) return;

    const isCorrect = String(opt) === String(currentProblem.correctAnswer);
    const now = Date.now();
    const elapsed = now - startTime;

    if (isCorrect) {
      soundManager.playCorrect();
      setCorrectCount(c => c + 1);
    } else {
      soundManager.playMistake();
      setMistakes(m => m + 1);
    }

    // Record in local question history to ensure zero duplicate questions
    questionHistory.recordAttempt({
      id: currentProblem.id,
      gameId: currentProblem.gameId,
      level: currentLevel,
      fingerprint: currentProblem.fingerprint,
      conceptKey: currentProblem.conceptKey,
      structureKey: `${currentProblem.gameId}:t${currentLevel}`,
      isCorrect,
      timeMs: elapsed,
      targetTimeMs: currentProblem.targetTimeMs
    });

    setFeedback({
      isCorrect,
      explanation: currentProblem.explanation
    });

    setTimeout(() => {
      setFeedback(null);
      setStartTime(Date.now());
      const nextIdx = problemIndex + 1;

      if (nextIdx >= session.problems.length) {
        // Complete Session
        const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
        const total = session.problems.length;
        const accuracy = Math.round((finalCorrect / total) * 100);
        setCompletedAccuracy(accuracy);
        setSessionCompleted(true);

        const passed = accuracy >= 80;
        if (passed) {
          soundManager.playLevelUp();
          const nextLevel = Math.min(10, currentLevel + 1);
          const isGrad = currentLevel === 10 && passed;

          const updated: TrainingProgress = {
            ...progress,
            highestUnlockedLevel: Math.max(progress.highestUnlockedLevel, nextLevel),
            isGraduated: progress.isGraduated || isGrad,
            totalSessionsCompleted: progress.totalSessionsCompleted + 1,
            bestAccuracyByLevel: {
              ...progress.bestAccuracyByLevel,
              [currentLevel]: Math.max(progress.bestAccuracyByLevel[currentLevel] || 0, accuracy)
            }
          };

          setProgress(updated);
          saveTrainingProgress(updated);
        }
      } else {
        setProblemIndex(nextIdx);
      }
    }, 1100);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentProblem || feedback !== null || sessionCompleted) return;
      const keyIdx = parseInt(e.key, 10) - 1;
      if (keyIdx >= 0 && keyIdx < currentProblem.options.length) {
        handleSelectOption(currentProblem.options[keyIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProblem, feedback, sessionCompleted]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-between p-4 selection:bg-amber-500 selection:text-black">
      
      {/* 1. Header Toolbar */}
      <div className="w-full max-w-lg flex items-center justify-between py-2 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black font-mono tracking-wide flex items-center gap-1.5 text-amber-400">
              TRAINING • LEVEL T{currentLevel}
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              {diffInfo.percent}% of Main Level 1 • {diffInfo.label}
            </span>
          </div>
        </div>

        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors border border-slate-700"
        >
          Exit Training
        </button>
      </div>

      {/* 2. Main Game View or Completion Modal */}
      {!sessionCompleted && currentProblem && (
        <div className="w-full max-w-lg flex flex-col items-center flex-1 justify-center py-2">
          
          {/* Progress Bar & Faculty Badge */}
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-amber-400 font-bold text-xs font-mono border border-slate-700">
              {currentProblem.facultyBadge}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              {problemIndex + 1} / {session.problems.length}
            </span>
          </div>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full mb-4 overflow-hidden border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${((problemIndex + 1) / session.problems.length) * 100}%` }}
            />
          </div>

          {/* Problem Stimulus Card */}
          <div className="relative w-full rounded-3xl bg-slate-800/90 border border-slate-700 shadow-2xl p-6 mb-4 flex flex-col items-center justify-center min-h-[220px] text-center">
            <h3 className="text-lg sm:text-xl font-black text-white mb-2 leading-relaxed">
              {currentProblem.prompt}
            </h3>
            {currentProblem.subPrompt && (
              <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-wider mt-1">
                {currentProblem.subPrompt}
              </p>
            )}

            {/* Instant Evaluation Feedback Overlay */}
            {feedback && (
              <div className="absolute inset-0 bg-slate-900/95 rounded-3xl flex flex-col items-center justify-center p-5 text-center animate-in fade-in zoom-in-95 z-20">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
                ) : (
                  <XCircle className="w-12 h-12 text-rose-400 mb-2" />
                )}
                <span className={`text-xl font-black ${feedback.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {feedback.isCorrect ? 'Awesome!' : 'Keep Going!'}
                </span>
                <p className="text-xs text-slate-300 mt-2 max-w-sm font-medium leading-relaxed">
                  {feedback.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {currentProblem.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                disabled={feedback !== null}
                className="py-4 px-4 rounded-2xl font-bold font-mono text-base sm:text-lg bg-slate-800 hover:bg-amber-500/20 text-white border-2 border-slate-700 hover:border-amber-400 shadow-md active:scale-95 transition-all flex items-center justify-between group disabled:opacity-40"
              >
                <span>{opt}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-amber-400 px-1.5 py-0.5 rounded bg-slate-700">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-slate-400 font-mono text-center">
            Tap the correct answer or press keyboard keys (1, 2, 3, 4)
          </p>

        </div>
      )}

      {/* 3. Session Completed / Graduation Card */}
      {sessionCompleted && (
        <div className="w-full max-w-md bg-slate-800/95 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 my-auto">
          
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
            {currentLevel === 10 && completedAccuracy >= 80 ? (
              <Trophy className="w-8 h-8 animate-bounce" />
            ) : completedAccuracy >= 80 ? (
              <Sparkles className="w-8 h-8" />
            ) : (
              <RotateCcw className="w-8 h-8 text-slate-400" />
            )}
          </div>

          <h3 className="text-xl font-black text-white mb-1 font-mono">
            {currentLevel === 10 && completedAccuracy >= 80
              ? '🎓 TRAINING GRADUATION!'
              : completedAccuracy >= 80
              ? `Level T${currentLevel} Completed!`
              : 'Keep Practicing!'}
          </h3>

          <p className="text-xs text-slate-300 mb-4 max-w-xs leading-relaxed">
            {currentLevel === 10 && completedAccuracy >= 80
              ? "You have built strong cognitive fundamentals. You are ready to start Main Game Level 1!"
              : completedAccuracy >= 80
              ? `Great progress! You achieved ${completedAccuracy}% accuracy.`
              : `You scored ${completedAccuracy}%. Practice once more to unlock the next level.`}
          </p>

          <div className="grid grid-cols-2 gap-2 w-full mb-5 text-left font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
              <span className="text-slate-400 text-[10px]">ACCURACY</span>
              <p className="text-base font-bold text-amber-400">{completedAccuracy}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
              <span className="text-slate-400 text-[10px]">TRAINING DIFFICULTY</span>
              <p className="text-base font-bold text-white">{diffInfo.percent}% of L1</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full">
            {currentLevel < 10 && completedAccuracy >= 80 && (
              <button
                onClick={() => setCurrentLevel(l => l + 1)}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black font-mono text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Continue to Level T{currentLevel + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {currentLevel === 10 && completedAccuracy >= 80 && onLaunchMainGame && (
              <button
                onClick={() => onLaunchMainGame('anzan', 1)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black font-mono text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <span>🚀 Enter Main Game Level 1</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                setSession(generateTrainingSession(currentLevel, progress.weaknessFacultyScores));
                setProblemIndex(0);
                setMistakes(0);
                setCorrectCount(0);
                setFeedback(null);
                setSessionCompleted(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold font-mono text-xs transition-colors"
            >
              Replay Level T{currentLevel}
            </button>

            <button
              onClick={onExit}
              className="w-full py-2 rounded-xl text-slate-400 hover:text-slate-200 font-mono text-xs transition-colors"
            >
              Return to Home
            </button>
          </div>

        </div>
      )}

      {/* 4. Footer Level Selector */}
      <div className="w-full max-w-lg flex items-center justify-center gap-1.5 py-2 overflow-x-auto">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(lvl => {
          const isUnlocked = lvl <= progress.highestUnlockedLevel;
          const isCurrent = lvl === currentLevel;

          return (
            <button
              key={lvl}
              onClick={() => isUnlocked && setCurrentLevel(lvl)}
              disabled={!isUnlocked}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center ${
                isCurrent
                  ? 'bg-amber-500 text-black ring-2 ring-amber-300'
                  : isUnlocked
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  : 'bg-slate-900/60 text-slate-600 cursor-not-allowed border border-slate-800'
              }`}
            >
              {lvl}
            </button>
          );
        })}
      </div>

    </div>
  );
};
