import { generateWordSpeedChallenge } from '../games/wordspeed/generator.ts';
import { generateBoggleBoard, solveBoggleBoard, generateBoggleReflexChallenge } from '../games/boggle/board-generator.ts';
import { boggleTrie } from '../games/boggle/dictionary-trie.ts';
import { generateAnzanChallenge } from '../games/anzan/generator.ts';
import { generateSudokuReflexTrials, generateFullSudoku } from '../games/sudoku/generator.ts';
import { generateZebraReflexExercises, generateZebraFullPuzzle } from '../games/zebra/generator.ts';
import { calculateNextLevel } from '../engine/level-engine/progression.ts';
import { generateWorkout } from '../engine/workout-engine/workout-generator.ts';
import { createSeededRandom } from '../lib/seeded-random.ts';

function runValidationSuite() {
  console.log('🧪 Starting TrainMyBrain Automated Validation Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Word Speed Generator (Standardized 5 Options & 4 Tiers)
  console.log('1. Testing Word Speed Generator:');
  const wsEasy = generateWordSpeedChallenge(1, 'test-seed-ws1');
  assert(wsEasy.questions.length === 15, 'Level 1 produces exactly 15 questions');
  assert(wsEasy.questions.every(q => q.options.length === 5), 'Every question has exactly 5 options (A, B, C, D, E)');
  assert(wsEasy.tier === 1, 'Level 1 maps to Tier 1 Beginner (Class 6-10)');

  // Zero word repetition test
  const usedWords = new Set<string>();
  let hasOverlap = false;
  for (const q of wsEasy.questions) {
    if (q.primaryWords && q.primaryWords.some(w => usedWords.has(w.toUpperCase()))) {
      hasOverlap = true;
    }
    if (q.primaryWords) {
      q.primaryWords.forEach(w => usedWords.add(w.toUpperCase()));
    }
  }
  assert(!hasOverlap, 'Zero word repetition across questions in the session');

  const wsIntermediate = generateWordSpeedChallenge(18, 'test-seed-ws18');
  assert(wsIntermediate.tier === 2, 'Level 18 maps to Tier 2 Intermediate (Class 11-12 / Graduate)');
  assert(wsIntermediate.questions.every(q => q.options.length === 5), 'Tier 2 maintains exactly 5 options');

  const wsExpert = generateWordSpeedChallenge(35, 'test-seed-ws35');
  assert(wsExpert.tier === 3, 'Level 35 maps to Tier 3 Expert (GMAT/GRE/CAT)');

  const wsTop1 = generateWordSpeedChallenge(75, 'test-seed-ws75');
  assert(wsTop1.tier === 4, 'Level 75 maps to Tier 4 Top 1% Global Grammar Experts');
  assert(wsTop1.questions.every(q => q.options.length === 5), 'Tier 4 maintains exactly 5 options');

  // 2. Boggle Engine & Prefix Trie
  console.log('\n2. Testing Boggle Board & Trie Engine:');
  assert(boggleTrie.isWord('TRAIN'), 'Trie recognizes standard English word TRAIN');
  assert(boggleTrie.hasPrefix('TRA'), 'Trie recognizes prefix TRA');
  assert(!boggleTrie.isWord('XYZQQQ'), 'Trie rejects non-existent word XYZQQQ');

  const boggleBoard = generateBoggleBoard(4, 'test-seed-123');
  assert(boggleBoard.grid.length === 7 && boggleBoard.grid[0].length === 7, 'Generates uniform 7x7 dice grid');
  assert(boggleBoard.allValidWords.size >= 10, 'Finds 10+ valid words on generated board');

  const reflexChallenge = generateBoggleReflexChallenge(10, 'test-seed-456');
  assert(reflexChallenge.targetWord.length >= 3, 'Generates valid Reflex target word');
  assert(reflexChallenge.targetPath.length === reflexChallenge.targetWord.length, 'Target path coordinates match word length');

  // 3. Anzan Generator
  console.log('\n3. Testing Flash Anzan Generator:');
  const anzanLvl1 = generateAnzanChallenge(1);
  assert(anzanLvl1.rounds.length > 0, 'Generates valid Anzan rounds');
  assert(anzanLvl1.rounds[0].digitCount === 1, 'Level 1 uses 1-digit numbers');
  assert(anzanLvl1.rounds[0].flashDurationMs >= 500, 'Display time respects >= 500ms human floor');

  // 4. Sudoku Reflex
  console.log('\n4. Testing Sudoku Reflex Generator:');
  const sudokuTrials = generateSudokuReflexTrials(10);
  assert(sudokuTrials.length >= 4, 'Generates 4+ candidate reflex trials');

  const fullSudoku = generateFullSudoku(10);
  assert(fullSudoku.initialGrid.length === 9, 'Generates full 9x9 sudoku board');

  // 5. Zebra Puzzles
  console.log('\n5. Testing Zebra Puzzles Generator:');
  const zebraExercises = generateZebraReflexExercises(10);
  assert(zebraExercises.length >= 4, 'Generates 4+ relational reflex exercises');

  const zebraFull = generateZebraFullPuzzle(15);
  assert(zebraFull.clues.length >= 4, 'Generates multi-variable clue set');
  assert(zebraFull.targetQuestion.options.includes(zebraFull.targetQuestion.correctAnswer), 'Target question has solvable option');

  // 6. Progression Engine & Strict Accuracy Gate
  console.log('\n6. Testing Progression Engine & Accuracy Gates:');
  
  // Under 70% accuracy MUST NOT level up
  const lowAccProg = calculateNextLevel('wordspeed', 10, 85, 3, {
    accuracy: 60,
    timeMs: 2000,
    mistakes: 4,
    totalAttempts: 10,
    difficultyScore: 50,
    consistencyScore: 40,
    level: 10
  });
  assert(lowAccProg.newLevel === 10, 'Accuracy < 70% blocks level increase');
  assert(!lowAccProg.accuracyPassed, 'accuracyPassed is false when < 70%');

  // High accuracy (95%) with mastery >= 85% and >= 3 attempts levels up
  const highAccProg = calculateNextLevel('wordspeed', 10, 85, 3, {
    accuracy: 95,
    timeMs: 15000,
    mistakes: 0,
    totalAttempts: 10,
    difficultyScore: 50,
    consistencyScore: 100,
    level: 10
  });
  assert(highAccProg.newLevel > 10, 'Accuracy 95% + 85% Mastery triggers level up');
  assert(highAccProg.leveledUp, 'leveledUp flag is true');

  // 7. Workout Engine
  console.log('\n7. Testing Workout Generator:');
  const dummyLevels = { sudoku: 10, zebra: 8, wordspeed: 15, anzan: 5, boggle: 12 };
  const workout2m = generateWorkout('2min', dummyLevels);
  assert(workout2m.totalDurationSec === 120, '2-min workout total duration is 120s');
  assert(workout2m.segments.length === 4, '2-min workout has 4 rapid segments');

  const workout5m = generateWorkout('5min', dummyLevels);
  assert(workout5m.totalDurationSec === 300, '5-min workout total duration is 300s');
  assert(workout5m.segments.length === 5, '5-min workout includes all 5 training areas');

  // 8. Deterministic Seed
  console.log('\n8. Testing Seeded PRNG Reproducibility:');
  const seed = 'DAILY-20260830';
  const rng1 = createSeededRandom(seed);
  const rng2 = createSeededRandom(seed);
  const num1 = rng1.nextInt(1, 1000);
  const num2 = rng2.nextInt(1, 1000);
  assert(num1 === num2, `Seeded random output is identical for seed ${seed} (${num1} === ${num2})`);

  console.log(`\n========================================`);
  console.log(`🎉 Validation Results: ${passed} passed, ${failed} failed.`);
  console.log(`========================================\n`);

  return failed === 0;
}

runValidationSuite();
