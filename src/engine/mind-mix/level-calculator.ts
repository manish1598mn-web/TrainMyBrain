import { GameId } from '../game-engine/types';

/**
 * Universal Mind Mix Derived Level Engine
 *
 * Mind Mix Level is derived directly from the candidate's 5 game levels:
 * MindMixLevel = 70% Average Game Level + 30% Weakest Game Level
 *
 * This ensures the overall session difficulty realistically reflects cognitive balance.
 */
export function calculateMindMixLevel(levels: Record<GameId, number>): number {
  const gameIds: GameId[] = ['sudoku', 'zebra', 'wordspeed', 'anzan', 'boggle'];
  const values = gameIds.map(id => levels[id] ?? 1);

  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const weakest = Math.min(...values);

  // 70% average + 30% weakest skill weighting
  const derived = (average * 0.70) + (weakest * 0.30);
  return Math.max(1, Math.round(derived));
}

/**
 * Generates the sequence of 5 game rounds for Mind Mix,
 * assigning each round the candidate's individual player level for that game.
 */
export function getMindMixRoundsPlan(levels: Record<GameId, number>) {
  return [
    {
      gameId: 'anzan' as GameId,
      name: 'Pro Calculations',
      skillName: 'Mental Arithmetic',
      level: levels.anzan ?? 1,
      durationSec: 28
    },
    {
      gameId: 'boggle' as GameId,
      name: 'Boggle',
      skillName: 'Visual Lexical Search',
      level: levels.boggle ?? 1,
      durationSec: 30
    },
    {
      gameId: 'wordspeed' as GameId,
      name: 'Word Speed',
      skillName: 'Verbal Processing Speed',
      level: levels.wordspeed ?? 1,
      durationSec: 28
    },
    {
      gameId: 'sudoku' as GameId,
      name: 'Sudoku Reflex',
      skillName: 'Constraint Logic',
      level: levels.sudoku ?? 1,
      durationSec: 32
    },
    {
      gameId: 'zebra' as GameId,
      name: 'Puzzles',
      skillName: 'Complex Reasoning',
      level: levels.zebra ?? 1,
      durationSec: 35
    }
  ];
}
