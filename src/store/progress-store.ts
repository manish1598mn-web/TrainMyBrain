import { create } from 'zustand';
import { GameAttempt, GameId, GameProgress, GameResult } from '../engine/game-engine/types';
import { calculateNextLevel, calculateOverallMindLevel, getRankTitle } from '../engine/level-engine/progression';
import { calculateMindMixLevel } from '../engine/mind-mix/level-calculator';
import { generateCognitiveInsight, getTargetTimeMs } from '../engine/scoring-engine/scoring';
import { progressStorage } from '../lib/storage/progressStorage';
import { historyStorage } from '../lib/storage/historyStorage';
import { usePlayerStore } from './player-store';

export interface SkillItem {
  key: string;
  name: string;
  level: number;
  mastery: number;
  status: 'Strong' | 'Good' | 'Developing';
  icon: string;
  gameId: GameId;
}

export interface ProgressState {
  games: Record<GameId, GameProgress>;
  attempts: GameAttempt[];

  // Actions
  recordGameResult: (
    gameId: GameId,
    accuracy: number,
    timeMs: number,
    score: number,
    mistakes: number,
    mode?: string,
    playedLevel?: number
  ) => { result: GameResult; leveledUp: boolean; levelDelta: number };

  getRecentGames: (limit?: number) => GameProgress[];
  getLevelsMap: () => Record<GameId, number>;
  getSkillProfile: () => SkillItem[];
  getSkillScores: () => {
    logic: number;
    verbalProcessing: number;
    calculation: number;
    focus: number;
    workingMemory: number;
  };
  getWeakestGame: () => {
    gameId: GameId;
    skillName: string;
    level: number;
    mastery: number;
    reason: string;
  };
  getMindMixLevel: () => number;
  resetAllProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => {
  const initialData = progressStorage.getProgress();
  const initialAttempts = historyStorage.getAttempts();

  return {
    games: initialData.games,
    attempts: initialAttempts,

    recordGameResult: (gameId, accuracy, timeMs, score, mistakes, mode, playedLevel) => {
      const state = get();
      const currentProgress = state.games[gameId];
      const previousLevel = currentProgress.level;
      const levelToEvaluate = playedLevel ?? previousLevel;
      const previousMastery = currentProgress.mastery ?? 25;
      const previousAvgTime = currentProgress.averageTimeMs;
      const attemptsAtLevel = currentProgress.attemptsAtCurrentLevel ?? 0;
      const recentPerformances = currentProgress.recentPerformances ?? [];

      // Layer 1 & 2: Evaluate Performance Components, Mastery, and Level Gating
      const progression = calculateNextLevel(
        gameId,
        levelToEvaluate,
        previousMastery,
        attemptsAtLevel,
        {
          accuracy,
          timeMs,
          mistakes,
          totalAttempts: 1,
          difficultyScore: levelToEvaluate * 5,
          level: levelToEvaluate
        },
        recentPerformances
      );

      // Only advance highest level if player completed their current highest level or above
      let newLevel = previousLevel;
      let leveledUp = false;
      let levelDelta = 0;

      if (progression.leveledUp) {
        if (levelToEvaluate >= previousLevel) {
          newLevel = previousLevel + 1;
          leveledUp = true;
          levelDelta = 1;
        } else {
          // Replayed an older level successfully; highest level remains
          newLevel = previousLevel;
          leveledUp = false;
          levelDelta = 0;
        }
      }
      const newMastery = progression.mastery;
      const performanceScore = progression.components.performanceScore;

      // Baseline Tracking (Layer 3)
      const baselineTime = currentProgress.baselineTimeMs > 0 ? currentProgress.baselineTimeMs : timeMs;
      const baselineImprovementPercent = baselineTime > 0
        ? Math.round(((baselineTime - timeMs) / baselineTime) * 100)
        : 0;

      // Speed * Accuracy Composite Index
      const targetTime = getTargetTimeMs(gameId, levelToEvaluate);
      const speedRatio = targetTime / Math.max(timeMs, 1000);
      const speedAccuracyScore = Math.round(accuracy * Math.min(1.5, speedRatio));

      // Speed + Accuracy Summary narrative
      let speedAccuracySummary = 'Steady Precision';
      if (accuracy >= 90 && baselineImprovementPercent > 10) {
        speedAccuracySummary = 'Faster + More Accurate';
      } else if (accuracy >= 90) {
        speedAccuracySummary = 'High Accuracy Maintained';
      } else if (baselineImprovementPercent > 15) {
        speedAccuracySummary = 'Speed Gained (Refining Accuracy)';
      }

      // Rolling history arrays
      const updatedRecentPerformances = [performanceScore, ...recentPerformances].slice(0, 10);
      const updatedRecentAccuracies = [accuracy, ...(currentProgress.recentAccuracies || [])].slice(0, 10);

      // Lifetime counters
      const newGamesPlayed = currentProgress.gamesPlayed + 1;
      const newBestScore = Math.max(currentProgress.bestScore, score);
      const newBestTime = currentProgress.bestTimeMs === 0 ? timeMs : Math.min(currentProgress.bestTimeMs, timeMs);
      const newAvgTime = currentProgress.averageTimeMs === 0
        ? timeMs
        : Math.round((currentProgress.averageTimeMs * currentProgress.gamesPlayed + timeMs) / newGamesPlayed);
      const newAvgAcc = currentProgress.averageAccuracy === 0
        ? accuracy
        : Math.round((currentProgress.averageAccuracy * currentProgress.gamesPlayed + accuracy) / newGamesPlayed);

      const deltaImprovement = previousAvgTime > 0
        ? Math.round(((previousAvgTime - timeMs) / previousAvgTime) * 100)
        : 0;

      const insight = generateCognitiveInsight(
        gameId,
        {
          accuracy,
          timeMs,
          mistakes,
          totalAttempts: 1,
          difficultyScore: levelToEvaluate * 5,
          level: levelToEvaluate
        },
        previousAvgTime,
        baselineTime
      );

      const updatedProgress: GameProgress = {
        ...currentProgress,
        level: newLevel,
        mastery: newMastery,
        bestScore: newBestScore,
        bestTimeMs: newBestTime,
        averageTimeMs: newAvgTime,
        averageAccuracy: newAvgAcc,
        baselineTimeMs: baselineTime,
        baselineImprovementPercent,
        recentPerformances: updatedRecentPerformances,
        recentAccuracies: updatedRecentAccuracies,
        attemptsAtCurrentLevel: leveledUp ? 0 : attemptsAtLevel + 1,
        speedAccuracyScore,
        gamesPlayed: newGamesPlayed,
        lastPlayed: Date.now()
      };

      const newGames = {
        ...state.games,
        [gameId]: updatedProgress
      };

      const newAttempt: GameAttempt = {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        gameId,
        level: levelToEvaluate,
        score,
        timeMs,
        accuracy,
        mistakes,
        performanceScore,
        timestamp: Date.now(),
        mode
      };

      const newAttempts = [newAttempt, ...state.attempts].slice(0, 150);

      set({
        games: newGames,
        attempts: newAttempts
      });

      progressStorage.saveProgress({ games: newGames });
      historyStorage.addAttempt(newAttempt);

      // Update Player Store overall mind level & intelligent training streak
      const playerStore = usePlayerStore.getState();
      const isPR = score > currentProgress.bestScore;
      const isSuccessful = accuracy >= 70;
      playerStore.recordTrainingSession({
        isSuccessful,
        leveledUp,
        isPR,
        isDailyChallenge: mode === 'Daily Challenge'
      });

      const levelsMap: Record<string, number> = {
        sudoku: newGames.sudoku.level,
        zebra: newGames.zebra.level,
        wordspeed: newGames.wordspeed.level,
        anzan: newGames.anzan.level,
        boggle: newGames.boggle.level
      };
      const overallLevel = calculateOverallMindLevel(levelsMap);
      playerStore.setOverallMindLevel(overallLevel);

      const result: GameResult = {
        gameId,
        level: levelToEvaluate,
        previousLevel: levelToEvaluate,
        newLevel,
        score,
        accuracy,
        timeMs,
        mistakes,
        completed: true,
        timestamp: Date.now(),
        performanceScore: progression.components.performanceScore,
        speedScore: progression.components.speedScore,
        difficultyScore: progression.components.difficultyScore,
        consistencyScore: progression.components.consistencyScore,
        mastery: newMastery,
        previousMastery,
        masteryDelta: progression.masteryDelta,
        baselineImprovementPercent,
        speedAccuracySummary,
        deltaImprovement,
        insight
      };

      return {
        result,
        leveledUp,
        levelDelta: progression.levelDelta
      };
    },

    getRecentGames: (limit = 3) => {
      const state = get();
      return Object.values(state.games)
        .filter(g => g.lastPlayed > 0)
        .sort((a, b) => b.lastPlayed - a.lastPlayed)
        .slice(0, limit);
    },

    getLevelsMap: () => {
      const state = get();
      return {
        sudoku: state.games.sudoku.level,
        zebra: state.games.zebra.level,
        wordspeed: state.games.wordspeed.level,
        anzan: state.games.anzan.level,
        boggle: state.games.boggle.level
      };
    },

    getSkillProfile: (): SkillItem[] => {
      const state = get();
      const g = state.games;

      const calcStatus = (lvl: number): 'Strong' | 'Good' | 'Developing' => {
        if (lvl >= 50) return 'Strong';
        if (lvl >= 25) return 'Good';
        return 'Developing';
      };

      return [
        {
          key: 'calc',
          name: 'Calculation',
          level: g.anzan.level,
          mastery: g.anzan.mastery,
          status: calcStatus(g.anzan.level),
          icon: 'Calculator',
          gameId: 'anzan'
        },
        {
          key: 'verbal',
          name: 'Verbal Speed',
          level: g.wordspeed.level,
          mastery: g.wordspeed.mastery,
          status: calcStatus(g.wordspeed.level),
          icon: 'BookOpen',
          gameId: 'wordspeed'
        },
        {
          key: 'logic',
          name: 'Logic Constraints',
          level: g.sudoku.level,
          mastery: g.sudoku.mastery,
          status: calcStatus(g.sudoku.level),
          icon: 'Grid3X3',
          gameId: 'sudoku'
        },
        {
          key: 'reasoning',
          name: 'Complex Reasoning',
          level: g.zebra.level,
          mastery: g.zebra.mastery,
          status: calcStatus(g.zebra.level),
          icon: 'Layers',
          gameId: 'zebra'
        },
        {
          key: 'focus',
          name: 'Lexical Search',
          level: g.boggle.level,
          mastery: g.boggle.mastery,
          status: calcStatus(g.boggle.level),
          icon: 'Sparkles',
          gameId: 'boggle'
        }
      ];
    },

    getSkillScores: () => {
      const state = get();
      return {
        logic: state.games.sudoku.level,
        verbalProcessing: state.games.wordspeed.level,
        calculation: state.games.anzan.level,
        focus: state.games.boggle.level,
        workingMemory: state.games.zebra.level
      };
    },

    getWeakestGame: () => {
      const state = get();
      const list = [
        {
          gameId: 'boggle' as GameId,
          skillName: 'Boggle (Visual Lexical Search)',
          level: state.games.boggle.level,
          mastery: state.games.boggle.mastery,
          gamesPlayed: state.games.boggle.gamesPlayed
        },
        {
          gameId: 'zebra' as GameId,
          skillName: 'Puzzles (Complex Reasoning)',
          level: state.games.zebra.level,
          mastery: state.games.zebra.mastery,
          gamesPlayed: state.games.zebra.gamesPlayed
        },
        {
          gameId: 'sudoku' as GameId,
          skillName: 'Sudoku Reflex (Constraint Logic)',
          level: state.games.sudoku.level,
          mastery: state.games.sudoku.mastery,
          gamesPlayed: state.games.sudoku.gamesPlayed
        },
        {
          gameId: 'wordspeed' as GameId,
          skillName: 'Word Speed (Verbal Processing)',
          level: state.games.wordspeed.level,
          mastery: state.games.wordspeed.mastery,
          gamesPlayed: state.games.wordspeed.gamesPlayed
        },
        {
          gameId: 'anzan' as GameId,
          skillName: 'Pro Calculations (Mental Arithmetic)',
          level: state.games.anzan.level,
          mastery: state.games.anzan.mastery,
          gamesPlayed: state.games.anzan.gamesPlayed
        }
      ];

      // Prioritize lowest level, then lowest mastery
      list.sort((a, b) => a.level - b.level || a.mastery - b.mastery || a.gamesPlayed - b.gamesPlayed);
      const weakest = list[0];

      return {
        gameId: weakest.gameId,
        skillName: weakest.skillName,
        level: weakest.level,
        mastery: weakest.mastery,
        reason: `Your biggest opportunity: Level ${weakest.level} (${weakest.mastery}% mastery). Training this area balances overall exam throughput.`
      };
    },

    getMindMixLevel: () => {
      const state = get();
      return calculateMindMixLevel(state.getLevelsMap());
    },

    resetAllProgress: () => {
      progressStorage.clearProgress();
      historyStorage.clearHistory();
      const fresh = progressStorage.getProgress();
      set({
        games: fresh.games,
        attempts: []
      });
      usePlayerStore.getState().resetPlayerState();
    }
  };
});
