import React, { useState } from 'react';
import { GameId } from '../../engine/game-engine/types';
import { useProgressStore } from '../../store/progress-store';
import { soundManager } from '../../lib/sound';
import { 
  Play, Grid3X3, Layers, Eye, Zap, Brain, Sparkles, Shuffle, 
  ChevronLeft, ChevronRight, Activity, Flame, ArrowRight, Target 
} from 'lucide-react';
import { NeuronActivityPulseBackground } from '../background/NeuronActivityPulseBackground';
import neuralBrainImg from '../../assets/neural_brain.jpg';

interface GameCardsSectionProps {
  onPlayGame: (gameId: GameId, customLevel?: number) => void;
  onPlayMindMix?: () => void;
  onPlayTraining?: (level?: number) => void;
}

interface BrainRegion {
  id: string;
  gameId: GameId | 'mindmix';
  gameName: string;
  skillName: string;
  nature: string;
  anatomicalLobe: string;
  colorName: string;
  examApplication: string;
  accentGradient: string;
  accentBadgeBg: string;
  accentBadgeText: string;
  accentBorder: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string }>;
  hotspotStyle: { top: string; left: string };
  badgeText: string;
  natureDetails: string;
  isFeatured?: boolean;
}

export const GameCardsSection: React.FC<GameCardsSectionProps> = ({
  onPlayGame,
  onPlayMindMix,
  onPlayTraining
}) => {
  const { games } = useProgressStore();
  const mindMixLevel = useProgressStore.getState().getMindMixLevel();

  const [selectedRegionId, setSelectedRegionId] = useState<string>('calculation');
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

  const brainRegions: BrainRegion[] = [
    {
      id: 'calculation',
      gameId: 'anzan',
      gameName: 'Pro Calculations',
      skillName: 'Mental Arithmetic',
      nature: 'Sequential Flash Buffer',
      anatomicalLobe: 'Frontal Lobe',
      colorName: 'Amber',
      examApplication: 'Quant Simplification & DI Approximations',
      accentGradient: 'from-amber-500 to-orange-500',
      accentBadgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
      accentBadgeText: 'text-amber-500',
      accentBorder: 'border-amber-400 dark:border-amber-500',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      icon: Zap,
      hotspotStyle: { top: '30%', left: '26%' },
      badgeText: 'Frontal Lobe • +48, -19',
      natureDetails: 'Maintains rapid arithmetic calculations directly in working memory without scratch paper.',
      isFeatured: true
    },
    {
      id: 'focus',
      gameId: 'boggle',
      gameName: 'Boggle',
      skillName: 'Visual Lexical Search',
      nature: '4x4 & 5x5 Adjacent Word Paths',
      anatomicalLobe: 'Occipital-Temporal Cortex',
      colorName: 'Rose',
      examApplication: 'Lexical Retrieval, Anagram Recognition & Spatial Scanning',
      accentGradient: 'from-rose-500 to-pink-500',
      accentBadgeBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-700/60',
      accentBadgeText: 'text-rose-500',
      accentBorder: 'border-rose-400 dark:border-rose-500',
      glowColor: 'rgba(244, 63, 94, 0.45)',
      icon: Sparkles,
      hotspotStyle: { top: '46%', left: '48%' },
      badgeText: 'Prefrontal Cortex • Lexical Flow',
      natureDetails: 'High-speed 2D grid letter pathing, anagram discovery, and fast lexical retrieval under pressure.'
    },
    {
      id: 'reasoning',
      gameId: 'zebra',
      gameName: 'Puzzles',
      skillName: 'Complex Reasoning',
      nature: 'Relational Positional Logic',
      anatomicalLobe: 'Temporal Lobe',
      colorName: 'Emerald',
      examApplication: 'Circular/Linear Seating & Blood Relations',
      accentGradient: 'from-emerald-500 to-teal-500',
      accentBadgeBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60',
      accentBadgeText: 'text-emerald-500',
      accentBorder: 'border-emerald-400 dark:border-emerald-500',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      icon: Layers,
      hotspotStyle: { top: '56%', left: '38%' },
      badgeText: 'Temporal Lobe • Positional Grid',
      natureDetails: 'Constructs relational condition maps from multi-variable logical clues.'
    },
    {
      id: 'logic',
      gameId: 'sudoku',
      gameName: 'Sudoku Reflex',
      skillName: 'Constraint Logic',
      nature: '9x9 Candidate Elimination',
      anatomicalLobe: 'Parietal Lobe',
      colorName: 'Violet',
      examApplication: 'Box, Floor & Day-Schedule Puzzles',
      accentGradient: 'from-purple-500 to-indigo-500',
      accentBadgeBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-700/60',
      accentBadgeText: 'text-purple-500',
      accentBorder: 'border-purple-400 dark:border-purple-500',
      glowColor: 'rgba(168, 85, 247, 0.45)',
      icon: Brain,
      hotspotStyle: { top: '26%', left: '62%' },
      badgeText: 'Parietal Lobe • Row/Col 1-9',
      natureDetails: 'Sub-second constraint checking and elimination of invalid logical candidates.'
    },
    {
      id: 'verbal_processing',
      gameId: 'wordspeed',
      gameName: 'Word Speed',
      skillName: 'Verbal Processing Speed',
      nature: 'Recognition & Discrimination',
      anatomicalLobe: 'Language Cortex',
      colorName: 'Cyan',
      examApplication: 'English Reading, Cloze Speed & Verbal Classification',
      accentGradient: 'from-sky-500 to-cyan-500',
      accentBadgeBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-300 dark:border-sky-700/60',
      accentBadgeText: 'text-sky-500',
      accentBorder: 'border-sky-400 dark:border-sky-500',
      glowColor: 'rgba(14, 165, 233, 0.45)',
      icon: Eye,
      hotspotStyle: { top: '48%', left: '80%' },
      badgeText: 'Language Cortex • Rapid Recognition',
      natureDetails: 'Fast verbal recognition, orthographic discrimination, and rapid semantic classification.'
    },
    {
      id: 'mindmix',
      gameId: 'mindmix',
      gameName: 'Mind Mix',
      skillName: 'Mental Switching',
      nature: '5-Discipline Rapid Shifts',
      anatomicalLobe: 'Executive Network',
      colorName: 'Indigo',
      examApplication: 'Sectional Agility Between Quant & Reasoning',
      accentGradient: 'from-indigo-600 to-violet-600',
      accentBadgeBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/60',
      accentBadgeText: 'text-indigo-500',
      accentBorder: 'border-indigo-400 dark:border-indigo-500',
      glowColor: 'rgba(99, 102, 241, 0.45)',
      icon: Shuffle,
      hotspotStyle: { top: '78%', left: '60%' },
      badgeText: 'Executive Network • 5-Game Sprint',
      natureDetails: 'Trains rapid context switching across all 5 faculties without cognitive fatigue.'
    }
  ];

  const leftRegions = [brainRegions[0], brainRegions[1], brainRegions[2]];  // Pro Calc, Boggle, Puzzles
  const rightRegions = [brainRegions[3], brainRegions[4], brainRegions[5]]; // Sudoku, Word Speed, Mind Mix

  const activeRegion = brainRegions.find(r => r.id === selectedRegionId) || brainRegions[0];
  const ActiveIcon = activeRegion.icon;

  const handleLaunchGameCard = (region: BrainRegion, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundManager.playTap();
    if (region.gameId === 'mindmix') {
      if (onPlayMindMix) onPlayMindMix();
    } else {
      const chosenLevel = selectedLevels[region.gameId as GameId] || 1;
      onPlayGame(region.gameId as GameId, chosenLevel);
    }
  };

  const renderCard = (region: BrainRegion) => {
    const isSelected = selectedRegionId === region.id;
    const Icon = region.icon;
    const isMindMix = region.gameId === 'mindmix';
    const progress = !isMindMix ? (games[region.gameId as GameId] || { level: 1, mastery: 25, bestScore: 0 }) : null;
    const chosenLevel = !isMindMix ? (selectedLevels[region.gameId as GameId] ?? (progress?.level || 1)) : mindMixLevel;
    const masteryPercent = !isMindMix ? (progress?.mastery ?? 25) : Math.min(100, Math.round((mindMixLevel / 99) * 100));

    return (
      <div
        key={region.id}
        onClick={() => {
          soundManager.playTap();
          setSelectedRegionId(region.id);
        }}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
          isSelected
            ? `bg-white dark:bg-slate-800/95 ${region.accentBorder} shadow-lg ring-1 ring-slate-400/20 scale-[1.02]`
            : 'bg-slate-50/90 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300'
        }`}
      >
        <div>
          {/* Lobe Tag & Icon */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${region.accentGradient} text-white flex items-center justify-center shadow-sm shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                  {region.anatomicalLobe}
                </span>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  {region.gameName}
                </h4>
              </div>
            </div>

            {/* Level Stepper (for 5 games) / Derived Level (for Mind Mix) */}
            {!isMindMix ? (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-750 border border-slate-200/70 dark:border-slate-700 shadow-xs"
              >
                <button
                  onClick={(e) => handleAdjustLevel(region.gameId as GameId, -1, e)}
                  disabled={chosenLevel <= 1}
                  title="Previous Level"
                  className="p-0.5 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="text-[11px] font-black text-slate-900 dark:text-white font-mono px-1">
                  L{chosenLevel}
                </span>
                <button
                  onClick={(e) => handleAdjustLevel(region.gameId as GameId, 1, e)}
                  disabled={chosenLevel >= 99}
                  title="Next Level"
                  className="p-0.5 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono text-[10px] font-bold">
                Lv {mindMixLevel}
              </span>
            )}
          </div>

          {/* Skill & Nature Description */}
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug font-medium mb-2.5">
            {region.skillName} • <span className="text-slate-400 font-normal">{region.nature}</span>
          </p>

          {/* Mini Mastery Bar */}
          <div className="mb-2.5">
            <div className="flex justify-between text-[9px] font-semibold text-slate-400 uppercase mb-1 font-mono">
              <span>Mastery: {masteryPercent}%</span>
              <span>{!isMindMix && progress && progress.bestScore > 0 ? `${progress.bestScore} pts` : 'Ready'}</span>
            </div>
            <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700/80 overflow-hidden">
              <div
                style={{ width: `${masteryPercent}%` }}
                className={`h-full rounded-full bg-gradient-to-r ${region.accentGradient} transition-all duration-500`}
              />
            </div>
          </div>
        </div>

        {/* Card Footer: Exam Tag & Play Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
          <span className="text-slate-400 font-mono text-[9px] truncate max-w-[120px] sm:max-w-[140px]">
            {region.examApplication.split('&')[0]}
          </span>

          <button
            onClick={(e) => handleLaunchGameCard(region, e)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] font-mono shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0 ${
              isSelected
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950'
            }`}
          >
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>Play L{chosenLevel}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <section id="games-section" className="my-12 select-none relative overflow-hidden py-4">
      
      {/* Brain Activity Pulse = Neuron System Background (Game Matrix) */}
      <NeuronActivityPulseBackground theme="game-matrix" activeGameId={selectedRegionId} />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Level 1 ? Level 99+ Adaptive Progression
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Train with 5 Brain Games & Cognitive Faculties
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Build the core cognitive reflex skills behind rapid Quant & Reasoning solving.
          </p>
        </div>
      </div>

      {/* Training Mode Banner Card */}
      {onPlayTraining && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-2 border-amber-400/40 dark:border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-amber-400 transition-all relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              ???
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

      {/* Main Anatomical Brain Diagram with Interactive Callout Cards */}
      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-7 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-md">
        
        {/* Diagram Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono">
              ANATOMICAL BRAIN DIAGRAM & GAME MAPPING
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Click any card or lobe to inspect & play
          </span>
        </div>

        {/* 3-Column Diagram Layout: Left 3 Cards | Center Brain Visual | Right 3 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          
          {/* Left 3 Cards */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-3.5 order-2 lg:order-1">
            {leftRegions.map((region) => renderCard(region))}
          </div>

          {/* Center Column: 3D Anatomical Brain Visual with Pointer Hotspots */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 relative py-2">
            
            {/* Ambient Neural Activity Glow behind Brain */}
            <div 
              className="absolute inset-0 rounded-3xl blur-2xl opacity-25 dark:opacity-40 transition-all duration-500 pointer-events-none -z-0"
              style={{ backgroundColor: activeRegion.glowColor }}
            />

            <div className="relative w-full aspect-square max-w-md rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 bg-slate-950 shadow-2xl p-1 group z-10">
              
              {/* Brain Visual Asset */}
              <img 
                src={neuralBrainImg} 
                alt="Anatomical Brain Diagram"
                className="w-full h-full object-cover rounded-[22px] filter contrast-105"
              />

              {/* Ambient Grid overlay & subtle neural pulse */}
              <div className="absolute inset-0 rounded-[22px] pointer-events-none bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />
              <div className="absolute inset-0 rounded-[22px] pointer-events-none ring-1 ring-white/10" />

              {/* Interactive Lobe Hotspot Pins */}
              {brainRegions.map((region) => {
                const isSelected = selectedRegionId === region.id;
                const Icon = region.icon;

                return (
                  <div
                    key={region.id}
                    style={{ top: region.hotspotStyle.top, left: region.hotspotStyle.left }}
                    onClick={() => {
                      soundManager.playTap();
                      setSelectedRegionId(region.id);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 transition-all duration-300 ${
                      isSelected ? 'scale-110' : 'scale-90 opacity-80 hover:opacity-100 hover:scale-100'
                    }`}
                  >
                    {/* Glowing Ping */}
                    {isSelected && (
                      <div 
                        className="absolute -inset-2.5 rounded-full animate-ping pointer-events-none"
                        style={{ backgroundColor: region.glowColor }}
                      />
                    )}

                    {/* Hotspot Badge */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md shadow-xl transition-all ${
                      isSelected 
                        ? `bg-slate-950 text-white border-2 ${region.accentBorder}`
                        : 'bg-slate-900/90 text-slate-300 border border-slate-700/90'
                    }`}>
                      <div className={`h-3.5 w-3.5 rounded-full bg-gradient-to-br ${region.accentGradient} text-white flex items-center justify-center text-[8px] font-bold shadow-sm`}>
                        <Icon className="w-2 h-2" />
                      </div>
                      <span className="text-[10px] font-bold tracking-tight font-sans">
                        {region.gameName}
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Right 3 Cards */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-3.5 order-3">
            {rightRegions.map((region) => renderCard(region))}
          </div>

        </div>

        {/* Selected Lobe Mechanism Breakdown Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-xl bg-gradient-to-br ${activeRegion.accentGradient} text-white flex items-center justify-center shadow-sm`}>
                <ActiveIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                  Active Faculty Breakdown • {activeRegion.anatomicalLobe}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeRegion.gameName} — {activeRegion.skillName}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${activeRegion.accentBadgeBg}`}>
                {activeRegion.badgeText}
              </span>
              <button
                onClick={(e) => handleLaunchGameCard(activeRegion, e)}
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold font-mono text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>Launch {activeRegion.gameName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {activeRegion.natureDetails}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-mono">
            <span>?? Primary Exam Transfer: <strong className="text-slate-800 dark:text-slate-200 font-medium">{activeRegion.examApplication}</strong></span>
          </div>
        </div>

      </div>

    </section>
  );
};
