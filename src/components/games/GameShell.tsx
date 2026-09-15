import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Pause, Play, RotateCcw, Volume2, VolumeX, Sparkles, Clock } from 'lucide-react';
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
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between max-w-3xl mx-auto px-3 py-3 sm:py-5 select-none">
      
      {/* Universal Floating In-Game HUD Bar */}
      <div className="glass-hud flex flex-col gap-2 rounded-2xl p-3 sm:p-3.5 shadow-md backdrop-blur-xl transition-all">
        
        {/* Workout Progress Strip (if inside a workout) */}
        {workoutInfo && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold">
            <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{workoutInfo.planName}</span>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold">
              Game {workoutInfo.segmentIndex} of {workoutInfo.totalSegments}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {/* Exit / Back Button */}
          <button
            onClick={() => {
              soundManager.playTap();
              onExit();
            }}
            className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{workoutInfo ? 'End Workout' : 'Exit'}</span>
          </button>

          {/* Game Title & Level Badge */}
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${game.accentColor} text-white font-bold text-xs shadow-sm shadow-slate-900/10`}>
              {game.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  {game.name}
                </h2>
                {modeName && (
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {modeName}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono font-semibold text-teal-600 dark:text-teal-400">
                Level {level}
              </p>
            </div>
          </div>

          {/* Timer & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Live Timer Monospace Pill */}
            <div className="flex items-center gap-1.5 font-mono font-bold text-xs sm:text-sm px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{formatTimeMs(elapsedMs)}</span>
            </div>

            {/* Pause Button */}
            <button
              onClick={handleTogglePause}
              disabled={!isReady}
              title={isPaused ? 'Resume' : 'Pause'}
              className="btn-tactile p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all disabled:opacity-30 cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-teal-600 fill-teal-600" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Restart Button */}
            <button
              onClick={handleRestart}
              title="Restart round"
              className="btn-tactile p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute' : 'Unmute'}
              className="btn-tactile p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-teal-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
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
      <div className="relative my-3 flex-1 flex flex-col items-center justify-center min-h-[360px]">
        
        {/* Calm 3...2...1 Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-xl rounded-3xl animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-3">
              <span className="text-7xl sm:text-8xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-indigo-500 to-amber-500 animate-in zoom-in-75 duration-200">
                {countdown === 0 ? 'GO!' : countdown}
              </span>
              <p className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                {workoutInfo ? `${workoutInfo.planName} · Focus` : 'Calm Focus & Visual Precision'}
              </p>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-md rounded-3xl animate-in fade-in duration-200">
            <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl shadow-2xl text-center max-w-xs border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1.5 font-mono">
                Session Paused
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                Take a breath. Resume whenever you are ready to continue.
              </p>
              <button
                onClick={handleTogglePause}
                className="btn-tactile w-full py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
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
