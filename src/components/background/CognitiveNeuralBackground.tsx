import React from 'react';
import { useProgressStore } from '../../store/progress-store';
import { computeAuthenticUserStats } from '../../engine/stats-engine/real-stats';

interface CognitiveNeuralBackgroundProps {
  hoveredGameId?: string | null;
}

export const CognitiveNeuralBackground: React.FC<CognitiveNeuralBackgroundProps> = ({
  hoveredGameId
}) => {
  const { games, attempts } = useProgressStore();
  const { backgroundLabels } = computeAuthenticUserStats(games, attempts);
  return (
    <div 
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* 1. Subtle Ambient Core Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-br from-teal-500/8 via-cyan-500/5 to-transparent dark:from-teal-500/12 dark:via-cyan-500/8 dark:to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-bl from-indigo-500/8 via-purple-500/5 to-transparent dark:from-indigo-500/12 dark:via-purple-500/8 dark:to-transparent rounded-full blur-3xl" />

      {/* 2. SVG Neural Network & 5 Colored Cognitive Signal Paths */}
      <svg 
        className="w-full h-full object-cover opacity-60 dark:opacity-75"
        viewBox="0 0 1440 900" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Signal Path Linear Gradients */}
          <linearGradient id="neural-amber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="neural-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="neural-violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="neural-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="neural-rose-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E11D48" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="neural-indigo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
          </linearGradient>

          {/* Particle Glow Filter */}
          <filter id="particle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- STATIC NEURAL MESH (Thin Subtle Interconnections) --- */}
        <g className="stroke-slate-300/40 dark:stroke-slate-700/40" strokeWidth="0.75" strokeDasharray="3 6">
          <line x1="180" y1="180" x2="340" y2="280" />
          <line x1="340" y1="280" x2="220" y2="440" />
          <line x1="220" y1="440" x2="160" y2="620" />
          <line x1="160" y1="620" x2="320" y2="740" />
          
          <line x1="1260" y1="200" x2="1100" y2="300" />
          <line x1="1100" y1="300" x2="1240" y2="480" />
          <line x1="1240" y1="480" x2="1120" y2="660" />
          <line x1="1120" y1="660" x2="1260" y2="760" />

          {/* Central cross-mesh connections */}
          <line x1="340" y1="280" x2="620" y2="420" />
          <line x1="1100" y1="300" x2="820" y2="420" />
          <line x1="220" y1="440" x2="600" y2="540" />
          <line x1="1240" y1="480" x2="840" y2="540" />
        </g>

        {/* --- STATIC NEURAL NODES (Small Junction Dots) --- */}
        <g className="fill-slate-300 dark:fill-slate-700 opacity-60">
          <circle cx="180" cy="180" r="2.5" />
          <circle cx="340" cy="280" r="3" />
          <circle cx="220" cy="440" r="2.5" />
          <circle cx="160" cy="620" r="2.5" />
          <circle cx="320" cy="740" r="3" />
          
          <circle cx="1260" cy="200" r="2.5" />
          <circle cx="1100" cy="300" r="3" />
          <circle cx="1240" cy="480" r="2.5" />
          <circle cx="1120" cy="660" r="2.5" />
          <circle cx="1260" cy="760" r="3" />
        </g>

        {/* --- 5 COGNITIVE SIGNAL PATHS (Converging Toward Central Brain Area [720, 520]) --- */}

        {/* 1. Pro Calculations (Amber / Orange) - Originates Top-Left */}
        <g className="transition-all duration-300">
          <path
            id="path-pro-calc"
            d="M 180 180 C 290 220, 420 340, 640 470"
            stroke="url(#neural-amber-grad)"
            strokeWidth={hoveredGameId === 'anzan' || hoveredGameId === 'calculation' ? "2.5" : "1.2"}
            strokeDasharray="4 6"
            className="transition-all duration-300"
            opacity={hoveredGameId === 'anzan' || hoveredGameId === 'calculation' ? "0.95" : "0.35"}
          />
          <circle cx="180" cy="180" r="4" fill="#F59E0B" opacity="0.8" />
          <circle cx="640" cy="470" r="3.5" fill="#F59E0B" opacity="0.9" filter="url(#particle-glow)" />

          {/* Animated Traveling Signal Particle */}
          <circle r="3" fill="#F59E0B" filter="url(#particle-glow)" className="neural-particle">
            <animateMotion
              dur="5.5s"
              repeatCount="indefinite"
              path="M 180 180 C 290 220, 420 340, 640 470"
            />
          </circle>
        </g>

        {/* 2. Reasoning Puzzles (Emerald / Green) - Originates Mid-Left */}
        <g className="transition-all duration-300">
          <path
            id="path-puzzles"
            d="M 120 460 C 260 480, 440 520, 640 530"
            stroke="url(#neural-emerald-grad)"
            strokeWidth={hoveredGameId === 'zebra' || hoveredGameId === 'reasoning' ? "2.5" : "1.2"}
            strokeDasharray="4 6"
            className="transition-all duration-300"
            opacity={hoveredGameId === 'zebra' || hoveredGameId === 'reasoning' ? "0.95" : "0.35"}
          />
          <circle cx="120" cy="460" r="4" fill="#10B981" opacity="0.8" />
          <circle cx="640" cy="530" r="3.5" fill="#10B981" opacity="0.9" filter="url(#particle-glow)" />

          {/* Animated Traveling Signal Particle */}
          <circle r="3" fill="#10B981" filter="url(#particle-glow)" className="neural-particle">
            <animateMotion
              dur="6.2s"
              begin="1.2s"
              repeatCount="indefinite"
              path="M 120 460 C 260 480, 440 520, 640 530"
            />
          </circle>
        </g>

        {/* 3. Mind Mix / Logic (Indigo / Purple) - Originates Bottom-Left */}
        <g className="transition-all duration-300">
          <path
            id="path-mindmix"
            d="M 220 740 C 360 700, 520 640, 670 570"
            stroke="url(#neural-indigo-grad)"
            strokeWidth={hoveredGameId === 'mindmix' ? "2.5" : "1.2"}
            strokeDasharray="4 6"
            className="transition-all duration-300"
            opacity={hoveredGameId === 'mindmix' ? "0.95" : "0.35"}
          />
          <circle cx="220" cy="740" r="4" fill="#6366F1" opacity="0.8" />
          <circle cx="670" cy="570" r="3.5" fill="#6366F1" opacity="0.9" filter="url(#particle-glow)" />

          {/* Animated Traveling Signal Particle */}
          <circle r="3" fill="#6366F1" filter="url(#particle-glow)" className="neural-particle">
            <animateMotion
              dur="5.8s"
              begin="2.5s"
              repeatCount="indefinite"
              path="M 220 740 C 360 700, 520 640, 670 570"
            />
          </circle>
        </g>

        {/* 4. Sudoku Reflex (Violet / Purple) - Originates Top-Right */}
        <g className="transition-all duration-300">
          <path
            id="path-sudoku"
            d="M 1260 200 C 1140 240, 980 360, 800 470"
            stroke="url(#neural-violet-grad)"
            strokeWidth={hoveredGameId === 'sudoku' || hoveredGameId === 'logic' ? "2.5" : "1.2"}
            strokeDasharray="4 6"
            className="transition-all duration-300"
            opacity={hoveredGameId === 'sudoku' || hoveredGameId === 'logic' ? "0.95" : "0.35"}
          />
          <circle cx="1260" cy="200" r="4" fill="#8B5CF6" opacity="0.8" />
          <circle cx="800" cy="470" r="3.5" fill="#8B5CF6" opacity="0.9" filter="url(#particle-glow)" />

          {/* Animated Traveling Signal Particle */}
          <circle r="3" fill="#8B5CF6" filter="url(#particle-glow)" className="neural-particle">
            <animateMotion
              dur="5.4s"
              begin="0.8s"
              repeatCount="indefinite"
              path="M 1260 200 C 1140 240, 980 360, 800 470"
            />
          </circle>
        </g>

        {/* 5. Word Speed (Cyan / Blue) - Originates Mid-Right */}
        <g className="transition-all duration-300">
          <path
            id="path-wordspeed"
            d="M 1320 480 C 1180 500, 1000 530, 800 530"
            stroke="url(#neural-cyan-grad)"
            strokeWidth={hoveredGameId === 'wordspeed' || hoveredGameId === 'verbal_processing' ? "2.5" : "1.2"}
            strokeDasharray="4 6"
            className="transition-all duration-300"
            opacity={hoveredGameId === 'wordspeed' || hoveredGameId === 'verbal_processing' ? "0.95" : "0.35"}
          />
          <circle cx="1320" cy="480" r="4" fill="#0EA5E9" opacity="0.8" />
          <circle cx="800" cy="530" r="3.5" fill="#0EA5E9" opacity="0.9" filter="url(#particle-glow)" />

          {/* Animated Traveling Signal Particle */}
          <circle r="3" fill="#0EA5E9" filter="url(#particle-glow)" className="neural-particle">
            <animateMotion
              dur="6.0s"
              begin="1.8s"
              repeatCount="indefinite"
              path="M 1320 480 C 1180 500, 1000 530, 800 530"
            />
          </circle>
        </g>

        {/* 6. Boggle / Focus (Rose / Pink) - Originates Bottom-Right */}
        <g className="transition-all duration-300">
          <path
            id="path-boggle"
            d="M 1220 740 C 1080 710, 940 640, 770 570"
            stroke="url(#neural-rose-grad)"
            strokeWidth={hoveredGameId === 'boggle' || hoveredGameId === 'focus' ? "2.5" : "1.2"}
            strokeDasharray="4 6"
            className="transition-all duration-300"
            opacity={hoveredGameId === 'boggle' || hoveredGameId === 'focus' ? "0.95" : "0.35"}
          />
          <circle cx="1220" cy="740" r="4" fill="#F43F5E" opacity="0.8" />
          <circle cx="770" cy="570" r="3.5" fill="#F43F5E" opacity="0.9" filter="url(#particle-glow)" />

          {/* Animated Traveling Signal Particle */}
          <circle r="3" fill="#F43F5E" filter="url(#particle-glow)" className="neural-particle">
            <animateMotion
              dur="5.9s"
              begin="3.1s"
              repeatCount="indefinite"
              path="M 1220 740 C 1080 710, 940 640, 770 570"
            />
          </circle>
        </g>

        {/* Central Brain Receiving Activity Rings (Subtle Pulse) */}
        <g className="opacity-40 dark:opacity-60 pointer-events-none">
          <circle cx="720" cy="520" r="90" stroke="#14B8A6" strokeWidth="0.8" strokeDasharray="3 6" className="animate-spin-slow" />
          <circle cx="720" cy="520" r="140" stroke="#6366F1" strokeWidth="0.5" strokeDasharray="2 8" className="animate-spin-reverse-slow" />
        </g>
      </svg>

      {/* 3. Floating Cognitive Performance Micro-Labels (Truth-Based Dynamic Telemetry) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        
        {/* Label 1 (Top Left) */}
        {backgroundLabels[0] && (
          <div className="absolute top-[14%] left-[7%] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 backdrop-blur-xs shadow-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${backgroundLabels[0].pulseColor} animate-pulse`} />
            <span>{backgroundLabels[0].title}</span>
            <span className={`font-bold ${backgroundLabels[0].color}`}>{backgroundLabels[0].value}</span>
          </div>
        )}

        {/* Label 2 (Top Right) */}
        {backgroundLabels[1] && (
          <div className="absolute top-[15%] right-[7%] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 backdrop-blur-xs shadow-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${backgroundLabels[1].pulseColor} animate-pulse`} />
            <span>{backgroundLabels[1].title}</span>
            <span className={`font-bold ${backgroundLabels[1].color}`}>{backgroundLabels[1].value}</span>
          </div>
        )}

        {/* Label 3 (Mid-Low Left) */}
        {backgroundLabels[2] && (
          <div className="absolute top-[52%] left-[4%] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 backdrop-blur-xs shadow-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${backgroundLabels[2].pulseColor} animate-pulse`} />
            <span>{backgroundLabels[2].title}</span>
            <span className={`font-bold ${backgroundLabels[2].color}`}>{backgroundLabels[2].value}</span>
          </div>
        )}

        {/* Label 4 (Mid Right) */}
        {backgroundLabels[3] && (
          <div className="absolute top-[50%] right-[4%] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 backdrop-blur-xs shadow-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${backgroundLabels[3].pulseColor} animate-pulse`} />
            <span>{backgroundLabels[3].title}</span>
            <span className={`font-bold ${backgroundLabels[3].color}`}>{backgroundLabels[3].value}</span>
          </div>
        )}

        {/* Label 5 (Bottom Right) */}
        {backgroundLabels[4] && (
          <div className="absolute top-[75%] right-[9%] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 backdrop-blur-xs shadow-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${backgroundLabels[4].pulseColor} animate-pulse`} />
            <span>{backgroundLabels[4].title}</span>
            <span className={`font-bold ${backgroundLabels[4].color}`}>{backgroundLabels[4].value}</span>
          </div>
        )}

      </div>

    </div>
  );
};