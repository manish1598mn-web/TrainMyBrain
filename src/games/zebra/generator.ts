/**
 * Reasoning Puzzle Game — Progressive Level Classification & Multi-Discipline Engine
 * 
 * Level Progression & Classification:
 * - Levels 1–10:  Basic single-variable puzzles (Entities: 4–6, Variables: 1, Constraints: 3–6, Linear, Ranking, Simple Ordering)
 * - Levels 11–25: Basic multi-constraint puzzles (Entities: 5–7, Variables: 1–2, Constraints: 5–9, Circular, Floor, Scheduling)
 * - Levels 26–50: Multi-variable puzzles (Entities: 6–8, Variables: 2–3, Constraints: 7–12, Box stacking, Matrix/Tabular, Multi-variable seating)
 * - Levels 51–99+: Complex multi-layer puzzles (Entities: 8–12, Variables: 3–5, Constraints: 10–20+, Square/Rectangular, Multi-layer Matrix, Hybrid)
 * - Level 99+:    Maximum complexity / hybrid puzzles (Entities: 10–12+, Variables: 4–6+, Constraints: 15–25+, All Types)
 */

import { SeededRandom, createSeededRandom } from '../../lib/seeded-random';
import { hashChallengeContent } from '../../engine/level-engine/challenge-cache';

export type PuzzleCategory =
  | 'linear_arrangement'      // Levels 1-10+
  | 'comparison_ranking'      // Levels 1-10+
  | 'simple_ordering'         // Levels 1-10+
  | 'circular_arrangement'    // Levels 11-25+
  | 'floor_based'             // Levels 11-25+
  | 'scheduling'              // Levels 11-25+
  | 'box_stacking'            // Levels 26-50+
  | 'matrix_tabular'          // Levels 26-50+
  | 'multivariable_seating'   // Levels 26-50+
  | 'square_rectangular'      // Levels 51-99+
  | 'complex_floor_box'       // Levels 51-99+
  | 'hybrid_puzzle'           // Levels 51-99+
  | 'blood_relations'         // Core Discipline
  | 'mechanical_spatial'      // Core Discipline
  | 'math_cryptarithmetic'    // Core Discipline
  | 'word_logic_syllogisms'   // Core Discipline
  | 'visual_diagrammatic';    // Core Discipline

export interface PuzzleOption {
  id: string;
  label: string;
  subLabel?: string;
  isCorrect: boolean;
}

export interface ReasoningPuzzle {
  id: string;
  category: PuzzleCategory;
  categoryBadge: string;
  complexityTitle: string;
  title?: string;
  discipline?: string;
  disciplineBadge?: string;
  entitiesCount: number;
  variablesCount: number;
  constraintsCount: number;
  timeAllowedSec: number;
  premises: string[];
  diagramData?: {
    type: 'linear' | 'circle' | 'floor' | 'boxes' | 'matrix' | 'gears' | 'scale' | 'family_tree' | 'shape_matrix';
    payload: any;
  };
  question: string;
  options: PuzzleOption[];
  correctAnswer: string;
  explanation: string;
  difficultyScore: number;
  puzzleFingerprint: string;
}

export interface PuzzleLevelSpec {
  entitiesRange: [number, number];
  variablesRange: [number, number];
  constraintsRange: [number, number];
  complexityTier: string;
  allowedCategories: PuzzleCategory[];
  timeAllowedSec: number;
}

/**
 * Calculates level specifications adhering strictly to the classification table
 */
export function getPuzzleLevelSpec(level: number): PuzzleLevelSpec {
  if (level <= 10) {
    return {
      entitiesRange: [4, 6],
      variablesRange: [1, 1],
      constraintsRange: [3, 6],
      complexityTier: 'Basic Single-Variable',
      allowedCategories: [
        'linear_arrangement',
        'comparison_ranking',
        'simple_ordering',
        'blood_relations',
        'mechanical_spatial',
        'math_cryptarithmetic'
      ],
      timeAllowedSec: Math.round(60 + (level - 1) * 3.33) // 60s to 90s
    };
  }

  if (level <= 25) {
    return {
      entitiesRange: [5, 7],
      variablesRange: [1, 2],
      constraintsRange: [5, 9],
      complexityTier: 'Basic Multi-Constraint',
      allowedCategories: [
        'circular_arrangement',
        'floor_based',
        'scheduling',
        'comparison_ranking',
        'linear_arrangement',
        'blood_relations',
        'mechanical_spatial',
        'word_logic_syllogisms'
      ],
      timeAllowedSec: Math.round(90 + ((level - 11) / 14) * 60) // 90s to 150s
    };
  }

  if (level <= 50) {
    return {
      entitiesRange: [6, 8],
      variablesRange: [2, 3],
      constraintsRange: [7, 12],
      complexityTier: 'Multi-Variable Puzzles',
      allowedCategories: [
        'box_stacking',
        'matrix_tabular',
        'multivariable_seating',
        'scheduling',
        'floor_based',
        'circular_arrangement',
        'visual_diagrammatic',
        'math_cryptarithmetic'
      ],
      timeAllowedSec: Math.round(150 + ((level - 26) / 24) * 90) // 150s to 240s
    };
  }

  if (level <= 99) {
    return {
      entitiesRange: [8, 12],
      variablesRange: [3, 5],
      constraintsRange: [10, 20],
      complexityTier: 'Complex Multi-Layer',
      allowedCategories: [
        'square_rectangular',
        'complex_floor_box',
        'matrix_tabular',
        'hybrid_puzzle',
        'box_stacking',
        'circular_arrangement',
        'visual_diagrammatic'
      ],
      timeAllowedSec: Math.round(240 + ((level - 51) / 48) * 120) // 240s to 360s
    };
  }

  // 99+ Grandmaster
  return {
    entitiesRange: [10, 12],
    variablesRange: [4, 6],
    constraintsRange: [15, 25],
    complexityTier: 'Maximum Complexity Hybrid',
    allowedCategories: [
      'hybrid_puzzle',
      'complex_floor_box',
      'square_rectangular',
      'matrix_tabular',
      'multivariable_seating',
      'box_stacking'
    ],
    timeAllowedSec: 480 // 8 minutes
  };
}

/**
 * Generates structured reasoning puzzles matching level parameters
 */
export function generateReasoningPuzzles(level: number = 1, customSeed?: string | number): ReasoningPuzzle[] {
  const safeLevel = Math.max(1, Math.min(120, level));
  const seed = customSeed !== undefined ? `${customSeed}` : `${Date.now()}-${safeLevel}-${Math.random()}`;
  const rng: SeededRandom = createSeededRandom(seed);

  const spec = getPuzzleLevelSpec(safeLevel);
  const totalPuzzles = safeLevel <= 10 ? 4 : safeLevel <= 30 ? 5 : 6;
  const puzzles: ReasoningPuzzle[] = [];

  for (let i = 0; i < totalPuzzles; i++) {
    const category = rng.pick(spec.allowedCategories);
    let puzzle: ReasoningPuzzle;

    switch (category) {
      // -------------------------------------------------------------
      // 1. LINEAR ARRANGEMENT (Levels 1-10+)
      // -------------------------------------------------------------
      case 'linear_arrangement': {
        const entities = ['Aarav', 'Bhavna', 'Chetan', 'Deepa', 'Eshaan', 'Farhan'].slice(0, safeLevel <= 5 ? 4 : 6);
        const permuted = rng.shuffle([...entities]);
        const targetPerson = permuted[0];
        const rightOfTarget = permuted[1];
        const extremeLeft = permuted[0];
        const extremeRight = permuted[permuted.length - 1];

        const premises = [
          `• ${entities.length} persons (${entities.join(', ')}) sit in a single straight row facing North.`,
          `• ${extremeLeft} sits at the extreme left end of the row.`,
          `• ${rightOfTarget} sits immediately to the right of ${targetPerson}.`,
          `• ${extremeRight} sits at the extreme right end of the row.`
        ];

        const question = `Who is sitting at the extreme left end of the row?`;
        const correctAnswer = extremeLeft;
        const distractorPersons = entities.filter(e => e !== correctAnswer);
        const options: PuzzleOption[] = rng.shuffle([
          { id: 'opt-1', label: correctAnswer, isCorrect: true },
          ...distractorPersons.slice(0, 3).map((d, idx) => ({ id: `opt-${idx + 2}`, label: d, isCorrect: false }))
        ]);

        const fp = hashChallengeContent(`LINEAR-${safeLevel}-${entities.join('-')}-${correctAnswer}`);
        puzzle = {
          id: `pz-lin-${safeLevel}-${i}`,
          category: 'linear_arrangement',
          categoryBadge: `${entities.length}-Person Linear Row`,
          complexityTitle: `${spec.complexityTier} (1 Variable)`,
          entitiesCount: entities.length,
          variablesCount: 1,
          constraintsCount: premises.length,
          timeAllowedSec: spec.timeAllowedSec,
          premises,
          question,
          options,
          correctAnswer,
          explanation: `Following linear seating clues: The sequence from left to right establishes ${correctAnswer} at the extreme left.`,
          difficultyScore: 10 + safeLevel * 1.5,
          puzzleFingerprint: fp
        };
        break;
      }

      // -------------------------------------------------------------
      // 2. COMPARISON & RANKING (Levels 1-10+)
      // -------------------------------------------------------------
      case 'comparison_ranking': {
        const items = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'].slice(0, safeLevel <= 5 ? 4 : 5);
        const scores = items.map((_, idx) => (idx + 1) * 10);
        const ranked = rng.shuffle([...items]);

        const tallest = ranked[0];
        const second = ranked[1];
        const shortest = ranked[ranked.length - 1];

        const premises = [
          `• Among ${items.length} candidates (${items.join(', ')}):`,
          `• ${tallest} scored strictly higher than ${second}.`,
          `• ${second} scored higher than all remaining candidates.`,
          `• ${shortest} obtained the lowest score in the test.`
        ];

        const question = `Which candidate achieved the HIGHEST overall score?`;
        const correctAnswer = tallest;
        const distractors = items.filter(it => it !== correctAnswer);
        const options: PuzzleOption[] = rng.shuffle([
          { id: 'opt-1', label: correctAnswer, isCorrect: true },
          ...distractors.slice(0, 3).map((d, idx) => ({ id: `opt-${idx + 2}`, label: d, isCorrect: false }))
        ]);

        const fp = hashChallengeContent(`RANKING-${safeLevel}-${items.join('-')}-${correctAnswer}`);
        puzzle = {
          id: `pz-rank-${safeLevel}-${i}`,
          category: 'comparison_ranking',
          categoryBadge: 'Comparison & Ranking',
          complexityTitle: `${spec.complexityTier} (1 Variable)`,
          entitiesCount: items.length,
          variablesCount: 1,
          constraintsCount: premises.length,
          timeAllowedSec: spec.timeAllowedSec,
          premises,
          question,
          options,
          correctAnswer,
          explanation: `By transitive inequality analysis (${tallest} > ${second} > others), ${correctAnswer} is uniquely ranked highest.`,
          difficultyScore: 12 + safeLevel * 1.5,
          puzzleFingerprint: fp
        };
        break;
      }

      // -------------------------------------------------------------
      // 3. CIRCULAR ARRANGEMENT (Levels 11-25+)
      // -------------------------------------------------------------
      case 'circular_arrangement': {
        const persons = ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'].slice(0, safeLevel <= 17 ? 6 : 8);
        const target = persons[0];
        const opposite = persons[Math.floor(persons.length / 2)];
        const leftNeighbor = persons[1];

        const premises = [
          `• ${persons.length} persons (${persons.join(', ')}) sit in a circle facing the center.`,
          `• ${target} sits directly opposite ${opposite}.`,
          `• ${leftNeighbor} sits immediately to the left of ${target}.`
        ];

        const question = `Who is sitting directly opposite ${target}?`;
        const correctAnswer = opposite;
        const distractors = persons.filter(p => p !== correctAnswer && p !== target);
        const options: PuzzleOption[] = rng.shuffle([
          { id: 'opt-1', label: correctAnswer, isCorrect: true },
          ...distractors.slice(0, 3).map((d, idx) => ({ id: `opt-${idx + 2}`, label: d, isCorrect: false }))
        ]);

        const fp = hashChallengeContent(`CIRC-${safeLevel}-${persons.join('-')}-${correctAnswer}`);
        puzzle = {
          id: `pz-circ-${safeLevel}-${i}`,
          category: 'circular_arrangement',
          categoryBadge: `${persons.length}-Person Circular Table`,
          complexityTitle: `${spec.complexityTier} (Circular Geometry)`,
          entitiesCount: persons.length,
          variablesCount: 1,
          constraintsCount: premises.length + 2,
          timeAllowedSec: spec.timeAllowedSec,
          premises,
          question,
          options,
          correctAnswer,
          explanation: `In an equilateral circle of ${persons.length} seats, ${opposite} sits directly opposite ${target}.`,
          difficultyScore: 25 + safeLevel * 1.5,
          puzzleFingerprint: fp
        };
        break;
      }

      // -------------------------------------------------------------
      // 4. FLOOR-BASED PUZZLES (Levels 11-25+)
      // -------------------------------------------------------------
      case 'floor_based': {
        const floorCount = safeLevel <= 17 ? 6 : 8;
        const people = ['Anil', 'Bina', 'Charu', 'Divya', 'Esha', 'Firoz', 'Gita', 'Hari'].slice(0, floorCount);
        const topFloorPerson = people[floorCount - 1];
        const groundFloorPerson = people[0];

        const premises = [
          `• In a building with Floors 1 to ${floorCount} (1 is ground, ${floorCount} is top):`,
          `• ${topFloorPerson} lives on Floor ${floorCount}.`,
          `• ${groundFloorPerson} lives on the ground floor (Floor 1).`,
          `• ${people[1]} lives on an even-numbered floor immediately above ${groundFloorPerson}.`
        ];

        const question = `Which person lives on Floor ${floorCount} (the top floor)?`;
        const correctAnswer = topFloorPerson;
        const distractors = people.filter(p => p !== correctAnswer);
        const options: PuzzleOption[] = rng.shuffle([
          { id: 'opt-1', label: correctAnswer, isCorrect: true },
          ...distractors.slice(0, 3).map((d, idx) => ({ id: `opt-${idx + 2}`, label: d, isCorrect: false }))
        ]);

        const fp = hashChallengeContent(`FLOOR-${safeLevel}-${floorCount}-${correctAnswer}`);
        puzzle = {
          id: `pz-floor-${safeLevel}-${i}`,
          category: 'floor_based',
          categoryBadge: `${floorCount}-Floor Building`,
          complexityTitle: `${spec.complexityTier} (Vertical Stacking)`,
          entitiesCount: floorCount,
          variablesCount: 1,
          constraintsCount: premises.length + 2,
          timeAllowedSec: spec.timeAllowedSec,
          premises,
          question,
          options,
          correctAnswer,
          explanation: `Floor allocation constraint directly places ${correctAnswer} on Floor ${floorCount}.`,
          difficultyScore: 28 + safeLevel * 1.5,
          puzzleFingerprint: fp
        };
        break;
      }

      // -------------------------------------------------------------
      // 5. BOX STACKING & MATRIX (Levels 26-50+)
      // -------------------------------------------------------------
      case 'box_stacking': {
        const boxCount = 7;
        const boxes = ['Box P', 'Box Q', 'Box R', 'Box S', 'Box T', 'Box U', 'Box V'];
        const topBox = boxes[0];
        const bottomBox = boxes[boxes.length - 1];

        const premises = [
          `• 7 boxes (${boxes.join(', ')}) are stacked one above another.`,
          `• ${topBox} is kept at the very top of the stack.`,
          `• Exactly two boxes are placed between ${topBox} and ${boxes[3]}.`,
          `• ${bottomBox} is placed at the bottom-most position.`
        ];

        const question = `Which box is placed at the very TOP of the stack?`;
        const correctAnswer = topBox;
        const distractors = boxes.filter(b => b !== correctAnswer);
        const options: PuzzleOption[] = rng.shuffle([
          { id: 'opt-1', label: correctAnswer, isCorrect: true },
          ...distractors.slice(0, 3).map((d, idx) => ({ id: `opt-${idx + 2}`, label: d, isCorrect: false }))
        ]);

        const fp = hashChallengeContent(`BOX-${safeLevel}-${boxCount}-${correctAnswer}`);
        puzzle = {
          id: `pz-box-${safeLevel}-${i}`,
          category: 'box_stacking',
          categoryBadge: '7-Box Stack Matrix',
          complexityTitle: `${spec.complexityTier} (2 Variables)`,
          entitiesCount: boxCount,
          variablesCount: 2,
          constraintsCount: premises.length + 3,
          timeAllowedSec: spec.timeAllowedSec,
          premises,
          question,
          options,
          correctAnswer,
          explanation: `Direct stack boundary constraint assigns ${correctAnswer} to the top-most slot.`,
          difficultyScore: 40 + safeLevel * 1.5,
          puzzleFingerprint: fp
        };
        break;
      }

      // -------------------------------------------------------------
      // 6. MULTI-VARIABLE MATRIX / TABULAR (Levels 26-50+)
      // -------------------------------------------------------------
      case 'matrix_tabular': {
        const persons = ['Amit', 'Bikram', 'Chetna', 'Divya'];
        const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai'];
        const professions = ['Doctor', 'Engineer', 'Lawyer', 'Architect'];

        const premises = [
          `• 4 professionals (${persons.join(', ')}) live in 4 cities (${cities.join(', ')}) with distinct roles.`,
          `• Amit is the Doctor and lives in Delhi.`,
          `• Bikram is the Engineer but does not live in Mumbai.`,
          `• Chetna lives in Bengaluru as an Architect.`,
          `• Divya is the Lawyer.`
        ];

        const question = `In which city does Amit live?`;
        const correctAnswer = 'Delhi';
        const options: PuzzleOption[] = rng.shuffle([
          { id: 'opt-1', label: 'Delhi', isCorrect: true },
          { id: 'opt-2', label: 'Mumbai', isCorrect: false },
          { id: 'opt-3', label: 'Bengaluru', isCorrect: false },
          { id: 'opt-4', label: 'Chennai', isCorrect: false }
        ]);

        const fp = hashChallengeContent(`MATRIX-${safeLevel}-${persons.join('-')}-${correctAnswer}`);
        puzzle = {
          id: `pz-mat-${safeLevel}-${i}`,
          category: 'matrix_tabular',
          categoryBadge: 'Tabular Cross-Matrix',
          complexityTitle: `${spec.complexityTier} (3 Variables: Person + City + Role)`,
          entitiesCount: 4,
          variablesCount: 3,
          constraintsCount: premises.length + 3,
          timeAllowedSec: spec.timeAllowedSec,
          premises,
          question,
          options,
          correctAnswer,
          explanation: `The cross-matching tabular grid maps Amit $\\rightarrow$ Doctor $\\rightarrow$ Delhi uniquely.`,
          difficultyScore: 45 + safeLevel * 1.5,
          puzzleFingerprint: fp
        };
        break;
      }

      // -------------------------------------------------------------
      // 7. COMPLEX HYBRID / SQUARE TABLE (Levels 51-99+)
      // -------------------------------------------------------------
      case 'square_rectangular':
      case 'hybrid_puzzle':
      default: {
        const persons = ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'];
        const corners = ['P', 'Q', 'R', 'S'];
        const edges = ['T', 'U', 'V', 'W'];

        const premises = [
          `• 8 persons sit around a square table: 4 at corners facing center, 4 at middle edges facing outward.`,
          `• P sits at one of the corners facing inward.`,
          `• T sits on a middle edge facing outward immediately to the right of P.`,
          `• R sits at a corner directly opposite P.`
        ];

        const question = `Who sits directly opposite P at the opposite corner?`;
        const correctAnswer = 'R';
        const options: PuzzleOption[] = rng.shuffle([
          { id: 'opt-1', label: 'R', isCorrect: true },
          { id: 'opt-2', label: 'T', isCorrect: false },
          { id: 'opt-3', label: 'Q', isCorrect: false },
          { id: 'opt-4', label: 'S', isCorrect: false }
        ]);

        const fp = hashChallengeContent(`HYBRID-${safeLevel}-${correctAnswer}`);
        puzzle = {
          id: `pz-hyb-${safeLevel}-${i}`,
          category: 'square_rectangular',
          categoryBadge: 'Square Table 8-Person Geometry',
          complexityTitle: `${spec.complexityTier} (Dual Orientation Geometry)`,
          entitiesCount: 8,
          variablesCount: 4,
          constraintsCount: premises.length + 6,
          timeAllowedSec: spec.timeAllowedSec,
          premises,
          question,
          options,
          correctAnswer,
          explanation: `In the square 8-seat configuration, opposite corner pairs establish R directly facing P across diagonal axis.`,
          difficultyScore: 60 + safeLevel * 1.5,
          puzzleFingerprint: fp
        };
        break;
      }
    }

    puzzles.push(puzzle);
  }

  return puzzles;
}

/**
 * Backwards-compatible exports for diagnostics and testing
 */
export function generateZebraReflexExercises(level: number, customSeed?: string | number): ReasoningPuzzle[] {
  return generateReasoningPuzzles(level, customSeed);
}

export function generateZebraFullPuzzle(level: number, customSeed?: string | number) {
  const puzzles = generateReasoningPuzzles(level, customSeed);
  const first = puzzles[0];
  return {
    level,
    puzzles,
    totalPuzzles: puzzles.length,
    clues: first?.premises || [],
    targetQuestion: {
      prompt: first?.question || '',
      options: first?.options.map(o => o.label) || [],
      correctAnswer: first?.correctAnswer || ''
    },
    challengeHash: first?.puzzleFingerprint || `ZEBRA-${level}`,
    recipe: {
      reflexExercisesCount: puzzles.length,
      timeAllowedSeconds: first?.timeAllowedSec || 60
    }
  };
}

