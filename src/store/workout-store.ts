import { create } from 'zustand';
import { GameResult, WorkoutPlan, WorkoutSegment } from '../engine/game-engine/types';

export interface WorkoutState {
  activePlan: WorkoutPlan | null;
  currentSegmentIndex: number;
  isWorkoutActive: boolean;
  segmentResults: GameResult[];
  totalScore: number;

  startWorkout: (plan: WorkoutPlan) => WorkoutSegment;
  recordSegmentResult: (result: GameResult) => { isLastSegment: boolean; nextIndex: number };
  advanceToNextSegment: () => WorkoutSegment | null;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  getCurrentSegment: () => WorkoutSegment | null;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activePlan: null,
  currentSegmentIndex: 0,
  isWorkoutActive: false,
  segmentResults: [],
  totalScore: 0,

  startWorkout: (plan: WorkoutPlan) => {
    const firstSegment = plan.segments[0];
    set({
      activePlan: plan,
      currentSegmentIndex: 0,
      isWorkoutActive: true,
      segmentResults: [],
      totalScore: 0
    });
    return firstSegment;
  },

  recordSegmentResult: (result: GameResult) => {
    const { activePlan, currentSegmentIndex, segmentResults, totalScore } = get();
    if (!activePlan) return { isLastSegment: true, nextIndex: 0 };

    const newResults = [...segmentResults, result];
    const newTotalScore = totalScore + result.score;
    const isLastSegment = currentSegmentIndex + 1 >= activePlan.segments.length;

    set({
      segmentResults: newResults,
      totalScore: newTotalScore
    });

    return {
      isLastSegment,
      nextIndex: currentSegmentIndex + 1
    };
  },

  advanceToNextSegment: () => {
    const { activePlan, currentSegmentIndex } = get();
    if (!activePlan) return null;

    const nextIndex = currentSegmentIndex + 1;
    if (nextIndex >= activePlan.segments.length) {
      set({ isWorkoutActive: false });
      return null;
    }

    set({ currentSegmentIndex: nextIndex });
    return activePlan.segments[nextIndex];
  },

  finishWorkout: () => {
    set({
      activePlan: null,
      currentSegmentIndex: 0,
      isWorkoutActive: false,
      segmentResults: [],
      totalScore: 0
    });
  },

  cancelWorkout: () => {
    set({
      activePlan: null,
      currentSegmentIndex: 0,
      isWorkoutActive: false,
      segmentResults: [],
      totalScore: 0
    });
  },

  getCurrentSegment: () => {
    const { activePlan, currentSegmentIndex } = get();
    if (!activePlan || currentSegmentIndex >= activePlan.segments.length) {
      return null;
    }
    return activePlan.segments[currentSegmentIndex];
  }
}));
