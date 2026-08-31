import { safeGetItem, safeSetItem, safeRemoveItem, STORAGE_KEYS } from './baseStorage';
import { GameId, GameProgress } from '../../engine/game-engine/types';

export interface ProgressData {
  games: Record<GameId, GameProgress>;
}

const defaultProgress: ProgressData = {
  games: {
    sudoku: {
      gameId: 'sudoku',
      level: 1,
      mastery: 25,
      bestScore: 0,
      bestTimeMs: 0,
      averageTimeMs: 0,
      averageAccuracy: 0,
      baselineTimeMs: 0,
      baselineImprovementPercent: 0,
      recentPerformances: [],
      recentAccuracies: [],
      attemptsAtCurrentLevel: 0,
      speedAccuracyScore: 0,
      gamesPlayed: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPlayed: 0
    },
    zebra: {
      gameId: 'zebra',
      level: 1,
      mastery: 25,
      bestScore: 0,
      bestTimeMs: 0,
      averageTimeMs: 0,
      averageAccuracy: 0,
      baselineTimeMs: 0,
      baselineImprovementPercent: 0,
      recentPerformances: [],
      recentAccuracies: [],
      attemptsAtCurrentLevel: 0,
      speedAccuracyScore: 0,
      gamesPlayed: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPlayed: 0
    },
    wordspeed: {
      gameId: 'wordspeed',
      level: 1,
      mastery: 25,
      bestScore: 0,
      bestTimeMs: 0,
      averageTimeMs: 0,
      averageAccuracy: 0,
      baselineTimeMs: 0,
      baselineImprovementPercent: 0,
      recentPerformances: [],
      recentAccuracies: [],
      attemptsAtCurrentLevel: 0,
      speedAccuracyScore: 0,
      gamesPlayed: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPlayed: 0
    },
    anzan: {
      gameId: 'anzan',
      level: 1,
      mastery: 25,
      bestScore: 0,
      bestTimeMs: 0,
      averageTimeMs: 0,
      averageAccuracy: 0,
      baselineTimeMs: 0,
      baselineImprovementPercent: 0,
      recentPerformances: [],
      recentAccuracies: [],
      attemptsAtCurrentLevel: 0,
      speedAccuracyScore: 0,
      gamesPlayed: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPlayed: 0
    },
    boggle: {
      gameId: 'boggle',
      level: 1,
      mastery: 25,
      bestScore: 0,
      bestTimeMs: 0,
      averageTimeMs: 0,
      averageAccuracy: 0,
      baselineTimeMs: 0,
      baselineImprovementPercent: 0,
      recentPerformances: [],
      recentAccuracies: [],
      attemptsAtCurrentLevel: 0,
      speedAccuracyScore: 0,
      gamesPlayed: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPlayed: 0
    }
  }
};

export const progressStorage = {
  getProgress: (): ProgressData => {
    const rawData = safeGetItem<any>(STORAGE_KEYS.PROGRESS, defaultProgress);
    const data: ProgressData = { games: { ...defaultProgress.games, ...rawData.games } };

    // Migrate from legacy 'schulte' key if present
    if (rawData.games?.schulte && !rawData.games?.wordspeed) {
      data.games.wordspeed = {
        ...rawData.games.schulte,
        gameId: 'wordspeed'
      };
    }

    // Migrate from legacy 'stroop' key if present
    if (rawData.games?.stroop && !rawData.games?.boggle) {
      data.games.boggle = {
        ...rawData.games.stroop,
        gameId: 'boggle'
      };
    }

    // Ensure all 5 games exist and have complete properties
    for (const g of ['sudoku', 'zebra', 'wordspeed', 'anzan', 'boggle'] as GameId[]) {
      if (!data.games[g]) {
        data.games[g] = defaultProgress.games[g];
      } else {
        data.games[g] = {
          ...defaultProgress.games[g],
          ...data.games[g],
          mastery: data.games[g].mastery ?? 25,
          recentPerformances: data.games[g].recentPerformances || [],
          recentAccuracies: data.games[g].recentAccuracies || []
        };
      }
    }
    return data;
  },

  saveProgress: (data: ProgressData): void => {
    safeSetItem(STORAGE_KEYS.PROGRESS, data);
  },

  clearProgress: (): void => {
    safeRemoveItem(STORAGE_KEYS.PROGRESS);
  }
};
