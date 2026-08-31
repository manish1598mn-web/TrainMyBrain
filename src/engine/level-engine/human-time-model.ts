import { GameId } from '../game-engine/types';

export interface ChallengeDifficultyModel {
  cognitiveLoad: number;       // 0 - 100
  memoryLoad: number;          // 0 - 100
  visualLoad: number;          // 0 - 100
  decisionLoad: number;        // 0 - 100
  timePressure: number;        // 0 - 100 (Capped)
  estimatedDifficulty: number; // 10 - 1000+
  minimumHumanTimeMs: number;  // Hard physical human perception floor
  targetSolveTimeMs: number;   // Recommended benchmark time for 85% mastery
  maximumHumanTimeMs: number;  // Generous timeout boundary
  targetAccuracy: number;      // 75% - 90%
}

/**
 * Universal Human Timing Floors & Calibration Model
 * Rule: Difficulty ≠ Less Time. Difficulty = More Cognitive Work + Appropriate Time Pressure.
 */
export function getAnzanHumanTiming(
  digitCount: 1 | 2 | 3,
  stepsCount: number,
  hasSubtraction: boolean,
  level: number,
  hasAdvancedOperators: boolean = false
): { flashDurationMs: number; pauseBetweenMs: number; minimumHumanTimeMs: number; targetSolveTimeMs: number } {
  // Hard Human Display Floors by Digit Complexity
  let minFloorMs = 500;
  let baseDisplayMs = 1100;

  if (digitCount === 2) {
    minFloorMs = 700;
    baseDisplayMs = 1200;
  } else if (digitCount === 3) {
    minFloorMs = 1000;
    baseDisplayMs = 1400;
  }

  // Adjust timing based on memory load & operations (Larger cognitive load allows appropriate time!)
  const stepLoadFactor = Math.min(1.3, 1 + (stepsCount - 3) * 0.04);
  const subtractionFactor = hasSubtraction ? 1.15 : 1.0;
  const operatorFactor = hasAdvancedOperators ? 1.25 : 1.0;
  
  // Progress scaling (gentle speed calibration that never breaches human floor)
  const speedScale = Math.max(0.70, 1 - Math.min(0.30, ((level % 10) * 0.03)));

  const calculatedFlashMs = Math.round(baseDisplayMs * stepLoadFactor * subtractionFactor * operatorFactor * speedScale);
  const flashDurationMs = Math.max(minFloorMs, calculatedFlashMs);
  const pauseBetweenMs = Math.max(250, Math.round(flashDurationMs * 0.35));

  const totalStreamDurationMs = (flashDurationMs + pauseBetweenMs) * stepsCount;
  const targetSolveTimeMs = totalStreamDurationMs + (hasAdvancedOperators ? 3500 : 2500); // time to enter answer
  const minimumHumanTimeMs = (minFloorMs + 200) * stepsCount + 1000;

  return {
    flashDurationMs,
    pauseBetweenMs,
    minimumHumanTimeMs,
    targetSolveTimeMs
  };
}

export function getWordSpeedHumanTiming(
  questionCount: number,
  mode: string,
  level: number
): { targetSolveTimeMs: number; minimumHumanTimeMs: number; maximumHumanTimeMs: number } {
  // Verbal processing reaction times per item (1.5s - 3.5s per question)
  let msPerQuestion = 2400;
  if (level <= 10) msPerQuestion = 2800;
  else if (level <= 40) msPerQuestion = 2400;
  else msPerQuestion = 2000;

  const targetSolveTimeMs = Math.round(questionCount * msPerQuestion);
  const minimumHumanTimeMs = Math.round(questionCount * 600); // 600ms per word is absolute minimum reading reflex
  const maximumHumanTimeMs = Math.round(targetSolveTimeMs * 2.5);

  return {
    targetSolveTimeMs,
    minimumHumanTimeMs,
    maximumHumanTimeMs
  };
}

export function getBoggleHumanTiming(
  gridSize: 4 | 5,
  targetWords: number
): { targetSolveTimeMs: number; minimumHumanTimeMs: number; maximumHumanTimeMs: number } {
  // 60-second fixed sprint with lexical search pacing
  const targetSolveTimeMs = 60000;
  const minimumHumanTimeMs = Math.max(15000, targetWords * 2500);
  const maximumHumanTimeMs = 65000;

  return {
    targetSolveTimeMs,
    minimumHumanTimeMs,
    maximumHumanTimeMs
  };
}

export function getStroopHumanTiming(
  conflictRatio: number,
  paletteSize: number,
  hasInvertedRule: boolean
): { trialTimeLimitMs: number; targetSolveTimeMs: number; minimumHumanTimeMs: number } {
  return {
    trialTimeLimitMs: 1800,
    targetSolveTimeMs: 60000,
    minimumHumanTimeMs: 15000
  };
}

export function getSudokuHumanTiming(
  trialsCount: number,
  deductionDepth: 2 | 3 | 4
): { targetSolveTimeMs: number; minimumHumanTimeMs: number; maximumHumanTimeMs: number } {
  // Reflex single cell deduction: 10s - 25s per cell depending on depth
  const secPerTrial = deductionDepth === 4 ? 22 : deductionDepth === 3 ? 15 : 10;
  const targetSolveTimeMs = trialsCount * secPerTrial * 1000;
  const minimumHumanTimeMs = trialsCount * 3500;
  const maximumHumanTimeMs = targetSolveTimeMs * 2.5;

  return {
    targetSolveTimeMs,
    minimumHumanTimeMs,
    maximumHumanTimeMs
  };
}

export function getZebraHumanTiming(
  housesCount: 4 | 5,
  attributesCount: 3 | 4,
  clueComplexity: 'adjacent' | 'comparative' | 'negative' | 'multi_hop'
): { targetSolveTimeMs: number; minimumHumanTimeMs: number; maximumHumanTimeMs: number } {
  // Structured reasoning timing
  let baseSeconds = 55;
  if (housesCount === 5) baseSeconds += 25;
  if (attributesCount === 4) baseSeconds += 25;
  if (clueComplexity === 'multi_hop') baseSeconds += 40;
  else if (clueComplexity === 'negative') baseSeconds += 20;

  const targetSolveTimeMs = baseSeconds * 1000;
  const minimumHumanTimeMs = Math.round(baseSeconds * 0.35 * 1000);
  const maximumHumanTimeMs = targetSolveTimeMs * 3;

  return {
    targetSolveTimeMs,
    minimumHumanTimeMs,
    maximumHumanTimeMs
  };
}
