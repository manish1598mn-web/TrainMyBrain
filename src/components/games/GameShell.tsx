import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Pause, Play, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { GameId } from '../../engine/game-engine/types';
import { GAMES } from '../../engine/game-engine/game-registry';
import { formatTimeMs, GameTimer } from '../../engine/game-engine/timer';
import { soundManager } from '../../lib/sound';
import { useSettingsStore } from '../../store/settings-store';
import { GhostPaceBar } from './GhostPaceBar';

interface GameShellProps {
  gameId: GameId;
  level: number;
  modeName?: string;
  ghostTargetMs?: number;
  ghostLabel?: string;
  workoutInfo?: {
    planName: string;
    segmentIndex: number;
    totalSegments: number;
  };
  onExit: () => void;
  onRestart: () => void;
  children: (props: {
    timer: GameTimer;
    isPaused: boolean;
    isReady: boolean;
    elapsedMs: number;
    timerTick: number;
  }) => React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  gameId,
  level,
  modeName,
  ghostTargetMs,
  ghostLabel,
  workoutInfo,
  onExit,
  onRestart,
  children
}) => {
  const game = GAMES[gameId];
  const { soundEnabled, toggleSound } = useSettingsStore();

  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [timerTick, setTimerTick] = useState(0);

  const timerRef = useRef<GameTimer>(new GameTimer());

  // Initial calm countdown
  useEffect(() => {
    let count = 3;
    soundManager.playCountdownBeep(false);

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
        setCountdown(null);
        setIsReady(true);
        timerRef.current.start();
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Timer interval tick
  useEffect(() => {
    if (!isReady || isPaused) return;

    const interval = setInterval(() => {
      setElapsedMs(timerRef.current.getElapsedMs());
      setTimerTick(t => t + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [isReady, isPaused]);

  const handleTogglePause = () => {
    soundManager.playTap();
    if (isPaused) {
      timerRef.current.resume();
      setIsPaused(false);
    } else {
      timerRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleRestart = () => {
    soundManager.playTap();
    timerRef.current.reset();
    setIsReady(false);
    setCountdown(3);
    setIsPaused(false);
    onRestart();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between max-w-3xl mx-auto px-3 py-3 sm:py-5">
      
      {/* Top Header Bar */}
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 backdrop-blur-md">
        
        {/* Workout Progress Strip (if inside a workout) */}
        {workoutInfo && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold">
            <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
              <Sparkles className="w-3 h-3" />
              <span>{workoutInfo.planName}</span>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
              Game {workoutInfo.segmentIndex} of {workoutInfo.totalSegments}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {/* Exit Button */}
          <button
            onClick={() => {
              soundManager.playTap();
              onExit();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{workoutInfo ? 'End Workout' : 'Exit'}</span>
          </button>

          {/* Game Title & Level */}
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${game.accentColor} text-white font-bold text-xs shadow-sm`}>
              {game.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {game.name}
                </h2>
                {modeName && (
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {modeName}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono font-medium text-slate-400">
                Level {level}
              </p>
            </div>
          </div>

          {/* Timer & Controls */}
          <div className="flex items-center gap-1.5">
            {/* Live Timer */}
            <div className="flex items-center font-mono font-bold text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <span>{formatTimeMs(elapsedMs)}</span>
            </div>

            {/* Pause Button */}
            <button
              onClick={handleTogglePause}
              disabled={!isReady}
              title={isPaused ? 'Resume' : 'Pause'}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors disabled:opacity-30"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-teal-600 fill-teal-600" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Restart Button */}
            <button
              onClick={handleRestart}
              title="Restart round"
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute' : 'Unmute'}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Ghost Pace Racer (when active) */}
      {ghostTargetMs && ghostTargetMs > 0 && (
        <div className="w-full flex justify-center mt-2.5">
          <GhostPaceBar
            ghostLabel={ghostLabel || 'Personal Best'}
            targetTimeMs={ghostTargetMs}
            currentElapsedMs={elapsedMs}
            isActive={isReady && !isPaused}
          />
        </div>
      )}

      {/* Main Game Playfield */}
      <div className="relative my-3 flex-1 flex flex-col items-center justify-center min-h-[350px]">
        
        {/* Calm 3...2...1 Countdown */}
        {countdown !== null && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md rounded-2xl animate-in fade-in">
            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl sm:text-7xl font-bold font-mono text-slate-900 dark:text-white">
                {countdown === 0 ? 'GO' : countdown}
              </span>
              <p className="text-xs font-normal text-slate-400 mt-1">
                {workoutInfo ? `${workoutInfo.planName} • Focus` : 'Calm Focus & Precision'}
              </p>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-sm rounded-2xl animate-in fade-in">
            <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 text-center max-w-xs border border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Session Paused</h3>
              <p className="text-xs text-slate-400 mb-5 font-normal">Take a breath. Resume when you are ready.</p>
              <button
                onClick={handleTogglePause}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Session</span>
              </button>
            </div>
          </div>
        )}

        {/* Game Content */}
        {children({
          timer: timerRef.current,
          isPaused,
          isReady,
          elapsedMs,
          timerTick
        })}
      </div>

    </div>
  );
};
