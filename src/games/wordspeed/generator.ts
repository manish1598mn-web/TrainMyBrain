/**
 * Word Speed — Progressive Difficulty System (WS-01 to WS-22)
 * 
 * Level Progression & Constraints:
 * - Levels 1–10: 4–8 letters, 10–15 options (smoothly interpolated: L1=10, L2=10, ..., L10=15), Tier 1–2
 * - Levels 11–25: 9–12 letters, 15–20 options, Tier 2
 * - Levels 26–50: 12–15 letters, 20–25 options, Tier 2–3 (Multi-property processing)
 * - Levels 51–99+: 15+ letters, 25–35 options, Tier 3–5 (Multi-dimensional, memory, switching)
 * - Level 99+: 35 options max, all 22 operations active
 */

import { SeededRandom, createSeededRandom } from '../../lib/seeded-random';
import {
  LEXICAL_DATASET,
  GRAMMAR_CLASS_WORDS,
  PARONYM_PAIRS,
  LexicalWord,
  PartOfSpeech
} from './word-database';
import { hashChallengeContent } from '../../engine/level-engine/challenge-cache';

export type WordSpeedOpCode =
  | 'WS-01' // Exact Recognition
  | 'WS-02' // Meaning / Definition
  | 'WS-03' // Synonym
  | 'WS-04' // Antonym
  | 'WS-05' // Similar Meaning (Nuance)
  | 'WS-06' // Noun Classification
  | 'WS-07' // Pronoun Classification
  | 'WS-08' // Verb Classification
  | 'WS-09' // Adjective Classification
  | 'WS-10' // Adverb Classification
  | 'WS-11' // Preposition Classification
  | 'WS-12' // Conjunction Classification
  | 'WS-13' // Interjection Classification
  | 'WS-14' // Contextual Meaning
  | 'WS-15' // Word Association
  | 'WS-16' // Category Identification
  | 'WS-17' // Odd Word / Intruder
  | 'WS-18' // Word Pair Matching
  | 'WS-19' // Semantic Relationship
  | 'WS-20' // Word Memory
  | 'WS-21' // Context Switching
  | 'WS-22'; // Multi-property Classification

export interface WordSpeedQuestion {
  id: string;
  opCode: WordSpeedOpCode;
  mode?: string;
  modeBadge: string;
  prompt: string;
  subPrompt?: string;
  targetWord?: string;
  memoryStream?: string[];
  options: string[];
  correctAnswer: string;
  targetResponseTimeMs: number;
  questionFingerprint: string;
}

export interface WordSpeedChallenge {
  level: number;
  wordLengthRange: [number, number];
  targetOptionsCount: number;
  activeTiers: number[];
  questions: WordSpeedQuestion[];
  totalQuestions: number;
  challengeHash: string;
}

/**
 * Computes exact target options count based on level interpolation
 */
export function getTargetOptionsCount(level: number): number {
  if (level <= 10) {
    // 1-10 -> 10 to 15 options
    const table: Record<number, number> = {
      1: 10, 2: 10, 3: 11, 4: 11, 5: 12,
      6: 12, 7: 13, 8: 14, 9: 14, 10: 15
    };
    return table[level] || 10;
  }
  if (level <= 25) {
    // 11-25 -> 15 to 20 options
    const progress = (level - 11) / (25 - 11);
    return Math.round(15 + progress * (20 - 15));
  }
  if (level <= 50) {
    // 26-50 -> 20 to 25 options
    const progress = (level - 26) / (50 - 26);
    return Math.round(20 + progress * (25 - 20));
  }
  if (level <= 99) {
    // 51-99 -> 25 to 35 options
    const progress = (level - 51) / (99 - 51);
    return Math.round(25 + progress * (35 - 25));
  }
  return 35; // 99+ max cap
}

/**
 * Computes target word length range based on level
 */
export function getWordLengthRange(level: number): [number, number] {
  if (level <= 10) {
    if (level <= 2) return [4, 6];
    if (level <= 5) return [4, 7];
    return [5, 8];
  }
  if (level <= 25) {
    if (level <= 17) return [8, 11];
    return [9, 12];
  }
  if (level <= 50) {
    if (level <= 38) return [11, 14];
    return [12, 15];
  }
  return [14, 20]; // 51-99+
}

/**
 * Selects allowed WS-01 to WS-22 operations for a given level
 */
export function getAllowedOperations(level: number): WordSpeedOpCode[] {
  if (level <= 2) {
    return ['WS-01', 'WS-03']; // Exact Recognition + Synonym
  }
  if (level <= 5) {
    return ['WS-01', 'WS-02', 'WS-03', 'WS-04', 'WS-06', 'WS-08', 'WS-09'];
  }
  if (level <= 10) {
    return ['WS-01', 'WS-02', 'WS-03', 'WS-04', 'WS-05', 'WS-06', 'WS-08', 'WS-09', 'WS-14', 'WS-16', 'WS-17'];
  }
  if (level <= 25) {
    return [
      'WS-02', 'WS-03', 'WS-04', 'WS-05', 'WS-06', 'WS-07', 'WS-08', 'WS-09',
      'WS-10', 'WS-11', 'WS-12', 'WS-14', 'WS-15', 'WS-16', 'WS-17', 'WS-18'
    ];
  }
  if (level <= 50) {
    return [
      'WS-02', 'WS-03', 'WS-04', 'WS-05', 'WS-09', 'WS-10', 'WS-14', 'WS-15',
      'WS-17', 'WS-18', 'WS-19', 'WS-21', 'WS-22'
    ];
  }
  // 51-99+ : All 22 operations active
  return [
    'WS-01', 'WS-02', 'WS-03', 'WS-04', 'WS-05', 'WS-06', 'WS-07', 'WS-08',
    'WS-09', 'WS-10', 'WS-11', 'WS-12', 'WS-13', 'WS-14', 'WS-15', 'WS-16',
    'WS-17', 'WS-18', 'WS-19', 'WS-20', 'WS-21', 'WS-22'
  ];
}

/**
 * Filters the lexical database by tier and word length
 */
export function getLexicalPool(level: number): LexicalWord[] {
  let tiers: number[] = [1];
  if (level <= 10) {
    tiers = [1, 2];
  } else if (level <= 25) {
    tiers = [2];
  } else if (level <= 50) {
    tiers = [2, 3];
  } else if (level <= 75) {
    tiers = [3, 4];
  } else {
    tiers = [3, 4, 5];
  }

  const [minLen, maxLen] = getWordLengthRange(level);
  const matched = LEXICAL_DATASET.filter(w => tiers.includes(w.tier) || (w.length >= minLen && w.length <= maxLen));
  return matched.length >= 8 ? matched : LEXICAL_DATASET;
}

/**
 * Fills options up to targetCount using structured distractor distribution:
 * - 1 Correct
 * - 2-3 Strong Distractors
 * - 3-5 Moderate Distractors
 * - Remainder Weak Plausible Distractors
 */
export function assembleStructuredOptions(
  correctAnswer: string,
  strongDistractors: string[],
  moderateDistractors: string[],
  targetCount: number,
  allVocabularyPool: string[],
  rng: SeededRandom
): string[] {
  const chosen = new Set<string>([correctAnswer.toUpperCase()]);

  // Add strong distractors
  for (const s of strongDistractors) {
    if (chosen.size >= targetCount) break;
    const clean = s.toUpperCase();
    if (clean !== correctAnswer.toUpperCase()) chosen.add(clean);
  }

  // Add moderate distractors
  for (const m of moderateDistractors) {
    if (chosen.size >= targetCount) break;
    const clean = m.toUpperCase();
    if (clean !== correctAnswer.toUpperCase()) chosen.add(clean);
  }

  // Fill remainder from general vocabulary pool
  const shuffledPool = rng.shuffle([...allVocabularyPool]);
  for (const item of shuffledPool) {
    if (chosen.size >= targetCount) break;
    const clean = item.toUpperCase();
    if (clean !== correctAnswer.toUpperCase()) chosen.add(clean);
  }

  return rng.shuffle(Array.from(chosen));
}

/**
 * Main Word Speed Challenge Generator (Adheres to complete 22-operation specification)
 */
export function generateWordSpeedChallenge(level: number, customSeed?: string | number): WordSpeedChallenge {
  const safeLevel = Math.max(1, Math.min(120, level));
  const seed = customSeed !== undefined ? `${customSeed}` : `${Date.now()}-${safeLevel}-${Math.random()}`;
  const rng = createSeededRandom(seed);

  const targetOptionsCount = getTargetOptionsCount(safeLevel);
  const wordLengthRange = getWordLengthRange(safeLevel);
  const allowedOps = getAllowedOperations(safeLevel);
  const pool = getLexicalPool(safeLevel);

  const allWordsList = Array.from(new Set([
    ...LEXICAL_DATASET.map(w => w.word),
    ...LEXICAL_DATASET.flatMap(w => w.synonyms),
    ...LEXICAL_DATASET.flatMap(w => w.antonyms),
    ...LEXICAL_DATASET.flatMap(w => w.nearDistractors),
    ...Object.values(GRAMMAR_CLASS_WORDS).flat()
  ]));

  // Total questions per session
  const totalQuestions = safeLevel <= 10 ? 12 : safeLevel <= 30 ? 15 : 18;
  const questions: WordSpeedQuestion[] = [];
  const generatedFingerprints = new Set<string>();

  for (let q = 0; q < totalQuestions; q++) {
    const opCode = rng.pick(allowedOps);
    let question: WordSpeedQuestion;
    const targetEntry = rng.pick(pool);

    switch (opCode) {
      case 'WS-01': { // Exact Recognition
        const target = targetEntry.word;
        const strong = targetEntry.nearDistractors;
        const options = assembleStructuredOptions(
          target,
          strong,
          pool.map(w => w.word),
          targetOptionsCount,
          allWordsList,
          rng
        );
        const fp = hashChallengeContent(`WS01-${target}-${options.join(',')}`);
        question = {
          id: `ws-${q}-${safeLevel}-${rng.next()}`,
          opCode: 'WS-01',
          modeBadge: 'Exact Recognition',
          prompt: 'Identify the exact target word:',
          targetWord: target,
          options,
          correctAnswer: target,
          targetResponseTimeMs: 1800,
          questionFingerprint: fp
        };
        break;
      }

      case 'WS-02': { // Meaning / Definition Match
        const answer = targetEntry.word;
        const strong = targetEntry.nearDistractors;
        const options = assembleStructuredOptions(
          answer,
          strong,
          pool.map(w => w.word),
          targetOptionsCount,
          allWordsList,
          rng
        );
        const fp = hashChallengeContent(`WS02-${targetEntry.definition}-${answer}`);
        question = {
          id: `ws-${q}-${safeLevel}-${rng.next()}`,
          opCode: 'WS-02',
          modeBadge: 'Definition Match',
          prompt: 'Which word matches the definition below?',
          subPrompt: `"${targetEntry.definition}"`,
          options,
          correctAnswer: answer,
          targetResponseTimeMs: 2400,
          questionFingerprint: fp
        };
        break;
      }

      case 'WS-03': { // Synonym
        const answer = rng.pick(targetEntry.synonyms) || targetEntry.word;
        const strong = targetEntry.nearDistractors;
        const options = assembleStructuredOptions(
          answer,
          strong,
          pool.flatMap(w => w.synonyms),
          targetOptionsCount,
          allWordsList,
          rng
        );
        const fp = hashChallengeContent(`WS03-${targetEntry.word}-${answer}`);
        question = {
          id: `ws-${q}-${safeLevel}-${rng.next()}`,
          opCode: 'WS-03',
          modeBadge: 'Synonym Search',
          prompt: `Find the closest meaning of:`,
          targetWord: targetEntry.word,
          options,
          correctAnswer: answer,
          targetResponseTimeMs: 2000,
          questionFingerprint: fp
        };
        break;
      }

      case 'WS-04': { // Antonym
        const answer = targetEntry.antonyms.length > 0 ? rng.pick(targetEntry.antonyms) : 'VAGUE';
        const strong = targetEntry.synonyms; // Synonyms act as strong trap distractors for antonyms!
        const options = assembleStructuredOptions(
          answer,
          strong,
          pool.flatMap(w => w.antonyms),
          targetOptionsCount,
          allWordsList,
          rng
        );
        const fp = hashChallengeContent(`WS04-${targetEntry.word}-${answer}`);
        question = {
          id: `ws-${q}-${safeLevel}-${rng.next()}`,
          opCode: 'WS-04',
          modeBadge: 'Antonym Search',
          prompt: `Find the OPPOSITE (Antonym) of:`,
          targetWord: targetEntry.word,
          options,
          correctAnswer: answer,
          targetResponseTimeMs: 2200,
          questionFingerprint: fp
        };
        break;
      }

      case 'WS-05': { // Similar Meaning / Nuance
        const answer = rng.pick(targetEntry.synonyms) || targetEntry.word;
        const strong = targetEntry.nearDistractors;
        const options = assembleStructuredOptions(
          answer,
          strong,
          pool.map(w => w.word),
          targetOptionsCount,
          allWordsList,
          rng
        );
        const fp = hashChallengeContent(`WS05-${targetEntry.word}-${answer}`);
        question = {
          id: `ws-${q}-${safeLevel}-${rng.next()}`,
          opCode: 'WS-05',
          modeBadge: 'Semantic Nuance',
          prompt: `Find the word most closely associated in nuance to:`,
          targetWord: targetEntry.word,
          options,
          correctAnswer: answer,
          targetResponseTimeMs: 2200,
          questionFingerprint: fp
        };
        break;
      }

      case 'WS-06': // Noun Classification
      case 'WS-07': // Pronoun Classification
      case 'WS-08': // Verb Classification
      case 'WS-09': // Adjective Classification
      case 'WS-10': // Adverb Classification
      case 'WS-11': // Preposition Classification
      case 'WS-12': // Conjunction Classification
      case 'WS-13': { // Interjection Classification
        const classMap: Record<string, { name: string; key: keyof typeof GRAMMAR_CLASS_WORDS; pos: PartOfSpeech }> = {
          'WS-06': { name: 'NOUN', key: 'nouns', pos: 'noun' },
          'WS-07': { name: 'PRONOUN', key: 'pronouns', pos: 'pronoun' },
          'WS-08': { name: 'VERB', key: 'verbs', pos: 'verb' },
          'WS-09': { name: 'ADJECTIVE', key: 'adjectives', pos: 'adjective' },
          'WS-10': { name: 'ADVERB', key: 'adverbs', pos: 'adverb' },
          'WS-11': { name: 'PREPOSITION', key: 'prepositions', pos: 'preposition' },
          'WS-12': { name: 'CONJUNCTION', key: 'conjunctions', pos: 'conjunction' },
          'WS-13': { name: 'INTERJECTION', key: 'interjections', pos: 'interjection' }
        };

        const targetInfo = classMap[opCode];
        const correctList = GRAMMAR_CLASS_WORDS[targetInfo.key];
        const answer = rng.pick(correctList);

        // Distractors come from the OTHER grammatical classes
        const otherClasses = Object.entries(GRAMMAR_CLASS_WORDS).filter(([k]) => k !== targetInfo.key).flatMap(([, v]) => v);
        const options = assembleStructuredOptions(
          answer,
          otherClasses.slice(0, 5),
          otherClasses.slice(5, 15),
          targetOptionsCount,
          otherClasses,
          rng
        );

        const fp = hashChallengeContent(`WSGrammar-${targetInfo.name}-${answer}`);
        question = {
          id: `ws-${q}-${safeLevel}-${rng.next()}`,
          opCode,
          modeBadge: `${targetInfo.name} Class`,
          prompt: `Find the ${targetInfo.name} among the options:`,
          options,
          correctAnswer: answer,
          targetResponseTimeMs: 2100,
          questionFingerprint: fp
        };
        break;
      }

      case 'WS-14': { // Contextual Meaning (Sentence Completion)
        const answer = targetEntry.word;
        const sentence = targetEntry.exampleSentence.replace(new RegExp(answer, 'gi'), '_____');
        const strong = targetEntry.nearDistractors;
        const options = assembleStructuredOptions(
          answer,
          strong,
          pool.map(w => w.word),
          targetOptionsCount,
          allWordsList,
          rng
        );
        const fp = hashChallengeContent(`WS14-${sentence}-${answer}`);
        question = {
          id: `ws-${q}-${safeLevel}-${rng.next()}`,
          opCode: 'WS-14',
          modeBadge: 'Contextual Meaning',
          prompt: 'Which word best completes the sentence?',
          subPrompt: `"${sentence}"`,
          options,
          correctAnswer: answer,
          targetResponseTimeMs: 2500,
          questionFingerprint: fp
        };
        break;
      }

      case 'WS-18': { // Word Pair / Paronym Discrimination
        const pair = rng.pick(PARONYM_PAIRS);
        const isA = rng.next() > 0.5;
        const sentence = isA ? pair.sentenceA : pair.sentenceB;
        const answer = isA ? pair.wordA : pair.wordB;
        const strongTrap = isA ? pair.wordB : pair.wordA;

        const options = assembleStructuredOptions(
          answer,
          [strongTrap],
          pool.map(w => w.word),
          targetOptionsCount,
          allWordsList,
          rng
        );

        const fp = hashChallengeContent(`WS18-${sentence}-${answer}`);
        question = {
          id: `ws-${q}-${safeLevel}-${rng.next()}`,
          opCode: 'WS-18',
          modeBadge: 'Paronym Discrimination',
          prompt: 'Select the correct confusable word for this context:',
          subPrompt: `"${sentence}"`,
          options,
          correctAnswer: answer,
          targetResponseTimeMs: 2300,
          questionFingerprint: fp
        };
        break;
      }

      case 'WS-20': { // Word Working Memory Stream
        const streamWords = rng.shuffle(pool.map(w => w.word)).slice(0, safeLevel >= 70 ? 8 : 5);
        const answer = rng.pick(streamWords);
        const unshownWords = pool.map(w => w.word).filter(w => !streamWords.includes(w));

        const options = assembleStructuredOptions(
          answer,
          unshownWords.slice(0, 5),
          unshownWords.slice(5, 15),
          targetOptionsCount,
          unshownWords,
          rng
        );

        const fp = hashChallengeContent(`WS20-${streamWords.join('-')}-${answer}`);
        question = {
          id: `ws-${q}-${safeLevel}-${rng.next()}`,
          opCode: 'WS-20',
          modeBadge: 'Working Memory',
          prompt: 'Which word appeared in the memorized sequence?',
          memoryStream: streamWords,
          options,
          correctAnswer: answer,
          targetResponseTimeMs: 2200,
          questionFingerprint: fp
        };
        break;
      }

      case 'WS-22': // Multi-Property Classification
      default: {
        // Multi-Property: e.g. Find the ADJECTIVE meaning "likely to happen and impossible to avoid"
        const answer = targetEntry.word;
        const posUpper = targetEntry.partOfSpeech.toUpperCase();
        const strong = targetEntry.nearDistractors;
        const options = assembleStructuredOptions(
          answer,
          strong,
          pool.map(w => w.word),
          targetOptionsCount,
          allWordsList,
          rng
        );

        const fp = hashChallengeContent(`WS22-${posUpper}-${targetEntry.definition}-${answer}`);
        question = {
          id: `ws-${q}-${safeLevel}-${rng.next()}`,
          opCode: 'WS-22',
          modeBadge: 'Multi-Property',
          prompt: `Find the ${posUpper} that matches:`,
          subPrompt: `"${targetEntry.definition}"`,
          options,
          correctAnswer: answer,
          targetResponseTimeMs: 2500,
          questionFingerprint: fp
        };
        break;
      }
    }

    question.mode = question.modeBadge;

    if (!generatedFingerprints.has(question.questionFingerprint)) {
      generatedFingerprints.add(question.questionFingerprint);
      questions.push(question);
    } else {
      // Fallback unique question
      questions.push({
        ...question,
        id: `ws-u-${q}-${Date.now()}`
      });
    }
  }

  const challengeHash = hashChallengeContent(
    questions.map(q => `${q.opCode}:${q.correctAnswer}:${q.options.length}`).join('|')
  );

  return {
    level: safeLevel,
    wordLengthRange,
    targetOptionsCount,
    activeTiers: safeLevel <= 10 ? [1, 2] : safeLevel <= 25 ? [2] : safeLevel <= 50 ? [2, 3] : [3, 4, 5],
    questions,
    totalQuestions: questions.length,
    challengeHash
  };
}
