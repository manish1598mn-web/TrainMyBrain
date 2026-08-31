import { GameId } from '../../engine/game-engine/types';

export interface DuelChallenge {
  duelId: string;
  gameId: GameId;
  level: number;
  seed: string;
  creatorName: string;
  creatorTimeMs: number;
  creatorAccuracy: number;
  creatorScore: number;
  createdAt: number;
}

export interface DuelComparison {
  isDuel: boolean;
  creatorName: string;
  creatorTimeMs: number;
  creatorAccuracy: number;
  playerTimeMs: number;
  playerAccuracy: number;
  verdict: 'VICTORY' | 'DEFEAT' | 'TIED';
  timeDeltaMs: number;       // negative means player was faster
  accuracyDelta: number;     // positive means player was more accurate
}
