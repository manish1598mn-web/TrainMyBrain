import React from 'react';
import { ArrowRight } from 'lucide-react';
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

export const Hero: React.FC<HeroProps> = ({ 
  onExploreGames, 
  onPlayTraining 
}) => {
  const handleScrollToGames = () => {
    soundManager.playTap();
    const el = document.getElementById('games-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExploreGames();
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-6 sm:pt-10 sm:pb-8 text-left select-none">
      
      {/* Brain Activity Pulse = Neuron System Background (Hero Convergence) */}
      <NeuronActivityPulseBackground theme="hero-convergence" />

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
              <span>??? Training — Build Fundamentals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleScrollToGames}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center gap-2"
          >
            <span>Explore 5 Brain Games</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level Progression Stepper (Levels 1 to 99+) */}
      <div className="relative z-10">
        <LevelProgressionPath />
      </div>

    </section>
  );
};
