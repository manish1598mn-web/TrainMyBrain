import React, { useState, useRef } from 'react';
import { GameTimer } from '../../engine/game-engine/timer';
import { useProgressStore } from '../../store/progress-store';
import { calculateMindMixLevel, getMindMixRoundsPlan } from '../../engine/mind-mix/level-calculator';
import { evaluateMentalSwitching } from '../../engine/mind-mix/switching-evaluator';
import { MindMixRoundResult } from '../../engine/mind-mix/types';
import { WordSpeedView } from '../wordspeed/WordSpeedView';
import { BoggleView } from '../boggle/BoggleView';
import { AnzanView } from '../anzan/AnzanView';
import { SudokuView } from '../sudoku/SudokuView';
import { ZebraView } from '../zebra/ZebraView';
import { soundManager } from '../../lib/sound';
import { Shuffle, ArrowRight, Zap, Brain, Eye, Target, Layers, BookOpen, Sparkles } from 'lucide-react';

interface MindMixViewProps {
  timer: GameTimer;
  isReady: boolean;
  isPaused: boolean;
  onComplete: (data: {
    accuracy: number;
    timeMs: number;
    score: number;
    mistakes: number;
    mode: string;
    mindMixLevel?: number;
    switchingScore?: number;
  }) => void;
}

export const MindMixView: React.FC<MindMixViewProps> = ({
  timer,
  isReady,
  isPaused,
  onComplete
}) => {
  const { getLevelsMap } = useProgressStore();
  const levelsMap = getLevelsMap();
  const mindMixLevel = calculateMindMixLevel(levelsMap);
  const roundsPlan = getMindMixRoundsPlan(levelsMap);

  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [accumulatedRoundResults, setAccumulatedRoundResults] = useState<MindMixRoundResult[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionStartRef = useRef<number>(Date.now());

  const currentRound = roundsPlan[currentRoundIdx] || roundsPlan[0];
  const nextRound = roundsPlan[currentRoundIdx + 1];

  const handleStageComplete = (data: {
    accuracy: number;
    timeMs: number;
    score: number;
    mistakes: number;
  }) => {
    const transitionLatencyMs = Math.max(400, Date.now() - transitionStartRef.current);
    
    const roundResult: MindMixRoundResult = {
      gameId: currentRound.gameId,
      level: currentRound.level,
      accuracy: data.accuracy,
      timeMs: data.timeMs,
      mistakes: data.mistakes,
      transitionLatencyMs
    };

    const updated = [...accumulatedRoundResults, roundResult];
    setAccumulatedRoundResults(updated);

    if (currentRoundIdx + 1 >= roundsPlan.length) {
      // Completed all 5 stages of Mind Mix!
      const totalScore = updated.reduce((sum, s) => sum + (s.accuracy * 10), 0);
      const avgAccuracy = Math.round(updated.reduce((sum, s) => sum + s.accuracy, 0) / updated.length);
      const totalMistakes = updated.reduce((sum, s) => sum + s.mistakes, 0);
      const elapsed = timer.getElapsedMs();

      const switchingMetrics = evaluateMentalSwitching(updated);

      onComplete({
        accuracy: avgAccuracy,
        timeMs: elapsed,
        score: totalScore,
        mistakes: totalMistakes,
        mode: `Mind Mix Lv ${mindMixLevel}`,
        mindMixLevel,
        switchingScore: switchingMetrics.switchingScore
      });
    } else {
      setIsTransitioning(true);
      soundManager.playCorrect();
      setTimeout(() => {
        transitionStartRef.current = Date.now();
        setIsTransitioning(false);
        setCurrentRoundIdx(prev => prev + 1);
      }, 900);
    }
  };

  const getRoundIcon = (gameId: string) => {
    switch (gameId) {
      case 'anzan': return Zap;
      case 'boggle': return Sparkles;
      case 'sudoku': return Brain;
      case 'wordspeed': return BookOpen;
      case 'zebra': return Layers;
      default: return Shuffle;
    }
  };

  const Icon = getRoundIcon(currentRound.gameId);

  return (
    <div className="w-full flex flex-col items-center justify-center select-none">
      
      {/* Mind Mix Header Badge */}
      <div className="w-full max-w-md flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-900/50 shadow-sm mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/30 text-indigo-300 flex items-center justify-center">
            <Shuffle className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
              Mind Mix • Level {mindMixLevel}
            </span>
            <span className="text-xs font-semibold text-white">
              Stage {currentRoundIdx + 1} of 5
            </span>
          </div>
        </div>

        {/* Individual Round Player Level */}
        <div className="text-right">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">{currentRound.name}</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-200 font-mono font-bold text-xs">
            User Lv {currentRound.level}
          </span>
        </div>
      </div>

      {/* Transition Screen Overlay */}
      {isTransitioning ? (
        <div className="py-16 text-center animate-in zoom-in-95">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ArrowRight className="w-7 h-7 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Context Shift
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Switching from <span className="font-semibold text-slate-800 dark:text-slate-200">{currentRound.name}</span> to <span className="font-semibold text-indigo-600 dark:text-indigo-400">{nextRound?.name}</span> (Lv {nextRound?.level})
          </p>
        </div>
      ) : (
        <div className="w-full flex justify-center">
          {currentRound.gameId === 'anzan' && (
            <AnzanView
              level={currentRound.level}
              timer={timer}
              isReady={isReady}
              isPaused={isPaused}
              onComplete={handleStageComplete}
            />
          )}

          {currentRound.gameId === 'boggle' && (
            <BoggleView
              level={currentRound.level}
              timer={timer}
              isReady={isReady}
              isPaused={isPaused}
              onComplete={handleStageComplete}
            />
          )}

          {currentRound.gameId === 'wordspeed' && (
            <WordSpeedView
              level={currentRound.level}
              timer={timer}
              isReady={isReady}
              isPaused={isPaused}
              onComplete={handleStageComplete}
            />
          )}

          {currentRound.gameId === 'sudoku' && (
            <SudokuView
              level={currentRound.level}
              timer={timer}
              isReady={isReady}
              isPaused={isPaused}
              onComplete={handleStageComplete}
            />
          )}

          {currentRound.gameId === 'zebra' && (
            <ZebraView
              level={currentRound.level}
              timer={timer}
              isReady={isReady}
              isPaused={isPaused}
              onComplete={handleStageComplete}
            />
          )}
        </div>
      )}

    </div>
  );
};
