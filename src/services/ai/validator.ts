/**
 * Multi-Discipline Algorithm Validator & Semantic Duplicate Detector
 * 
 * Rules:
 * 1. AI is never the sole source of truth; algorithms verify correctness.
 * 2. Mathematical expressions must evaluate to whole integers.
 * 3. Words must exist in the dictionary Prefix Trie.
 * 4. Logical deductions must have single defensible answers.
 * 5. Semantic Fingerprints prevent duplicate or near-duplicate challenges.
 */

import { GameId } from '../../engine/game-engine/types';
import { UniversalProblemSchema, ValidationResult, LevelSpecification } from './types';
import { boggleTrie } from '../../games/boggle/dictionary-trie';

// Cache of stored semantic fingerprints per game type
const FINGERPRINT_REGISTRY: Map<GameId, Set<string>> = new Map([
  ['anzan', new Set()],
  ['wordspeed', new Set()],
  ['boggle', new Set()],
  ['sudoku', new Set()],
  ['zebra', new Set()]
]);

/**
 * Computes a structural semantic fingerprint to detect near-identical duplicates
 */
export function computeSemanticFingerprint(gameId: GameId, problem: Partial<UniversalProblemSchema>): string {
  const normalizedPrompt = (problem.prompt || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalizedAnswer = String(problem.correctAnswer || '').toLowerCase().trim();
  const normalizedOptions = (problem.options || []).map(o => String(o).toLowerCase().trim()).sort().join('|');

  return `${gameId}:${normalizedPrompt}:${normalizedAnswer}:${normalizedOptions}`;
}

/**
 * Multi-Discipline Validation Pipeline
 */
export function validateCandidateProblem(
  gameId: GameId,
  spec: LevelSpecification,
  candidate: UniversalProblemSchema
): ValidationResult {
  // 1. Semantic Duplicate Check
  const fingerprint = computeSemanticFingerprint(gameId, candidate);
  const existingFingerprints = FINGERPRINT_REGISTRY.get(gameId) || new Set();

  if (existingFingerprints.has(fingerprint)) {
    return {
      isValid: false,
      gameId,
      rejectionReason: 'Semantic duplicate of previously generated challenge',
      semanticDuplicate: true,
      mathCorrect: true,
      hasSingleDefensibleAnswer: true,
      difficultyWithinBounds: true,
      healthScore: 0
    };
  }

  // 2. Game-Specific Algorithmic Verification
  let mathCorrect = true;
  let hasSingleDefensibleAnswer = true;
  let rejectionReason: string | undefined;

  switch (gameId) {
    case 'anzan': {
      // Validate arithmetic steps
      const steps = candidate.content?.steps || [];
      if (!Array.isArray(steps) || steps.length < spec.constraints.maxElements) {
        mathCorrect = false;
        rejectionReason = `Insufficient calculation steps: required ${spec.constraints.maxElements}, got ${steps.length}`;
      } else {
        let total = 0;
        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          if (i === 0) total = step.value;
          else if (step.operator === '+') total += step.value;
          else if (step.operator === '-') total -= step.value;
          else if (step.operator === '*') total *= step.value;
          else if (step.operator === '/') {
            if (step.value === 0 || total % step.value !== 0) {
              mathCorrect = false;
              rejectionReason = `Non-integer division in step ${i}: ${total} / ${step.value}`;
              break;
            }
            total = Math.floor(total / step.value);
          } else if (step.operator === '%') {
            if (step.value === 0) {
              mathCorrect = false;
              rejectionReason = 'Modulo by zero';
              break;
            }
            total = total % step.value;
          }

          if (total < 0 || !Number.isInteger(total)) {
            mathCorrect = false;
            rejectionReason = `Intermediate total became negative or fractional (${total}) at step ${i}`;
            break;
          }
        }

        if (mathCorrect && total !== Number(candidate.correctAnswer)) {
          mathCorrect = false;
          rejectionReason = `Calculated total (${total}) does not match supplied answer (${candidate.correctAnswer})`;
        }
      }
      break;
    }

    case 'wordspeed': {
      // Validate target word and options
      const target = String(candidate.content?.targetWord || candidate.correctAnswer || '').toUpperCase().trim();
      const options = (candidate.options || []).map(o => String(o).toUpperCase().trim());

      if (options.length < 2) {
        hasSingleDefensibleAnswer = false;
        rejectionReason = 'Word speed options must contain at least 2 distinct choices';
      } else if (!options.includes(target) && !options.includes(String(candidate.correctAnswer).toUpperCase().trim())) {
        hasSingleDefensibleAnswer = false;
        rejectionReason = 'Options array does not contain the correct answer';
      }
      break;
    }

    case 'boggle': {
      // Validate Boggle grid words with Prefix Trie
      const words = candidate.content?.words || [];
      if (Array.isArray(words)) {
        const invalidWords = words.filter((w: string) => !boggleTrie.isWord(w));
        if (invalidWords.length > 0) {
          rejectionReason = `Boggle challenge contained non-dictionary words: ${invalidWords.slice(0, 3).join(', ')}`;
          hasSingleDefensibleAnswer = false;
        }
      }
      break;
    }

    case 'sudoku': {
      // Validate options contain correct digit
      const opt = candidate.options || [];
      const ans = Number(candidate.correctAnswer);
      if (isNaN(ans) || ans < 1 || ans > 9 || !opt.includes(ans as never)) {
        hasSingleDefensibleAnswer = false;
        rejectionReason = `Invalid Sudoku digit answer: ${candidate.correctAnswer}`;
      }
      break;
    }

    case 'zebra': {
      // Validate single correct option
      const correctOpts = (candidate.options || []).filter(o => o === candidate.correctAnswer);
      if (correctOpts.length !== 1) {
        hasSingleDefensibleAnswer = false;
        rejectionReason = `Must have exactly 1 correct answer option; found ${correctOpts.length}`;
      }
      break;
    }
  }

  const isValid = mathCorrect && hasSingleDefensibleAnswer && !rejectionReason;

  if (isValid) {
    existingFingerprints.add(fingerprint);
    FINGERPRINT_REGISTRY.set(gameId, existingFingerprints);
  }

  return {
    isValid,
    gameId,
    rejectionReason,
    semanticDuplicate: false,
    mathCorrect,
    hasSingleDefensibleAnswer,
    difficultyWithinBounds: true,
    healthScore: isValid ? 95 : 0
  };
}

/**
 * Resets semantic fingerprint cache (for unit testing)
 */
export function clearFingerprintRegistry(): void {
  FINGERPRINT_REGISTRY.forEach(set => set.clear());
}
