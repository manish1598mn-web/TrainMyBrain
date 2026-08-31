import { safeGetItem, safeSetItem, safeRemoveItem, STORAGE_KEYS } from './baseStorage';
import { GameAttempt } from '../../engine/game-engine/types';

export const historyStorage = {
  getAttempts: (): GameAttempt[] => {
    return safeGetItem<GameAttempt[]>(STORAGE_KEYS.HISTORY, []);
  },

  addAttempt: (attempt: GameAttempt): void => {
    const attempts = safeGetItem<GameAttempt[]>(STORAGE_KEYS.HISTORY, []);
    attempts.unshift(attempt);
    // Keep bounded history of last 150 attempts to avoid unbounded growth
    if (attempts.length > 150) {
      attempts.pop();
    }
    safeSetItem(STORAGE_KEYS.HISTORY, attempts);
  },

  clearHistory: (): void => {
    safeRemoveItem(STORAGE_KEYS.HISTORY);
  }
};
