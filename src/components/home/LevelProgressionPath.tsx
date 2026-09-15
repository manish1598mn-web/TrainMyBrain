import React from 'react';
import { Sparkles } from 'lucide-react';

export const LevelProgressionPath: React.FC = () => {
  const steps = [
    { level: 'Lvl 1', label: 'Beginner', active: true },
    { level: 'Lvl 10', label: 'Building', active: true },
    { level: 'Lvl 25', label: 'Improving', active: false },
    { level: 'Lvl 50', label: 'Advanced', active: false },
    { level: 'Lvl 75', label: 'Expert', active: false },
    { level: 'Lvl 99+', label: 'Master', active: false }
  ];

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 select-none">
      
      {/* Container Box */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 backdrop-blur-sm shadow-xs">
        
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-teal-500" />
            <span>Level Progression Path</span>
          </div>
          <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold hidden sm:inline-block">
            Adaptive Scaling (Lvl 1 ? 99+)
          </span>
        </div>

        {/* Horizontal Stepper Path */}
        <div className="relative flex items-center justify-between w-full px-2 sm:px-4">
          
          {/* Background Connecting Rail */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
          
          {/* Active Gradient Segment (Lvl 1 to Lvl 10) */}
          <div className="absolute top-1/2 left-4 w-[20%] -translate-y-1/2 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 -z-0" />

          {/* Stepper Nodes */}
          {steps.map((st, idx) => (
            <div 
              key={idx}
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              {/* Node Dot */}
              <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                st.active
                  ? 'bg-teal-500 border-white dark:border-slate-900 shadow-sm ring-2 ring-teal-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
              }`}>
                {st.active && <div className="w-1 h-1 rounded-full bg-white" />}
              </div>

              {/* Node Labels */}
              <div className="mt-1.5 text-center flex flex-col items-center">
                <span className={`text-[10px] sm:text-xs font-mono font-bold tracking-tight ${
                  st.active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {st.level}
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 hidden xs:inline-block">
                  {st.label}
                </span>
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};
