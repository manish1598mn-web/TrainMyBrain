/**
 * TrainMyBrain — Foundational Training Mode Engine (Levels T1 to T10)
 * 
 * Purpose:
 * Training is a dedicated standalone mode for users to build speed, confidence,
 * and cognitive fundamentals before entering Main Game Level 1.
 * 
 * Mathematical Progression:
 * Training(N-1) = Training(N) * 0.60  <=>  Training(N) = Main L1 * (0.60)^(10 - N)
 * - T1:  ~1.00% of Main L1 (15–20 ultra-gentle mixed problems)
 * - T2:  ~1.67% of Main L1
 * - T3:  ~2.78% of Main L1
 * - T4:  ~4.63% of Main L1
 * - T5:  ~7.72% of Main L1
 * - T6:  ~12.86% of Main L1
 * - T7:  ~21.43% of Main L1
 * - T8:  ~35.71% of Main L1
 * - T9:  ~59.52% of Main L1
 * - T10: 100.00% = Main Game Level 1 (Graduation to Main L1)
 */

import { GameId } from '../game-engine/types';
import { SeededRandom, createSeededRandom } from '../../lib/seeded-random';
import { questionHistory } from './question-history';

export interface TrainingProblem {
  id: string;
  gameId: GameId;
  trainingLevel: number;
  difficultyPercentOfL1: number;
  facultyBadge: string;
  facultyColor: string;
  prompt: string;
  subPrompt?: string;
  options: (string | number)[];
  correctAnswer: string | number;
  explanation: string;
  targetTimeMs: number;
  conceptKey: string;
  fingerprint: string;
}

export interface TrainingSessionConfig {
  level: number;
  difficultyRatio: number;
  totalProblems: number;
  problems: TrainingProblem[];
}

export interface TrainingProgress {
  currentLevel: number;
  highestUnlockedLevel: number;
  isGraduated: boolean;
  totalSessionsCompleted: number;
  bestAccuracyByLevel: Record<number, number>;
  weaknessFacultyScores: Record<GameId, number>;
}

const STORAGE_KEY = 'tmb_training_progress_v1';

export const TRAINING_DIFFICULTY_TABLE: Record<number, { percent: number; ratio: number; label: string }> = {
  1: { percent: 1.00, ratio: Math.pow(0.60, 9), label: 'Basic Foundations I' },
  2: { percent: 1.67, ratio: Math.pow(0.60, 8), label: 'Basic Foundations II' },
  3: { percent: 2.78, ratio: Math.pow(0.60, 7), label: 'Speed Warm-Up I' },
  4: { percent: 4.63, ratio: Math.pow(0.60, 6), label: 'Speed Warm-Up II' },
  5: { percent: 7.72, ratio: Math.pow(0.60, 5), label: 'Cognitive Flow I' },
  6: { percent: 12.86, ratio: Math.pow(0.60, 4), label: 'Cognitive Flow II' },
  7: { percent: 21.43, ratio: Math.pow(0.60, 3), label: 'Intermediate Agility' },
  8: { percent: 35.71, ratio: Math.pow(0.60, 2), label: 'Pre-Level 1 Sprint' },
  9: { percent: 59.52, ratio: Math.pow(0.60, 1), label: 'Mastery Gateway' },
  10: { percent: 100.00, ratio: 1.00, label: 'Main Level 1 Readiness' }
};

/**
 * Loads Training Mode progress from LocalStorage
 */
export function loadTrainingProgress(): TrainingProgress {
  const defaultProgress: TrainingProgress = {
    currentLevel: 1,
    highestUnlockedLevel: 1,
    isGraduated: false,
    totalSessionsCompleted: 0,
    bestAccuracyByLevel: {},
    weaknessFacultyScores: {
      anzan: 50,
      wordspeed: 50,
      boggle: 50,
      sudoku: 50,
      zebra: 50
    }
  };

  try {
    if (typeof window === 'undefined' || !window.localStorage) return defaultProgress;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return { ...defaultProgress, ...parsed };
  } catch {
    return defaultProgress;
  }
}

/**
 * Saves Training Mode progress to LocalStorage
 */
export function saveTrainingProgress(progress: TrainingProgress): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('[TrainingEngine] Failed to save training progress:', e);
  }
}

/**
 * Calculates adaptive sampling weights based on user's weak faculties
 */
export function calculateAdaptiveWeights(facultyScores: Record<GameId, number>): Record<GameId, number> {
  const games: GameId[] = ['anzan', 'wordspeed', 'sudoku', 'zebra', 'boggle'];
  const inverseScores: Record<GameId, number> = {} as any;
  let totalWeight = 0;

  for (const g of games) {
    const score = Math.max(10, Math.min(100, facultyScores[g] || 50));
    const inv = 110 - score; // lower score -> higher training probability
    inverseScores[g] = inv;
    totalWeight += inv;
  }

  const normalized: Record<GameId, number> = {} as any;
  for (const g of games) {
    normalized[g] = inverseScores[g] / totalWeight;
  }
  return normalized;
}

/**
 * Generates an ultra-gentle training problem scaled precisely to Training Level T
 */
export function generateSingleTrainingProblem(
  gameId: GameId,
  trainingLevel: number,
  rng: SeededRandom
): TrainingProblem {
  const safeT = Math.max(1, Math.min(10, trainingLevel));
  const diffInfo = TRAINING_DIFFICULTY_TABLE[safeT] || TRAINING_DIFFICULTY_TABLE[1];
  const now = Date.now();

  switch (gameId) {
    // -------------------------------------------------------------
    // 1. PRO CALCULATIONS (2-term basic addition at T1 -> 7 terms at T10)
    // -------------------------------------------------------------
    case 'anzan': {
      let numTerms = 2;
      let maxVal = 5;
      if (safeT >= 3) { numTerms = 3; maxVal = 9; }
      if (safeT >= 6) { numTerms = 4; maxVal = 15; }
      if (safeT >= 8) { numTerms = 5; maxVal = 20; }
      if (safeT === 10) { numTerms = 7; maxVal = 25; }

      const terms: number[] = [];
      let runningTotal = rng.nextInt(1, maxVal);
      terms.push(runningTotal);

      const ops: string[] = [];
      for (let i = 1; i < numTerms; i++) {
        const canSub = runningTotal > 3 && safeT >= 4;
        const isSub = canSub && rng.next() < 0.35;
        const val = rng.nextInt(1, isSub ? runningTotal - 1 : maxVal);

        if (isSub) {
          runningTotal -= val;
          ops.push(`- ${val}`);
        } else {
          runningTotal += val;
          ops.push(`+ ${val}`);
        }
      }

      const expressionStr = `${terms[0]} ${ops.join(' ')}`;
      const correctAnswer = runningTotal;
      const distractors = [correctAnswer + 1, correctAnswer - 1, correctAnswer + 2]
        .filter(n => n > 0 && n !== correctAnswer)
        .slice(0, 3);
      const options = rng.shuffle([correctAnswer, ...distractors]);

      const conceptKey = `calc:t${safeT}:len${numTerms}`;
      const { fingerprint } = questionHistory.computeFingerprint(
        'anzan',
        safeT,
        expressionStr,
        correctAnswer,
        conceptKey
      );

      return {
        id: `tr-anzan-${safeT}-${now}-${rng.next()}`,
        gameId: 'anzan',
        trainingLevel: safeT,
        difficultyPercentOfL1: diffInfo.percent,
        facultyBadge: '⚡ Pro Calculations',
        facultyColor: 'amber',
        prompt: `Calculate: ${expressionStr} = ?`,
        options,
        correctAnswer,
        explanation: `${expressionStr} equals ${correctAnswer}.`,
        targetTimeMs: Math.max(3000, (11 - safeT) * 1000),
        conceptKey,
        fingerprint
      };
    }

    // -------------------------------------------------------------
    // 2. WORD SPEED (3-letter basic vocabulary at T1 -> 10 options at T10)
    // -------------------------------------------------------------
    case 'wordspeed': {
      const basicPairs: [string, string, string[]][] = [
        ['BIG', 'LARGE', ['TINY', 'COLD', 'BLUE', 'FAST']],
        ['FAST', 'QUICK', ['SLOW', 'DARK', 'HEAVY', 'SOFT']],
        ['HAPPY', 'GLAD', ['SAD', 'ANGRY', 'LOUD', 'COLD']],
        ['SMART', 'CLEVER', ['DULL', 'SLOW', 'WEAK', 'HARD']],
        ['BRAVE', 'BOLD', ['TIMID', 'QUIET', 'SICK', 'LATE']],
        ['CALM', 'PEACEFUL', ['NOISY', 'ROUGH', 'STORM', 'SHARP']]
      ];

      const selected = rng.pick(basicPairs);
      const targetWord = selected[0];
      const synonym = selected[1];
      const distractors = selected[2].slice(0, safeT <= 4 ? 3 : safeT <= 7 ? 5 : 9);
      const options = rng.shuffle([synonym, ...distractors]);

      const conceptKey = `ws:t${safeT}:${targetWord.toLowerCase()}`;
      const { fingerprint } = questionHistory.computeFingerprint(
        'wordspeed',
        safeT,
        targetWord,
        synonym,
        conceptKey
      );

      return {
        id: `tr-wordspeed-${safeT}-${now}-${rng.next()}`,
        gameId: 'wordspeed',
        trainingLevel: safeT,
        difficultyPercentOfL1: diffInfo.percent,
        facultyBadge: '🔤 Word Speed',
        facultyColor: 'indigo',
        prompt: `Find the SYNONYM of:`,
        subPrompt: `"${targetWord}"`,
        options,
        correctAnswer: synonym,
        explanation: `"${synonym}" has the closest meaning to "${targetWord}".`,
        targetTimeMs: 4000,
        conceptKey,
        fingerprint
      };
    }

    // -------------------------------------------------------------
    // 3. SUDOKU REFLEX (Mini 2x2 missing number at T1 -> 4x4 single at T10)
    // -------------------------------------------------------------
    case 'sudoku': {
      const isMini = safeT <= 5;
      let prompt = '';
      let correctAnswer = 1;
      let options: number[] = [];

      if (isMini) {
        // 2x2 missing digit [1, 2, 3, ?]
        const digits = rng.shuffle([1, 2, 3, 4]);
        const missing = digits[3];
        correctAnswer = missing;
        prompt = `Complete the 4-number set: [ ${digits[0]}, ${digits[1]}, ${digits[2]}, ? ]`;
        options = [1, 2, 3, 4];
      } else {
        // 4x4 row with 1 missing
        const digits = rng.shuffle([1, 2, 3, 4]);
        const missing = digits[0];
        correctAnswer = missing;
        prompt = `Row Missing Digit: [ ${digits[1]}, ?, ${digits[2]}, ${digits[3]} ]`;
        options = [1, 2, 3, 4];
      }

      const conceptKey = `sdk:t${safeT}:miss${correctAnswer}`;
      const { fingerprint } = questionHistory.computeFingerprint(
        'sudoku',
        safeT,
        prompt,
        correctAnswer,
        conceptKey
      );

      return {
        id: `tr-sudoku-${safeT}-${now}-${rng.next()}`,
        gameId: 'sudoku',
        trainingLevel: safeT,
        difficultyPercentOfL1: diffInfo.percent,
        facultyBadge: '🧩 Sudoku Reflex',
        facultyColor: 'purple',
        prompt,
        options,
        correctAnswer,
        explanation: `The missing number from {1, 2, 3, 4} is ${correctAnswer}.`,
        targetTimeMs: 4500,
        conceptKey,
        fingerprint
      };
    }

    // -------------------------------------------------------------
    // 4. REASONING PUZZLES (Direct 2-entity comparison at T1 -> 4-entity linear at T10)
    // -------------------------------------------------------------
    case 'zebra': {
      const names = ['Aarav', 'Bhavna', 'Chetan', 'Deepa'];
      const p1 = names[0], p2 = names[1];

      let prompt = '';
      let correctAnswer = p1;
      let options: string[] = [];

      if (safeT <= 4) {
        prompt = `${p1} is taller than ${p2}. Who is TALLER?`;
        correctAnswer = p1;
        options = [p1, p2];
      } else if (safeT <= 7) {
        const p3 = names[2];
        prompt = `${p1} is faster than ${p2}. ${p2} is faster than ${p3}. Who is the FASTEST?`;
        correctAnswer = p1;
        options = [p1, p2, p3];
      } else {
        const p3 = names[2], p4 = names[3];
        prompt = `In a line: ${p1} is left of ${p2}. ${p4} is at the extreme right. Who is left of ${p2}?`;
        correctAnswer = p1;
        options = [p1, p2, p3, p4];
      }

      const conceptKey = `pz:t${safeT}:${correctAnswer.toLowerCase()}`;
      const { fingerprint } = questionHistory.computeFingerprint(
        'zebra',
        safeT,
        prompt,
        correctAnswer,
        conceptKey
      );

      return {
        id: `tr-zebra-${safeT}-${now}-${rng.next()}`,
        gameId: 'zebra',
        trainingLevel: safeT,
        difficultyPercentOfL1: diffInfo.percent,
        facultyBadge: '🧠 Reasoning Puzzles',
        facultyColor: 'emerald',
        prompt,
        options: rng.shuffle(options),
        correctAnswer,
        explanation: `By direct premise deduction: ${correctAnswer} is the valid answer.`,
        targetTimeMs: 5000,
        conceptKey,
        fingerprint
      };
    }

    // -------------------------------------------------------------
    // 5. BOGGLE / LEXICAL SEARCH (3-letter word search at T1 -> 4x4 at T10)
    // -------------------------------------------------------------
    case 'boggle':
    default: {
      const wordLists = ['CAT', 'SUN', 'DOG', 'RUN', 'STAR', 'BLUE', 'MIND'];
      const targetWord = rng.pick(wordLists);
      const scrambled = rng.shuffle(targetWord.split('')).join('');

      const distractors = ['BIRD', 'GOLD', 'FAST', 'JUMP']
        .filter(w => w !== targetWord)
        .slice(0, 3);
      const options = rng.shuffle([targetWord, ...distractors]);

      const conceptKey = `bog:t${safeT}:${targetWord.toLowerCase()}`;
      const { fingerprint } = questionHistory.computeFingerprint(
        'boggle',
        safeT,
        `Anagram: ${scrambled}`,
        targetWord,
        conceptKey
      );

      return {
        id: `tr-boggle-${safeT}-${now}-${rng.next()}`,
        gameId: 'boggle',
        trainingLevel: safeT,
        difficultyPercentOfL1: diffInfo.percent,
        facultyBadge: '🎲 Boggle & Words',
        facultyColor: 'rose',
        prompt: `Unscramble the letters to form a word:`,
        subPrompt: `[ ${scrambled.split('').join(' • ')} ]`,
        options,
        correctAnswer: targetWord,
        explanation: `The letters ${scrambled} spell "${targetWord}".`,
        targetTimeMs: 4500,
        conceptKey,
        fingerprint
      };
    }
  }
}

/**
 * Builds a complete 15–20 problem Training Session with adaptive faculty weighting
 */
export function generateTrainingSession(
  trainingLevel: number = 1,
  facultyScores?: Record<GameId, number>,
  customSeed?: string | number
): TrainingSessionConfig {
  const safeLevel = Math.max(1, Math.min(10, trainingLevel));
  const seed = customSeed !== undefined ? `${customSeed}` : `${Date.now()}-tr-${safeLevel}-${Math.random()}`;
  const rng = createSeededRandom(seed);

  const diffInfo = TRAINING_DIFFICULTY_TABLE[safeLevel] || TRAINING_DIFFICULTY_TABLE[1];
  const totalProblems = 15; // Standard 15-problem agile session
  const games: GameId[] = ['anzan', 'wordspeed', 'sudoku', 'zebra', 'boggle'];

  // Calculate adaptive game sampling pool
  const weights = calculateAdaptiveWeights(facultyScores || {
    anzan: 50,
    wordspeed: 50,
    boggle: 50,
    sudoku: 50,
    zebra: 50
  });

  const problems: TrainingProblem[] = [];

  for (let i = 0; i < totalProblems; i++) {
    // Weighted selection
    const rand = rng.next();
    let cumulative = 0;
    let selectedGame: GameId = 'anzan';

    for (const g of games) {
      cumulative += weights[g];
      if (rand <= cumulative) {
        selectedGame = g;
        break;
      }
    }

    const problem = generateSingleTrainingProblem(selectedGame, safeLevel, rng);
    problems.push(problem);
  }

  return {
    level: safeLevel,
    difficultyRatio: diffInfo.ratio,
    totalProblems,
    problems
  };
}
