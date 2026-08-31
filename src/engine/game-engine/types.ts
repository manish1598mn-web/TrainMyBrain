export type GameId = 'sudoku' | 'zebra' | 'wordspeed' | 'anzan' | 'boggle';

export type CognitiveSkill = 'logic' | 'verbal_processing' | 'calculation' | 'focus' | 'working_memory';

export interface GameInfo {
  id: GameId;
  name: string;
  subtitle: string;
  skillName: string;
  skillKey: CognitiveSkill;
  accentColor: string; // Tailwind color or hex
  accentBg: string;
  accentBorder: string;
  examRelevance: string; // e.g. "Competitive Exams & Logic: Seating Arrangements & Constraint Puzzles"
  description: string;
  recommendedDurationSec: number;
}

export interface GamePerformance {
  accuracy: number; // 0 - 100
  timeMs: number;
  reactionTimeMs?: number;
  mistakes: number;
  totalAttempts: number;
  difficultyScore: number; // 1 - 100
  consistencyScore?: number; // 0 - 100
  level: number;
}

export interface GameResult {
  gameId: GameId;
  level: number;
  score: number;
  accuracy: number;
  timeMs: number;
  mistakes: number;
  completed: boolean;
  timestamp: number;
  previousLevel?: number;
  newLevel?: number;
  performanceScore: number; // 0 - 100
  speedScore: number;       // 0 - 100
  difficultyScore: number;  // 0 - 100
  consistencyScore: number; // 0 - 100
  mastery: number;          // 0 - 100
  previousMastery: number;  // 0 - 100
  masteryDelta: number;     // e.g. +6%
  baselineImprovementPercent: number; // e.g. +26.6% faster
  speedAccuracySummary: string;       // e.g. "Faster + More Accurate"
  deltaImprovement?: number; // percentage vs historical avg
  insight?: string;
}

export interface GameAttempt {
  id: string;
  gameId: GameId;
  level: number;
  score: number;
  timeMs: number;
  accuracy: number;
  mistakes: number;
  performanceScore?: number;
  timestamp: number;
  mode?: string;
}

export interface GameProgress {
  gameId: GameId;
  level: number; // 1 to 99+
  mastery: number; // 0 - 100% toward next level
  bestScore: number;
  bestTimeMs: number;
  averageTimeMs: number;
  averageAccuracy: number;
  baselineTimeMs: number; // First recorded benchmark time
  baselineImprovementPercent: number; // ((baseline - current) / baseline) * 100
  recentPerformances: number[]; // Last 5-10 performance scores for StdDev consistency
  recentAccuracies: number[];   // Last 5-10 accuracy values
  attemptsAtCurrentLevel: number; // Count of attempts at the active level
  speedAccuracyScore: number;     // Speed * Accuracy composite index
  gamesPlayed: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayed: number;
}

export interface UserProfile {
  playerId: string;
  displayName: string;
  createdAt: number;
  lastTrainingDate: string; // 'YYYY-MM-DD'
  currentStreak: number;
  longestStreak: number;
  totalTimeSpentMs: number; // Cumulative active training time in ms
  todayActiveTimeMs?: number; // Active training time recorded today in ms
  dailyFocusGoalMinutes?: number; // User daily training goal in minutes (e.g. 15)
  totalProblemsSolved: number; // Total correct questions/words/cells
  totalLevelsAchieved: number; // Total levels unlocked/mastered
  dailyTrainingScore: number;
  todaySessionsCount: number;
  todaySuccessfulCount: number;
  todayQualified: boolean;
  weeklyActiveDates: string[]; // List of 'YYYY-MM-DD' dates trained this week
  unlockedMilestones: string[];
  totalWorkoutsCompleted: number;
  totalGamesPlayed: number;
  overallMindLevel: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface WorkoutSegment {
  gameId: GameId;
  mode?: string;
  durationSec: number;
  level: number;
  focusArea: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  type: '2min' | '5min' | '10min' | 'custom';
  totalDurationSec: number;
  segments: WorkoutSegment[];
}
