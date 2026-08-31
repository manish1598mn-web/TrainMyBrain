import { GameId, WorkoutPlan, WorkoutSegment } from '../game-engine/types';

export function generateWorkout(
  type: '2min' | '5min' | '10min',
  gameLevels: Record<GameId, number>
): WorkoutPlan {
  if (type === '2min') {
    const segments: WorkoutSegment[] = [
      { gameId: 'boggle', durationSec: 30, level: gameLevels.boggle || 1, focusArea: 'Lexical Search' },
      { gameId: 'wordspeed', durationSec: 30, level: gameLevels.wordspeed || 1, focusArea: 'Verbal Recognition' },
      { gameId: 'anzan', durationSec: 30, level: gameLevels.anzan || 1, focusArea: 'Rapid Calculation' },
      { gameId: 'zebra', mode: 'reflex', durationSec: 30, level: gameLevels.zebra || 1, focusArea: 'Relational Logic' }
    ];
    return {
      id: `workout-2m-${Date.now()}`,
      name: '2-Minute Quick Boost',
      type: '2min',
      totalDurationSec: 120,
      segments
    };
  }

  if (type === '5min') {
    const segments: WorkoutSegment[] = [
      { gameId: 'anzan', durationSec: 60, level: gameLevels.anzan || 1, focusArea: 'Mental Arithmetic' },
      { gameId: 'wordspeed', durationSec: 60, level: gameLevels.wordspeed || 1, focusArea: 'Verbal Processing Speed' },
      { gameId: 'boggle', durationSec: 60, level: gameLevels.boggle || 1, focusArea: 'Visual Lexical Search' },
      { gameId: 'sudoku', mode: 'reflex', durationSec: 60, level: gameLevels.sudoku || 1, focusArea: 'Constraint Elimination' },
      { gameId: 'zebra', mode: 'reflex', durationSec: 60, level: gameLevels.zebra || 1, focusArea: 'Logic-to-Structure' }
    ];
    return {
      id: `workout-5m-${Date.now()}`,
      name: '5-Minute Smart Workout',
      type: '5min',
      totalDurationSec: 300,
      segments
    };
  }

  // 10-Minute Deep Training with Adaptive Weakness Allocation
  const games: GameId[] = ['sudoku', 'zebra', 'wordspeed', 'anzan', 'boggle'];
  // Sort by lowest level (highest weakness)
  const sortedByWeakness = [...games].sort((a, b) => (gameLevels[a] || 1) - (gameLevels[b] || 1));

  const segments: WorkoutSegment[] = [
    // 70% Weakness focus (weakest 2 games get 2.5 min and 2.5 min = 5 min total)
    { gameId: sortedByWeakness[0], durationSec: 150, level: gameLevels[sortedByWeakness[0]] || 1, focusArea: 'Target Weakness #1' },
    { gameId: sortedByWeakness[1], durationSec: 150, level: gameLevels[sortedByWeakness[1]] || 1, focusArea: 'Target Weakness #2' },
    // 20% Maintenance (next 2 games get 1.5 min each = 3 min total)
    { gameId: sortedByWeakness[2], durationSec: 90, level: gameLevels[sortedByWeakness[2]] || 1, focusArea: 'Skill Maintenance' },
    { gameId: sortedByWeakness[3], durationSec: 90, level: gameLevels[sortedByWeakness[3]] || 1, focusArea: 'Skill Maintenance' },
    // 10% Challenge (strongest game pushed higher = 2 min total)
    { gameId: sortedByWeakness[4], durationSec: 120, level: (gameLevels[sortedByWeakness[4]] || 1) + 2, focusArea: 'Peak Challenge' }
  ];

  return {
    id: `workout-10m-${Date.now()}`,
    name: '10-Minute Deep Training',
    type: '10min',
    totalDurationSec: 600,
    segments
  };
}
