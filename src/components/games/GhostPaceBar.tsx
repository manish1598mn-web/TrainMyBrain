import React, { useEffect, useState } from 'react';
import { Ghost, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { formatTimeMs } from '../../engine/game-engine/timer';

interface GhostPaceBarProps {
  ghostLabel: string;            // e.g. "Personal Best" or "Alex's Ghost"
  targetTimeMs: number;          // Completion time of the ghost
  currentElapsedMs: number;      // Current live elapsed time from game timer
  isActive: boolean;
}

export const GhostPaceBar: React.FC<GhostPaceBarProps> = ({
  ghostLabel,
  targetTimeMs,
  currentElapsedMs,
  isActive
}) => {
  if (!isActive || targetTimeMs <= 0) return null;

  // Calculate live ghost position (0 to 100%)
  const ghostPercent = Math.min(100, Math.max(0, (currentElapsedMs / targetTimeMs) * 100));
  
  // Real-time delta
  const deltaMs = currentElapsedMs - targetTimeMs;
  const isAhead = currentElapsedMs < targetTimeMs;

  return (
    <div className="w-full max-w-md px-3.5 py-2 rounded-xl bg-slate-900/90 text-white border border-slate-800 shadow-sm flex flex-col gap-1.5 select-none mb-3">
      <div className="flex items-center justify-between text-[11px] font-mono">
        
        {/* Left: Ghost Label */}
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <Ghost className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>{ghostLabel}:</span>
          <span className="text-white">{formatTimeMs(targetTimeMs)}</span>
        </div>

        {/* Right: Live Pace Status */}
        <div className="flex items-center gap-1 text-[10px] font-bold">
          {isAhead ? (
            <span className="flex items-center gap-0.5 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
              <TrendingUp className="w-3 h-3" />
              Pacing Ahead
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/60">
              <TrendingDown className="w-3 h-3" />
              Behind Ghost (+{((currentElapsedMs - targetTimeMs)/1000).toFixed(1)}s)
            </span>
          )}
        </div>

      </div>

      {/* Progress Track */}
      <div className="relative h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        {/* Ghost Marker */}
        <div
          style={{ width: `${ghostPercent}%` }}
          className="h-full rounded-full bg-indigo-500/80 transition-all duration-150"
        />
      </div>
    </div>
  );
};
