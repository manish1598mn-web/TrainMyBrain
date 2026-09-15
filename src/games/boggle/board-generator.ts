/**
 * Boggle Progressive Difficulty & Board Generation Engine
 * 
 * Uniform 7x7 (49 dice) Grid Across All Levels.
 * 
 * Progressive Difficulty Progression:
 * - Levels 1–10:  3 to 5 letter words, 4 to 6 target words
 * - Levels 11–25: 5 to 7 letter words, 6 to 12 target words
 * - Levels 26–50: 7 to 12 letter words, 12 to 20 target words
 * - Levels 51–99+: 8 to 20 letter words, 15 to 25 target words
 * 
 * Timing:
 * - Generous, brain-friendly timing: max(90s, targetWords * 15s)
 */

import { SeededRandom, createSeededRandom } from '../../lib/seeded-random';
import { boggleTrie } from './dictionary-trie';

export interface BoggleCellCoord {
  r: number;
  c: number;
}

export interface BoggleBoard {
  rows: number;
  cols: number;
  size: number;
  grid: string[][];
  allValidWords: Map<string, BoggleCellCoord[]>;
  totalWordCount: number;
  targetWordCount: number;
  timeAllowedSec: number;
  minWordLength: number;
  maxScore: number;
  levelTier: {
    minLetters: number;
    maxLetters: number;
    description: string;
  };
}

export interface BoggleReflexTrailChallenge {
  id: string;
  board: BoggleBoard;
  targetWord: string;
  targetPath: BoggleCellCoord[];
  hint: string;
  options: {
    id: string;
    path: BoggleCellCoord[];
    displayLabel: string;
    isCorrect: boolean;
  }[];
  correctAnswer: string;
  targetTimeSec: number;
}

// Authentic Classic 16 Boggle Dice Distributions
const CLASSIC_BOGGLE_DICE_16 = [
  ['R', 'I', 'F', 'O', 'R', 'X'],
  ['I', 'F', 'E', 'H', 'E', 'Y'],
  ['D', 'E', 'N', 'O', 'W', 'S'],
  ['U', 'T', 'O', 'K', 'N', 'D'],
  ['H', 'M', 'S', 'R', 'A', 'O'],
  ['L', 'U', 'P', 'E', 'T', 'S'],
  ['A', 'C', 'I', 'T', 'O', 'A'],
  ['Y', 'L', 'G', 'K', 'U', 'E'],
  ['Q', 'B', 'M', 'J', 'O', 'A'],
  ['E', 'H', 'I', 'S', 'P', 'N'],
  ['V', 'E', 'T', 'I', 'G', 'N'],
  ['B', 'A', 'L', 'I', 'Y', 'T'],
  ['E', 'Z', 'A', 'V', 'N', 'D'],
  ['R', 'A', 'L', 'E', 'S', 'C'],
  ['U', 'W', 'I', 'L', 'R', 'G'],
  ['P', 'A', 'C', 'E', 'M', 'D']
];

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// 8-directional neighbor offsets
const DIR_ROW = [-1, -1, -1, 0, 0, 1, 1, 1];
const DIR_COL = [-1, 0, 1, -1, 1, -1, 0, 1];

// Curated seed words for serpentine planting by tier
const TIER_WORDS_5_7 = [
  'STREAM', 'PLANET', 'GARDEN', 'FOREST', 'SPRING', 'SILVER', 'TRAVEL', 'NATURE',
  'WONDER', 'BRIGHT', 'BRIDGE', 'CASTLE', 'FLOWER', 'GOLDEN', 'ISLAND', 'MEMORY',
  'ORANGE', 'PURPLE', 'RIVER', 'SUNNY', 'VALLEY', 'WINTER', 'YELLOW', 'BALANCE',
  'CRYSTAL', 'DOLPHIN', 'JOURNEY', 'LANTERN', 'MYSTERY', 'PENGUIN', 'THUNDER', 'VILLAGE'
];

const TIER_WORDS_7_12 = [
  'BEAUTIFUL', 'CHALLENGE', 'EDUCATION', 'HAPPINESS', 'KNOWLEDGE', 'LANDSCAPE',
  'MOUNTAIN', 'NOTEBOOK', 'ORCHESTRA', 'PYRAMID', 'RAINBOW', 'SCIENTIST',
  'TELESCOPE', 'UMBRELLA', 'VACATION', 'WATERFALL', 'ADVENTURE', 'ASTRONOMY',
  'DISCOVERY', 'FANTASTIC', 'GEOMETRY', 'HORIZON', 'IMAGINATION', 'LIGHTNING',
  'NAVIGATOR', 'SYMPHONY', 'WONDERLAND', 'CELEBRATION', 'REMARKABLE', 'BRILLIANT'
];

const TIER_WORDS_8_PLUS = [
  'CHALLENGE', 'EDUCATION', 'HAPPINESS', 'KNOWLEDGE', 'LANDSCAPE', 'ASTRONOMY',
  'DISCOVERY', 'FANTASTIC', 'GEOMETRY', 'IMAGINATION', 'LIGHTNING', 'NAVIGATOR',
  'REMARKABLE', 'SCIENTIST', 'SYMPHONY', 'TELESCOPE', 'WATERFALL', 'WONDERLAND',
  'CELEBRATION', 'BRILLIANT', 'ADVENTURE', 'EXPERIMENT', 'INNOVATION', 'LEADERSHIP'
];

/**
 * Dimensions: Consistent 7x7 Grid across all levels
 */
export function getBoggleDimensions(_level: number): { rows: number; cols: number; label: string } {
  return { rows: 7, cols: 7, label: '7x7' };
}

/**
 * Calculates target words count to find for the level according to approved criteria:
 * - Level 1–10: 4 to 6 words
 * - Level 11–25: 6 to 12 words
 * - Level 26–50: 12 to 20 words
 * - Level 51–99+: 15 to 25 words
 */
export function getBoggleTargetWordCount(level: number): number {
  if (level <= 10) {
    return Math.round(4 + ((level - 1) / 9) * (6 - 4));
  }
  if (level <= 25) {
    return Math.round(6 + ((level - 11) / 14) * (12 - 6));
  }
  if (level <= 50) {
    return Math.round(12 + ((level - 26) / 24) * (20 - 12));
  }
  // Level 51 to 99+
  return Math.min(25, Math.round(15 + ((level - 51) / 48) * (25 - 15)));
}

/**
 * Calculates minimum required word length based on level:
 * - Level 1–10: 3 letters
 * - Level 11–25: 5 letters
 * - Level 26–50: 7 letters
 * - Level 51–99+: 8 letters
 */
export function getBoggleMinWordLength(level: number): number {
  if (level <= 10) return 3;
  if (level <= 25) return 5;
  if (level <= 50) return 7;
  return 8;
}

/**
 * Level tier metadata for UI indicators
 */
export function getBoggleLevelTier(level: number): { minLetters: number; maxLetters: number; description: string } {
  if (level <= 10) {
    return { minLetters: 3, maxLetters: 5, description: '3–5 Letter Words' };
  }
  if (level <= 25) {
    return { minLetters: 5, maxLetters: 7, description: '5–7 Letter Words' };
  }
  if (level <= 50) {
    return { minLetters: 7, maxLetters: 12, description: '7–12 Letter Words' };
  }
  return { minLetters: 8, maxLetters: 20, description: '8–20 Letter Words' };
}

/**
 * Calculates time allowed: Generous 15 seconds per target word (minimum 90s)
 */
export function getBoggleTimeAllowedSec(level: number): number {
  const targetWords = getBoggleTargetWordCount(level);
  return Math.max(90, targetWords * 15);
}

/**
 * High-Speed DFS Prefix Trie Solver for 7x7 grid.
 * Explores valid paths using Trie pruning with depth up to 14.
 */
export function solveBoggleBoard(grid: string[][], rows: number = 7, cols: number = 7, minLength: number = 3): Map<string, BoggleCellCoord[]> {
  const foundWords = new Map<string, BoggleCellCoord[]>();
  const visited: boolean[][] = Array(rows).fill(false).map(() => Array(cols).fill(false));
  const maxSearchDepth = 14;

  function dfs(r: number, c: number, currentWord: string, currentPath: BoggleCellCoord[]) {
    if (foundWords.size >= 150) return; // Cut-off once ample words are found

    const char = grid[r][c];
    const newWord = currentWord + char;

    // Prune invalid prefixes immediately in O(L) time using Trie
    if (!boggleTrie.hasPrefix(newWord)) {
      return;
    }

    const newPath = [...currentPath, { r, c }];

    if (newWord.length >= minLength && boggleTrie.isWord(newWord)) {
      if (!foundWords.has(newWord)) {
        foundWords.set(newWord, newPath);
      }
    }

    if (newWord.length >= maxSearchDepth) return;

    visited[r][c] = true;

    for (let d = 0; d < 8; d++) {
      const nr = r + DIR_ROW[d];
      const nc = c + DIR_COL[d];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        dfs(nr, nc, newWord, newPath);
      }
    }

    visited[r][c] = false;
  }

  // Scan grid starting cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, '', []);
      if (foundWords.size >= 120) break;
    }
    if (foundWords.size >= 120) break;
  }

  return foundWords;
}

/**
 * Plants a word along a random self-avoiding path on the 7x7 grid.
 * Returns true if planting was successful.
 */
function plantWordOnGrid(grid: (string | null)[][], word: string, rng: SeededRandom): boolean {
  const rows = 7;
  const cols = 7;
  const wordLen = word.length;

  // Try multiple random starting positions
  for (let attempt = 0; attempt < 30; attempt++) {
    const startR = rng.nextInt(0, rows - 1);
    const startC = rng.nextInt(0, cols - 1);

    // Check if start position is empty or matches first letter
    if (grid[startR][startC] !== null && grid[startR][startC] !== word[0]) {
      continue;
    }

    const path: BoggleCellCoord[] = [{ r: startR, c: startC }];
    const visited = new Set<string>([`${startR},${startC}`]);

    let currR = startR;
    let currC = startC;
    let pathFound = true;

    for (let i = 1; i < wordLen; i++) {
      const nextLetter = word[i];
      // Gather valid adjacent unvisited or matching cells
      const candidates: BoggleCellCoord[] = [];

      for (let d = 0; d < 8; d++) {
        const nr = currR + DIR_ROW[d];
        const nc = currC + DIR_COL[d];
        const key = `${nr},${nc}`;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(key)) {
          if (grid[nr][nc] === null || grid[nr][nc] === nextLetter) {
            candidates.push({ r: nr, c: nc });
          }
        }
      }

      if (candidates.length === 0) {
        pathFound = false;
        break;
      }

      const nextCell = rng.pick(candidates);
      visited.add(`${nextCell.r},${nextCell.c}`);
      path.push(nextCell);
      currR = nextCell.r;
      currC = nextCell.c;
    }

    if (pathFound && path.length === wordLen) {
      // Commit word to grid
      for (let i = 0; i < wordLen; i++) {
        const { r, c } = path[i];
        grid[r][c] = word[i];
      }
      return true;
    }
  }

  return false;
}

/**
 * Generates a calibrated 7x7 Boggle board matching exact level specifications
 */
export function generateBoggleBoard(level: number = 1, customSeed?: string | number): BoggleBoard {
  const safeLevel = Math.max(1, Math.min(120, level));
  const seed = customSeed !== undefined ? `${customSeed}` : `${Date.now()}-${safeLevel}-${Math.random()}`;
  const rng: SeededRandom = createSeededRandom(seed);

  const rows = 7;
  const cols = 7;
  const totalCells = 49;

  const targetWordCount = getBoggleTargetWordCount(safeLevel);
  const timeAllowedSec = getBoggleTimeAllowedSec(safeLevel);
  const minWordLength = getBoggleMinWordLength(safeLevel);
  const levelTier = getBoggleLevelTier(safeLevel);

  let attempts = 0;

  while (attempts < 25) {
    attempts++;

    // Initialize 7x7 empty grid
    const rawGrid: (string | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));

    // For levels with higher minimum lengths, embed serpentine seed words to guarantee valid paths
    if (minWordLength >= 5) {
      const pool = minWordLength >= 8 
        ? TIER_WORDS_8_PLUS 
        : minWordLength >= 7 
        ? TIER_WORDS_7_12 
        : TIER_WORDS_5_7;

      const wordsToPlant = rng.nextInt(3, 6);
      const shuffled = [...pool].sort(() => rng.next() - 0.5);

      for (let w = 0; w < Math.min(wordsToPlant, shuffled.length); w++) {
        plantWordOnGrid(rawGrid, shuffled[w], rng);
      }
    }

    // Fill remaining cells using classic boggle dice distribution
    const dicePool = [
      ...CLASSIC_BOGGLE_DICE_16, 
      ...CLASSIC_BOGGLE_DICE_16, 
      ...CLASSIC_BOGGLE_DICE_16, 
      ...CLASSIC_BOGGLE_DICE_16
    ];

    let vowelCount = 0;
    const finalGrid: string[][] = [];

    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        let letter = rawGrid[r][c];
        if (!letter) {
          const die = dicePool[(r * cols + c) % dicePool.length];
          letter = rng.pick(die);
        }
        if (VOWELS.has(letter)) vowelCount++;
        row.push(letter);
      }
      finalGrid.push(row);
    }

    // Guarantee healthy vowel ratio (at least 25% vowels = ~12 vowels on 7x7)
    const minVowels = Math.floor(totalCells * 0.25);
    if (vowelCount < minVowels) {
      const vowelList = ['A', 'E', 'I', 'O', 'U'];
      let added = 0;
      for (let r = 0; r < rows && added < minVowels - vowelCount; r++) {
        for (let c = 0; c < cols && added < minVowels - vowelCount; c++) {
          if (!VOWELS.has(finalGrid[r][c]) && rawGrid[r][c] === null) {
            finalGrid[r][c] = rng.pick(vowelList);
            added++;
          }
        }
      }
    }

    // Solve the generated grid
    const allValidWords = solveBoggleBoard(finalGrid, rows, cols, minWordLength);

    // Verify sufficient valid words exist
    if (allValidWords.size >= Math.max(targetWordCount, 6)) {
      let maxScore = 0;
      allValidWords.forEach((_, word) => {
        const len = word.length;
        maxScore += len === 3 ? 1 : len === 4 ? 2 : len === 5 ? 4 : len === 6 ? 6 : len === 7 ? 9 : 15;
      });

      return {
        rows,
        cols,
        size: 7,
        grid: finalGrid,
        allValidWords,
        totalWordCount: allValidWords.size,
        targetWordCount,
        timeAllowedSec,
        minWordLength,
        maxScore,
        levelTier
      };
    }
  }

  // Fallback 7x7 guaranteed board
  const fallbackGrid: string[][] = [
    ['T', 'R', 'A', 'I', 'N', 'E', 'R'],
    ['P', 'L', 'A', 'N', 'E', 'T', 'S'],
    ['S', 'P', 'R', 'I', 'N', 'G', 'S'],
    ['F', 'O', 'R', 'E', 'S', 'T', 'S'],
    ['G', 'A', 'R', 'D', 'E', 'N', 'S'],
    ['S', 'I', 'L', 'V', 'E', 'R', 'Y'],
    ['W', 'O', 'N', 'D', 'E', 'R', 'S']
  ];
  const allValidWords = solveBoggleBoard(fallbackGrid, 7, 7, minWordLength);

  return {
    rows: 7,
    cols: 7,
    size: 7,
    grid: fallbackGrid,
    allValidWords,
    totalWordCount: allValidWords.size,
    targetWordCount,
    timeAllowedSec,
    minWordLength,
    maxScore: 100,
    levelTier
  };
}

/**
 * Generates Reflex Trail Challenges on 7x7 Boggle Boards.
 */
export function generateBoggleReflexChallenge(level: number, customSeed?: string | number): BoggleReflexTrailChallenge {
  const safeLevel = Math.max(1, Math.min(120, level));
  const board = generateBoggleBoard(safeLevel, customSeed);
  const wordsList = Array.from(board.allValidWords.keys());

  const targetWords = wordsList.filter(w => {
    if (safeLevel <= 10) return w.length >= 3 && w.length <= 5;
    if (safeLevel <= 25) return w.length >= 5 && w.length <= 7;
    return w.length >= 7;
  });

  const chosenWord = targetWords.length > 0
    ? targetWords[Math.floor(Math.random() * targetWords.length)]
    : wordsList[0] || 'TRAIN';

  const targetPath = board.allValidWords.get(chosenWord) || [];

  return {
    id: `boggle-ref-${safeLevel}-${chosenWord}`,
    board,
    targetWord: chosenWord,
    targetPath,
    hint: `Find the adjacent letter path spelling "${chosenWord}" (${chosenWord.length} letters)`,
    options: [
      { id: 'opt-1', path: targetPath, displayLabel: chosenWord, isCorrect: true }
    ],
    correctAnswer: chosenWord,
    targetTimeSec: safeLevel <= 10 ? 20 : 15
  };
}
