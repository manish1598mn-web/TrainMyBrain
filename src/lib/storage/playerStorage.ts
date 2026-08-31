import { safeGetItem, safeSetItem, safeRemoveItem, STORAGE_KEYS } from './baseStorage';
import { UserProfile } from '../../engine/game-engine/types';

const defaultPlayer: UserProfile = {
  playerId: `MIND-${Math.floor(1000 + Math.random() * 9000)}`,
  displayName: 'Brain Athlete',
  createdAt: Date.now(),
  lastTrainingDate: '',
  currentStreak: 0,
  longestStreak: 0,
  totalTimeSpentMs: 0,
  todayActiveTimeMs: 0,
  dailyFocusGoalMinutes: 15,
  totalProblemsSolved: 0,
  totalLevelsAchieved: 0,
  dailyTrainingScore: 0,
  todaySessionsCount: 0,
  todaySuccessfulCount: 0,
  todayQualified: false,
  weeklyActiveDates: [],
  unlockedMilestones: [],
  totalWorkoutsCompleted: 0,
  totalGamesPlayed: 0,
  overallMindLevel: 1,
  soundEnabled: true,
  hapticEnabled: true,
  theme: 'light'
};

export const playerStorage = {
  getProfile: (): UserProfile => {
    const profile = safeGetItem<UserProfile>(STORAGE_KEYS.PLAYER, defaultPlayer);
    return {
      ...defaultPlayer,
      ...profile,
      weeklyActiveDates: profile.weeklyActiveDates || [],
      unlockedMilestones: profile.unlockedMilestones || []
    };
  },

  saveProfile: (profile: UserProfile): void => {
    safeSetItem(STORAGE_KEYS.PLAYER, profile);
  },

  clearProfile: (): void => {
    safeRemoveItem(STORAGE_KEYS.PLAYER);
  }
};
