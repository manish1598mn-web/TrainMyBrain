import React, { useState } from 'react';
import { 
  Zap, Target, Brain, Rocket, ArrowRight, Eye, Layers, Shuffle, 
  Activity, CheckCircle2, Sparkles, Play
} from 'lucide-react';
import { GameId } from '../../engine/game-engine/types';
import { soundManager } from '../../lib/sound';
import { NeuronActivityPulseBackground } from '../background/NeuronActivityPulseBackground';
import { LevelProgressionPath } from './LevelProgressionPath';

interface HeroProps {
  onExploreGames: () => void;
  onPlayGame?: (gameId: GameId) => void;
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
}

export const Hero: React.FC<HeroProps> = ({ onExploreGames, onPlayGame, onPlayMindMix, onPlayTraining }) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('calculation');

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
      natureDetails: 'Maintains rapid arithmetic calculations directly in working memory without scratch paper.'
    },
    {
      id: 'focus',
      gameId: 'boggle',
      gameName: 'Boggle',
      skillName: 'Visual Lexical Search',
      nature: '4x4 & 5x5 Adjacent Word Paths',
      anatomicalLobe: 'Occipital-Temporal & Prefrontal Cortex',
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
      badgeText: 'Parietal Lobe • Row/Col ≠ 9',
      natureDetails: 'Sub-second constraint checking and elimination of invalid logical candidates.'
    },
    {
      id: 'verbal_processing',
      gameId: 'wordspeed',
      gameName: 'Word Speed',
      skillName: 'Verbal Processing Speed',
      nature: 'Recognition & Discrimination',
      anatomicalLobe: 'Language Cortex (Occipital-Temporal)',
      colorName: 'Cyan',
      examApplication: 'English Reading, Cloze Speed & Verbal Classification',
      accentGradient: 'from-sky-500 to-cyan-500',
      accentBadgeBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-300 dark:border-sky-700/60',
      accentBadgeText: 'text-sky-500',
      accentBorder: 'border-sky-400 dark:border-sky-500',
      glowColor: 'rgba(14, 165, 233, 0.45)',
      icon: Eye,
      hotspotStyle: { top: '48%', left: '80%' },
      badgeText: 'Language Cortex • BALANCE ➔ REDUCE',
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

  const leftRegions = [brainRegions[0], brainRegions[1], brainRegions[2]];  // Pro Calc, Colour Focus, Puzzles
  const rightRegions = [brainRegions[3], brainRegions[4], brainRegions[5]]; // Sudoku, Speed Search, Mind Mix

  const activeRegion = brainRegions.find(r => r.id === selectedRegionId) || brainRegions[0];
  const ActiveIcon = activeRegion.icon;

  const handleLaunchSpecificGame = (region: BrainRegion, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playTap();
    if (region.gameId === 'mindmix') {
      if (onPlayMindMix) onPlayMindMix();
    } else {
      if (onPlayGame) onPlayGame(region.gameId as GameId);
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 text-left select-none">
      
      {/* Brain Activity Pulse = Neuron System Background (Hero Convergence) */}
      <NeuronActivityPulseBackground 
        theme="hero-convergence" 
        activeGameId={selectedRegionId} 
      />

      {/* 1. Header Section: Headline & Value Proposition */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 mb-4 shadow-xs backdrop-blur-xs">
          <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
            Cognitive Speed & Mental Fitness • For All Competitive Exams & Brain Training
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Train Your Mind.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-indigo-600 dark:from-teal-400 dark:to-indigo-400">
            Solve Faster.
          </span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Explore how each of our 5 brain training games targets a specific cognitive faculty to dramatically boost your speed, mental agility, and problem-solving focus.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {onPlayTraining && (
            <button
              onClick={() => {
                soundManager.playTap();
                onPlayTraining();
              }}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center gap-2 border border-amber-400"
            >
              <span>🏋️ Training — Build Fundamentals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playTap();
              onExploreGames();
            }}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center gap-2"
          >
            <span>Explore 5 Brain Games</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level Progression Stepper (Between CTA and Brain Mapping) */}
      <div className="relative z-10">
        <LevelProgressionPath />
      </div>

      {/* 2. Main Anatomical Brain Diagram with Callout Pointers */}
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
            Click any card or lobe to inspect
          </span>
        </div>

        {/* 3-Column Diagram Layout: Left 3 Cards | Center Brain Visual | Right 3 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left 3 Cards */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-3.5 order-2 lg:order-1">
            {leftRegions.map((region) => {
              const isSelected = selectedRegionId === region.id;
              const Icon = region.icon;

              return (
                <div
                  key={region.id}
                  onClick={() => {
                    soundManager.playTap();
                    setSelectedRegionId(region.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? `bg-white dark:bg-slate-800/95 ${region.accentBorder} shadow-lg ring-1 ring-slate-400/20 scale-102`
                      : 'bg-slate-50/90 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Lobe Tag & Icon */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-7 w-7 rounded-xl bg-gradient-to-br ${region.accentGradient} text-white flex items-center justify-center shadow-sm shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
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

                      {/* Quick Play Arrow */}
                      {(onPlayGame || onPlayMindMix) && (
                        <button
                          onClick={(e) => handleLaunchSpecificGame(region, e)}
                          title={`Train ${region.gameName}`}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      )}
                    </div>

                    {/* Skill & Nature Description */}
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug font-medium mb-2">
                      {region.skillName} • <span className="text-slate-400 font-normal">{region.nature}</span>
                    </p>
                  </div>

                  {/* Exam Tag */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono truncate">{region.examApplication.split('&')[0]}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${region.accentBadgeBg}`}>
                      {region.colorName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Column: 3D Anatomical Brain Visual with Pointer Hotspots */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 relative">
            
            {/* Subtle Ambient Neural Activity Glow behind Brain */}
            <div 
              className="absolute inset-0 rounded-3xl blur-2xl opacity-25 dark:opacity-40 transition-all duration-500 pointer-events-none -z-0"
              style={{ backgroundColor: activeRegion.glowColor }}
            />

            <div className="relative w-full aspect-square max-w-md rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 bg-slate-950 shadow-2xl p-1 group z-10">
              
              {/* Brain Visual Asset */}
              <img 
                src="/images/neural_brain.jpg" 
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
            {rightRegions.map((region) => {
              const isSelected = selectedRegionId === region.id;
              const Icon = region.icon;

              return (
                <div
                  key={region.id}
                  onClick={() => {
                    soundManager.playTap();
                    setSelectedRegionId(region.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? `bg-white dark:bg-slate-800/95 ${region.accentBorder} shadow-lg ring-1 ring-slate-400/20 scale-102`
                      : 'bg-slate-50/90 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Lobe Tag & Icon */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-7 w-7 rounded-xl bg-gradient-to-br ${region.accentGradient} text-white flex items-center justify-center shadow-sm shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
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

                      {/* Quick Play Arrow */}
                      {(onPlayGame || onPlayMindMix) && (
                        <button
                          onClick={(e) => handleLaunchSpecificGame(region, e)}
                          title={`Train ${region.gameName}`}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      )}
                    </div>

                    {/* Skill & Nature Description */}
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug font-medium mb-2">
                      {region.skillName} • <span className="text-slate-400 font-normal">{region.nature}</span>
                    </p>
                  </div>

                  {/* Exam Tag */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono truncate">{region.examApplication.split('&')[0]}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${region.accentBadgeBg}`}>
                      {region.colorName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 3. Selected Lobe Mechanism Breakdown Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-xl bg-gradient-to-br ${activeRegion.accentGradient} text-white flex items-center justify-center shadow-sm`}>
                <ActiveIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{activeRegion.gameName}</span>
                  <span className="text-xs font-mono font-normal text-slate-400">• {activeRegion.skillName}</span>
                </h4>
                <p className="text-[11px] font-mono font-semibold text-teal-600 dark:text-teal-400">
                  Target: {activeRegion.anatomicalLobe} ({activeRegion.colorName})
                </p>
              </div>
            </div>

            <span className={`self-start sm:self-auto px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${activeRegion.accentBadgeBg}`}>
              {activeRegion.nature}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              <strong className="font-semibold text-slate-800 dark:text-slate-100">Cognitive Function:</strong> {activeRegion.natureDetails}
            </p>
            
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong className="font-semibold text-slate-800 dark:text-slate-100">Cognitive & Exam Transfer:</strong> {activeRegion.examApplication}</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
