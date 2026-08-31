import { GameId } from '../game-engine/types';
import {
  getAnzanHumanTiming,
  getWordSpeedHumanTiming,
  getStroopHumanTiming,
  getSudokuHumanTiming,
  getZebraHumanTiming
} from './human-time-model';

export interface BaseDifficultyRecipe {
  level: number;
  difficultyBudget: number; // 10 -> 1000+ nonlinear difficulty score
  progressRatio: number;   // 0.0 at level 1, 1.0 at level 99
  isMilestoneLevel: boolean; // Level 11, 21, 31, 41, 51, 61, 71, 81, 91 (1.5x complexity shift)
  complexity: number;
  speedFactor: number;
  memoryLoad: number;
  distraction: number;
}

export interface WordSpeedDifficultyRecipe extends BaseDifficultyRecipe {
  totalQuestions: number;
  allowedModes: Array<'word_match' | 'odd_word' | 'basic_meaning' | 'category_rush' | 'word_scramble' | 'word_recall'>;
  wordLengthMin: number;
  wordLengthMax: number;
  optionsCount: number;
  targetTimeMs: number;
  evaluatedCost: number;
}

export interface BoggleDifficultyRecipe extends BaseDifficultyRecipe {
  gridSize: 4 | 5;
  sessionDurationSec: number;
  minWordLength: number;
  targetWordsCount: number;
  evaluatedCost: number;
}

export type StroopDifficultyRecipe = BoggleDifficultyRecipe;

export interface AnzanDifficultyRecipe extends BaseDifficultyRecipe {
  totalRounds: number;
  stepsPerRound: number;
  digitCount: 1 | 2 | 3;
  flashDurationMs: number;
  pauseBetweenMs: number;
  allowSubtraction: boolean;
  allowedOperators: Array<'+' | '-' | '*' | '/' | '%'>;
  maxMagnitude: number;
  evaluatedCost: number;
}

export interface SudokuDifficultyRecipe extends BaseDifficultyRecipe {
  gridSize: 9;
  clueDensity: number;
  reflexTrialsCount: number;
  deductionDepth: 2 | 3 | 4;
  targetTimeSec: number;
  evaluatedCost: number;
}

export interface ZebraDifficultyRecipe extends BaseDifficultyRecipe {
  housesCount: 4 | 5;
  attributesPerHouse: 3 | 4;
  reflexExercisesCount: number;
  clueComplexity: 'adjacent' | 'comparative' | 'negative' | 'multi_hop';
  targetTimeSec: number;
  evaluatedCost: number;
}

/**
 * Universal Curved Difficulty Budget Calculation
 * Formula: D(L) = Dmin * (Dmax / Dmin)^((L - 1) / 98)
 * Dmin = 10, Dmax = 1000
 */
export function calculateDifficultyBudget(level: number): number {
  const safeLevel = Math.max(1, Math.min(120, level));
  const Dmin = 10;
  const Dmax = 1000;
  
  const exponent = (safeLevel - 1) / 98;
  let budget = Dmin * Math.pow(Dmax / Dmin, exponent);

  // Milestone levels (11, 21, 31, 41, 51, 61, 71, 81, 91) introduce ~1.15x step boost
  const milestoneDecade = Math.floor((safeLevel - 1) / 10);
  if (milestoneDecade > 0) {
    budget *= (1 + milestoneDecade * 0.035);
  }

  return Math.round(budget);
}

export function isMilestoneLevel(level: number): boolean {
  return level > 1 && (level % 10 === 1 || level === 99);
}

export function getBaseDifficulty(level: number): BaseDifficultyRecipe {
  const safeLevel = Math.max(1, level);
  const difficultyBudget = calculateDifficultyBudget(safeLevel);
  const progressRatio = Math.max(0, Math.min(1.0, (safeLevel - 1) / 98));
  const isMilestone = isMilestoneLevel(safeLevel);

  const complexity = Math.min(1.0, difficultyBudget / 1000);
  const speedFactor = Math.min(1.0, Math.pow(progressRatio, 0.85));
  const memoryLoad = Math.min(1.0, complexity);
  const distraction = Math.min(1.0, Math.pow(progressRatio, 0.95));

  return {
    level: safeLevel,
    difficultyBudget,
    progressRatio,
    isMilestoneLevel: isMilestone,
    complexity,
    speedFactor,
    memoryLoad,
    distraction
  };
}

/**
 * Flash Anzan (Pro Calculations) Feature-Cost & Human Time Difficulty Mapper
 * 
 * Rules:
 * - Level 1: At least 7 terms, single/double digits, add and multiply (+, *)
 * - Level 1 to 10: 2 operators (+, *)
 * - Level 10 to 25: 3 operators (+, -, *)
 * - Level 25 to 50: 4 operators (+, -, *, /)
 * - Level 50 to 99+: 5 operators (+, -, *, /, %)
 * - Level 99+: All operators
 */
export function getAnzanRecipe(level: number): AnzanDifficultyRecipe {
  const base = getBaseDifficulty(level);
  const budget = base.difficultyBudget;

  const totalRounds = level <= 3 ? 3 : level <= 20 ? 4 : 5;

  // Step Scaling: At least 7 terms from Level 1, scaling up to 16+
  let stepsPerRound = 7;
  if (level >= 75) stepsPerRound = 14 + Math.min(6, Math.floor((level - 75) / 5)); // 14 - 18 terms
  else if (level >= 50) stepsPerRound = 12 + Math.floor((level - 50) / 12);        // 12 - 13 terms
  else if (level >= 25) stepsPerRound = 10 + Math.floor((level - 25) / 12);        // 10 - 11 terms
  else if (level >= 10) stepsPerRound = 8 + Math.floor((level - 10) / 7);          // 8 - 9 terms
  else stepsPerRound = 7;                                                          // 7 terms (Level 1-9)

  // Digit Complexity: Single and double digits from Level 1
  let digitCount: 1 | 2 | 3 = 1;
  if (level >= 70 || budget >= 400) digitCount = 3;
  else if (level >= 10 || budget >= 35) digitCount = 2;
  else digitCount = 1;

  // Operator Tier Breakdown
  const allowMultiplication = true;          // Active from Level 1
  const allowSubtraction = level >= 10;      // 3 operators (Level 10 - 25)
  const allowDivision = level >= 25;         // 4 operators (Level 25 - 50)
  const allowPercentageOrModulo = level >= 50; // 5 operators (Level 50 - 99+)

  const allowedOperators: Array<'+' | '-' | '*' | '/' | '%'> = ['+', '*'];
  if (allowSubtraction) allowedOperators.push('-');
  if (allowDivision) allowedOperators.push('/');
  if (allowPercentageOrModulo) allowedOperators.push('%');

  const maxMagnitude = digitCount === 1 ? 9 : digitCount === 2 ? 89 : 450;
  const hasAdvancedOperators = allowedOperators.some(op => op === '*' || op === '/' || op === '%');

  const timingModel = getAnzanHumanTiming(digitCount, stepsPerRound, allowSubtraction, level, hasAdvancedOperators);

  let evaluatedCost = (digitCount === 1 ? 5 : digitCount === 2 ? 15 : 35) * stepsPerRound;
  evaluatedCost += (stepsPerRound - 2) * 8;
  if (allowSubtraction) evaluatedCost += 15;
  if (allowMultiplication) evaluatedCost += 25;
  if (allowDivision) evaluatedCost += 35;
  if (allowPercentageOrModulo) evaluatedCost += 35;

  return {
    ...base,
    totalRounds,
    stepsPerRound,
    digitCount,
    flashDurationMs: timingModel.flashDurationMs,
    pauseBetweenMs: timingModel.pauseBetweenMs,
    allowSubtraction,
    allowedOperators,
    maxMagnitude,
    evaluatedCost
  };
}

/**
 * Word Speed Feature-Cost & Human Time Difficulty Mapper
 *
 * Trains verbal processing, orthographic discrimination, semantic classification and recall.
 */
export function getWordSpeedRecipe(level: number): WordSpeedDifficultyRecipe {
  const base = getBaseDifficulty(level);
  const budget = base.difficultyBudget;

  const totalQuestions = level <= 10 ? 15 : level <= 40 ? 18 : 20;

  let allowedModes: Array<'word_match' | 'odd_word' | 'basic_meaning' | 'category_rush' | 'word_scramble' | 'word_recall'> = [
    'word_match', 'odd_word', 'basic_meaning'
  ];
  if (level >= 11 && level <= 20) {
    allowedModes = ['word_match', 'odd_word', 'category_rush'];
  } else if (level >= 21 && level <= 40) {
    allowedModes = ['word_match', 'odd_word', 'basic_meaning', 'category_rush', 'word_scramble'];
  } else if (level >= 41) {
    allowedModes = ['word_match', 'odd_word', 'basic_meaning', 'category_rush', 'word_scramble', 'word_recall'];
  }

  const wordLengthMin = level <= 10 ? 3 : level <= 30 ? 4 : 5;
  const wordLengthMax = level <= 10 ? 8 : level <= 40 ? 10 : 12;
  const optionsCount = level <= 5 ? 3 : 4;

  const timingModel = getWordSpeedHumanTiming(totalQuestions, 'mixed', level);

  let evaluatedCost = totalQuestions * 8 + (optionsCount * 6) + (allowedModes.length * 10);

  return {
    ...base,
    totalQuestions,
    allowedModes,
    wordLengthMin,
    wordLengthMax,
    optionsCount,
    targetTimeMs: timingModel.targetSolveTimeMs,
    evaluatedCost
  };
}

/**
 * Boggle (Visual Lexical Search) Feature-Cost Difficulty Mapper
 */
export function getBoggleRecipe(level: number): BoggleDifficultyRecipe {
  const base = getBaseDifficulty(level);
  const budget = base.difficultyBudget;

  const gridSize: 4 | 5 = budget >= 300 ? 5 : 4;
  const minWordLength = budget >= 150 ? 4 : 3;
  const targetWordsCount = Math.min(15, Math.max(5, 5 + Math.floor(budget / 70)));
  const sessionDurationSec = 60;

  let evaluatedCost = 25 + (gridSize === 5 ? 50 : 0) + (targetWordsCount * 5);

  return {
    ...base,
    gridSize,
    sessionDurationSec,
    minWordLength,
    targetWordsCount,
    evaluatedCost: Math.round(evaluatedCost)
  };
}

export const getStroopRecipe = getBoggleRecipe;

/**
 * Sudoku Reflex Feature-Cost Difficulty Mapper
 */
export function getSudokuRecipe(level: number): SudokuDifficultyRecipe {
  const base = getBaseDifficulty(level);
  const budget = base.difficultyBudget;

  const gridSize: 9 = 9;
  const clueDensity = Number(Math.max(0.24, 0.38 - (budget / 1000) * 0.14).toFixed(2));
  
  let reflexTrialsCount = 4;
  if (budget >= 250) reflexTrialsCount = Math.min(8, 6 + Math.floor((budget - 250) / 200));
  else if (budget >= 80) reflexTrialsCount = 5 + Math.floor((budget - 80) / 100);

  let deductionDepth: 2 | 3 | 4 = 2;
  if (budget >= 200) deductionDepth = 4;
  else if (budget >= 40) deductionDepth = 3;

  const timingModel = getSudokuHumanTiming(reflexTrialsCount, deductionDepth);

  let evaluatedCost = 30 + (reflexTrialsCount * 12) + (deductionDepth === 4 ? 75 : deductionDepth === 3 ? 45 : 20);

  return {
    ...base,
    gridSize,
    clueDensity,
    reflexTrialsCount,
    deductionDepth,
    targetTimeSec: Math.round(timingModel.targetSolveTimeMs / 1000),
    evaluatedCost
  };
}

/**
 * Zebra / Logic Puzzles Feature-Cost Difficulty Mapper
 */
export function getZebraRecipe(level: number): ZebraDifficultyRecipe {
  const base = getBaseDifficulty(level);
  const budget = base.difficultyBudget;

  const housesCount: 4 | 5 = budget >= 50 ? 5 : 4;
  const attributesPerHouse: 3 | 4 = budget >= 60 ? 4 : 3;

  let reflexExercisesCount = 4;
  if (budget >= 250) reflexExercisesCount = Math.min(7, 5 + Math.floor((budget - 250) / 200));
  else if (budget >= 50) reflexExercisesCount = 5;

  let clueComplexity: 'adjacent' | 'comparative' | 'negative' | 'multi_hop' = 'adjacent';
  if (budget >= 300) clueComplexity = 'multi_hop';
  else if (budget >= 100) clueComplexity = 'negative';
  else if (budget >= 35) clueComplexity = 'comparative';

  const timingModel = getZebraHumanTiming(housesCount, attributesPerHouse, clueComplexity);

  let evaluatedCost = (housesCount === 5 ? 55 : 20) + (attributesPerHouse === 4 ? 50 : 20) + (reflexExercisesCount * 12);

  return {
    ...base,
    housesCount,
    attributesPerHouse,
    reflexExercisesCount,
    clueComplexity,
    targetTimeSec: Math.round(timingModel.targetSolveTimeMs / 1000),
    evaluatedCost
  };
}
