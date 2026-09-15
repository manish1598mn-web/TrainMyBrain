import { GameId, GameProgress, GameAttempt } from '../game-engine/types';

export interface AuthenticUserStats {
  totalGamesPlayed: number;
  hasPlayedAnyGame: boolean;
  overallAccuracy: number; // 0 - 100
  accuracyDisplay: string;
  speedImprovementDisplay: string;
  focusScore: number;
  reasoningScore: number;
  calculationScore: number;
  backgroundLabels: {
    title: string;
    value: string;
    color: string;
    pulseColor: string;
  }[];
}

/**
 * Universal Authentic Statistics Engine
 * Derives 100% mathematically truthful metrics from user game storage and attempts.
 * Zero hardcoded fallbacks or fabricated percentages.
 */
export function computeAuthenticUserStats(
  games: Record<GameId, GameProgress>,
  attempts: GameAttempt[] = []
): AuthenticUserStats {
  const gameKeys: GameId[] = ['sudoku', 'zebra', 'wordspeed', 'anzan', 'boggle'];
  
  // Calculate true total games played
  const totalGamesPlayed = gameKeys.reduce((acc, g) => acc + (games[g]?.gamesPlayed || 0), 0);
  const hasPlayedAnyGame = totalGamesPlayed > 0 || attempts.length > 0;

  // Calculate true overall accuracy
  let overallAccuracy = 0;
  if (attempts.length > 0) {
    const sumAccuracy = attempts.reduce((sum, a) => sum + (a.accuracy || 0), 0);
    overallAccuracy = Math.round(sumAccuracy / attempts.length);
  } else if (totalGamesPlayed > 0) {
    let playedGamesCount = 0;
    let sumAcc = 0;
    for (const g of gameKeys) {
      if (games[g]?.gamesPlayed > 0 && games[g]?.averageAccuracy > 0) {
        sumAcc += games[g].averageAccuracy;
        playedGamesCount++;
      }
    }
    overallAccuracy = playedGamesCount > 0 ? Math.round(sumAcc / playedGamesCount) : 0;
  }

  // Calculate real speed improvement across games with valid baseline
  let totalBaseline = 0;
  let totalCurrent = 0;
  for (const g of gameKeys) {
    const prog = games[g];
    if (prog && prog.gamesPlayed >= 2 && prog.baselineTimeMs > 0 && prog.averageTimeMs > 0) {
      totalBaseline += prog.baselineTimeMs;
      totalCurrent += prog.averageTimeMs;
    }
  }

  let speedImprovementDisplay = 'Calibrating';
  if (totalBaseline > 0 && totalCurrent > 0) {
    const diff = totalBaseline - totalCurrent;
    const pct = Math.round((diff / totalBaseline) * 100);
    speedImprovementDisplay = pct >= 0 ? +% : ${pct}%;
  } else if (totalGamesPlayed > 0) {
    speedImprovementDisplay = 'Calibrating (1/3)';
  }

  // Focus: WordSpeed & Boggle accuracy
  const focusGames = [games.wordspeed, games.boggle].filter(g => g && g.gamesPlayed > 0);
  const focusScore = focusGames.length > 0
    ? Math.round(focusGames.reduce((s, g) => s + (g.averageAccuracy || 0), 0) / focusGames.length)
    : 0;

  // Reasoning: Sudoku & Puzzles (Zebra) accuracy
  const reasoningGames = [games.sudoku, games.zebra].filter(g => g && g.gamesPlayed > 0);
  const reasoningScore = reasoningGames.length > 0
    ? Math.round(reasoningGames.reduce((s, g) => s + (g.averageAccuracy || 0), 0) / reasoningGames.length)
    : 0;

  // Calculation: Anzan arithmetic accuracy
  const calculationScore = (games.anzan && games.anzan.gamesPlayed > 0)
    ? Math.round(games.anzan.averageAccuracy || 0)
    : 0;

  // Generate 100% honest background labels
  const backgroundLabels = !hasPlayedAnyGame ? [
    {
      title: 'COGNITIVE TELEMETRY',
      value: 'CALIBRATING',
      color: 'text-slate-600 dark:text-slate-400',
      pulseColor: 'bg-teal-500/80'
    },
    {
      title: 'PROCESSING SPEED',
      value: 'STANDBY',
      color: 'text-slate-600 dark:text-slate-400',
      pulseColor: 'bg-sky-500/80'
    },
    {
      title: 'ANALYTICAL REASONING',
      value: 'AWAITING DATA',
      color: 'text-slate-600 dark:text-slate-400',
      pulseColor: 'bg-emerald-500/80'
    },
    {
      title: 'WORKING MEMORY',
      value: 'READY FOR L1',
      color: 'text-slate-600 dark:text-slate-400',
      pulseColor: 'bg-purple-500/80'
    },
    {
      title: 'ACCURACY INDEX',
      value: 'UNRANKED',
      color: 'text-slate-600 dark:text-slate-400',
      pulseColor: 'bg-teal-500/80'
    }
  ] : [
    {
      title: 'FOCUS RETENTION',
      value: focusScore > 0 ? ${focusScore}% : 'UNPLAYED',
      color: focusScore > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500',
      pulseColor: 'bg-amber-500/80'
    },
    {
      title: 'PROCESSING SPEED',
      value: speedImprovementDisplay,
      color: 'text-sky-600 dark:text-sky-400',
      pulseColor: 'bg-sky-500/80'
    },
    {
      title: 'ANALYTICAL REASONING',
      value: reasoningScore > 0 ? ${reasoningScore}% : 'UNPLAYED',
      color: reasoningScore > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500',
      pulseColor: 'bg-emerald-500/80'
    },
    {
      title: 'MENTAL CALCULATION',
      value: calculationScore > 0 ? ${calculationScore}% : 'UNPLAYED',
      color: calculationScore > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500',
      pulseColor: 'bg-purple-500/80'
    },
    {
      title: 'ACCURACY INDEX',
      value: ${overallAccuracy}%,
      color: 'text-teal-600 dark:text-teal-400',
      pulseColor: 'bg-teal-500/80'
    }
  ];

  return {
    totalGamesPlayed,
    hasPlayedAnyGame,
    overallAccuracy,
    accuracyDisplay: hasPlayedAnyGame ? ${overallAccuracy}% : 'Awaiting Data',
    speedImprovementDisplay,
    focusScore,
    reasoningScore,
    calculationScore,
    backgroundLabels
  };
}
