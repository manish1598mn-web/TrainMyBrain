import React, { useState, useEffect, useCallback } from 'react';
import {
  generateSudokuPuzzle,
  generateSudokuReflexTrials,
  calculateCandidates,
  SudokuPuzzle,
  SudokuReflexTrial,
  SudokuGrid
} from './generator';
import { GameTimer } from '../../engine/game-engine/timer';
import { calculateGameScore } from '../../engine/scoring-engine/scoring';
import { soundManager } from '../../lib/sound';
import { CheckCircle2, XCircle, Grid, Eye, Sparkles, Layers, Lightbulb, Clock, RotateCcw } from 'lucide-react';

interface SudokuViewProps {
  level: number;
  mode?: 'reflex' | 'full';
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

export const SudokuView: React.FC<SudokuViewProps> = ({
  level,
  mode = 'full',
  timer,
  isReady,
  isPaused,
  customSeed,
  onComplete
}) => {
  const [activeTab, setActiveTab] = useState<'full' | 'reflex'>(mode);
  const isFullMode = activeTab === 'full';

  // --- Full Sudoku Puzzle State ---
  const [puzzle, setPuzzle] = useState<SudokuPuzzle>(() => generateSudokuPuzzle(level, customSeed));
  const [currentGrid, setCurrentGrid] = useState<SudokuGrid>(() => puzzle.initialGrid.map(row => [...row]));
  const [candidatesMatrix, setCandidatesMatrix] = useState<number[][][]>(() => puzzle.candidatesMatrix);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [fullMistakes, setFullMistakes] = useState(0);
  const [showCandidates, setShowCandidates] = useState(true);
  const [hintTier, setHintTier] = useState<number>(0);
  const [timeRemainingSec, setTimeRemainingSec] = useState(() => puzzle.timeAllowedSec);

  // --- Reflex Trials State ---
  const [reflexTrials, setReflexTrials] = useState<SudokuReflexTrial[]>(() => generateSudokuReflexTrials(level, customSeed));
  const [trialIndex, setTrialIndex] = useState(0);
  const [reflexMistakes, setReflexMistakes] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);

  // Reload on level change
  useEffect(() => {
    const p = generateSudokuPuzzle(level, customSeed);
    setPuzzle(p);
    setCurrentGrid(p.initialGrid.map(row => [...row]));
    setCandidatesMatrix(p.candidatesMatrix);
    setSelectedCell(null);
    setFullMistakes(0);
    setHintTier(0);
    setTimeRemainingSec(p.timeAllowedSec);

    const trials = generateSudokuReflexTrials(level, customSeed);
    setReflexTrials(trials);
    setTrialIndex(0);
    setReflexMistakes(0);
    setFeedback(null);
  }, [level, customSeed]);

  // Dynamic Countdown Timer (Scales generously with difficulty)
  useEffect(() => {
    if (!isReady || isPaused) return;

    const interval = window.setInterval(() => {
      setTimeRemainingSec(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady, isPaused]);

  // Session completion handler on timeout
  const handleTimeUp = useCallback(() => {
    const elapsed = timer.getElapsedMs();
    const totalCells = puzzle.gridSize * puzzle.gridSize;
    let filled = 0;
    for (let r = 0; r < puzzle.gridSize; r++) {
      for (let c = 0; c < puzzle.gridSize; c++) {
        if (currentGrid[r][c] !== null) filled++;
      }
    }

    const accuracy = Math.round((filled / totalCells) * 100);
    const score = calculateGameScore('sudoku', level, {
      accuracy,
      timeMs: elapsed,
      mistakes: fullMistakes,
      totalAttempts: totalCells,
      difficultyScore: 40 + level * 2,
      consistencyScore: Math.max(0, 100 - fullMistakes * 10),
      level
    });

    onComplete({
      accuracy,
      timeMs: elapsed,
      score,
      mistakes: fullMistakes,
      mode: `${puzzle.gridSize}×${puzzle.gridSize} Sudoku (${accuracy}%)`
    });
  }, [puzzle, currentGrid, fullMistakes, timer, level, onComplete]);

  // Full Grid Cell Input Handler
  const handleFullCellInput = (digit: number) => {
    if (!selectedCell || !puzzle || !isReady || isPaused) return;
    const { r, c } = selectedCell;

    // Cannot edit initial clues
    if (puzzle.initialGrid[r][c] !== null) return;

    const expected = puzzle.solution[r][c];
    const isCorrect = digit === expected;

    if (isCorrect) {
      soundManager.playCorrect();
      const newGrid = currentGrid.map(row => [...row]);
      newGrid[r][c] = digit;
      setCurrentGrid(newGrid);
      setCandidatesMatrix(calculateCandidates(newGrid, puzzle.gridSize, puzzle.boxRows, puzzle.boxCols));

      // Check if complete
      let filled = 0;
      const totalCells = puzzle.gridSize * puzzle.gridSize;
      for (let i = 0; i < puzzle.gridSize; i++) {
        for (let j = 0; j < puzzle.gridSize; j++) {
          if (newGrid[i][j] !== null) filled++;
        }
      }

      if (filled === totalCells) {
        const elapsed = timer.getElapsedMs();
        const accuracy = Math.max(0, 100 - fullMistakes * 5);
        const score = calculateGameScore('sudoku', level, {
          accuracy,
          timeMs: elapsed,
          mistakes: fullMistakes,
          totalAttempts: totalCells,
          difficultyScore: 45 + level * 3,
          consistencyScore: Math.max(0, 100 - fullMistakes * 8),
          level
        });

        onComplete({
          accuracy,
          timeMs: elapsed,
          score,
          mistakes: fullMistakes,
          mode: `${puzzle.gridSize}×${puzzle.gridSize} Completed!`
        });
      }
    } else {
      soundManager.playMistake();
      setFullMistakes(m => m + 1);
    }
  };

  // Keyboard shortcut listener for digits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isReady || isPaused || !isFullMode) return;
      const keyNum = parseInt(e.key, 10);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= puzzle.gridSize) {
        handleFullCellInput(keyNum);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady, isPaused, isFullMode, selectedCell, puzzle, currentGrid]);

  // Handle Progressive Hint Trigger
  const handleTriggerHint = () => {
    soundManager.playTap();
    setHintTier(prev => (prev < 3 ? prev + 1 : 1));
  };

  // Cell sizing classes based on grid size
  const gridSize = puzzle.gridSize;
  let cellClass = 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl';
  if (gridSize === 6) {
    cellClass = 'w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl';
  } else if (gridSize === 9) {
    cellClass = 'w-8 h-8 sm:w-10 sm:h-10 text-base sm:text-lg';
  }

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg select-none py-1 px-2">
      
      {/* 1. Header Bar: Level & Grid Badge, Timer, Mode Switcher */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold text-xs font-mono uppercase tracking-wider">
            {puzzle.gridSize}×{puzzle.gridSize} SUDOKU
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {puzzle.emptyCellsCount} Empty
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          <span className="text-rose-500">
            Mistakes: {fullMistakes}
          </span>
          <span className={`px-2.5 py-0.5 rounded-md font-black flex items-center gap-1 ${
            timeRemainingSec <= 30
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            <Clock className="w-3 h-3" />
            {timeRemainingSec}s
          </span>
        </div>
      </div>

      {/* 2. Top Toolbar: Hint & Candidate Visibility */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <button
          onClick={handleTriggerHint}
          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
            hintTier > 0
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{hintTier === 0 ? 'Need a Hint?' : `Hint (Tier ${hintTier}/3)`}</span>
        </button>

        <button
          onClick={() => setShowCandidates(!showCandidates)}
          className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showCandidates ? 'Hide Pencil Marks' : 'Show Pencil Marks'}</span>
        </button>
      </div>

      {/* 3-Tier Progressive Hint Display */}
      {hintTier > 0 && (
        <div className="w-full mb-3 p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 animate-in zoom-in-95 leading-relaxed">
          {hintTier === 1 && <div><strong>🔍 Hint 1 (Area Focus):</strong> {puzzle.progressiveHints[0]?.hint1}</div>}
          {hintTier === 2 && <div><strong>⚡ Hint 2 (Constraint Reduction):</strong> {puzzle.progressiveHints[0]?.hint2}</div>}
          {hintTier === 3 && <div><strong>💡 Hint 3 (Direct Solution):</strong> {puzzle.progressiveHints[0]?.hint3}</div>}
        </div>
      )}

      {/* 3. The Dynamic Sudoku Board */}
      <div className="relative p-2 rounded-3xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xl mb-3 flex items-center justify-center">
        <div
          className="grid gap-0.5 select-none bg-slate-400 dark:bg-slate-700 p-1 rounded-2xl"
          style={{
            gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`
          }}
        >
          {currentGrid.map((row, r) =>
            row.map((val, c) => {
              const isInitial = puzzle.initialGrid[r][c] !== null;
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const candidates = candidatesMatrix[r]?.[c] || [];
              const isThickRight = (c + 1) % puzzle.boxCols === 0 && c < puzzle.gridSize - 1;
              const isThickBottom = (r + 1) % puzzle.boxRows === 0 && r < puzzle.gridSize - 1;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => setSelectedCell({ r, c })}
                  disabled={!isReady || isPaused}
                  className={`${cellClass} flex flex-col items-center justify-center font-mono font-bold transition-all relative ${
                    isSelected
                      ? 'bg-purple-600 text-white ring-4 ring-purple-300 dark:ring-purple-700 z-10 scale-105'
                      : isInitial
                      ? 'bg-slate-100 dark:bg-slate-850 font-black text-slate-900 dark:text-white'
                      : val !== null
                      ? 'bg-white dark:bg-slate-900 font-bold text-purple-600 dark:text-purple-400'
                      : 'bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-400'
                  } ${isThickRight ? 'mr-1' : ''} ${isThickBottom ? 'mb-1' : ''}`}
                >
                  {val !== null ? (
                    <span>{val}</span>
                  ) : showCandidates ? (
                    // Candidate Possibility Marks
                    <div
                      className="grid gap-0 w-full h-full p-0.5 text-[7px] leading-tight text-slate-400 dark:text-slate-500 items-center justify-items-center"
                      style={{
                        gridTemplateColumns: `repeat(${puzzle.boxCols}, minmax(0, 1fr))`
                      }}
                    >
                      {Array.from({ length: puzzle.gridSize }, (_, i) => i + 1).map(n => (
                        <span
                          key={n}
                          className={candidates.includes(n) ? 'opacity-100 text-purple-600 dark:text-purple-400 font-bold' : 'opacity-0'}
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Adaptive Digit Keypad (1..4, 1..6, or 1..9) */}
      <div
        className="grid gap-1.5 w-full mt-1"
        style={{
          gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: puzzle.gridSize }, (_, i) => i + 1).map(d => (
          <button
            key={d}
            onClick={() => handleFullCellInput(d)}
            disabled={!selectedCell || puzzle.initialGrid[selectedCell.r][selectedCell.c] !== null}
            className="py-3 rounded-2xl font-mono font-black text-lg bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 shadow-sm active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center"
          >
            {d}
          </button>
        ))}
      </div>

      <p className="mt-2.5 text-[10px] text-slate-400 text-center font-normal">
        Select empty cell • Tap number or press keyboard keys
      </p>

    </div>
  );
};
