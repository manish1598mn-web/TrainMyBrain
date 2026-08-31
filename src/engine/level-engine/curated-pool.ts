import { GameId } from '../game-engine/types';

export interface CuratedMilestoneChallenge {
  gameId: GameId;
  level: number;
  title: string;
  badge: string;
  description: string;
  payload: any;
}

export const CURATED_MILESTONES: Record<string, CuratedMilestoneChallenge> = {
  // --- Word Speed Milestones ---
  'wordspeed-10': {
    gameId: 'wordspeed',
    level: 10,
    title: 'Verbal Recognition Foundation',
    badge: 'Milestone 10',
    description: 'High-frequency exam vocabulary with rapid orthographic discrimination.',
    payload: {
      mode: 'word_match'
    }
  },
  'wordspeed-25': {
    gameId: 'wordspeed',
    level: 25,
    title: 'Odd Word Out Sprint',
    badge: 'Milestone 25',
    description: 'Rapid categorization and spotting subtle spelling distractors.',
    payload: {
      mode: 'odd_word'
    }
  },
  'wordspeed-50': {
    gameId: 'wordspeed',
    level: 50,
    title: 'Semantic Association Mastery',
    badge: 'Milestone 50',
    description: 'Advanced synonym/antonym and multi-variable word recall.',
    payload: {
      mode: 'basic_meaning'
    }
  },

  // --- Boggle Milestones ---
  'boggle-25': {
    gameId: 'boggle',
    level: 25,
    title: 'Lexical Speed Gateway',
    badge: 'Milestone 25',
    description: '4x4 Boggle board discovery requiring 8+ unique words in 60s.',
    payload: {
      gridSize: 4,
      minWordLength: 3,
      targetWordsCount: 8
    }
  },
  'boggle-50': {
    gameId: 'boggle',
    level: 50,
    title: 'Big Boggle Grandmaster Benchmark',
    badge: 'Milestone 50',
    description: '5x5 Big Boggle grid with 4+ letter word constraints and high-yield scoring.',
    payload: {
      gridSize: 5,
      minWordLength: 4,
      targetWordsCount: 12
    }
  },

  // --- Anzan Milestones ---
  'anzan-25': {
    gameId: 'anzan',
    level: 25,
    title: '2-Digit Working Memory Gate',
    badge: 'Milestone 25',
    description: 'Continuous 5-term mental addition stream at 650ms tempo.',
    payload: {
      digitCount: 2,
      steps: 5,
      flashDurationMs: 650
    }
  },
  'anzan-50': {
    gameId: 'anzan',
    level: 50,
    title: 'Mixed Operations Precision',
    badge: 'Milestone 50',
    description: 'Rapid addition and subtraction with strict positive running buffers.',
    payload: {
      digitCount: 2,
      steps: 7,
      allowSubtraction: true,
      flashDurationMs: 500
    }
  },

  // --- Sudoku Milestones ---
  'sudoku-25': {
    gameId: 'sudoku',
    level: 25,
    title: 'Full 9x9 Single Box Induction',
    badge: 'Milestone 25',
    description: 'Deduce candidate eliminations across cross-intersecting row and column lines.',
    payload: {
      gridSize: 9,
      mode: 'reflex'
    }
  },
  'sudoku-50': {
    gameId: 'sudoku',
    level: 50,
    title: 'Naked Pair Candidate Lock',
    badge: 'Milestone 50',
    description: 'Identifying dual candidate locks that unlock blocked 3x3 zones.',
    payload: {
      gridSize: 9,
      mode: 'reflex'
    }
  },

  // --- Zebra Milestones ---
  'zebra-25': {
    gameId: 'zebra',
    level: 25,
    title: '4-House Spatial Tabulation',
    badge: 'Milestone 25',
    description: 'Mapping relative adjacency ("immediately left of", "between X and Y").',
    payload: {
      housesCount: 4,
      mode: 'reflex'
    }
  },
  'zebra-50': {
    gameId: 'zebra',
    level: 50,
    title: '5-House Multi-Parameter Einstein',
    badge: 'Milestone 50',
    description: 'Complete 5-variable constraint puzzle with unique deductive path.',
    payload: {
      housesCount: 5,
      mode: 'full'
    }
  }
};

export function getCuratedMilestone(gameId: GameId, level: number): CuratedMilestoneChallenge | null {
  const key = `${gameId}-${level}`;
  return CURATED_MILESTONES[key] || null;
}
