import { GameId, GamePerformance } from '../game-engine/types';

export interface PerformanceComponents {
  accuracy: number;        // 0 - 100
  speedScore: number;      // 0 - 100 (relative to level target)
  difficultyScore: number; // 0 - 100 (based on recipe complexity)
  consistencyScore: number;// 0 - 100 (rolling standard deviation)
  performanceScore: number;// 0 - 100 (weighted composite)
}

/**
 * Game-Specific Component Weighting Matrix (Layer 1)
 */
export const GAME_WEIGHTS: Record<GameId, { accuracy: number; speed: number; difficulty: number; consistency: number }> = {
  anzan:     { accuracy: 0.55, speed: 0.20, difficulty: 0.15, consistency: 0.10 },
  wordspeed: { accuracy: 0.50, speed: 0.25, difficulty: 0.15, consistency: 0.10 },
  boggle:    { accuracy: 0.45, speed: 0.35, difficulty: 0.10, consistency: 0.10 },
  sudoku:    { accuracy: 0.45, speed: 0.20, difficulty: 0.25, consistency: 0.10 },
  zebra:     { accuracy: 0.45, speed: 0.20, difficulty: 0.25, consistency: 0.10 }
};

/**
 * Speed Score Normalizer: Evaluates speed relative to calibrated benchmark target
 * speedRatio = targetTime / actualTime
 */
export function calculateSpeedScore(gameId: GameId, level: number, actualTimeMs: number): number {
  const targetMs = getTargetTimeMs(gameId, level);
  const time = Math.max(actualTimeMs, 500);
  const speedRatio = targetMs / time;

  // speedRatio = 1.0 -> 75 pts (meeting target benchmark)
  // speedRatio >= 1.4 -> 95-100 pts (exceptional speed)
  // speedRatio <= 0.6 -> 30-45 pts (slow speed)
  let score = 75 + (speedRatio - 1.0) * 55;
  return Math.round(Math.min(100, Math.max(15, score)));
}

/**
 * Consistency Score: 100 - Normalized Standard Deviation of last 5-10 attempts
 */
export function calculateConsistencyScore(recentPerformances: number[]): number {
  if (!recentPerformances || recentPerformances.length < 2) {
    return 85; // Default healthy baseline for new players
  }

  const sample = recentPerformances.slice(0, 10);
  const mean = sample.reduce((a, b) => a + b, 0) / sample.length;
  const variance = sample.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sample.length;
  const stdDev = Math.sqrt(variance);

  // Low stdDev (e.g. 2-4 pts) -> 92-96 consistency
  // High stdDev (e.g. 15-20 pts) -> 60-70 consistency
  const consistency = 100 - (stdDev * 1.8);
  return Math.round(Math.min(100, Math.max(20, consistency)));
}

/**
 * Difficulty Score: Derives normalized 0-100 difficulty rating from level & recipe
 */
export function calculateDifficultyScore(gameId: GameId, level: number): number {
  const safeLevel = Math.max(1, level);
  // Scales smoothly from 25 at Level 1 to 100 at Level 99+
  const score = 25 + Math.min(75, Math.pow((safeLevel - 1) / 98, 0.95) * 75);
  return Math.round(score);
}

/**
 * Layer 1: Evaluates all 4 components with Game-Specific Weighting
 */
export function evaluatePerformanceComponents(
  gameId: GameId,
  level: number,
  perf: GamePerformance,
  recentPerformances: number[] = []
): PerformanceComponents {
  const accuracy = Math.min(100, Math.max(0, perf.accuracy));
  const speedScore = calculateSpeedScore(gameId, level, perf.timeMs);
  const difficultyScore = calculateDifficultyScore(gameId, level);
  const consistencyScore = perf.consistencyScore ?? calculateConsistencyScore(recentPerformances);

  const weights = GAME_WEIGHTS[gameId] || GAME_WEIGHTS.wordspeed;

  const rawComposite = (
    accuracy * weights.accuracy +
    speedScore * weights.speed +
    difficultyScore * weights.difficulty +
    consistencyScore * weights.consistency
  );

  const performanceScore = Math.round(Math.min(100, Math.max(0, rawComposite)));

  return {
    accuracy,
    speedScore,
    difficultyScore,
    consistencyScore,
    performanceScore
  };
}

export function calculatePerformanceScore(perf: GamePerformance): number {
  const comp = evaluatePerformanceComponents('wordspeed', perf.level, perf);
  return comp.performanceScore;
}

export function calculateGameScore(
  gameId: GameId,
  level: number,
  perf: GamePerformance,
  recentPerformances: number[] = []
): number {
  const baseScore = level * 100;
  const comp = evaluatePerformanceComponents(gameId, level, perf, recentPerformances);
  const accuracyMultiplier = comp.accuracy / 100;
  
  const targetMs = getTargetTimeMs(gameId, level);
  const speedRatio = Math.max(0.6, Math.min(1.8, targetMs / Math.max(perf.timeMs, 1000)));

  const rawScore = (baseScore + comp.performanceScore * 12) * accuracyMultiplier * speedRatio;
  return Math.max(100, Math.round(rawScore));
}

export function getTargetTimeMs(gameId: GameId, level: number): number {
  switch (gameId) {
    case 'wordspeed':
      return Math.max(18000, 36000 - level * 120);
    case 'boggle':
      return 60000;
    case 'anzan':
      return Math.max(6000, 18000 - level * 110);
    case 'sudoku':
      return Math.max(18000, 42000 - level * 180);
    case 'zebra':
      return Math.max(22000, 55000 - level * 250);
    default:
      return 25000;
  }
}

export function generateCognitiveInsight(
  gameId: GameId,
  perf: GamePerformance,
  previousAvgTimeMs?: number,
  baselineTimeMs?: number
): string {
  const isHighAccuracy = perf.accuracy >= 90;
  const isFaster = previousAvgTimeMs ? perf.timeMs < previousAvgTimeMs : false;

  let baselineDelta = 0;
  if (baselineTimeMs && baselineTimeMs > 0) {
    baselineDelta = Math.round(((baselineTimeMs - perf.timeMs) / baselineTimeMs) * 100);
  }

  if (isHighAccuracy && baselineDelta > 15) {
    return `Phenomenal throughput! You are ${baselineDelta}% faster than your initial baseline with pristine ${perf.accuracy}% accuracy.`;
  } else if (isHighAccuracy && isFaster) {
    return 'Superb performance! Both precision and decision speed increased, establishing strong neural automation.';
  } else if (isHighAccuracy) {
    return 'Flawless precision achieved! To build higher exam throughput, try maintaining this accuracy while increasing tap cadence.';
  } else if (perf.accuracy >= 70) {
    return 'Solid passing run! Focus on minimizing hasty false choices to elevate accuracy above 90% for bonus mastery.';
  } else {
    return 'Accuracy is the primary foundation of speed. Slow down slightly to identify the correct constraint pattern before responding.';
  }
}
