import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateBoggleBoard, BoggleBoard, BoggleCellCoord, getBoggleDimensions } from './board-generator';
import { boggleTrie } from './dictionary-trie';
import { GameTimer } from '../../engine/game-engine/timer';
import { calculateGameScore } from '../../engine/scoring-engine/scoring';
import { soundManager } from '../../lib/sound';
import { Sparkles, Flame, Check, RotateCcw, Zap, HelpCircle, Trophy, BookOpen, Clock, Target } from 'lucide-react';

interface BoggleViewProps {
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

export const BoggleView: React.FC<BoggleViewProps> = ({
  level,
  timer,
  isReady,
  isPaused,
  customSeed,
  onComplete
}) => {
  const [board, setBoard] = useState<BoggleBoard>(() => generateBoggleBoard(level, customSeed));
  const [currentPath, setCurrentPath] = useState<BoggleCellCoord[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isGood: boolean } | null>(null);
  const [timeRemainingSec, setTimeRemainingSec] = useState(() => board.timeAllowedSec);
  const [isCompleted, setIsCompleted] = useState(false);
  const isCompletedRef = useRef(false);

  const boardRef = useRef<HTMLDivElement>(null);

  // Initialize on level change
  useEffect(() => {
    const b = generateBoggleBoard(level, customSeed);
    setBoard(b);
    setCurrentPath([]);
    setFoundWords(new Set());
    setScore(0);
    setCombo(0);
    setMistakes(0);
    setFeedbackMsg(null);
    setTimeRemainingSec(b.timeAllowedSec);
    setIsCompleted(false);
    isCompletedRef.current = false;
  }, [level, customSeed]);

  // Current formed word string from path
  const currentWord = currentPath.map(coord => board.grid[coord.r][coord.c]).join('');
  const targetWords = board.targetWordCount;
  const isGoalReached = foundWords.size >= targetWords;

  // Session completion handler - guarded against multiple calls
  const handleCompleteGame = useCallback((userRequested: boolean = false) => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setIsCompleted(true);

    const elapsed = timer.getElapsedMs();
    const totalFound = foundWords.size;
    const isTargetMet = totalFound >= targetWords;

    // Accuracy Calculation:
    // If target met: 100% accuracy (triggers level-up in progression.ts)
    // If target NOT met: capped at <= 65% (below 70% threshold -> strictly blocks automatic level up!)
    let accuracy = 0;
    if (isTargetMet) {
      accuracy = 100;
    } else {
      accuracy = Math.min(65, Math.round((totalFound / Math.max(1, targetWords)) * 60));
    }

    const finalScore = calculateGameScore('boggle' as any, level, {
      accuracy,
      timeMs: elapsed,
      mistakes,
      totalAttempts: Math.max(totalFound + mistakes, 1),
      difficultyScore: 40 + level * 3,
      consistencyScore: Math.min(100, 50 + totalFound * 10),
      level
    });

    onComplete({
      accuracy,
      timeMs: elapsed,
      score: finalScore,
      mistakes,
      mode: isTargetMet
        ? `Target Reached! Found ${totalFound}/${targetWords} Words (${score} pts)`
        : `Time Up: Found ${totalFound}/${targetWords} Words (Target: ${targetWords})`
    });
  }, [foundWords, targetWords, score, mistakes, timer, level, onComplete]);

  // Countdown Timer based on 10s per target word (stops immediately upon completion)
  useEffect(() => {
    if (!isReady || isPaused || isCompleted) return;

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
  }, [isReady, isPaused, isCompleted]);

  // Handle timeout when countdown reaches zero safely outside state updater
  useEffect(() => {
    if (timeRemainingSec === 0 && !isCompletedRef.current && isReady && !isPaused && !isCompleted) {
      handleCompleteGame(false);
    }
  }, [timeRemainingSec, isReady, isPaused, isCompleted, handleCompleteGame]);

  // Check if cell is an adjacent neighbor of the last cell in path
  const isAdjacent = (r1: number, c1: number, r2: number, c2: number) => {
    return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);
  };

  // Cell Interaction Handlers
  const handleCellClick = (r: number, c: number) => {
    if (!isReady || isPaused || isCompleted) return;

    soundManager.playTap();

    // 1. If path is empty, start path
    if (currentPath.length === 0) {
      setCurrentPath([{ r, c }]);
      return;
    }

    const last = currentPath[currentPath.length - 1];

    // 2. If clicking on last selected, undo it
    if (last.r === r && last.c === c) {
      setCurrentPath(prev => prev.slice(0, -1));
      return;
    }

    // 3. Check if cell is already visited in path (prevent reuse)
    const isVisited = currentPath.some(cell => cell.r === r && cell.c === c);
    if (isVisited) {
      const existingIdx = currentPath.findIndex(cell => cell.r === r && cell.c === c);
      if (existingIdx !== -1) {
        setCurrentPath(prev => prev.slice(0, existingIdx + 1));
      }
      return;
    }

    // 4. Must be adjacent neighbor
    if (isAdjacent(last.r, last.c, r, c)) {
      setCurrentPath(prev => [...prev, { r, c }]);
    }
  };

  // Submit and validate the formed word
  const handleSubmitWord = useCallback(() => {
    if (isCompleted) return;
    if (currentWord.length < board.minWordLength) {
      setFeedbackMsg({ text: `Words must be at least ${board.minWordLength} letters!`, isGood: false });
      setTimeout(() => setFeedbackMsg(null), 1200);
      return;
    }

    if (foundWords.has(currentWord)) {
      soundManager.playMistake();
      setFeedbackMsg({ text: `"${currentWord}" already found!`, isGood: false });
      setTimeout(() => setFeedbackMsg(null), 1200);
      setCurrentPath([]);
      return;
    }

    const isValid = boggleTrie.isWord(currentWord);

    if (isValid) {
      soundManager.playCorrect();
      const wordLen = currentWord.length;
      const pts = wordLen === 3 ? 10 : wordLen === 4 ? 20 : wordLen === 5 ? 40 : wordLen === 6 ? 60 : 100;
      const bonusPts = pts * (combo >= 2 ? 2 : 1);

      setFoundWords(prev => new Set([...prev, currentWord]));
      setScore(s => s + bonusPts);
      setCombo(c => c + 1);
      setFeedbackMsg({ text: `✓ ${currentWord} (+${bonusPts} pts)`, isGood: true });
    } else {
      soundManager.playMistake();
      setMistakes(m => m + 1);
      setCombo(0);
      setFeedbackMsg({ text: `✗ "${currentWord}" is not in dictionary`, isGood: false });
    }

    setTimeout(() => setFeedbackMsg(null), 1200);
    setCurrentPath([]);
  }, [currentWord, foundWords, combo, board.minWordLength]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isReady || isPaused || isCompleted) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitWord();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        setCurrentPath([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady, isPaused, handleSubmitWord]);

  // Calculate dynamic tile sizing based on columns count
  const cols = board.cols;
  let tileClass = 'w-13 h-13 sm:w-16 sm:h-16 text-xl sm:text-2xl';
  if (cols >= 16) {
    tileClass = 'w-6 h-6 sm:w-8 sm:h-8 text-[11px] sm:text-xs font-bold';
  } else if (cols >= 10) {
    tileClass = 'w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-bold';
  } else if (cols >= 7) {
    tileClass = 'w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg font-bold';
  }

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-2xl select-none py-1 px-2">
      
      {/* 1. Top Header: Timer, Score, Grid Dimension & Target */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold text-xs font-mono uppercase tracking-wider">
            {board.rows}x{board.cols} BOGGLE
          </span>
          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-teal-600" />
            <span>Target: <strong className={isGoalReached ? 'text-emerald-500 font-black' : 'text-slate-700 dark:text-slate-200'}>{foundWords.size}/{targetWords}</strong></span>
          </span>
          {combo >= 2 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 text-xs font-bold font-mono animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {combo}x
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          <span className="text-slate-500 dark:text-slate-400">
            Score: <strong className="text-slate-900 dark:text-white font-black">{score}</strong>
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

      {/* 2. Active Word Formation Ribbon */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs mb-3 min-h-[3rem]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Word:</span>
          {currentPath.length > 0 ? (
            <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-rose-600 dark:text-rose-400 animate-in zoom-in-95">
              {currentWord}
            </span>
          ) : (
            <span className="text-xs font-mono text-slate-400 italic">
              Tap adjacent dice (min {board.minWordLength} letters) • 10s per target word
            </span>
          )}
        </div>

        {/* Action Controls: Finish Level, Clear & Submit */}
        <div className="flex items-center gap-1.5">
          {isGoalReached && !isCompleted && (
            <button
              onClick={() => handleCompleteGame(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-1 animate-pulse"
              title="Target reached! Finish level and view results"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Finish Level</span>
            </button>
          )}

          <button
            onClick={() => setCurrentPath([])}
            disabled={currentPath.length === 0 || isCompleted}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Clear Path (Esc)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSubmitWord}
            disabled={currentWord.length < board.minWordLength || isCompleted}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            Submit
          </button>
        </div>
      </div>

      {/* Feedback Toast Notification */}
      {feedbackMsg && (
        <div className={`mb-2 px-3 py-1 rounded-xl text-xs font-bold font-mono animate-in zoom-in-95 ${
          feedbackMsg.isGood
            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
        }`}>
          {feedbackMsg.text}
        </div>
      )}

      {/* 3. The Responsive Boggle Matrix */}
      <div className="w-full max-h-[50vh] overflow-auto flex items-center justify-center p-2 rounded-3xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
        <div
          ref={boardRef}
          className="grid gap-1.5 sm:gap-2 select-none"
          style={{
            gridTemplateColumns: `repeat(${board.cols}, minmax(0, 1fr))`
          }}
        >
          {board.grid.map((row, r) =>
            row.map((letter, c) => {
              const isSelected = currentPath.some(cell => cell.r === r && cell.c === c);
              const pathIdx = currentPath.findIndex(cell => cell.r === r && cell.c === c);
              const isLast = currentPath.length > 0 && currentPath[currentPath.length - 1].r === r && currentPath[currentPath.length - 1].c === c;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  disabled={!isReady || isPaused || isCompleted}
                  className={`relative ${tileClass} rounded-xl font-mono font-black flex items-center justify-center shadow-sm transition-all transform active:scale-95 ${
                    isLast
                      ? 'bg-rose-600 text-white shadow-rose-500/40 ring-4 ring-rose-400/50 scale-105 z-10'
                      : isSelected
                      ? 'bg-rose-500/80 text-white ring-2 ring-rose-400/40 z-0'
                      : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <span>{letter}</span>
                  {isSelected && (
                    <span className="absolute top-0.5 right-1 text-[8px] font-mono text-white/80">
                      {pathIdx + 1}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Found Words Chips Gallery */}
      <div className="w-full mt-3 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto min-h-[2.5rem]">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 shrink-0">
          Found ({foundWords.size}):
        </span>
        {foundWords.size === 0 ? (
          <span className="text-[11px] text-slate-400 italic">No words found yet.</span>
        ) : (
          Array.from(foundWords).map(w => (
            <span
              key={w}
              className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-mono font-bold text-[11px] shrink-0 animate-in zoom-in-95"
            >
              {w}
            </span>
          ))
        )}
      </div>

    </div>
  );
};
