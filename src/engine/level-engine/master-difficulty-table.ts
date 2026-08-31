import { GameId } from '../game-engine/types';
import { calculateDifficultyBudget, isMilestoneLevel } from './difficulty-recipes';
import {
  getAnzanHumanTiming,
  getWordSpeedHumanTiming,
  getBoggleHumanTiming,
  getSudokuHumanTiming,
  getZebraHumanTiming,
  ChallengeDifficultyModel
} from './human-time-model';

export interface LevelRulebookEntry {
  level: number;
  budget: number;
  isMilestone: boolean;
  primaryGrowthDimension: string;
  recipe: Record<string, any>;
  timing: {
    targetSolveTimeMs: number;
    minimumHumanTimeMs: number;
    maximumHumanTimeMs?: number;
    displayFloorMs?: number;
  };
}

/**
 * Dimension Alternation Ladder:
 * Ensures consecutive levels vary their growth dimension so training feels engaging and balanced.
 */
export function getGrowthDimension(level: number, gameId: GameId): string {
  const mod = level % 5;
  switch (gameId) {
    case 'anzan':
      if (mod === 1) return 'Number Count (Sequence Length)';
      if (mod === 2) return 'Memory Buffer Load';
      if (mod === 3) return 'Digit Magnitude (1 -> 2 -> 3 digits)';
      if (mod === 4) return 'Operation Complexity (+ / - Mixed)';
      return 'Flash Rhythm & Pace';

    case 'wordspeed':
      if (mod === 1) return 'Word Length & Recognition (3 -> 12 letters)';
      if (mod === 2) return 'Orthographic Distractor Similarity';
      if (mod === 3) return 'Semantic Decisions (Synonym / Category)';
      if (mod === 4) return 'Multi-Mode Verbal Sprint (Scramble / Recall)';
      return 'Verbal Processing Throughput';

    case 'boggle':
      if (mod === 1) return 'Grid Size & Board Density (4x4 -> 5x5)';
      if (mod === 2) return 'Word Length Constraints (3 -> 6+ letters)';
      if (mod === 3) return 'Adjacent Path Complexity & Diagonal Links';
      if (mod === 4) return 'Lexical Discovery Speed & Combo Multipliers';
      return 'Visual-Spatial Search Throughput';

    case 'sudoku':
      if (mod === 1) return 'Candidate Clue Elimination';
      if (mod === 2) return 'Hidden Single Deduction Depth';
      if (mod === 3) return 'Naked Pair & Cross-Hatching';
      if (mod === 4) return 'Box Reduction & Multi-Constraint';
      return 'Reflex Execution Flow';

    case 'zebra':
      if (mod === 1) return 'Entity Count (3 -> 4 -> 5 Houses)';
      if (mod === 2) return 'Attribute Complexity (Color/Drink/Pet)';
      if (mod === 3) return 'Comparative & Positional Clues';
      if (mod === 4) return 'Negative Exclusion Constraints';
      return 'Multi-Hop Transitive Deduction';
  }
}

/**
 * Master Rulebook Builder for Level 1 to 99
 */
export function getMasterRulebookEntry(gameId: GameId, level: number): LevelRulebookEntry {
  const safeLevel = Math.max(1, Math.min(120, level));
  const budget = calculateDifficultyBudget(safeLevel);
  const isMilestone = isMilestoneLevel(safeLevel);
  const primaryDimension = getGrowthDimension(safeLevel, gameId);

  let recipe: Record<string, any> = {};
  let timing: any = {};

  switch (gameId) {
    case 'anzan': {
      // Dimension scaling
      let stepsPerRound = 3;
      if (safeLevel >= 60) stepsPerRound = Math.min(12, 7 + Math.floor((safeLevel - 60) / 8));
      else if (safeLevel >= 30) stepsPerRound = 5 + Math.floor((safeLevel - 30) / 15);
      else if (safeLevel >= 10) stepsPerRound = 4;

      let digitCount: 1 | 2 | 3 = 1;
      if (safeLevel >= 70) digitCount = 3;
      else if (safeLevel >= 20) digitCount = 2;

      const hasSubtraction = safeLevel >= 15;
      const timingModel = getAnzanHumanTiming(digitCount, stepsPerRound, hasSubtraction, safeLevel);

      recipe = {
        totalRounds: safeLevel <= 10 ? 3 : safeLevel <= 50 ? 4 : 5,
        stepsPerRound,
        digitCount,
        allowSubtraction: hasSubtraction,
        flashDurationMs: timingModel.flashDurationMs,
        pauseBetweenMs: timingModel.pauseBetweenMs
      };

      timing = {
        targetSolveTimeMs: timingModel.targetSolveTimeMs,
        minimumHumanTimeMs: timingModel.minimumHumanTimeMs,
        displayFloorMs: digitCount === 1 ? 500 : digitCount === 2 ? 700 : 1000
      };
      break;
    }

    case 'wordspeed': {
      const totalQuestions = safeLevel <= 10 ? 15 : safeLevel <= 40 ? 18 : 20;
      const timingModel = getWordSpeedHumanTiming(totalQuestions, 'mixed', safeLevel);

      recipe = {
        totalQuestions,
        wordLengthMin: safeLevel <= 10 ? 3 : safeLevel <= 30 ? 4 : 5,
        wordLengthMax: safeLevel <= 10 ? 8 : safeLevel <= 40 ? 10 : 12,
        optionsCount: safeLevel <= 5 ? 3 : 4
      };

      timing = {
        targetSolveTimeMs: timingModel.targetSolveTimeMs,
        minimumHumanTimeMs: timingModel.minimumHumanTimeMs,
        maximumHumanTimeMs: timingModel.maximumHumanTimeMs
      };
      break;
    }

    case 'boggle': {
      const gridSize: 4 | 5 = safeLevel >= 30 ? 5 : 4;
      const targetWords = Math.min(15, Math.max(5, 5 + Math.floor(safeLevel / 8)));
      const minWordLength = safeLevel >= 25 ? 4 : 3;
      const timingModel = getBoggleHumanTiming(gridSize, targetWords);

      recipe = {
        gridSize,
        minWordLength,
        targetWords,
        sessionDurationSec: 60
      };

      timing = {
        targetSolveTimeMs: timingModel.targetSolveTimeMs,
        minimumHumanTimeMs: timingModel.minimumHumanTimeMs,
        maximumHumanTimeMs: timingModel.maximumHumanTimeMs
      };
      break;
    }

    case 'sudoku': {
      let deductionDepth: 2 | 3 | 4 = 2;
      if (safeLevel >= 60) deductionDepth = 4;
      else if (safeLevel >= 25) deductionDepth = 3;

      const trialsCount = Math.min(8, Math.max(4, 4 + Math.floor(safeLevel / 20)));
      const timingModel = getSudokuHumanTiming(trialsCount, deductionDepth);

      recipe = {
        gridSize: 9,
        trialsCount,
        deductionDepth,
        clueDensity: Number(Math.max(0.24, 0.38 - (safeLevel / 100) * 0.12).toFixed(2))
      };

      timing = {
        targetSolveTimeMs: timingModel.targetSolveTimeMs,
        minimumHumanTimeMs: timingModel.minimumHumanTimeMs,
        maximumHumanTimeMs: timingModel.maximumHumanTimeMs
      };
      break;
    }

    case 'zebra': {
      const housesCount: 4 | 5 = safeLevel >= 30 ? 5 : 4;
      const attributesCount: 3 | 4 = safeLevel >= 40 ? 4 : 3;

      let clueComplexity: 'adjacent' | 'comparative' | 'negative' | 'multi_hop' = 'adjacent';
      if (safeLevel >= 70) clueComplexity = 'multi_hop';
      else if (safeLevel >= 45) clueComplexity = 'negative';
      else if (safeLevel >= 20) clueComplexity = 'comparative';

      const timingModel = getZebraHumanTiming(housesCount, attributesCount, clueComplexity);

      recipe = {
        housesCount,
        attributesCount,
        clueComplexity,
        reflexExercisesCount: Math.min(7, Math.max(4, 4 + Math.floor(safeLevel / 25)))
      };

      timing = {
        targetSolveTimeMs: timingModel.targetSolveTimeMs,
        minimumHumanTimeMs: timingModel.minimumHumanTimeMs,
        maximumHumanTimeMs: timingModel.maximumHumanTimeMs
      };
      break;
    }
  }

  return {
    level: safeLevel,
    budget,
    isMilestone,
    primaryGrowthDimension: primaryDimension,
    recipe,
    timing
  };
}
