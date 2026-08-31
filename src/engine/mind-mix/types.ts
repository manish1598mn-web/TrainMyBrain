import { GameId } from '../game-engine/types';

export interface MindMixRoundConfig {
  gameId: GameId;
  name: string;
  skillName: string;
  level: number; // The user's individual game level
  durationSec: number;
}

export interface MindMixRoundResult {
  gameId: GameId;
  level: number;
  accuracy: number;
  timeMs: number;
  mistakes: number;
  transitionLatencyMs?: number;
}

export interface MentalSwitchingMetrics {
  switchingScore: number;       // 0 - 100
  averageTransitionLatencyMs: number;
  switchAccuracyDropPercent: number;
  cognitiveAgilityTier: 'Master' | 'Skilled' | 'Developing' | 'Calibrating';
  summary: string;
}

export interface MindMixSessionResult {
  mindMixLevel: number;
  overallAccuracy: number;
  totalTimeMs: number;
  totalScore: number;
  switchingMetrics: MentalSwitchingMetrics;
  roundResults: MindMixRoundResult[];
  newMindMixMastery: number;
  previousMindMixMastery: number;
  masteryDelta: number;
}
