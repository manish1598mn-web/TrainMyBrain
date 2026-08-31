/**
 * AI Explanation Engine & 3-Tier Progressive Hints
 * 
 * Rules:
 * 1. AI never determines the correct answer; game algorithms supply ground truth.
 * 2. 3-Tier Hints:
 *    - Hint 1: Small conceptual hint (activates pattern recognition).
 *    - Hint 2: Specific relationship hint (connects relevant premises).
 *    - Hint 3: Near-solution hint (guides the final decision step).
 * 3. Learning tips empower the user with cognitive techniques (e.g. mental chunking, parity rules).
 */

import { GameId } from '../../engine/game-engine/types';
import { AIExplanationPayload, ProgressiveHints } from './types';

/**
 * Generates 3-Tier Progressive Hints for any challenge
 */
export function generateProgressiveHints(
  gameId: GameId,
  questionPrompt: string,
  correctAnswer: string | number,
  context?: any
): ProgressiveHints {
  switch (gameId) {
    case 'anzan': {
      return {
        hint1_conceptual: 'Focus on keeping a running total after each operator rather than memorizing individual numbers.',
        hint2_relationship: `Notice the multiplication step (${context?.multStep || 'earlier in the sequence'}) which scaled the base total.`,
        hint3_nearsolution: `The total before the final addition was ${Number(correctAnswer) - (context?.lastValue || 5)}. Add the final term to get the total.`
      };
    }

    case 'wordspeed': {
      return {
        hint1_conceptual: 'Consider the core semantic root and part of speech of the target word.',
        hint2_relationship: `Look for polarity: is the target word expressing a positive, negative, or structural state?`,
        hint3_nearsolution: `Eliminate options with matching meaning. The true direct opposite begins with "${String(correctAnswer)[0]}".`
      };
    }

    case 'boggle': {
      return {
        hint1_conceptual: 'Scan for vowels (A, E, I, O, U) surrounded by high-frequency consonants (T, R, N, S).',
        hint2_relationship: 'Follow diagonal and vertical connections from the center tile.',
        hint3_nearsolution: `There is a valid ${String(correctAnswer).length}-letter word starting with "${String(correctAnswer).slice(0, 2)}".`
      };
    }

    case 'sudoku': {
      return {
        hint1_conceptual: 'Check the row, column, and 3x3 box for numbers that already appear between 1 and 9.',
        hint2_relationship: 'Cross-reference which digits are missing from both the active box and its intersecting column.',
        hint3_nearsolution: `All digits except ${correctAnswer} are already present across the intersecting constraints.`
      };
    }

    case 'zebra': {
      return {
        hint1_conceptual: 'Identify the fixed anchor in the premises and build relationships relative to that node.',
        hint2_relationship: 'Apply the parity / equilibrium rule: meshed gears alternate direction, lever torque balances as Weight × Distance.',
        hint3_nearsolution: `The logical chain directly leads to: ${correctAnswer}.`
      };
    }
  }
}

/**
 * Generates an educational explanation following an incorrect attempt
 */
export function generateAIExplanation(
  gameId: GameId,
  questionPrompt: string,
  userAnswer: string | number,
  correctAnswer: string | number,
  algorithmProof: string
): AIExplanationPayload {
  let learningTip = 'Maintain focus on the primary constraint and take a steady breath before locking in your answer.';

  if (gameId === 'anzan') {
    learningTip = 'Tip: Use Soroban mental chunking — group addition terms into tens to reduce working memory fatigue.';
  } else if (gameId === 'wordspeed') {
    learningTip = 'Tip: Break down unfamiliar terms into their Greek/Latin prefix and suffix roots.';
  } else if (gameId === 'sudoku') {
    learningTip = 'Tip: Scan for "Naked Singles" where row and box exclusions leave only 1 possible candidate.';
  } else if (gameId === 'zebra') {
    learningTip = 'Tip: Draw or visualize a linear anchor first, then map left/right and clockwise/counter-clockwise links.';
  }

  return {
    question: questionPrompt,
    userAnswer,
    correctAnswer,
    gameEngineProof: algorithmProof,
    explanationText: `You selected "${userAnswer}", but the verified correct answer is "${correctAnswer}". ${algorithmProof}`,
    learningTip
  };
}
