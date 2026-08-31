/**
 * Level Specification Engine & AI Model Routing Strategy
 * 
 * Translates game engine difficulty budgets into structured LevelSpecifications
 * for machine-readable generation.
 */

import { GameId } from '../../engine/game-engine/types';
import { LevelSpecification } from './types';
import { calculateDifficultyBudget } from '../../engine/level-engine/difficulty-recipes';

export interface AIModelStrategy {
  bulkGenerationModel: string;
  reasoningModel: string;
  explanationModel: string;
  coachModel: string;
}

export const DEFAULT_AI_MODELS: AIModelStrategy = {
  bulkGenerationModel: 'gpt-4o-mini',      // Fast, cost-efficient bulk candidate generator
  reasoningModel: 'gpt-4o',               // High-precision formal logic & complex diagram creator
  explanationModel: 'gpt-4o-mini',        // Responsive, clear conversational explanations
  coachModel: 'gpt-4o-mini'               // User history performance analyzer & recommender
};

/**
 * Builds an explicit, constraint-driven LevelSpecification for any game at any level
 */
export function buildLevelSpecification(gameId: GameId, level: number): LevelSpecification {
  const budget = calculateDifficultyBudget(level);
  const normalizedDifficulty = Math.min(1.0, Number((budget / 1000).toFixed(3)));

  switch (gameId) {
    case 'anzan': {
      const allowedOps = ['+'];
      if (level >= 10) allowedOps.push('-');
      if (level >= 1) allowedOps.push('*');
      if (level >= 25) allowedOps.push('/');
      if (level >= 50) allowedOps.push('%');

      return {
        gameId,
        level,
        difficultyBudget: budget,
        normalizedDifficulty,
        targetSkill: 'Sequential Working Memory Arithmetic',
        constraints: {
          memoryLoad: level <= 10 ? 'low' : level <= 40 ? 'medium' : 'high',
          reasoningLoad: level <= 20 ? 'low' : 'medium',
          timePressure: level <= 15 ? 'low' : 'medium',
          distractionLoad: 'low',
          maxElements: level <= 9 ? 7 : Math.min(16, 7 + Math.floor(level / 7)),
          allowedOperators: allowedOps
        },
        sampleOutputFormat: {
          steps: [
            { value: 4, operator: '+', displayString: '4' },
            { value: 2, operator: '*', displayString: '× 2' },
            { value: 5, operator: '+', displayString: '+ 5' }
          ],
          expectedTotal: 13
        }
      };
    }

    case 'wordspeed': {
      return {
        gameId,
        level,
        difficultyBudget: budget,
        normalizedDifficulty,
        targetSkill: 'Verbal Processing Speed & Semantic Discrimination',
        constraints: {
          memoryLoad: level >= 45 ? 'high' : 'low',
          reasoningLoad: level <= 15 ? 'low' : 'medium',
          timePressure: 'medium',
          distractionLoad: level <= 10 ? 'low' : 'medium',
          maxElements: 4,
          allowedVocabularyTier: level <= 10 ? 'foundational' : level <= 30 ? 'intermediate' : 'advanced'
        },
        sampleOutputFormat: {
          prompt: 'Which word is the OPPOSITE of "BENEFICIAL"?',
          targetWord: 'BENEFICIAL',
          options: ['HARMFUL', 'GENEROUS', 'PLEASANT', 'ACTIVE'],
          correctAnswer: 'HARMFUL',
          explanation: '"Beneficial" means producing good results; its direct antonym is "Harmful".'
        }
      };
    }

    case 'boggle': {
      return {
        gameId,
        level,
        difficultyBudget: budget,
        normalizedDifficulty,
        targetSkill: 'Visual Lexical Graph Search & Spatial Assembly',
        constraints: {
          memoryLoad: 'medium',
          reasoningLoad: 'medium',
          timePressure: 'medium',
          distractionLoad: 'low',
          maxElements: level >= 25 ? 25 : 16
        },
        sampleOutputFormat: {
          gridSize: level >= 25 ? 5 : 4,
          minWordLength: level >= 25 ? 4 : 3,
          minSolveableWordsTarget: level <= 10 ? 15 : 25
        }
      };
    }

    case 'sudoku': {
      return {
        gameId,
        level,
        difficultyBudget: budget,
        normalizedDifficulty,
        targetSkill: 'Constraint Recognition & Candidate Elimination',
        constraints: {
          memoryLoad: 'medium',
          reasoningLoad: level <= 15 ? 'low' : level <= 40 ? 'medium' : 'high',
          timePressure: 'low',
          distractionLoad: 'low',
          maxElements: 9
        },
        sampleOutputFormat: {
          category: 'naked_single_9x9',
          question: 'What is the only legal candidate for cell (Row 3, Col 5)?',
          options: [2, 4, 7, 9],
          correctAnswer: 7,
          explanation: 'Row has [1,2,3], Col has [4,5,6], Box has [8,9]. 7 is the only candidate.'
        }
      };
    }

    case 'zebra': {
      const disciplines = ['logical_relational', 'blood_relations', 'math_cryptarithmetic'];
      if (level >= 6) disciplines.push('mechanical_spatial', 'word_logic_syllogisms');
      if (level >= 12) disciplines.push('visual_diagrammatic');

      return {
        gameId,
        level,
        difficultyBudget: budget,
        normalizedDifficulty,
        targetSkill: 'Multi-Discipline Relational Deduction',
        constraints: {
          memoryLoad: 'medium',
          reasoningLoad: level <= 10 ? 'low' : level <= 30 ? 'medium' : 'high',
          timePressure: 'low',
          distractionLoad: 'low',
          maxElements: 4,
          allowedDisciplines: disciplines
        },
        sampleOutputFormat: {
          discipline: 'mechanical_spatial',
          title: 'Gear Train Rotation',
          premises: ['Gear 1 spins Clockwise and meshes with Gear 2, which meshes with Gear 3.'],
          question: 'In which direction does Gear 3 spin?',
          options: ['Clockwise', 'Counter-Clockwise'],
          correctAnswer: 'Clockwise',
          explanation: 'Odd-numbered gears in a single linear train maintain the initial drive direction.'
        }
      };
    }
  }
}
