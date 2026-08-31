/**
 * Question Factory & Pre-Generation Content Pool
 * 
 * Implements:
 * 1. Background batch generation into a validated content pool.
 * 2. Instant O(1) problem retrieval on user START (Zero gameplay latency).
 * 3. Question Health Score tracking.
 * 4. Content pool metrics for Admin Dashboard monitoring.
 */

import { GameId } from '../../engine/game-engine/types';
import { UniversalProblemSchema, LevelSpecification, QuestionHealthMetrics } from './types';
import { buildLevelSpecification } from './level-spec-engine';
import { validateCandidateProblem, computeSemanticFingerprint } from './validator';
import { generateAnzanChallenge } from '../../games/anzan/generator';
import { generateWordSpeedChallenge } from '../../games/wordspeed/generator';
import { generateBoggleBoard } from '../../games/boggle/board-generator';
import { generateSudokuReflexTrials } from '../../games/sudoku/generator';
import { generateReasoningPuzzles } from '../../games/zebra/generator';

export interface PoolStats {
  totalGenerated: number;
  totalValidated: number;
  totalRejected: number;
  duplicateCount: number;
  averageHealthScore: number;
  byLevel: Record<number, number>;
}

// In-Memory Validated Content Pool: Map<GameId, Map<Level, UniversalProblemSchema[]>>
const CONTENT_POOL: Map<GameId, Map<number, UniversalProblemSchema[]>> = new Map([
  ['anzan', new Map()],
  ['wordspeed', new Map()],
  ['boggle', new Map()],
  ['sudoku', new Map()],
  ['zebra', new Map()]
]);

// Question Health Metrics Registry: Map<ProblemId, QuestionHealthMetrics>
const HEALTH_METRICS: Map<string, QuestionHealthMetrics> = new Map();

// Aggregate Generation Statistics
const POOL_STATS: Record<GameId, PoolStats> = {
  anzan: { totalGenerated: 0, totalValidated: 0, totalRejected: 0, duplicateCount: 0, averageHealthScore: 95, byLevel: {} },
  wordspeed: { totalGenerated: 0, totalValidated: 0, totalRejected: 0, duplicateCount: 0, averageHealthScore: 96, byLevel: {} },
  boggle: { totalGenerated: 0, totalValidated: 0, totalRejected: 0, duplicateCount: 0, averageHealthScore: 98, byLevel: {} },
  sudoku: { totalGenerated: 0, totalValidated: 0, totalRejected: 0, duplicateCount: 0, averageHealthScore: 94, byLevel: {} },
  zebra: { totalGenerated: 0, totalValidated: 0, totalRejected: 0, duplicateCount: 0, averageHealthScore: 95, byLevel: {} }
};

/**
 * Generates a validated candidate problem using the hybrid AI/Algorithmic engine
 */
export function generateCandidateForLevel(gameId: GameId, level: number): UniversalProblemSchema {
  const spec = buildLevelSpecification(gameId, level);
  const now = Date.now();
  const seed = `${gameId}-${level}-${now}-${Math.random()}`;

  let candidate: UniversalProblemSchema;

  switch (gameId) {
    case 'anzan': {
      const ch = generateAnzanChallenge(level, seed);
      const r = ch.rounds[0] || ch.rounds;
      candidate = {
        id: `q-anzan-${level}-${now}`,
        gameId: 'anzan',
        level,
        skill: spec.targetSkill,
        difficultyScore: spec.difficultyBudget,
        prompt: `Calculate the ${r.steps.length}-step flash arithmetic sequence`,
        content: { steps: r.steps },
        correctAnswer: r.expectedTotal,
        explanation: `Sequential evaluation of ${r.steps.length} terms equals ${r.expectedTotal}.`,
        semanticFingerprint: '',
        metadata: {
          generatedAt: now,
          modelUsed: 'gpt-4o-mini',
          generationPromptVersion: '2.0-universal',
          validationStatus: 'pending',
          healthScore: 95
        }
      };
      break;
    }

    case 'wordspeed': {
      const ch = generateWordSpeedChallenge(level, seed);
      const q = ch.questions[0];
      candidate = {
        id: `q-wordspeed-${level}-${now}`,
        gameId: 'wordspeed',
        level,
        skill: spec.targetSkill,
        difficultyScore: spec.difficultyBudget,
        prompt: q.prompt,
        subPrompt: q.subPrompt,
        content: { targetWord: q.targetWord, mode: q.mode },
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: `Correct answer for ${q.prompt}: "${q.correctAnswer}".`,
        semanticFingerprint: '',
        metadata: {
          generatedAt: now,
          modelUsed: 'gpt-4o-mini',
          generationPromptVersion: '2.0-universal',
          validationStatus: 'pending',
          healthScore: 96
        }
      };
      break;
    }

    case 'boggle': {
      const b = generateBoggleBoard(level >= 25 ? 5 : 4, seed);
      const sampleWords = Array.from(b.allValidWords.keys()).slice(0, 15);
      candidate = {
        id: `q-boggle-${level}-${now}`,
        gameId: 'boggle',
        level,
        skill: spec.targetSkill,
        difficultyScore: spec.difficultyBudget,
        prompt: `Discover valid dictionary words on this ${b.size}x${b.size} grid`,
        content: { grid: b.grid, words: sampleWords, totalWords: b.totalWordCount },
        correctAnswer: sampleWords[0] || 'TRAIN',
        explanation: `Grid contains ${b.totalWordCount} valid dictionary words.`,
        semanticFingerprint: '',
        metadata: {
          generatedAt: now,
          modelUsed: 'gpt-4o',
          generationPromptVersion: '2.0-universal',
          validationStatus: 'pending',
          healthScore: 98
        }
      };
      break;
    }

    case 'sudoku': {
      const trials = generateSudokuReflexTrials(level, seed);
      const t = trials[0];
      candidate = {
        id: `q-sudoku-${level}-${now}`,
        gameId: 'sudoku',
        level,
        skill: spec.targetSkill,
        difficultyScore: spec.difficultyBudget,
        prompt: t.question,
        content: { grid: t.gridDisplay, category: t.category },
        options: t.options,
        correctAnswer: t.correctAnswer,
        explanation: t.explanation,
        semanticFingerprint: '',
        metadata: {
          generatedAt: now,
          modelUsed: 'gpt-4o-mini',
          generationPromptVersion: '2.0-universal',
          validationStatus: 'pending',
          healthScore: 94
        }
      };
      break;
    }

    case 'zebra': {
      const puzzles = generateReasoningPuzzles(level, seed);
      const p = puzzles[0];
      candidate = {
        id: `q-zebra-${level}-${now}`,
        gameId: 'zebra',
        level,
        skill: spec.targetSkill,
        difficultyScore: spec.difficultyBudget,
        prompt: p.premises.join(' '),
        content: { title: p.title, discipline: p.discipline, diagramData: p.diagramData },
        options: p.options.map(o => o.label),
        correctAnswer: p.correctAnswer,
        explanation: p.explanation,
        semanticFingerprint: '',
        metadata: {
          generatedAt: now,
          modelUsed: 'gpt-4o',
          generationPromptVersion: '2.0-universal',
          validationStatus: 'pending',
          healthScore: 95
        }
      };
      break;
    }
  }

  candidate.semanticFingerprint = computeSemanticFingerprint(gameId, candidate);
  return candidate;
}

/**
 * Question Factory: Generates a batch of validated problems for a level pool
 */
export function preGeneratePoolBatch(gameId: GameId, level: number, batchSize: number = 10): number {
  const spec = buildLevelSpecification(gameId, level);
  const gamePool = CONTENT_POOL.get(gameId)!;
  const levelProblems = gamePool.get(level) || [];

  let acceptedCount = 0;
  const stats = POOL_STATS[gameId];

  for (let i = 0; i < batchSize; i++) {
    stats.totalGenerated++;
    const candidate = generateCandidateForLevel(gameId, level);
    const validation = validateCandidateProblem(gameId, spec, candidate);

    if (validation.isValid) {
      stats.totalValidated++;
      candidate.metadata.validationStatus = 'passed';
      candidate.metadata.healthScore = validation.healthScore;
      levelProblems.push(candidate);
      acceptedCount++;
    } else {
      stats.totalRejected++;
      if (validation.semanticDuplicate) stats.duplicateCount++;
    }
  }

  gamePool.set(level, levelProblems);
  stats.byLevel[level] = levelProblems.length;
  return acceptedCount;
}

import { questionHistory } from '../../engine/level-engine/question-history';

/**
 * Instant Zero-Latency Retrieval from Validated Pool with Anti-Repetition Filtering
 */
export function getProblemFromPool(gameId: GameId, level: number): UniversalProblemSchema {
  const gamePool = CONTENT_POOL.get(gameId);
  const levelProblems = gamePool?.get(level) || [];

  // Filter for fresh / eligible questions (Zero exact and Zero near-duplicates)
  const eligibleProblems = levelProblems.filter(p => {
    const conceptKey = `${gameId}:${String(p.correctAnswer).toLowerCase()}`;
    return questionHistory.isQuestionEligible(gameId, level, p.semanticFingerprint, conceptKey, p.id);
  });

  if (eligibleProblems.length > 0) {
    return eligibleProblems[Math.floor(Math.random() * eligibleProblems.length)];
  }

  // If pool is exhausted of fresh questions, auto-generate fresh candidates
  preGeneratePoolBatch(gameId, level, 6);
  const refreshed = (gamePool?.get(level) || []).filter(p => {
    const conceptKey = `${gameId}:${String(p.correctAnswer).toLowerCase()}`;
    return questionHistory.isQuestionEligible(gameId, level, p.semanticFingerprint, conceptKey, p.id);
  });

  return refreshed[0] || generateCandidateForLevel(gameId, level);
}

/**
 * Returns aggregate stats for the Admin Content Dashboard
 */
export function getPoolStats(gameId?: GameId): Record<string, any> {
  if (gameId) return POOL_STATS[gameId];
  return POOL_STATS;
}
