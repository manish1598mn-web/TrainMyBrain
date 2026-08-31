import React, { useState } from 'react';
import { GameId } from '../../engine/game-engine/types';
import { useProgressStore } from '../../store/progress-store';
import { soundManager } from '../../lib/sound';
import { Play, Grid3X3, Layers, Eye, Zap, Target, Sparkles, Shuffle, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { NeuronActivityPulseBackground } from '../background/NeuronActivityPulseBackground';

interface GameCardsSectionProps {
  onPlayGame: (gameId: GameId, customLevel?: number) => void;
  onPlayMindMix?: () => void;
  onPlayTraining?: (level?: number) => void;
}

export const GameCardsSection: React.FC<GameCardsSectionProps> = ({
  onPlayGame,
  onPlayMindMix,
  onPlayTraining
}) => {
  const { games } = useProgressStore();
  const [selectedLevels, setSelectedLevels] = useState<Record<GameId, number>>({
    anzan: games.anzan?.level || 1,
    wordspeed: games.wordspeed?.level || 1,
    boggle: games.boggle?.level || 1,
    sudoku: games.sudoku?.level || 1,
    zebra: games.zebra?.level || 1
  });

  const handleAdjustLevel = (gameId: GameId, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playTap();
    setSelectedLevels(prev => {
      const current = prev[gameId] ?? (games[gameId]?.level || 1);
      const next = Math.min(99, Math.max(1, current + delta));
      return { ...prev, [gameId]: next };
    });
  };

  const gameDefinitions = [
    {
      id: 'anzan' as GameId,
      name: 'Pro Calculations',
      skillName: 'Flash Arithmetic',
      icon: Zap,
      description: 'Calculate flashing numbers rapidly in your head without pen and paper.',
      accentGradient: 'from-amber-500 via-orange-500 to-amber-600',
      accentColor: 'text-amber-600 dark:text-amber-400',
      accentBg: 'bg-amber-50 dark:bg-amber-950/40',
      progressBg: 'bg-amber-500 dark:bg-amber-500',
      borderHover: 'hover:border-amber-400 dark:hover:border-amber-700',
      isFeatured: true
    },
    {
      id: 'wordspeed' as GameId,
      name: 'Word Speed',
      skillName: 'Verbal Processing Speed',
      icon: Eye,
      description: 'Instant word recognition, spelling discrimination, and semantic association under speed.',
      accentGradient: 'from-sky-600 to-blue-600',
      accentColor: 'text-sky-600 dark:text-sky-400',
      accentBg: 'bg-sky-50 dark:bg-sky-950/40',
      progressBg: 'bg-sky-600 dark:bg-sky-500',
      borderHover: 'hover:border-sky-300 dark:hover:border-sky-800'
    },
    {
      id: 'boggle' as GameId,
      name: 'Boggle',
      skillName: 'Visual Lexical Search',
      icon: Sparkles,
      description: 'Discover connected adjacent letter paths and build valid words under 60s pressure.',
      accentGradient: 'from-rose-500 to-pink-600',
      accentColor: 'text-rose-600 dark:text-rose-400',
      accentBg: 'bg-rose-50 dark:bg-rose-950/40',
      progressBg: 'bg-rose-500 dark:bg-rose-500',
      borderHover: 'hover:border-rose-300 dark:hover:border-rose-800'
    },
    {
      id: 'sudoku' as GameId,
      name: 'Sudoku Reflex',
      skillName: 'Constraint Deduction',
      icon: Grid3X3,
      description: 'Spot missing candidates and eliminate conflicting options under time pressure.',
      accentGradient: 'from-purple-600 to-indigo-600',
      accentColor: 'text-purple-600 dark:text-purple-400',
      accentBg: 'bg-purple-50 dark:bg-purple-950/40',
      progressBg: 'bg-purple-600 dark:bg-purple-500',
      borderHover: 'hover:border-purple-300 dark:hover:border-purple-800'
    },
    {
      id: 'zebra' as GameId,
      name: 'Puzzles',
      skillName: 'Deductive Relations',
      icon: Layers,
      description: 'Solve multi-variable clues and deduction grids like exam seating puzzles.',
      accentGradient: 'from-emerald-600 to-teal-600',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      progressBg: 'bg-emerald-600 dark:bg-emerald-500',
      borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-800'
    }
  ];

  return (
    <section id="games-section" className="my-12 select-none relative overflow-hidden py-4">
      
      {/* Brain Activity Pulse = Neuron System Background (Game Matrix) */}
      <NeuronActivityPulseBackground theme="game-matrix" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Level 1 → Level 99+ Adaptive Progression
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Train with 5 Brain Games
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Build the cognitive reflex skills behind rapid Quant & Reasoning solving.
          </p>
        </div>
      </div>

      {/* Training Mode Banner Card */}
      {onPlayTraining && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-2 border-amber-400/40 dark:border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              🏋️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Training — Build Fundamentals & Speed
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold text-[10px] uppercase">
                  10 Foundation Levels
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                New to brain training? Build speed and core reflexes across all 5 games before entering Main Level 1.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playTap();
              onPlayTraining();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black font-mono text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Start Training</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      )}

      {/* 5 Primary Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {gameDefinitions.map((g) => {
          const progress = games[g.id] || { level: 1, mastery: 25, bestScore: 0, gamesPlayed: 0, averageAccuracy: 0 };
          const chosenLevel = selectedLevels[g.id] ?? progress.level;
          const Icon = g.icon;
          const masteryPercent = progress.mastery ?? 25;
          const nextLevel = progress.level + 1;

          return (
            <div
              key={g.id}
              className={`
                group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border p-5 sm:p-6 shadow-sm transition-all duration-200
                ${g.isFeatured 
                  ? 'border-amber-300/80 dark:border-amber-800/80 ring-1 ring-amber-400/20' 
                  : 'border-slate-200/90 dark:border-slate-800'
                }
                ${g.borderHover} hover:shadow-md hover:-translate-y-0.5
              `}
            >
              {/* Featured Badge for Pro Calculations */}
              {g.isFeatured && (
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3 fill-white" />
                  Core Quant
                </div>
              )}

              {/* Card Top: Icon, Title, Level Stepper, Description */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${g.accentGradient} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {g.name}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {g.skillName}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Level Stepper */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                    <button
                      onClick={(e) => handleAdjustLevel(g.id, -1, e)}
                      disabled={chosenLevel <= 1}
                      title="Previous Level"
                      className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="px-1 text-center min-w-[50px]">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Level</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white font-mono leading-tight">
                        {chosenLevel}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAdjustLevel(g.id, 1, e)}
                      disabled={chosenLevel >= 99}
                      title="Next Level"
                      className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5 font-normal">
                  {g.description}
                </p>
              </div>

              {/* Card Bottom: Mastery Progress & Play Now CTA */}
              <div>
                <div className="mb-3.5">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase mb-1.5 font-mono">
                    <span>Mastery toward Lv {nextLevel}: {masteryPercent}%</span>
                    <span>{progress.bestScore > 0 ? `Best: ${progress.bestScore} pts` : 'Ready'}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${masteryPercent}%` }}
                      className={`h-full rounded-full ${g.progressBg} transition-all duration-500`}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playTap();
                    onPlayGame(g.id, chosenLevel);
                  }}
                  className={`
                    w-full py-2.5 rounded-xl font-bold text-xs active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm
                    ${g.isFeatured
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900'
                    }
                  `}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Level {chosenLevel}</span>
                </button>
              </div>

            </div>
          );
        })}

        {/* 6th Card: Mind Mix Meta-Training Sprint */}
        {onPlayMindMix && (() => {
          const mindMixLevel = useProgressStore.getState().getMindMixLevel();
          return (
            <div className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-slate-800 transition-all">
              <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Shuffle className="w-3 h-3" />
                Mental Switching
              </div>

              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center">
                      <Shuffle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Mind Mix
                      </h3>
                      <span className="text-[11px] font-medium text-slate-400">
                        5-Discipline Sprint
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Derived</span>
                    <span className="text-lg font-black text-indigo-400 font-mono">
                      Lv {mindMixLevel}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-5 font-normal">
                  Rapid-fire context switching across all 5 faculties without cognitive fatigue.
                </p>
              </div>

              <div>
                <div className="mb-3.5">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase mb-1.5 font-mono">
                    <span>Derived from 5 Game Levels</span>
                    <span>70% Avg + 30% Weak</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (mindMixLevel / 99) * 100)}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playTap();
                    onPlayMindMix();
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Mind Mix Sprint</span>
                </button>
              </div>

            </div>
          );
        })()}

      </div>

    </section>
  );
};
