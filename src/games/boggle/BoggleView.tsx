import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateBoggleBoard, BoggleBoard, BoggleCellCoord } from './board-generator';
import { boggleTrie } from './dictionary-trie';
import { GameTimer } from '../../engine/game-engine/timer';
import { calculateGameScore } from '../../engine/scoring-engine/scoring';
import { soundManager } from '../../lib/sound';
import { useVocabularyStore } from '../../store/vocabulary-store';
import { resolveWordDefinition } from '../../lib/vocabulary/vocabulary-database';
import { VocabularyWord } from '../../lib/vocabulary/types';
import { 
  Sparkles, Flame, Check, RotateCcw, Trophy, Clock, Target, 
  BookOpen, Star, HelpCircle, CheckCircle2, ChevronRight, X
} from 'lucide-react';

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

  // Vocabulary Definition Drawer / Card state
  const [inspectingWord, setInspectingWord] = useState<VocabularyWord | null>(null);
  const [recentDefinition, setRecentDefinition] = useState<VocabularyWord | null>(null);

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
    setRecentDefinition(null);
    setInspectingWord(null);
    setTimeRemainingSec(b.timeAllowedSec);
    setIsCompleted(false);
    isCompletedRef.current = false;
  }, [level, customSeed]);

  // Current formed word string from path
  const currentWord = currentPath.map(coord => board.grid[coord.r][coord.c]).join('');
  const targetWords = board.targetWordCount;
  const isGoalReached = foundWords.size >= targetWords;
  const progressPercent = Math.min(100, Math.round((foundWords.size / Math.max(1, targetWords)) * 100));

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
      mode: isTargetMet ? 'Target Completed' : 'Time Up'
    });
  }, [foundWords.size, targetWords, timer, mistakes, level, onComplete]);

  // Active game countdown ticker
  useEffect(() => {
    if (!isReady || isPaused || isCompleted) return;

    const interval = setInterval(() => {
      setTimeRemainingSec(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleCompleteGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady, isPaused, isCompleted, handleCompleteGame]);

  // Check if two cells are 8-way adjacent
  const isAdjacent = (c1: BoggleCellCoord, c2: BoggleCellCoord) => {
    const dr = Math.abs(c1.r - c2.r);
    const dc = Math.abs(c1.c - c2.c);
    return (dr <= 1 && dc <= 1) && !(dr === 0 && dc === 0);
  };

  // Handle cell click / selection
  const handleCellClick = (r: number, c: number) => {
    if (!isReady || isPaused || isCompleted) return;

    // If clicking the last selected cell, undo it (step back)
    if (currentPath.length > 0) {
      const last = currentPath[currentPath.length - 1];
      if (last.r === r && last.c === c) {
        setCurrentPath(prev => prev.slice(0, -1));
        soundManager.playTap();
        return;
      }
    }

    // Check if cell is already in path
    const existingIdx = currentPath.findIndex(p => p.r === r && p.c === c);
    if (existingIdx !== -1) {
      // Retract path back to that index
      setCurrentPath(prev => prev.slice(0, existingIdx + 1));
      soundManager.playTap();
      return;
    }

    // If starting a new path or connecting to adjacent cell
    if (currentPath.length === 0) {
      setCurrentPath([{ r, c }]);
      soundManager.playTap();
    } else {
      const lastCell = currentPath[currentPath.length - 1];
      if (isAdjacent(lastCell, { r, c })) {
        setCurrentPath(prev => [...prev, { r, c }]);
        soundManager.playTap();
      } else {
        // Disconnected cell tap: start new path from here
        setCurrentPath([{ r, c }]);
        soundManager.playTap();
      }
    }
  };

  // Handle Word Submission
  const handleSubmitWord = () => {
    if (!isReady || isPaused || isCompleted) return;

    if (currentWord.length < board.minWordLength) {
      setFeedbackMsg({
        text: `Word too short! Level ${level} requires words with ${board.minWordLength}+ letters.`,
        isGood: false
      });
      soundManager.playMistake();
      setMistakes(m => m + 1);
      setTimeout(() => setFeedbackMsg(null), 2500);
      return;
    }

    if (foundWords.has(currentWord)) {
      setFeedbackMsg({
        text: `"${currentWord}" already found!`,
        isGood: false
      });
      soundManager.playMistake();
      setTimeout(() => setFeedbackMsg(null), 2000);
      return;
    }

    // Check validity in dictionary trie
    if (boggleTrie.isWord(currentWord)) {
      // Valid word found!
      const newFound = new Set(foundWords);
      newFound.add(currentWord);
      setFoundWords(newFound);

      // Score calculation
      const wordLen = currentWord.length;
      const basePoints = wordLen === 3 ? 1 : wordLen === 4 ? 2 : wordLen === 5 ? 4 : wordLen === 6 ? 7 : wordLen === 7 ? 10 : 15;
      const comboMult = combo >= 3 ? 2 : combo >= 1 ? 1.5 : 1;
      const pts = Math.round(basePoints * comboMult * 10);

      setScore(s => s + pts);
      setCombo(c => c + 1);

      // Save to Integrated Vocabulary Vault in LocalStorage
      const vocabEntry = useVocabularyStore.getState().recordWord(currentWord, 'boggle');
      setRecentDefinition(vocabEntry);

      soundManager.playCorrect();

      setFeedbackMsg({
        text: `+${pts} pts! "${currentWord}" saved to Vocabulary Vault!`,
        isGood: true
      });

      setCurrentPath([]);

      // If target reached, play fanfare
      if (newFound.size === targetWords) {
        soundManager.playLevelUp();
      }

      setTimeout(() => setFeedbackMsg(null), 3500);
    } else {
      // Invalid word
      setMistakes(m => m + 1);
      setCombo(0);
      setFeedbackMsg({
        text: `"${currentWord}" is not in the dictionary.`,
        isGood: false
      });
      soundManager.playMistake();
      setTimeout(() => setFeedbackMsg(null), 2000);
    }
  };

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isReady || isPaused || isCompleted) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitWord();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setCurrentPath([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, isReady, isPaused, isCompleted]);

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-2xl select-none py-1 px-2">
      
      {/* 1. Top Header: Level Tier, Target Progress & Countdown Timer */}
      <div className="glass-hud w-full flex items-center justify-between px-4 py-2.5 rounded-2xl shadow-sm mb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold text-xs font-mono uppercase tracking-wider">
            7x7 BOGGLE
          </span>
          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-teal-600" />
            <span>Target: <strong className={isGoalReached ? 'text-emerald-500 font-black' : 'text-slate-700 dark:text-slate-200'}>{foundWords.size}/{targetWords}</strong></span>
          </span>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
            {board.levelTier.description}
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
            timeRemainingSec <= 20
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            <Clock className="w-3 h-3" />
            {timeRemainingSec}s
          </span>
        </div>
      </div>

      {/* Progress Bar towards Target Completion */}
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-2.5 overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 rounded-full ${
            isGoalReached 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
              : 'bg-gradient-to-r from-rose-500 to-amber-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 2. Active Word Formation Ribbon */}
      <div className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs mb-2.5 min-h-[3.2rem]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Word:</span>
          {currentPath.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-rose-600 dark:text-rose-400 animate-in zoom-in-95">
                {currentWord}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                {currentWord.length} letters
              </span>
            </div>
          ) : (
            <span className="text-xs font-mono text-slate-400 italic">
              Tap adjacent dice • Min {board.minWordLength} letters
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
        <div className={`mb-2 px-3 py-1.5 rounded-xl text-xs font-bold font-mono animate-in zoom-in-95 flex items-center gap-2 ${
          feedbackMsg.isGood
            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
        }`}>
          {feedbackMsg.isGood ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : null}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 3. The 7x7 Tactile Boggle Dice Grid */}
      <div className="w-full flex items-center justify-center p-3 rounded-3xl bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
        <div
          ref={boardRef}
          className="grid grid-cols-7 gap-1.5 sm:gap-2 select-none w-full max-w-[420px] sm:max-w-[480px] aspect-square"
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
                  className={`relative aspect-square rounded-xl sm:rounded-2xl font-mono font-black text-sm sm:text-lg md:text-xl flex items-center justify-center transition-all transform active:translate-y-0.5 ${
                    isLast
                      ? 'bg-rose-600 text-white border-b-2 sm:border-b-4 border-rose-800 ring-4 ring-rose-400/60 shadow-lg scale-105 z-10'
                      : isSelected
                      ? 'bg-rose-500 text-white border-b-2 sm:border-b-4 border-rose-700 ring-2 ring-rose-400/40 shadow-md z-0'
                      : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 border-b-2 sm:border-b-4 border-b-slate-300 dark:border-b-slate-900 shadow-xs hover:border-b-2 hover:translate-y-[1px]'
                  }`}
                >
                  <span>{letter}</span>
                  {isSelected && (
                    <span className="absolute top-0.5 right-1 text-[8px] sm:text-[9px] font-mono text-white/90 font-bold">
                      {pathIdx + 1}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Definition Banner (if word recently discovered) */}
      {recentDefinition && (
        <div className="w-full mt-2.5 p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-xs text-rose-700 dark:text-rose-300">
                  {recentDefinition.word}
                </span>
                <span className="text-[10px] font-serif italic text-slate-500">
                  ({recentDefinition.partOfSpeech})
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                {recentDefinition.definition}
              </p>
            </div>
          </div>

          <button
            onClick={() => setRecentDefinition(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5. Found Words Chips Gallery with Click-to-Inspect Definition */}
      <div className="w-full mt-2.5 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto min-h-[2.5rem]">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 shrink-0">
          Found ({foundWords.size}):
        </span>
        {foundWords.size === 0 ? (
          <span className="text-[11px] text-slate-400 italic">No words found yet.</span>
        ) : (
          Array.from(foundWords).map(w => (
            <button
              key={w}
              onClick={() => {
                const lexical = resolveWordDefinition(w);
                const info: VocabularyWord = {
                  word: w,
                  definition: lexical.definition,
                  partOfSpeech: lexical.partOfSpeech,
                  exampleSentence: lexical.exampleSentence,
                  difficultyTier: lexical.difficultyTier,
                  discoveredAt: Date.now(),
                  timesFound: 1,
                  gameSource: 'boggle'
                };
                setInspectingWord(info);
              }}
              className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 hover:border-rose-400 text-rose-700 dark:text-rose-300 font-mono font-bold text-[11px] shrink-0 active:scale-95 transition-all flex items-center gap-1"
              title="Click to view definition"
            >
              <span>{w}</span>
              <BookOpen className="w-2.5 h-2.5 opacity-60" />
            </button>
          ))
        )}
      </div>

      {/* 6. Word Detail Modal (when tapping a chip) */}
      {inspectingWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xl text-left">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-black text-rose-600 dark:text-rose-400">
                  {inspectingWord.word}
                </span>
                <span className="text-xs font-serif italic text-slate-500">
                  ({inspectingWord.partOfSpeech})
                </span>
              </div>
              <button
                onClick={() => setInspectingWord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              {inspectingWord.definition}
            </p>

            {inspectingWord.exampleSentence && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic border-l-2 border-rose-500/40 pl-2 mb-3">
                "{inspectingWord.exampleSentence}"
              </p>
            )}

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>{inspectingWord.word.length} Letters</span>
              <span className="text-rose-500 font-bold">Saved in Vocabulary Vault</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
