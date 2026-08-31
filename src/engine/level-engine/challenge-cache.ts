import { GameId } from '../game-engine/types';

/**
 * 32-bit FNV-1a Hashing Algorithm
 * Produces fast, deterministic fingerprint hashes for any generated challenge object or string.
 */
export function hashChallengeContent(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

const MAX_HISTORY_PER_GAME = 120;
const memoryHashCache: Record<GameId, string[]> = {
  wordspeed: [],
  boggle: [],
  anzan: [],
  sudoku: [],
  zebra: []
};

/**
 * Checks if a generated challenge hash is unique or was recently served.
 */
export function isChallengeUnique(gameId: GameId, challengeHash: string): boolean {
  const history = memoryHashCache[gameId] || [];
  return !history.includes(challengeHash);
}

/**
 * Records a served challenge hash in the recent history cache.
 */
export function recordChallengeHash(gameId: GameId, challengeHash: string): void {
  if (!memoryHashCache[gameId]) {
    memoryHashCache[gameId] = [];
  }
  const history = memoryHashCache[gameId];
  history.unshift(challengeHash);
  if (history.length > MAX_HISTORY_PER_GAME) {
    history.pop();
  }
}

/**
 * Clears the de-duplication cache (for testing or profile resets).
 */
export function clearChallengeCache(): void {
  for (const k of Object.keys(memoryHashCache) as GameId[]) {
    memoryHashCache[k] = [];
  }
}
