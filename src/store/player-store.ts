import { create } from 'zustand';
import { playerStorage } from '../lib/storage/playerStorage';

export interface StreakMilestone {
  minutes: number;
  title: string;
  badge: string;
  description: string;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { minutes: 15, title: 'Getting Started', badge: '🌱', description: '15 minutes of focused training' },
  { minutes: 30, title: 'Quick Thinker', badge: '⚡', description: '30 minutes of focused training' },
  { minutes: 60, title: 'Deep Focus', badge: '🔥', description: '1 hour of active brain training' },
  { minutes: 180, title: 'Brain Builder', badge: '🧠', description: '3 hours of active brain training' },
  { minutes: 300, title: 'Mind Athlete', badge: '🎯', description: '5 hours of active brain training' },
  { minutes: 600, title: 'Grandmaster', badge: '🏆', description: '10 hours of active brain training' },
  { minutes: 1500, title: 'Brain Titan', badge: '👑', description: '25 hours of active brain training' }
];

export interface PlayerState {
  playerId: string;
  displayName: string;
  createdAt: number;
  lastTrainingDate: string; // 'YYYY-MM-DD'
  currentStreak: number;
  longestStreak: number;
  totalTimeSpentMs: number;
  todayActiveTimeMs: number;
  dailyFocusGoalMinutes: number;
  totalProblemsSolved: number;
  totalLevelsAchieved: number;
  dailyTrainingScore: number;
  todaySessionsCount: number;
  todaySuccessfulCount: number;
  todayQualified: boolean;
  weeklyActiveDates: string[];
  unlockedMilestones: string[];
  totalWorkoutsCompleted: number;
  totalGamesPlayed: number;
  overallMindLevel: number;
  
  // Actions
  setDailyFocusGoal: (minutes: number) => void;
  getDailyGoalProgress: () => {
    targetMinutes: number;
    currentMinutes: number;
    currentSeconds: number;
    progressPercent: number;
    isGoalReached: boolean;
  };
  recordTrainingActivity: (params: {
    timeMs: number;
    problemsCount?: number;
    isSuccessful?: boolean;
    isLevelUp?: boolean;
  }) => { totalTimeSpentMs: number; formattedStreak: string };

  recordTrainingSession: (params: {
    isSuccessful: boolean;
    leveledUp?: boolean;
    isPR?: boolean;
    isDailyChallenge?: boolean;
    timeMs?: number;
    problemsCount?: number;
  }) => { newlyEarned: boolean; currentStreak: number; todayQualified: boolean };

  getTrainingTimeBreakdown: () => {
    hours: number;
    minutes: number;
    seconds: number;
    formattedString: string;
    shortFormatted: string;
  };

  isTodayQualified: () => boolean;
  getWeeklyStatus: () => { daysTrainedCount: number; daysMap: { label: string; dateStr: string; trained: boolean; isToday: boolean }[] };
  getRemainingForToday: () => string;
  incrementGamesPlayed: () => void;
  incrementWorkoutsCompleted: () => void;
  setOverallMindLevel: (lvl: number) => void;
  setDisplayName: (name: string) => void;
  resetPlayerState: () => void;
}

export function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  const initial = playerStorage.getProfile();
  const today = getTodayString();
  const isTodayAlready = initial.lastTrainingDate === today;

  return {
    playerId: initial.playerId,
    displayName: initial.displayName,
    createdAt: initial.createdAt,
    lastTrainingDate: initial.lastTrainingDate,
    currentStreak: initial.currentStreak || 0,
    longestStreak: initial.longestStreak || 0,
    totalTimeSpentMs: initial.totalTimeSpentMs || 0,
    todayActiveTimeMs: isTodayAlready ? (initial.todayActiveTimeMs || 0) : 0,
    dailyFocusGoalMinutes: initial.dailyFocusGoalMinutes || 15,
    totalProblemsSolved: initial.totalProblemsSolved || 0,
    totalLevelsAchieved: initial.totalLevelsAchieved || 0,
    dailyTrainingScore: isTodayAlready ? (initial.dailyTrainingScore || 3) : 0,
    todaySessionsCount: isTodayAlready ? (initial.todaySessionsCount || 1) : 0,
    todaySuccessfulCount: isTodayAlready ? (initial.todaySuccessfulCount || 1) : 0,
    todayQualified: isTodayAlready,
    weeklyActiveDates: initial.weeklyActiveDates || [],
    unlockedMilestones: initial.unlockedMilestones || [],
    totalWorkoutsCompleted: initial.totalWorkoutsCompleted || 0,
    totalGamesPlayed: initial.totalGamesPlayed || 0,
    overallMindLevel: initial.overallMindLevel || 1,

    setDailyFocusGoal: (minutes: number) => {
      const safeMins = Math.max(5, Math.min(180, minutes));
      set({ dailyFocusGoalMinutes: safeMins });
      const current = get();
      playerStorage.saveProfile({
        ...playerStorage.getProfile(),
        dailyFocusGoalMinutes: safeMins
      });
    },

    getDailyGoalProgress: () => {
      const state = get();
      const targetMinutes = state.dailyFocusGoalMinutes || 15;
      const todayMs = state.todayActiveTimeMs || 0;
      const totalSec = Math.floor(todayMs / 1000);
      const currentMinutes = Math.floor(totalSec / 60);
      const currentSeconds = totalSec % 60;
      const progressPercent = Math.min(100, Math.round((todayMs / (targetMinutes * 60000)) * 100));
      const isGoalReached = todayMs >= (targetMinutes * 60000);

      return {
        targetMinutes,
        currentMinutes,
        currentSeconds,
        progressPercent,
        isGoalReached
      };
    },

    getTrainingTimeBreakdown: () => {
      const state = get();
      const totalSec = Math.floor((state.totalTimeSpentMs || 0) / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      let formattedString = '';
      let shortFormatted = '';

      if (hours > 0) {
        formattedString = `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        shortFormatted = `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        formattedString = `${minutes} minute${minutes > 1 ? 's' : ''}`;
        shortFormatted = `${minutes}m`;
      } else {
        formattedString = `${Math.max(1, seconds)} seconds`;
        shortFormatted = `${Math.max(1, seconds)}s`;
      }

      return {
        hours,
        minutes,
        seconds,
        formattedString,
        shortFormatted
      };
    },

    recordTrainingActivity: ({ timeMs, problemsCount = 1, isSuccessful = true, isLevelUp = false }) => {
      const state = get();
      const currentToday = getTodayString();
      const isSameDay = state.lastTrainingDate === currentToday;
      const newTime = (state.totalTimeSpentMs || 0) + Math.max(0, timeMs);
      const newTodayTime = (isSameDay ? (state.todayActiveTimeMs || 0) : 0) + Math.max(0, timeMs);
      const newProblems = (state.totalProblemsSolved || 0) + Math.max(1, problemsCount);
      const newLevels = (state.totalLevelsAchieved || 0) + (isLevelUp || isSuccessful ? 1 : 0);

      // Check focus time milestones
      const totalMinutes = Math.floor(newTime / 60000);
      const updatedMilestones = [...state.unlockedMilestones];
      for (const m of STREAK_MILESTONES) {
        if (totalMinutes >= m.minutes && !updatedMilestones.includes(m.title)) {
          updatedMilestones.push(m.title);
        }
      }

      const updates: Partial<PlayerState> = {
        totalTimeSpentMs: newTime,
        todayActiveTimeMs: newTodayTime,
        totalProblemsSolved: newProblems,
        totalLevelsAchieved: newLevels,
        unlockedMilestones: updatedMilestones,
        totalGamesPlayed: state.totalGamesPlayed + 1
      };

      set(updates);

      playerStorage.saveProfile({
        playerId: state.playerId,
        displayName: state.displayName,
        createdAt: state.createdAt,
        lastTrainingDate: state.lastTrainingDate || currentToday,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        totalTimeSpentMs: newTime,
        todayActiveTimeMs: newTodayTime,
        dailyFocusGoalMinutes: state.dailyFocusGoalMinutes || 15,
        totalProblemsSolved: newProblems,
        totalLevelsAchieved: newLevels,
        dailyTrainingScore: state.dailyTrainingScore,
        todaySessionsCount: state.todaySessionsCount,
        todaySuccessfulCount: state.todaySuccessfulCount,
        todayQualified: state.todayQualified,
        weeklyActiveDates: state.weeklyActiveDates,
        unlockedMilestones: updatedMilestones,
        totalWorkoutsCompleted: state.totalWorkoutsCompleted,
        totalGamesPlayed: state.totalGamesPlayed + 1,
        overallMindLevel: state.overallMindLevel,
        soundEnabled: true,
        hapticEnabled: true,
        theme: 'dark'
      });

      const totalSec = Math.floor(newTime / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      const formattedStreak = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m` : `${Math.max(1, s)}s`;

      return {
        totalTimeSpentMs: newTime,
        formattedStreak
      };
    },

    recordTrainingSession: ({ isSuccessful, leveledUp, isPR, isDailyChallenge, timeMs = 60000, problemsCount = 1 }) => {
      const state = get();
      const currentToday = getTodayString();
      const yesterday = getYesterdayString();
      const isSameDay = state.lastTrainingDate === currentToday;

      // Also record time spent and problems solved
      const newTime = (state.totalTimeSpentMs || 0) + Math.max(0, timeMs);
      const newTodayTime = (isSameDay ? (state.todayActiveTimeMs || 0) : 0) + Math.max(0, timeMs);
      const newProblems = (state.totalProblemsSolved || 0) + Math.max(1, problemsCount);
      const newLevels = (state.totalLevelsAchieved || 0) + (leveledUp ? 1 : 0);

      // Reset daily counters if day rolled over
      let dailyScore = isSameDay ? state.dailyTrainingScore : 0;
      let sessionsCount = isSameDay ? state.todaySessionsCount : 0;
      let successfulCount = isSameDay ? state.todaySuccessfulCount : 0;
      let isAlreadyQualified = isSameDay && state.todayQualified;

      // Calculate Training Points for this activity
      let addedPoints = 1;
      if (isSuccessful) addedPoints += 2;
      if (leveledUp) addedPoints += 2;
      if (isPR) addedPoints += 1;
      if (isDailyChallenge) addedPoints += 2;

      dailyScore += addedPoints;
      sessionsCount += 1;
      if (isSuccessful) successfulCount += 1;

      const qualifiesNow = isAlreadyQualified || successfulCount >= 1 || sessionsCount >= 3 || dailyScore >= 3;
      const newlyEarned = !isAlreadyQualified && qualifiesNow;

      let newStreak = state.currentStreak;
      let newLongest = state.longestStreak;
      let updatedWeekly = [...state.weeklyActiveDates];
      let updatedMilestones = [...state.unlockedMilestones];

      if (newlyEarned) {
        if (state.lastTrainingDate === yesterday) {
          newStreak = (state.currentStreak || 0) + 1;
        } else if (state.lastTrainingDate === currentToday) {
          newStreak = Math.max(1, state.currentStreak);
        } else {
          newStreak = 1;
        }

        newLongest = Math.max(newLongest, newStreak);

        if (!updatedWeekly.includes(currentToday)) {
          updatedWeekly.push(currentToday);
        }
      }

      // Check focus time milestones
      const totalMinutes = Math.floor(newTime / 60000);
      for (const m of STREAK_MILESTONES) {
        if (totalMinutes >= m.minutes && !updatedMilestones.includes(m.title)) {
          updatedMilestones.push(m.title);
        }
      }

      const updates: Partial<PlayerState> = {
        lastTrainingDate: qualifiesNow ? currentToday : state.lastTrainingDate,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalTimeSpentMs: newTime,
        todayActiveTimeMs: newTodayTime,
        totalProblemsSolved: newProblems,
        totalLevelsAchieved: newLevels,
        dailyTrainingScore: dailyScore,
        todaySessionsCount: sessionsCount,
        todaySuccessfulCount: successfulCount,
        todayQualified: qualifiesNow,
        weeklyActiveDates: updatedWeekly,
        unlockedMilestones: updatedMilestones,
        totalGamesPlayed: state.totalGamesPlayed + 1
      };

      set(updates);

      playerStorage.saveProfile({
        playerId: state.playerId,
        displayName: state.displayName,
        createdAt: state.createdAt,
        lastTrainingDate: qualifiesNow ? currentToday : state.lastTrainingDate,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalTimeSpentMs: newTime,
        todayActiveTimeMs: newTodayTime,
        dailyFocusGoalMinutes: state.dailyFocusGoalMinutes || 15,
        totalProblemsSolved: newProblems,
        totalLevelsAchieved: newLevels,
        dailyTrainingScore: dailyScore,
        todaySessionsCount: sessionsCount,
        todaySuccessfulCount: successfulCount,
        todayQualified: qualifiesNow,
        weeklyActiveDates: updatedWeekly,
        unlockedMilestones: updatedMilestones,
        totalWorkoutsCompleted: state.totalWorkoutsCompleted,
        totalGamesPlayed: state.totalGamesPlayed + 1,
        overallMindLevel: state.overallMindLevel,
        soundEnabled: true,
        hapticEnabled: true,
        theme: 'dark'
      });

      return {
        newlyEarned,
        currentStreak: newStreak,
        todayQualified: qualifiesNow
      };
    },

    isTodayQualified: () => {
      const state = get();
      const todayStr = getTodayString();
      return state.lastTrainingDate === todayStr && state.todayQualified;
    },

    getRemainingForToday: () => {
      const state = get();
      if (state.isTodayQualified()) {
        return 'Training verified for today.';
      }
      const remainingSessions = Math.max(0, 3 - state.todaySessionsCount);
      return `Complete 1 successful level OR ${remainingSessions} more session(s) to keep your streak.`;
    },

    getWeeklyStatus: () => {
      const state = get();
      const todayObj = new Date();
      const currentDay = todayObj.getDay(); // 0 is Sun, 1 is Mon...
      const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

      const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      const todayStr = getTodayString();

      const daysMap = labels.map((label, idx) => {
        const d = new Date(todayObj);
        d.setDate(todayObj.getDate() + mondayOffset + idx);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        
        const isTrained = state.weeklyActiveDates.includes(dateStr) || (dateStr === todayStr && state.todayQualified);
        const isToday = dateStr === todayStr;

        return {
          label,
          dateStr,
          trained: isTrained,
          isToday
        };
      });

      const daysTrainedCount = daysMap.filter(d => d.trained).length;

      return {
        daysTrainedCount,
        daysMap
      };
    },

    incrementGamesPlayed: () => {
      const next = get().totalGamesPlayed + 1;
      set({ totalGamesPlayed: next });
    },

    incrementWorkoutsCompleted: () => {
      const next = get().totalWorkoutsCompleted + 1;
      set({ totalWorkoutsCompleted: next });
      const current = get();
      playerStorage.saveProfile({
        playerId: current.playerId,
        displayName: current.displayName,
        createdAt: current.createdAt,
        lastTrainingDate: current.lastTrainingDate,
        currentStreak: current.currentStreak,
        longestStreak: current.longestStreak,
        totalTimeSpentMs: current.totalTimeSpentMs,
        totalProblemsSolved: current.totalProblemsSolved,
        totalLevelsAchieved: current.totalLevelsAchieved,
        dailyTrainingScore: current.dailyTrainingScore,
        todaySessionsCount: current.todaySessionsCount,
        todaySuccessfulCount: current.todaySuccessfulCount,
        todayQualified: current.todayQualified,
        weeklyActiveDates: current.weeklyActiveDates,
        unlockedMilestones: current.unlockedMilestones,
        totalWorkoutsCompleted: next,
        totalGamesPlayed: current.totalGamesPlayed,
        overallMindLevel: current.overallMindLevel,
        soundEnabled: true,
        hapticEnabled: true,
        theme: 'dark'
      });
    },

    setOverallMindLevel: (lvl) => {
      set({ overallMindLevel: lvl });
      const current = get();
      playerStorage.saveProfile({
        playerId: current.playerId,
        displayName: current.displayName,
        createdAt: current.createdAt,
        lastTrainingDate: current.lastTrainingDate,
        currentStreak: current.currentStreak,
        longestStreak: current.longestStreak,
        totalTimeSpentMs: current.totalTimeSpentMs,
        totalProblemsSolved: current.totalProblemsSolved,
        totalLevelsAchieved: current.totalLevelsAchieved,
        dailyTrainingScore: current.dailyTrainingScore,
        todaySessionsCount: current.todaySessionsCount,
        todaySuccessfulCount: current.todaySuccessfulCount,
        todayQualified: current.todayQualified,
        weeklyActiveDates: current.weeklyActiveDates,
        unlockedMilestones: current.unlockedMilestones,
        totalWorkoutsCompleted: current.totalWorkoutsCompleted,
        totalGamesPlayed: current.totalGamesPlayed,
        overallMindLevel: lvl,
        soundEnabled: true,
        hapticEnabled: true,
        theme: 'dark'
      });
    },

    setDisplayName: (name) => {
      set({ displayName: name });
      const current = get();
      playerStorage.saveProfile({
        playerId: current.playerId,
        displayName: name,
        createdAt: current.createdAt,
        lastTrainingDate: current.lastTrainingDate,
        currentStreak: current.currentStreak,
        longestStreak: current.longestStreak,
        totalTimeSpentMs: current.totalTimeSpentMs,
        totalProblemsSolved: current.totalProblemsSolved,
        totalLevelsAchieved: current.totalLevelsAchieved,
        dailyTrainingScore: current.dailyTrainingScore,
        todaySessionsCount: current.todaySessionsCount,
        todaySuccessfulCount: current.todaySuccessfulCount,
        todayQualified: current.todayQualified,
        weeklyActiveDates: current.weeklyActiveDates,
        unlockedMilestones: current.unlockedMilestones,
        totalWorkoutsCompleted: current.totalWorkoutsCompleted,
        totalGamesPlayed: current.totalGamesPlayed,
        overallMindLevel: current.overallMindLevel,
        soundEnabled: true,
        hapticEnabled: true,
        theme: 'dark'
      });
    },

    resetPlayerState: () => {
      playerStorage.clearProfile();
      const fresh = playerStorage.getProfile();
      set({
        playerId: fresh.playerId,
        displayName: fresh.displayName,
        createdAt: fresh.createdAt,
        lastTrainingDate: '',
        currentStreak: 0,
        longestStreak: 0,
        dailyTrainingScore: 0,
        todaySessionsCount: 0,
        todaySuccessfulCount: 0,
        todayQualified: false,
        weeklyActiveDates: [],
        unlockedMilestones: [],
        totalWorkoutsCompleted: 0,
        totalGamesPlayed: 0,
        overallMindLevel: 1
      });
    }
  };
});
