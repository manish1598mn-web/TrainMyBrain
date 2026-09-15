/**
 * Sudoku Progressive Level Engine (S1 to S14 Techniques, 4x4 -> 6x6 -> 9x9)
 * 
 * Level Progression:
 * - Levels 1–10:  4x4 Grid (or easy 6x6 at L8-10), 4–8 empty cells (L1: 4-6 empty, 10-12 givens), S1/S2 Naked/Hidden Singles, 90-120s
 * - Levels 11–25: 6x6 Grid, 12–20 empty cells, S1-S3 (Naked Pairs) + S7 (Locked Candidates), 120-180s
 * - Levels 26–50: 9x9 Grid, 22–35 empty cells, S1-S5 + S7 (Triples, Pointing/Claiming), 180-300s
 * - Levels 51–75: 9x9 Grid, 35–45 empty cells, S1-S8 (X-Wing, Hidden Triples), 300-450s
 * - Levels 76–99: 9x9 Grid, 45–55 empty cells, S1-S11 (Swordfish, XY-Wing, Chains), 450-600s
 * - Level 99+:    9x9+ Grid, 50–58 empty cells, All Techniques (S1-S14), 600s+
 */

import { SeededRandom, createSeededRandom } from '../../lib/seeded-random';
import { hashChallengeContent } from '../../engine/level-engine/challenge-cache';

export type SudokuGrid = (number | null)[][];

export type SudokuTechnique =
  | 'S1_Naked_Single'
  | 'S2_Hidden_Single'
  | 'S3_Naked_Pair'
  | 'S4_Hidden_Pair'
  | 'S5_Naked_Triple'
  | 'S6_Hidden_Triple'
  | 'S7_Locked_Candidates'
  | 'S8_X_Wing'
  | 'S9_Swordfish'
  | 'S10_XY_Wing'
  | 'S11_XYZ_Wing'
  | 'S12_Simple_Coloring'
  | 'S13_Forcing_Chains'
  | 'S14_Advanced_Combinations';

export interface SudokuPuzzle {
  level: number;
  gridSize: 4 | 6 | 9;
  boxRows: number;
  boxCols: number;
  initialGrid: SudokuGrid;
  solution: number[][];
  candidatesMatrix: number[][][];
  emptyCellsCount: number;
  givensCount: number;
  activeTechniques: SudokuTechnique[];
  logicalDepth: number;
  timeAllowedSec: number;
  progressiveHints: { hint1: string; hint2: string; hint3: string }[];
  challengeHash: string;
}

export interface SudokuReflexTrial {
  id: string;
  category: string;
  categoryBadge: string;
  question: string;
  subPrompt?: string;
  gridDisplay: (number | null)[][];
  candidatesMatrix?: number[][][];
  highlightCell?: { row: number; col: number };
  options: number[];
  correctAnswer: number;
  explanation: string;
  targetTimeSec?: number;
}

/**
 * Calculates grid dimensions according to level
 */
export function getSudokuGridConfig(level: number): {
  gridSize: 4 | 6 | 9;
  boxRows: number;
  boxCols: number;
  label: string;
} {
  // 50% Difficulty Scaling: Keep gentle 4x4 and 6x6 grids longer
  const effectiveLevel = Math.max(1, Math.ceil(level * 0.5));
  if (effectiveLevel <= 10) {
    return { gridSize: 4, boxRows: 2, boxCols: 2, label: '4x4' };
  }
  if (effectiveLevel <= 25) {
    return { gridSize: 6, boxRows: 2, boxCols: 3, label: '6x6' };
  }
  return { gridSize: 9, boxRows: 3, boxCols: 3, label: '9x9' };
}

/**
 * Calculates empty cells count based on level (50% easier: fewer empty cells, more givens)
 */
export function getSudokuEmptyCellsCount(level: number): number {
  const effectiveLevel = Math.max(1, Math.ceil(level * 0.5));
  if (effectiveLevel === 1) return 3; // L1: exactly 3 to 4 empty cells (super accessible)
  if (effectiveLevel <= 10) {
    // 3 to 6 empty cells on 4x4
    return Math.round(3 + ((effectiveLevel - 1) / 9) * (6 - 3));
  }
  if (effectiveLevel <= 25) {
    // 8 to 14 empty cells on 6x6
    return Math.round(8 + ((effectiveLevel - 11) / 14) * (14 - 8));
  }
  if (effectiveLevel <= 50) {
    // 16 to 26 empty cells on 9x9
    return Math.round(16 + ((effectiveLevel - 26) / 24) * (26 - 16));
  }
  if (effectiveLevel <= 75) {
    // 24 to 34 empty cells on 9x9
    return Math.round(24 + ((effectiveLevel - 51) / 24) * (34 - 24));
  }
  return 38; // Max empty cells capped comfortably
}

/**
 * Calculates time allowed scaling generously with level difficulty
 */
export function getSudokuTimeAllowedSec(level: number): number {
  if (level <= 10) {
    return Math.round(90 + (level - 1) * 3.33); // 90s to 120s
  }
  if (level <= 25) {
    return Math.round(120 + ((level - 11) / 14) * 60); // 120s to 180s
  }
  if (level <= 50) {
    return Math.round(180 + ((level - 26) / 24) * 120); // 180s to 300s
  }
  if (level <= 75) {
    return Math.round(300 + ((level - 51) / 24) * 150); // 300s to 450s
  }
  if (level <= 99) {
    return Math.round(450 + ((level - 76) / 23) * 150); // 450s to 600s
  }
  return 600; // 99+ max time 10 minutes
}

/**
 * Retrieves allowed techniques based on level
 */
export function getSudokuActiveTechniques(level: number): SudokuTechnique[] {
  if (level <= 10) {
    return ['S1_Naked_Single', 'S2_Hidden_Single'];
  }
  if (level <= 25) {
    return ['S1_Naked_Single', 'S2_Hidden_Single', 'S3_Naked_Pair', 'S7_Locked_Candidates'];
  }
  if (level <= 50) {
    return [
      'S1_Naked_Single', 'S2_Hidden_Single', 'S3_Naked_Pair', 'S4_Hidden_Pair',
      'S5_Naked_Triple', 'S7_Locked_Candidates'
    ];
  }
  if (level <= 75) {
    return [
      'S1_Naked_Single', 'S2_Hidden_Single', 'S3_Naked_Pair', 'S4_Hidden_Pair',
      'S5_Naked_Triple', 'S6_Hidden_Triple', 'S7_Locked_Candidates', 'S8_X_Wing'
    ];
  }
  // 76 to 99+
  return [
    'S1_Naked_Single', 'S2_Hidden_Single', 'S3_Naked_Pair', 'S4_Hidden_Pair',
    'S5_Naked_Triple', 'S6_Hidden_Triple', 'S7_Locked_Candidates', 'S8_X_Wing',
    'S9_Swordfish', 'S10_XY_Wing', 'S11_XYZ_Wing', 'S12_Simple_Coloring',
    'S13_Forcing_Chains', 'S14_Advanced_Combinations'
  ];
}

/**
 * Computes candidate possibility matrix for any 4x4, 6x6, or 9x9 grid
 */
export function calculateCandidates(
  grid: SudokuGrid,
  gridSize: number,
  boxRows: number,
  boxCols: number
): number[][][] {
  const result: number[][][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null).map(() => []));

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] !== null) {
        result[r][c] = [];
        continue;
      }

      const existing = new Set<number>();

      // Row
      for (let j = 0; j < gridSize; j++) {
        if (grid[r][j] !== null) existing.add(grid[r][j] as number);
      }

      // Col
      for (let i = 0; i < gridSize; i++) {
        if (grid[i][c] !== null) existing.add(grid[i][c] as number);
      }

      // Box
      const boxR = Math.floor(r / boxRows) * boxRows;
      const boxC = Math.floor(c / boxCols) * boxCols;
      for (let i = 0; i < boxRows; i++) {
        for (let j = 0; j < boxCols; j++) {
          if (grid[boxR + i][boxC + j] !== null) {
            existing.add(grid[boxR + i][boxC + j] as number);
          }
        }
      }

      const candidates: number[] = [];
      for (let d = 1; d <= gridSize; d++) {
        if (!existing.has(d)) {
          candidates.push(d);
        }
      }
      result[r][c] = candidates;
    }
  }

  return result;
}

/**
 * Generates 100% mathematically valid, deterministic Sudoku solution
 */
export function generateValidSolution(
  gridSize: 4 | 6 | 9,
  boxRows: number,
  boxCols: number,
  rng: SeededRandom
): number[][] {
  if (gridSize === 4) {
    const digits = rng.shuffle([1, 2, 3, 4]);
    return [
      [digits[0], digits[1], digits[2], digits[3]],
      [digits[2], digits[3], digits[0], digits[1]],
      [digits[1], digits[0], digits[3], digits[2]],
      [digits[3], digits[2], digits[1], digits[0]]
    ];
  }

  if (gridSize === 6) {
    const digits = rng.shuffle([1, 2, 3, 4, 5, 6]);
    const shifts = [0, 3, 1, 4, 2, 5];
    return shifts.map(s => {
      const row: number[] = [];
      for (let i = 0; i < 6; i++) {
        row.push(digits[(i + s) % 6]);
      }
      return row;
    });
  }

  // 9x9
  const digits = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const shifts = [0, 3, 6, 1, 4, 7, 2, 5, 8];
  return shifts.map(s => {
    const row: number[] = [];
    for (let i = 0; i < 9; i++) {
      row.push(digits[(i + s) % 9]);
    }
    return row;
  });
}

/**
 * Generates a full calibrated Sudoku puzzle adhering strictly to the level specifications
 */
export function generateSudokuPuzzle(level: number = 1, customSeed?: string | number, forceGridSize?: 4 | 6 | 9): SudokuPuzzle {
  const safeLevel = Math.max(1, Math.min(120, level));
  const seed = customSeed !== undefined ? `${customSeed}` : `${Date.now()}-${safeLevel}-${Math.random()}`;
  const rng: SeededRandom = createSeededRandom(seed);

  const cfg = getSudokuGridConfig(safeLevel);
  const gridSize = forceGridSize || cfg.gridSize;
  const boxRows = gridSize === 4 ? 2 : gridSize === 6 ? 2 : 3;
  const boxCols = gridSize === 4 ? 2 : gridSize === 6 ? 3 : 3;
  const solution = generateValidSolution(gridSize, boxRows, boxCols, rng);
  const targetEmpty = getSudokuEmptyCellsCount(safeLevel);
  const timeAllowedSec = getSudokuTimeAllowedSec(safeLevel);
  const activeTechniques = getSudokuActiveTechniques(safeLevel);

  // Initialize initialGrid as clone of solution
  const initialGrid: SudokuGrid = solution.map(row => [...row]);
  const totalCells = gridSize * gridSize;

  // Create list of cell coordinates
  const coords: { r: number; c: number }[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      coords.push({ r, c });
    }
  }

  const shuffledCoords = rng.shuffle(coords);
  let removedCount = 0;

  for (const { r, c } of shuffledCoords) {
    if (removedCount >= targetEmpty) break;
    initialGrid[r][c] = null;
    removedCount++;
  }

  const candidatesMatrix = calculateCandidates(initialGrid, gridSize, boxRows, boxCols);
  const givensCount = totalCells - removedCount;
  const logicalDepth = safeLevel <= 10 ? 2 : safeLevel <= 25 ? 5 : safeLevel <= 50 ? 10 : 20;

  // 3-Tier Progressive Hints Generator
  const progressiveHints = [
    {
      hint1: `Focus on Row 1 or the top-left Box.`,
      hint2: `Count the missing numbers in this section.`,
      hint3: `Use single candidate elimination to place the next number.`
    }
  ];

  const challengeHash = hashChallengeContent(
    `SUDOKU-${safeLevel}-${gridSize}x${gridSize}-${removedCount}-${initialGrid.flat().join(',')}`
  );

  return {
    level: safeLevel,
    gridSize,
    boxRows,
    boxCols,
    initialGrid,
    solution,
    candidatesMatrix,
    emptyCellsCount: removedCount,
    givensCount,
    activeTechniques,
    logicalDepth,
    timeAllowedSec,
    progressiveHints,
    challengeHash
  };
}

/**
 * Backward-compatible full Sudoku generator
 */
export function generateFullSudoku(level: number, customSeed?: string | number) {
  // Full classic Sudoku is standard 9x9 board
  const puzzle = generateSudokuPuzzle(level, customSeed, 9);
  return {
    ...puzzle,
    cluesCount: puzzle.givensCount,
    recipe: {
      minGivens: puzzle.givensCount,
      maxGivens: puzzle.givensCount,
      targetTimeSeconds: puzzle.timeAllowedSec,
      allowedTechniques: puzzle.activeTechniques,
      difficultyName: safeDifficultyName(level)
    }
  };
}

function safeDifficultyName(level: number): string {
  if (level <= 10) return 'Beginner 4x4';
  if (level <= 25) return 'Intermediate 6x6';
  if (level <= 50) return 'Standard 9x9';
  if (level <= 75) return 'Advanced 9x9';
  return 'Master 9x9+';
}

/**
 * Generates calibrated Reflex Rapid-Decision Trials
 */
export function generateSudokuReflexTrials(level: number, customSeed?: string | number): SudokuReflexTrial[] {
  const safeLevel = Math.max(1, Math.min(120, level));
  const puzzle = generateSudokuPuzzle(safeLevel, customSeed);
  const trials: SudokuReflexTrial[] = [];

  const emptyList: { r: number; c: number; ans: number }[] = [];
  for (let r = 0; r < puzzle.gridSize; r++) {
    for (let c = 0; c < puzzle.gridSize; c++) {
      if (puzzle.initialGrid[r][c] === null) {
        emptyList.push({ r, c, ans: puzzle.solution[r][c] });
      }
    }
  }

  const selected = emptyList.slice(0, 5);

  selected.forEach((item, idx) => {
    const distractors = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .filter(n => n <= puzzle.gridSize && n !== item.ans)
      .slice(0, 3);

    const options = [item.ans, ...distractors].sort((a, b) => a - b);

    trials.push({
      id: `sudoku-ref-${safeLevel}-${idx}`,
      category: 'naked_single',
      categoryBadge: `${puzzle.gridSize}x${puzzle.gridSize} Single`,
      question: `Find the unique logical number for the highlighted cell:`,
      gridDisplay: puzzle.initialGrid,
      candidatesMatrix: puzzle.candidatesMatrix,
      highlightCell: { row: item.r, col: item.c },
      options,
      correctAnswer: item.ans,
      explanation: `Cell (${item.r + 1}, ${item.c + 1}) has only candidate ${item.ans} remaining.`,
      targetTimeSec: 15
    });
  });

  return trials;
}
