import React from 'react';
import { useProgressStore } from '../../store/progress-store';
import { usePlayerStore } from '../../store/player-store';
import { soundManager } from '../../lib/sound';
import { ArrowRight, Brain, Eye, Calculator, Target, Layers } from 'lucide-react';
import { NeuronActivityPulseBackground } from '../background/NeuronActivityPulseBackground';

interface ProgressPreviewProps {
  onViewFullProgress: () => void;
}

export const ProgressPreview: React.FC<ProgressPreviewProps> = ({ onViewFullProgress }) => {
  const { getSkillProfile } = useProgressStore();
  const { overallMindLevel } = usePlayerStore();

  const skills = getSkillProfile();

  const iconMap: Record<string, any> = {
    Calculation: Calculator,
    'Visual Scan': Eye,
    'Logic Constraints': Brain,
    'Complex Reasoning': Layers,
    'Selective Focus': Target
  };

  const colorMap: Record<string, string> = {
    Calculation: 'bg-amber-500',
    'Visual Scan': 'bg-sky-500',
    'Logic Constraints': 'bg-purple-500',
    'Complex Reasoning': 'bg-emerald-500',
    'Selective Focus': 'bg-rose-500'
  };

  return (
    <div className="relative overflow-hidden p-6 sm:p-7 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between select-none">
      
      {/* Brain Activity Pulse = Neuron System Background (Cognitive Radar) */}
      <NeuronActivityPulseBackground theme="cognitive-radar" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Your Mind
              </h3>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-mono font-black">
                LV {overallMindLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              5 core cognitive training areas
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playTap();
              onViewFullProgress();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all inline-flex items-center gap-1.5 active:scale-98"
          >
            <span>Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Skills Progress with Status Tiers */}
        <div className="space-y-3">
          {skills.map((s) => {
            const Icon = iconMap[s.name] || Brain;
            const barColor = colorMap[s.name] || 'bg-teal-500';
            const progressPercent = Math.min(100, Math.max(0, s.mastery));

            return (
              <div key={s.name} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-36 shrink-0">
                  <div className="h-6 w-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {s.name}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                    />
                  </div>
                </div>

                <div className="w-24 text-right shrink-0 flex items-center justify-end gap-1.5">
                  <span className={`text-[10px] font-semibold ${s.status === 'Unplayed' ? 'text-slate-400 dark:text-slate-500 italic' : 'text-teal-600 dark:text-teal-400'}`}>
                    {s.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {s.status === 'Unplayed' ? 'L1' : `L${s.level}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
