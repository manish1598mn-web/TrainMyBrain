/**
 * Boggle Progressive Difficulty & Board Generation Engine
 * 
 * Grid Dimension Progression:
 * - Levels 1–10:  4x4, 4x5, 5x5, 6x5, 6x6
 * - Levels 11–25: 6x7 to 9x9
 * - Levels 26–50: 9x10 to 15x15
 * - Levels 51–99+: 15x16 to 25x25
 * - Level 99+:    25x25 (All constraints activated)
 * 
 * Timing:
 * - Exactly 10 seconds per target word building: Time = max(60, targetWords * 10)
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
  size?: number;
  grid: string[][];
  allValidWords: Map<string, BoggleCellCoord[]>;
  totalWordCount: number;
  targetWordCount: number;
  timeAllowedSec: number;
  minWordLength: number;
  maxScore: number;
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

/**
 * Calculates exact grid dimensions according to the progressive difficulty algorithm:
 * - 1-10: 4x4, 4x5, 5x5, 6x5, 6x6
 * - 11-25: 6x7 to 9x9
 * - 25-50: 9x10 to 15x15
 * - 50-99+: 15x16 to 25x25
 */
export function getBoggleDimensions(level: number): { rows: number; cols: number; label: string } {
  if (level <= 10) {
    if (level === 1) return { rows: 4, cols: 4, label: '4x4' };
    if (level <= 3) return { rows: 4, cols: 5, label: '4x5' };
    if (level <= 5) return { rows: 5, cols: 5, label: '5x5' };
    if (level <= 7) return { rows: 6, cols: 5, label: '6x5' };
    return { rows: 6, cols: 6, label: '6x6' };
  }

  if (level <= 25) {
    if (level <= 13) return { rows: 6, cols: 7, label: '6x7' };
    if (level <= 17) return { rows: 7, cols: 7, label: '7x7' };
    if (level <= 21) return { rows: 8, cols: 8, label: '8x8' };
    return { rows: 9, cols: 9, label: '9x9' };
  }

  if (level <= 50) {
    if (level <= 29) return { rows: 9, cols: 10, label: '9x10' };
    if (level <= 34) return { rows: 10, cols: 10, label: '10x10' };
    if (level <= 39) return { rows: 11, cols: 11, label: '11x11' };
    if (level <= 44) return { rows: 12, cols: 12, label: '12x12' };
    if (level <= 48) return { rows: 14, cols: 14, label: '14x14' };
    return { rows: 15, cols: 15, label: '15x15' };
  }

  // 51 to 99+
  if (level <= 60) return { rows: 15, cols: 16, label: '15x16' };
  if (level <= 70) return { rows: 18, cols: 18, label: '18x18' };
  if (level <= 80) return { rows: 20, cols: 20, label: '20x20' };
  if (level <= 90) return { rows: 22, cols: 22, label: '22x22' };
  return { rows: 25, cols: 25, label: '25x25' };
}

/**
 * Calculates target words count to find for the level
 */
export function getBoggleTargetWordCount(level: number): number {
  if (level <= 10) {
    // 4 to 8 words
    return Math.round(4 + ((level - 1) / 9) * (8 - 4));
  }
  if (level <= 25) {
    // 8 to 14 words
    return Math.round(8 + ((level - 11) / 14) * (14 - 8));
  }
  if (level <= 50) {
    // 14 to 20 words
    return Math.round(14 + ((level - 26) / 24) * (20 - 14));
  }
  if (level <= 99) {
    // 20 to 35 words
    return Math.round(20 + ((level - 51) / 48) * (35 - 20));
  }
  return 35;
}

/**
 * Calculates time allowed: 10 seconds per target word (with 60s minimum comfortable baseline)
 */
export function getBoggleTimeAllowedSec(level: number): number {
  const targetWords = getBoggleTargetWordCount(level);
  return Math.max(60, targetWords * 10);
}

/**
 * Calculates minimum required word length based on level
 */
export function getBoggleMinWordLength(level: number): number {
  if (level <= 10) return 3;
  if (level <= 25) return 3;
  if (level <= 50) return 4;
  return 4;
}

/**
 * High-Speed DFS Prefix Trie Solver for arbitrary rows x cols grids.
 */
export function solveBoggleBoard(grid: string[][], rows: number, cols: number, minLength: number = 3): Map<string, BoggleCellCoord[]> {
  const foundWords = new Map<string, BoggleCellCoord[]>();
  const visited: boolean[][] = Array(rows).fill(false).map(() => Array(cols).fill(false));

  function dfs(r: number, c: number, currentWord: string, currentPath: BoggleCellCoord[]) {
    if (foundWords.size >= 120) return; // Early cut-off for large dense grids

    const char = grid[r][c];
    const newWord = currentWord + char;

    // Prune invalid prefixes immediately in O(L) time
    if (!boggleTrie.hasPrefix(newWord)) {
      return;
    }

    const newPath = [...currentPath, { r, c }];

    if (newWord.length >= minLength && boggleTrie.isWord(newWord)) {
      if (!foundWords.has(newWord)) {
        foundWords.set(newWord, newPath);
      }
    }

    if (newWord.length >= 8) return; // Max search depth per branch

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
      if (foundWords.size >= 100) break;
    }
    if (foundWords.size >= 100) break;
  }

  return foundWords;
}

/**
 * Generates calibrated Boggle board matching exact level specifications
 */
export function generateBoggleBoard(level: number = 1, customSeed?: string | number): BoggleBoard {
  const safeLevel = Math.max(1, Math.min(120, level));
  const seed = customSeed !== undefined ? `${customSeed}` : `${Date.now()}-${safeLevel}-${Math.random()}`;
  const rng: SeededRandom = createSeededRandom(seed);

  const { rows, cols } = getBoggleDimensions(safeLevel);
  const targetWordCount = getBoggleTargetWordCount(safeLevel);
  const timeAllowedSec = getBoggleTimeAllowedSec(safeLevel);
  const minWordLength = getBoggleMinWordLength(safeLevel);

  const totalCells = rows * cols;
  let attempts = 0;

  while (attempts < 20) {
    attempts++;

    // Generate letters using dice distributions and frequency balancing
    const letters: string[] = [];
    const dicePool = [...CLASSIC_BOGGLE_DICE_16, ...CLASSIC_BOGGLE_DICE_16, ...CLASSIC_BOGGLE_DICE_16, ...CLASSIC_BOGGLE_DICE_16];

    for (let i = 0; i < totalCells; i++) {
      const die = dicePool[i % dicePool.length];
      letters.push(rng.pick(die));
    }

    // Convert into 2D grid
    const grid: string[][] = [];
    let vowelCount = 0;

    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        const letter = letters[r * cols + c];
        if (VOWELS.has(letter)) vowelCount++;
        row.push(letter);
      }
      grid.push(row);
    }

    // Guarantee minimum vowel ratio (>= 20% vowels)
    const minVowels = Math.max(3, Math.floor(totalCells * 0.20));
    if (vowelCount < minVowels) {
      const vowelList = ['A', 'E', 'I', 'O', 'U'];
      for (let i = 0; i < minVowels - vowelCount; i++) {
        const rr = i % rows;
        const cc = (i * 2) % cols;
        grid[rr][cc] = vowelList[i % vowelList.length];
      }
    }

    const allValidWords = solveBoggleBoard(grid, rows, cols, minWordLength);

    if (allValidWords.size >= Math.max(8, targetWordCount)) {
      let maxScore = 0;
      allValidWords.forEach((_, word) => {
        const len = word.length;
        maxScore += len === 3 ? 1 : len === 4 ? 2 : len === 5 ? 4 : len === 6 ? 6 : 10;
      });

      return {
        rows,
        cols,
        size: rows,
        grid,
        allValidWords,
        totalWordCount: allValidWords.size,
        targetWordCount,
        timeAllowedSec,
        minWordLength,
        maxScore
      };
    }
  }

  // Fallback guaranteed board
  const fallbackGrid: string[][] = [
    ['T', 'R', 'A', 'I'],
    ['N', 'E', 'P', 'N'],
    ['B', 'A', 'L', 'S'],
    ['O', 'A', 'N', 'T']
  ];
  const allValidWords = solveBoggleBoard(fallbackGrid, 4, 4, 3);

  return {
    rows: 4,
    cols: 4,
    size: 4,
    grid: fallbackGrid,
    allValidWords,
    totalWordCount: allValidWords.size,
    targetWordCount: 4,
    timeAllowedSec: 60,
    minWordLength: 3,
    maxScore: 45
  };
}

/**
 * Generates Reflex Trail Challenges on Boggle Boards.
 */
export function generateBoggleReflexChallenge(level: number, customSeed?: string | number): BoggleReflexTrailChallenge {
  const safeLevel = Math.max(1, Math.min(120, level));
  const board = generateBoggleBoard(safeLevel, customSeed);
  const wordsList = Array.from(board.allValidWords.keys());

  const targetWords = wordsList.filter(w => {
    if (safeLevel <= 10) return w.length >= 3 && w.length <= 4;
    if (safeLevel <= 30) return w.length >= 4 && w.length <= 5;
    return w.length >= 5;
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
    targetTimeSec: safeLevel <= 10 ? 15 : 10
  };
}
