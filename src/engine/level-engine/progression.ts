import { GameId, GamePerformance } from '../game-engine/types';
import { evaluatePerformanceComponents, PerformanceComponents } from '../scoring-engine/scoring';

export interface ProgressionResult {
  currentLevel: number;
  newLevel: number;
  levelDelta: number;
  leveledUp: boolean;
  accuracyPassed: boolean;
  mastery: number;         // 0 - 100%
  previousMastery: number; // 0 - 100%
  masteryDelta: number;    // e.g. +6%
  components: PerformanceComponents;
  adaptiveRank: string;
  reason: string;
}

/**
 * Universal 4-Layer Mastery & Progression Engine (Layer 2)
 *
 * 1. Performance = Game-specific weighted composite (Accuracy, Speed, Difficulty, Consistency)
 * 2. Mastery = (OldMastery * 0.70) + (CurrentPerformance * 0.30)
 * 3. Accuracy Gate: <70% accuracy blocks progression / decreases mastery
 * 4. Level-Up Gate: Mastery >= 85% AND Accuracy >= 85% AND >= 3 successful attempts at level
 */
export function calculateNextLevel(
  gameId: GameId,
  currentLevel: number,
  previousMastery: number,
  attemptsAtLevel: number,
  perf: GamePerformance,
  recentPerformances: number[] = []
): ProgressionResult {
  const components = evaluatePerformanceComponents(gameId, currentLevel, perf, recentPerformances);
  const accuracy = components.accuracy;
  const performance = components.performanceScore;

  let newMastery = previousMastery;
  let masteryDelta = 0;

  // Strict Accuracy Gate (< 70% accuracy blocks mastery gain)
  if (accuracy < 70) {
    // Penalty for inaccurate guessing
    newMastery = Math.max(0, Math.round(previousMastery * 0.95 - 2));
    masteryDelta = newMastery - previousMastery;

    return {
      currentLevel,
      newLevel: currentLevel,
      levelDelta: 0,
      leveledUp: false,
      accuracyPassed: false,
      mastery: newMastery,
      previousMastery,
      masteryDelta,
      components,
      adaptiveRank: getRankTitle(currentLevel),
      reason: 'Accuracy was under 70%. Accuracy takes precedence over speed to build mastery.'
    };
  }

  // Exponentially Weighted Rolling Mastery: (Old * 0.70) + (Perf * 0.30)
  const accuracyBonusMultiplier = accuracy >= 95 ? 1.05 : accuracy >= 90 ? 1.0 : accuracy >= 80 ? 0.95 : 0.85;
  const weightedPerformance = performance * accuracyBonusMultiplier;
  
  const rawMastery = (previousMastery === 0 || previousMastery === undefined) 
    ? weightedPerformance 
    : (previousMastery * 0.70) + (weightedPerformance * 0.30);
  newMastery = Math.round(Math.min(100, Math.max(0, rawMastery)));
  masteryDelta = newMastery - previousMastery;

  // Level-Up Gate: Level is passed when Accuracy >= 70%
  // Automatically unlock next level upon completing the current level successfully!
  let leveledUp = false;
  let newLevel = currentLevel;

  if (accuracy >= 70) {
    leveledUp = true;
    newLevel = currentLevel + 1;
  }

  const adaptiveRank = getRankTitle(newLevel);

  let reason = '';
  if (leveledUp) {
    reason = `🎉 Level ${currentLevel} Solved! Unlocked Level ${newLevel} (${performance}/100 Performance).`;
  } else {
    reason = `Accuracy was ${accuracy}%. Achieve ≥ 70% accuracy to unlock Level ${currentLevel + 1}.`;
  }

  return {
    currentLevel,
    newLevel,
    levelDelta: newLevel - currentLevel,
    leveledUp,
    accuracyPassed: accuracy >= 70,
    mastery: newMastery,
    previousMastery,
    masteryDelta,
    components,
    adaptiveRank,
    reason
  };
}

export function getRankTitle(level: number): string {
  if (level >= 99) return 'Grandmaster (99+)';
  if (level >= 80) return 'Extreme';
  if (level >= 65) return 'Elite';
  if (level >= 50) return 'Expert';
  if (level >= 35) return 'Skilled';
  if (level >= 20) return 'Comfortable';
  if (level >= 10) return 'Developing';
  return 'Beginner';
}

export function calculateOverallMindLevel(levels: Record<string, number>): number {
  const values = Object.values(levels);
  if (values.length === 0) return 1;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.max(1, Math.round(sum / values.length));
}
