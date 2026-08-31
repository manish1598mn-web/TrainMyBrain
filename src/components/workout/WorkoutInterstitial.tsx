import React, { useEffect, useState } from 'react';
import { WorkoutSegment } from '../../engine/game-engine/types';
import { GAMES } from '../../engine/game-engine/game-registry';
import { soundManager } from '../../lib/sound';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WorkoutInterstitialProps {
  segment: WorkoutSegment;
  segmentNumber: number;
  totalSegments: number;
  onStartSegment: () => void;
}

export const WorkoutInterstitial: React.FC<WorkoutInterstitialProps> = ({
  segment,
  segmentNumber,
  totalSegments,
  onStartSegment
}) => {
  const game = GAMES[segment.gameId];
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    soundManager.playCountdownBeep(false);
    let count = 3;

    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        soundManager.playCountdownBeep(false);
      } else if (count === 0) {
        setCountdown(0);
        soundManager.playCountdownBeep(true);
      } else {
        clearInterval(interval);
        onStartSegment();
      }
    }, 750);

    return () => clearInterval(interval);
  }, [onStartSegment]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xl text-center">
        
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-4">
          Game {segmentNumber} of {totalSegments}
        </div>

        <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${game.accentColor} text-white font-bold text-2xl shadow-sm`}>
          {game.name[0]}
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {game.name}
        </h3>
        <p className="text-xs font-medium text-slate-400 mt-0.5 mb-5">
          {segment.focusArea} ({segment.durationSec}s)
        </p>

        {/* Calm Countdown */}
        <div className="my-5">
          <span className="text-5xl font-bold font-mono text-slate-900 dark:text-white animate-pulse">
            {countdown}
          </span>
          <p className="text-xs text-slate-400 mt-1 font-normal">Prepare...</p>
        </div>

        <button
          onClick={() => {
            soundManager.playTap();
            onStartSegment();
          }}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
        >
          <span>Begin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
