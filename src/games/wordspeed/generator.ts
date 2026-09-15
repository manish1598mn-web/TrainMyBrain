/**
 * Word Speed — Standardized 5-Option English Grammar & Linguistic Mastery Generator
 * 
 * Strict User Requirements:
 * 1. Exactly 5 options per question for every level (A, B, C, D, E).
 * 2. Zero word repetition across multiple questions in the same session.
 * 3. Each and every question is different, unique, and rotates through diverse grammar formats.
 * 4. 1-to-2 liner English Grammar questions:
 *    - Fill in the blanks (articles: a, an, the; prepositions: in, on, at, by, for, under; tenses; conjunctions)
 *    - Sentence error spotting
 *    - Sentence arrangement (PQRS)
 *    - Grammatical usage rules & paronyms
 * 5. Strict 4-Tier Difficulty Progression:
 *    - Levels 1–10: Beginner (Class 6–10 Student Level)
 *    - Levels 11–25: Intermediate (Class 11–12 & Graduate Level / SAT / IELTS)
 *    - Levels 26–50: Expert (Post-Graduate / GMAT / GRE / CAT / Higher Studies)
 *    - Levels 51–99+: Top 1% Global English Grammar Experts
 */

import { SeededRandom, createSeededRandom } from '../../lib/seeded-random';
import {
  GRAMMAR_QUESTIONS_DATASET,
  GrammarQuestionItem,
  GrammarCategory
} from './grammar-database';
import {
  LEXICAL_DATASET,
  GRAMMAR_CLASS_WORDS,
  PARONYM_PAIRS
} from './word-database';
import { hashChallengeContent } from '../../engine/level-engine/challenge-cache';

export interface WordSpeedQuestion {
  id: string;
  opCode?: string;
  tier: 1 | 2 | 3 | 4;
  category: GrammarCategory | string;
  mode?: string;
  modeBadge: string;
  prompt: string;
  subPrompt?: string;
  targetWord?: string;
  options: [string, string, string, string, string]; // Fixed exactly 5 options
  correctAnswer: string;
  explanation: string;
  primaryWords: string[];
  targetResponseTimeMs: number;
  questionFingerprint: string;
}

export interface WordSpeedChallenge {
  level: number;
  tier: 1 | 2 | 3 | 4;
  tierDescription: string;
  targetOptionsCount: 5;
  questions: WordSpeedQuestion[];
  totalQuestions: number;
  challengeHash: string;
}

/**
 * Maps player level into one of the 4 strict difficulty tiers
 */
export function getLevelTier(level: number): {
  tier: 1 | 2 | 3 | 4;
  description: string;
} {
  if (level <= 10) {
    return { tier: 1, description: 'Beginner (Class 6–10 Level)' };
  }
  if (level <= 25) {
    return { tier: 2, description: 'Intermediate (Graduate / SAT Level)' };
  }
  if (level <= 50) {
    return { tier: 3, description: 'Expert (GMAT / GRE / Post-Grad Level)' };
  }
  return { tier: 4, description: 'Global Top 1% Grammar Expert Level' };
}

/**
 * Procedural Dynamic Fallback Generators to ensure infinite variety with zero word repetition
 */

// 1. Procedural Fill in the Blank: Prepositions (at, in, on, by, under)
function generateDynamicPrepositionQuestion(
  tier: 1 | 2 | 3 | 4,
  rng: SeededRandom,
  usedWords: Set<string>
): WordSpeedQuestion | null {
  const templates = [
    {
      prep: 'at',
      context: 'The international express train arrives _____ the central terminal platform at dawn.',
      words: ['EXPRESS', 'TERMINAL', 'PLATFORM'],
      rule: 'Specific transport stops and precise locations take the preposition "at".'
    },
    {
      prep: 'in',
      context: 'She discovered a handwritten antique manuscript tucked _____ the secret wooden drawer.',
      words: ['MANUSCRIPT', 'ANTIQUE', 'DRAWER'],
      rule: 'Enclosed containers, interiors, and dimensional spaces take the preposition "in".'
    },
    {
      prep: 'on',
      context: 'The scientific research symposium will commence _____ Tuesday morning.',
      words: ['SYMPOSIUM', 'TUESDAY', 'COMMENCE'],
      rule: 'Specific days of the week and dates take the preposition "on".'
    },
    {
      prep: 'under',
      context: 'The ancient stone foundation remained hidden _____ centuries of volcanic sediment.',
      words: ['FOUNDATION', 'VOLCANIC', 'SEDIMENT'],
      rule: '"Under" signifies directly beneath or covered by a physical layer.'
    },
    {
      prep: 'between',
      context: 'A secret peace treaty was brokered _____ the two rival empires.',
      words: ['TREATY', 'BROKERED', 'EMPIRES'],
      rule: '"Between" is strictly used when referring to two distinct, individual entities.'
    },
    {
      prep: 'among',
      context: 'The generous benefactor distributed the scholarly awards _____ all fifteen candidates.',
      words: ['BENEFACTOR', 'AWARDS', 'CANDIDATES'],
      rule: '"Among" is used when distributing or referring to more than two entities.'
    }
  ];

  const available = templates.filter(t => !t.words.some(w => usedWords.has(w)));
  if (available.length === 0) return null;

  const chosen = rng.pick(available);
  const prepPool = ['in', 'on', 'at', 'under', 'between', 'among', 'by', 'through', 'into'];
  const distractors = rng.shuffle(prepPool.filter(p => p !== chosen.prep)).slice(0, 4);
  const options = rng.shuffle([chosen.prep, ...distractors]) as [string, string, string, string, string];

  return {
    id: `dyn-prep-${tier}-${rng.next()}`,
    tier,
    category: 'prepositions',
    modeBadge: 'Preposition Usage',
    prompt: 'Fill in the blank with the grammatically correct preposition:',
    subPrompt: chosen.context,
    options,
    correctAnswer: chosen.prep,
    explanation: chosen.rule,
    primaryWords: chosen.words,
    targetResponseTimeMs: 2000,
    questionFingerprint: hashChallengeContent(`dyn-prep-${chosen.prep}-${chosen.words.join('-')}`)
  };
}

// 2. Procedural Fill in the Blank: Articles (a, an, the, no article)
function generateDynamicArticleQuestion(
  tier: 1 | 2 | 3 | 4,
  rng: SeededRandom,
  usedWords: Set<string>
): WordSpeedQuestion | null {
  const templates = [
    {
      art: 'an',
      context: 'The archeologist unearthed _____ ancient artifact dating back to the Bronze Age.',
      words: ['ARCHEOLOGIST', 'ARTIFACT', 'BRONZE'],
      rule: '"Ancient" begins with a vowel sound /eɪ/, requiring the indefinite article "an".'
    },
    {
      art: 'a',
      context: 'The committee unanimously voted to adopt _____ unified code of business ethics.',
      words: ['COMMITTEE', 'UNIFIED', 'ETHICS'],
      rule: '"Unified" begins with the consonant glide /juː/, requiring "a", not "an".'
    },
    {
      art: 'the',
      context: 'He is unquestionably _____ most articulate speaker in the entire debate tournament.',
      words: ['ARTICULATE', 'TOURNAMENT', 'DEBATE'],
      rule: 'Superlative constructions ("most articulate") mandate the definite article "the".'
    },
    {
      art: 'no article needed',
      context: 'True wisdom and _____ patience are virtues cultivated through experience.',
      words: ['WISDOM', 'PATIENCE', 'VIRTUES'],
      rule: 'Abstract uncountable nouns used in a general sense take no article (zero article).'
    }
  ];

  const available = templates.filter(t => !t.words.some(w => usedWords.has(w)));
  if (available.length === 0) return null;

  const chosen = rng.pick(available);
  const standardOptions = ['a', 'an', 'the', 'some', 'no article needed'] as [string, string, string, string, string];

  return {
    id: `dyn-art-${tier}-${rng.next()}`,
    tier,
    category: 'articles',
    modeBadge: 'Articles (A/An/The)',
    prompt: 'Select the article that correctly completes the sentence:',
    subPrompt: chosen.context,
    options: standardOptions,
    correctAnswer: chosen.art,
    explanation: chosen.rule,
    primaryWords: chosen.words,
    targetResponseTimeMs: 1900,
    questionFingerprint: hashChallengeContent(`dyn-art-${chosen.art}-${chosen.words.join('-')}`)
  };
}

// 3. Procedural Sentence Arrangement (PQRS)
function generateDynamicArrangementQuestion(
  tier: 1 | 2 | 3 | 4,
  rng: SeededRandom,
  usedWords: Set<string>
): WordSpeedQuestion | null {
  const sentences = [
    {
      p: 'innovative renewable technologies',
      q: 'can substantially reduce',
      r: 'global carbon emissions',
      s: 'over the next decade',
      correct: 'P - Q - R - S',
      words: ['RENEWABLE', 'EMISSIONS', 'DECADE']
    },
    {
      p: 'diligent laboratory research',
      q: 'enabled the biochemists',
      r: 'to formulate',
      s: 'an effective breakthrough vaccine',
      correct: 'P - Q - R - S',
      words: ['BIOCHEMIST', 'VACCINE', 'LABORATORY']
    },
    {
      p: 'the historical archives',
      q: 'revealed startling evidence',
      r: 'concerning maritime trade routes',
      s: 'in ancient Mediterranean ports',
      correct: 'P - Q - R - S',
      words: ['MARITIME', 'MEDITERRANEAN', 'EVIDENCE']
    },
    {
      p: 'preserving biodiversity',
      q: 'remains essential',
      r: 'for ecological balance',
      s: 'across threatened forest biomes',
      correct: 'P - Q - R - S',
      words: ['BIODIVERSITY', 'ECOLOGICAL', 'BIOMES']
    }
  ];

  const available = sentences.filter(s => !s.words.some(w => usedWords.has(w)));
  if (available.length === 0) return null;

  const chosen = rng.pick(available);
  const permutations: [string, string, string, string, string] = [
    'P - Q - R - S',
    'Q - P - S - R',
    'R - Q - P - S',
    'S - P - Q - R',
    'P - R - Q - S'
  ];

  return {
    id: `dyn-arr-${tier}-${rng.next()}`,
    tier,
    category: 'sentence_arrangement',
    modeBadge: 'Sentence Arrangement (PQRS)',
    prompt: 'Arrange the jumbled clauses into a grammatically coherent sentence:',
    subPrompt: `[P] ${chosen.p}  [Q] ${chosen.q}  [R] ${chosen.r}  [S] ${chosen.s}`,
    options: permutations,
    correctAnswer: chosen.correct,
    explanation: `The coherent sequence follows standard English Subject-Verb-Object syntax: ${chosen.p} ${chosen.q} ${chosen.r} ${chosen.s}.`,
    primaryWords: chosen.words,
    targetResponseTimeMs: 2500,
    questionFingerprint: hashChallengeContent(`dyn-arr-${chosen.words.join('-')}`)
  };
}

// 4. Procedural Grammar Classification: Exactly 5 options
function generateDynamicGrammarClassQuestion(
  tier: 1 | 2 | 3 | 4,
  rng: SeededRandom,
  usedWords: Set<string>
): WordSpeedQuestion | null {
  const classes = [
    { name: 'NOUN', key: 'nouns' as const },
    { name: 'VERB', key: 'verbs' as const },
    { name: 'ADJECTIVE', key: 'adjectives' as const },
    { name: 'ADVERB', key: 'adverbs' as const },
    { name: 'PREPOSITION', key: 'prepositions' as const }
  ];

  const targetClass = rng.pick(classes);
  const pool = GRAMMAR_CLASS_WORDS[targetClass.key].filter(w => !usedWords.has(w.toUpperCase()));
  if (pool.length === 0) return null;

  const correctWord = rng.pick(pool);

  // Distractors from other 4 classes
  const otherClasses = classes.filter(c => c.name !== targetClass.name);
  const distractors: string[] = [];

  for (const oc of otherClasses) {
    const dPool = GRAMMAR_CLASS_WORDS[oc.key].filter(w => !usedWords.has(w.toUpperCase()) && w !== correctWord);
    if (dPool.length > 0) {
      distractors.push(rng.pick(dPool));
    }
  }

  if (distractors.length < 4) return null;

  const final5 = rng.shuffle([correctWord, ...distractors.slice(0, 4)]) as [string, string, string, string, string];

  return {
    id: `dyn-class-${tier}-${rng.next()}`,
    tier,
    category: 'usage_rules',
    modeBadge: `${targetClass.name} Identification`,
    prompt: `Identify the word that functions as a ${targetClass.name}:`,
    options: final5,
    correctAnswer: correctWord,
    explanation: `"${correctWord}" belongs to the grammatical category of ${targetClass.name}s.`,
    primaryWords: [correctWord, ...distractors.slice(0, 4)],
    targetResponseTimeMs: 2000,
    questionFingerprint: hashChallengeContent(`dyn-class-${targetClass.name}-${correctWord}`)
  };
}

/**
 * Main Word Speed Challenge Generator
 * Standardized to 5 options per question, zero word repetition per session, and 4 difficulty tiers.
 */
export function generateWordSpeedChallenge(level: number = 1, customSeed?: string | number): WordSpeedChallenge {
  const safeLevel = Math.max(1, Math.min(120, level));
  const seed = customSeed !== undefined ? `${customSeed}` : `${Date.now()}-${safeLevel}-${Math.random()}`;
  const rng: SeededRandom = createSeededRandom(seed);

  const { tier, description: tierDescription } = getLevelTier(safeLevel);
  const totalQuestions = 15; // Standard 15-question challenge

  const questions: WordSpeedQuestion[] = [];
  const usedWordsInSession = new Set<string>();
  const usedFingerprints = new Set<string>();

  // Filter curated questions for this tier (with fallback to adjacent tiers if needed)
  const tierCurated = GRAMMAR_QUESTIONS_DATASET.filter(q => q.tier === tier);
  const shuffledCurated = rng.shuffle([...tierCurated]);

  // Try adding non-overlapping curated questions first
  for (const item of shuffledCurated) {
    if (questions.length >= totalQuestions) break;

    // Check if any primary word was already used in this round
    const hasOverlap = item.primaryWords.some(w => usedWordsInSession.has(w.toUpperCase()));
    if (!hasOverlap && !usedFingerprints.has(item.id)) {
      usedFingerprints.add(item.id);
      item.primaryWords.forEach(w => usedWordsInSession.add(w.toUpperCase()));

      // Ensure options are shuffled while keeping exactly 5
      const shuffledOptions = rng.shuffle([...item.options]) as [string, string, string, string, string];

      questions.push({
        id: item.id,
        tier: item.tier,
        category: item.category,
        mode: item.modeBadge,
        modeBadge: item.modeBadge,
        prompt: item.prompt,
        subPrompt: item.subPrompt,
        options: shuffledOptions,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        primaryWords: item.primaryWords,
        targetResponseTimeMs: item.targetResponseTimeMs,
        questionFingerprint: item.id
      });
    }
  }

  // Fill remaining questions using dynamic procedural generators
  let attempts = 0;
  while (questions.length < totalQuestions && attempts < 80) {
    attempts++;
    const genType = rng.nextInt(1, 4);
    let dynQ: WordSpeedQuestion | null = null;

    if (genType === 1) {
      dynQ = generateDynamicPrepositionQuestion(tier, rng, usedWordsInSession);
    } else if (genType === 2) {
      dynQ = generateDynamicArticleQuestion(tier, rng, usedWordsInSession);
    } else if (genType === 3) {
      dynQ = generateDynamicArrangementQuestion(tier, rng, usedWordsInSession);
    } else {
      dynQ = generateDynamicGrammarClassQuestion(tier, rng, usedWordsInSession);
    }

    if (dynQ && !usedFingerprints.has(dynQ.questionFingerprint)) {
      const hasOverlap = dynQ.primaryWords.some(w => usedWordsInSession.has(w.toUpperCase()));
      if (!hasOverlap) {
        usedFingerprints.add(dynQ.questionFingerprint);
        dynQ.primaryWords.forEach(w => usedWordsInSession.add(w.toUpperCase()));
        dynQ.mode = dynQ.modeBadge;
        questions.push(dynQ);
      }
    }
  }

  // If still need items, draw from full curated pool without overlap
  if (questions.length < totalQuestions) {
    const allRemaining = rng.shuffle([...GRAMMAR_QUESTIONS_DATASET]);
    for (const item of allRemaining) {
      if (questions.length >= totalQuestions) break;
      const hasOverlap = item.primaryWords.some(w => usedWordsInSession.has(w.toUpperCase()));
      if (!hasOverlap && !usedFingerprints.has(item.id)) {
        usedFingerprints.add(item.id);
        item.primaryWords.forEach(w => usedWordsInSession.add(w.toUpperCase()));
        questions.push({
          ...item,
          mode: item.modeBadge,
          options: rng.shuffle([...item.options]) as [string, string, string, string, string],
          questionFingerprint: item.id
        });
      }
    }
  }

  const challengeHash = hashChallengeContent(
    questions.map(q => `${q.tier}:${q.category}:${q.correctAnswer}`).join('|')
  );

  return {
    level: safeLevel,
    tier,
    tierDescription,
    targetOptionsCount: 5,
    questions,
    totalQuestions: questions.length,
    challengeHash
  };
}
