/**
 * AI Training Coach & Personalized Performance Analyzer
 * 
 * Rules:
 * 1. AI analyzes performance patterns (Strengths, Weaknesses, Latency, Accuracy, Mistakes).
 * 2. AI recommends tailored training focus; the deterministic game engine schedules the parameters.
 */

import { GameId } from '../../engine/game-engine/types';
import { TrainingCoachReport } from './types';

export interface UserSessionData {
  gameId: GameId;
  level: number;
  accuracy: number; // 0 - 100
  timeMs: number;
  mistakes: number;
  targetTimeMs: number;
}

export interface UserProfileSnapshot {
  overallLevel: number;
  gameLevels: Record<GameId, number>;
  averageAccuracy: number;
  streakDays: number;
  recentSessions: UserSessionData[];
}

/**
 * AI Training Coach: Formulates deep cognitive feedback and personal workout recommendations
 */
export function generateCoachReport(profile: UserProfileSnapshot): TrainingCoachReport {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Identify highest and lowest performing games
  const sortedGames = (Object.keys(profile.gameLevels) as GameId[]).sort(
    (a, b) => profile.gameLevels[b] - profile.gameLevels[a]
  );

  const strongestGame = sortedGames[0] || 'anzan';
  const weakestGame = sortedGames[sortedGames.length - 1] || 'zebra';

  // Analyze accuracy & speed across recent sessions
  const avgAccuracy = profile.recentSessions.length > 0
    ? Math.round(profile.recentSessions.reduce((acc, s) => acc + s.accuracy, 0) / profile.recentSessions.length)
    : profile.averageAccuracy;

  if (avgAccuracy >= 85) {
    strengths.push('High Precision: Consistent and dependable answer accuracy across sessions.');
  } else {
    weaknesses.push('Accuracy Under Stress: Performance dips when multiple constraints interact.');
  }

  // Game-specific diagnostic mapping
  const gameNameMap: Record<GameId, string> = {
    anzan: 'Pro Calculations (Mental Arithmetic)',
    wordspeed: 'Word Speed (Verbal Agility)',
    boggle: 'Boggle (Visual Lexical Search)',
    sudoku: 'Sudoku Reflex (Constraint Logic)',
    zebra: 'Reasoning Puzzles (Relational Deduction)'
  };

  strengths.push(`Core Mastery in ${gameNameMap[strongestGame]} (Level ${profile.gameLevels[strongestGame]}).`);
  weaknesses.push(`Room for Growth in ${gameNameMap[weakestGame]} (Level ${profile.gameLevels[weakestGame]}).`);

  let assessment = `Your overall Mind Level is currently at ${profile.overallLevel}. You maintain an average accuracy of ${avgAccuracy}% with a ${profile.streakDays}-day training streak.`;

  if (avgAccuracy >= 88) {
    assessment += ' Your neural processing speed is accelerating smoothly without sacrificing precision.';
  } else {
    assessment += ' Focusing on deliberate constraint elimination will yield significant performance jumps.';
  }

  return {
    overallAssessment: assessment,
    strengths,
    weaknesses,
    recommendedFocus: {
      gameId: weakestGame,
      level: profile.gameLevels[weakestGame],
      rationale: `Targeting ${gameNameMap[weakestGame]} will balance your cognitive radar profile and lift your overall Mind Level from ${profile.overallLevel} to ${profile.overallLevel + 1}.`
    },
    motivationalNote: 'Neuroplasticity thrives on consistent daily practice. Keep challenging your boundaries!'
  };
}
