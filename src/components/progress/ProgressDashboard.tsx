import React, { useState } from 'react';
import { useProgressStore } from '../../store/progress-store';
import { usePlayerStore } from '../../store/player-store';
import { GAMES } from '../../engine/game-engine/game-registry';
import { GameId } from '../../engine/game-engine/types';
import { formatTimeMs } from '../../engine/game-engine/timer';
import { soundManager } from '../../lib/sound';
import { Brain, Eye, Calculator, Target, Layers, Trophy, TrendingUp, Play, Award, Zap, Sparkles, Download } from 'lucide-react';
import { NeuronActivityPulseBackground } from '../background/NeuronActivityPulseBackground';
import { CognitiveCertificateModal } from './CognitiveCertificateModal';

interface ProgressDashboardProps {
  onPlayGame: (gameId: GameId) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onPlayGame }) => {
  const { games, attempts } = useProgressStore();
  const { overallMindLevel, currentStreak, longestStreak, totalGamesPlayed } = usePlayerStore();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('7d');
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  const domainCards = [
    { id: 'anzan' as GameId, name: 'Pro Calculations', icon: Calculator, progress: games.anzan, color: 'from-amber-600 to-stone-800', barColor: 'bg-amber-500' },
    { id: 'wordspeed' as GameId, name: 'Word Speed', icon: Eye, progress: games.wordspeed, color: 'from-sky-600 to-cyan-800', barColor: 'bg-sky-600' },
    { id: 'boggle' as GameId, name: 'Boggle', icon: Sparkles, progress: games.boggle, color: 'from-rose-600 to-slate-800', barColor: 'bg-rose-500' },
    { id: 'sudoku' as GameId, name: 'Sudoku Reflex', icon: Brain, progress: games.sudoku, color: 'from-indigo-600 to-slate-800', barColor: 'bg-indigo-600' },
    { id: 'zebra' as GameId, name: 'Puzzles', icon: Layers, progress: games.zebra, color: 'from-teal-600 to-emerald-800', barColor: 'bg-teal-600' }
  ];

  const personalRecords = [
    { title: 'Fastest Word Speed', value: games.wordspeed?.bestTimeMs > 0 ? formatTimeMs(games.wordspeed.bestTimeMs) : '—' },
    { title: 'Best Pro Calc Acc', value: games.anzan?.averageAccuracy > 0 ? `${games.anzan.averageAccuracy}%` : '—' },
    { title: 'Highest Boggle Score', value: games.boggle?.bestScore > 0 ? `${games.boggle.bestScore} pts` : '—' },
    { title: 'Highest Sudoku Reflex', value: `Level ${games.sudoku?.level || 1}` },
    { title: 'Highest Puzzle Level', value: `Level ${games.zebra?.level || 1}` }
  ];

  const filteredAttempts = attempts.slice(0, timeframe === '7d' ? 10 : timeframe === '30d' ? 25 : 50);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 select-none relative overflow-hidden">
      
      {/* Brain Activity Pulse = Neuron System Background (Analytics Cortex) */}
      <NeuronActivityPulseBackground theme="analytics-cortex" />

      {/* Header Banner: Your Mind */}
      <div className="relative z-10 overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm mb-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Cognitive Profile
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">
              Your Mind Performance
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-md font-normal leading-relaxed">
              4-Layer Performance analytics tracking accuracy, speed vs baseline, and level mastery.
            </p>
          </div>

          {/* Action Buttons: Export Certificate & Mind Level Badge */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => {
                soundManager.playTap();
                setCertificateModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Generate and Download Cognitive Certificate"
            >
              <Award className="w-4 h-4" />
              <span>Certificate (.PNG)</span>
            </button>

            {/* Overall Mind Level Badge */}
            <div className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60">
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Mind Level</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{overallMindLevel}</span>
              </div>
              <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Zap className="w-4 h-4 fill-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Mini stats strip */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Active Streak</p>
            <p className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">{currentStreak} Days</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Longest Streak</p>
            <p className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">{longestStreak} Days</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Games Played</p>
            <p className="text-base font-bold font-mono text-slate-800 dark:text-slate-200">{totalGamesPlayed}</p>
          </div>
        </div>
      </div>

      {/* 5 Cognitive Domain Cards */}
      <div className="mb-7">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3.5">
          5 Cognitive Domain Levels & Mastery
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {domainCards.map((domain) => {
            const Icon = domain.icon;
            const game = GAMES[domain.id];
            const p = domain.progress;
            const mastery = p.mastery ?? 25;
            const nextLvl = p.level + 1;

            return (
              <div
                key={domain.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${domain.color} text-white flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">{domain.name}</h3>
                        <p className="text-[10px] text-slate-400 font-normal">{game.name}</p>
                      </div>
                    </div>

                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                      Lvl {p.level}
                    </span>
                  </div>

                  {/* Mastery toward Next Level Bar */}
                  <div className="my-2.5">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase mb-1 font-mono">
                      <span>Mastery toward Lv {nextLvl}</span>
                      <span>{mastery}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${mastery}%` }}
                        className={`h-full rounded-full ${domain.barColor} transition-all duration-500`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 my-3 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Avg Accuracy:</span>
                      <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{p.averageAccuracy || 100}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Baseline Speed:</span>
                      <span className="font-mono font-medium text-teal-600 dark:text-teal-400">
                        {p.baselineImprovementPercent > 0 ? `+${p.baselineImprovementPercent}% faster` : 'Calibrating'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Best Time:</span>
                      <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                        {p.bestTimeMs > 0 ? formatTimeMs(p.bestTimeMs) : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playTap();
                    onPlayGame(domain.id);
                  }}
                  className="mt-1.5 w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-1"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Train</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Records Showcase */}
      <div className="mb-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-3.5">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Personal Records
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {personalRecords.map((r) => (
            <div key={r.title} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <p className="text-[10px] font-medium text-slate-400 truncate">{r.title}</p>
              <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">{r.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Session History Log */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Training History
            </h2>
          </div>

          <div className="flex gap-1 self-start sm:self-auto">
            {(['7d', '30d', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  soundManager.playTap();
                  setTimeframe(t);
                }}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  timeframe === t
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {t === '7d' ? 'Recent' : t === '30d' ? '30 Days' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {filteredAttempts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-normal">
            No training sessions recorded yet. Play a game to see your performance metrics.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredAttempts.map((attempt) => {
              const game = GAMES[attempt.gameId];
              return (
                <div key={attempt.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{game.name}</span>
                    <span className="text-slate-400 ml-2 font-mono">Lvl {attempt.level}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-slate-600 dark:text-slate-400">{attempt.accuracy}% acc</span>
                    <span className="text-slate-600 dark:text-slate-400">{formatTimeMs(attempt.timeMs)}</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400 min-w-[3.5rem] text-right">
                      {attempt.performanceScore ? `${attempt.performanceScore} pts` : `${attempt.score} pts`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Verified Cognitive Performance Certificate Modal (Phase 5) */}
      <CognitiveCertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
      />

    </div>
  );
};
