import React, { useState } from 'react';
import { Sparkles, Trophy, Swords, Shield, Zap, Lock, BellRing, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../lib/sound';
import { NeuronActivityPulseBackground } from '../background/NeuronActivityPulseBackground';

export const DailyChallengeView: React.FC = () => {
  const [notified, setNotified] = useState(false);

  const handleNotifyToggle = () => {
    soundManager.playCorrect();
    setNotified(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 select-none animate-in fade-in duration-300 relative overflow-hidden">
      
      {/* Brain Activity Pulse = Neuron System Background */}
      <NeuronActivityPulseBackground theme="hero-convergence" />

      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>UPCOMING MAJOR EXPANSION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Global Challenges & Tournaments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto font-medium leading-relaxed">
          Compete against brain athletes worldwide with deterministic synchronized seeds, peer ghost racing, and seasonal leaderboards.
        </p>
      </div>

      {/* Main Coming Soon Banner Card */}
      <div className="relative z-10 overflow-hidden rounded-3xl bg-gradient-to-b from-amber-500/15 via-slate-900/95 to-slate-950 border-2 border-amber-500/40 p-8 sm:p-12 shadow-2xl text-center flex flex-col items-center justify-center mb-8 backdrop-blur-md">
        
        {/* Glow ambient pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none -z-0 animate-pulse" />

        {/* Animated Trophy Node */}
        <div className="relative z-10 w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-3xl shadow-2xl mb-4 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs uppercase mb-3 border border-amber-500/30">
          <Lock className="w-3.5 h-3.5" />
          <span>COMING SOON</span>
        </div>

        <h2 className="relative z-10 text-2xl sm:text-3xl font-black text-white mb-2 font-mono tracking-tight">
          Global Daily Challenges & Arena
        </h2>

        <p className="relative z-10 text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed mb-6 font-medium">
          We are engineering a zero-cheat, client-verified tournament engine with daily synchronized puzzle seeds and real-time ghost racing.
        </p>

        {/* Interactive Notification / Reminder Button */}
        <div className="relative z-10 mb-8">
          <button
            onClick={handleNotifyToggle}
            className={`px-5 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
              notified
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
            }`}
          >
            {notified ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>You'll be notified on launch! ✨</span>
              </>
            ) : (
              <>
                <BellRing className="w-4 h-4 animate-swing" />
                <span>Notify Me When Tournaments Open</span>
              </>
            )}
          </button>
        </div>

        {/* Feature Teasers Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
          
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between hover:border-amber-400/50 transition-all">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Global Daily Seed</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              One uniform puzzle challenge generated daily worldwide with identical deterministic seed.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between hover:border-indigo-400/50 transition-all">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 font-bold">
              <Swords className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Ghost Duels</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Race in real time against peer ghost recordings with sub-second delta pacing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between hover:border-emerald-400/50 transition-all">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Proof-of-Solve</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Algorithmic anti-cheat validation with local-first client verification.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
