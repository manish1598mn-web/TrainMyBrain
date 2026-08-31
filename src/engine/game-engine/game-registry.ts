import { GameId, GameInfo } from './types';

export const GAMES: Record<GameId, GameInfo> = {
  anzan: {
    id: 'anzan',
    name: 'Pro Calculations',
    subtitle: 'Flash Arithmetic & Mental Buffer',
    skillName: 'Mental Calculation',
    skillKey: 'calculation',
    accentColor: 'from-amber-500 to-orange-600',
    accentBg: 'bg-amber-50/80 dark:bg-amber-950/40',
    accentBorder: 'border-amber-200/80 text-amber-800 dark:border-amber-900/60 dark:text-amber-300',
    examRelevance: 'Quant Section: Simplification, Approximation & Instant Multi-Term Additions',
    description: 'Calculate flashing number streams rapidly in your head without pen and paper.',
    recommendedDurationSec: 60
  },
  wordspeed: {
    id: 'wordspeed',
    name: 'Word Speed',
    subtitle: 'Verbal Processing & Recognition',
    skillName: 'Verbal Processing Speed',
    skillKey: 'verbal_processing',
    accentColor: 'from-sky-600 to-blue-600',
    accentBg: 'bg-sky-50/80 dark:bg-sky-950/40',
    accentBorder: 'border-sky-200/80 text-sky-700 dark:border-sky-900/60 dark:text-sky-300',
    examRelevance: 'English & Reading: Fast Word Recognition, Cloze Speed & Semantic Accuracy',
    description: 'Train rapid verbal recognition, spelling discrimination, and semantic association under speed.',
    recommendedDurationSec: 60
  },
  boggle: {
    id: 'boggle',
    name: 'Boggle',
    subtitle: 'Visual Lexical Search & Executive Flow',
    skillName: 'Visual Lexical Search',
    skillKey: 'focus',
    accentColor: 'from-rose-500 to-pink-600',
    accentBg: 'bg-rose-50/80 dark:bg-rose-950/40',
    accentBorder: 'border-rose-200/80 text-rose-700 dark:border-rose-900/60 dark:text-rose-300',
    examRelevance: 'English & Reading: Fast Lexical Retrieval, Anagram Recognition & Spatial Scanning',
    description: 'Find connected adjacent letter paths and discover valid words under 60-second pressure.',
    recommendedDurationSec: 60
  },
  sudoku: {
    id: 'sudoku',
    name: 'Sudoku Reflex',
    subtitle: 'Constraint Recognition & Elimination',
    skillName: 'Constraint Logic',
    skillKey: 'logic',
    accentColor: 'from-purple-600 to-indigo-600',
    accentBg: 'bg-purple-50/80 dark:bg-purple-950/40',
    accentBorder: 'border-purple-200/80 text-purple-700 dark:border-purple-900/60 dark:text-purple-300',
    examRelevance: 'Reasoning: Fast Candidate Elimination & 9x9 Constraint Recognition',
    description: 'Spot missing candidates and eliminate conflicting options under time pressure.',
    recommendedDurationSec: 90
  },
  zebra: {
    id: 'zebra',
    name: 'Puzzles',
    subtitle: 'Multi-Variable Reasoning',
    skillName: 'Complex Reasoning',
    skillKey: 'working_memory',
    accentColor: 'from-emerald-600 to-teal-600',
    accentBg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
    accentBorder: 'border-emerald-200/80 text-emerald-700 dark:border-emerald-900/60 dark:text-emerald-300',
    examRelevance: 'Competitive Exams & Logic: Seating Arrangements, Floor Puzzles & Multi-Attribute Relations',
    description: 'Transform complex positional and relational clues into structured deductions.',
    recommendedDurationSec: 90
  }
};

export const GAME_LIST: GameInfo[] = Object.values(GAMES);
