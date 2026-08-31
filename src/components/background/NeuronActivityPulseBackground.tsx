import React from 'react';

export type NeuronTheme = 
  | 'hero-convergence'
  | 'game-matrix'
  | 'cognitive-radar'
  | 'neural-plasticity'
  | 'educational-synapses'
  | 'analytics-cortex'
  | 'arithmetic'
  | 'verbal'
  | 'spatial'
  | 'logic';

interface NeuronActivityPulseBackgroundProps {
  theme?: NeuronTheme;
  activeGameId?: string | null;
  density?: 'minimal' | 'balanced' | 'rich';
  className?: string;
}

export const NeuronActivityPulseBackground: React.FC<NeuronActivityPulseBackgroundProps> = ({
  theme = 'hero-convergence',
  activeGameId,
  density = 'balanced',
  className = ''
}) => {
  return (
    <div 
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* 1. Theme: HERO CONVERGENCE (Branching Axons & Dendrites converging into Central 🧠) */}
      {theme === 'hero-convergence' && (
        <svg 
          className="w-full h-full object-cover opacity-65 dark:opacity-80"
          viewBox="0 0 1440 850" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Synaptic Gradients */}
            <linearGradient id="synapse-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="synapse-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="synapse-violet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="synapse-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="synapse-rose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E11D48" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="synapse-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="synapse-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* --- BRANCHING DENDRITIC LATTICE (ASCII-Style Branching Mesh) --- */}
          {/*
              ·──────·          ·──────·
             /        \        /
          ·─·          ·──────·
           \              \
            ·──────·       ·──────·
                    \
                     🧠
          */}
          <g className="stroke-slate-300/40 dark:stroke-slate-700/40" strokeWidth="1" strokeDasharray="3 5">
            {/* Top-Left Dendrite Branch */}
            <path d="M 120 140 L 260 140 L 380 220 L 520 220 L 640 460" />
            <path d="M 120 140 L 200 240 L 340 240 L 480 360 L 640 460" />
            <path d="M 80 280 L 200 240 L 320 380 L 500 420 L 640 480" />

            {/* Mid-Left & Bottom-Left Dendrite Branch */}
            <path d="M 100 480 L 240 480 L 380 540 L 520 540 L 650 530" />
            <path d="M 160 700 L 300 700 L 440 640 L 560 600 L 670 570" />

            {/* Top-Right Dendrite Branch */}
            <path d="M 1320 150 L 1180 150 L 1060 230 L 920 230 L 800 460" />
            <path d="M 1320 150 L 1240 250 L 1100 250 L 960 370 L 800 460" />
            <path d="M 1360 290 L 1240 250 L 1120 390 L 940 430 L 800 480" />

            {/* Mid-Right & Bottom-Right Dendrite Branch */}
            <path d="M 1340 490 L 1200 490 L 1060 550 L 920 550 L 790 540" />
            <path d="M 1280 710 L 1140 710 L 1000 650 L 880 610 L 770 570" />
          </g>

          {/* --- SYNAPTIC JUNCTION NODES (· Nodes at Branch Intersections) --- */}
          <g className="fill-slate-400 dark:fill-slate-600 opacity-75">
            {/* Left Synapse Nodes */}
            <circle cx="120" cy="140" r="3.5" />
            <circle cx="260" cy="140" r="3" />
            <circle cx="380" cy="220" r="3.5" />
            <circle cx="520" cy="220" r="3" />
            <circle cx="200" cy="240" r="3.5" />
            <circle cx="340" cy="240" r="3" />
            <circle cx="480" cy="360" r="3.5" />
            <circle cx="80" cy="280" r="3" />
            <circle cx="320" cy="380" r="3" />
            <circle cx="500" cy="420" r="3.5" />
            <circle cx="100" cy="480" r="3.5" />
            <circle cx="240" cy="480" r="3" />
            <circle cx="380" cy="540" r="3.5" />
            <circle cx="520" cy="540" r="3" />
            <circle cx="160" cy="700" r="3.5" />
            <circle cx="300" cy="700" r="3" />
            <circle cx="440" cy="640" r="3.5" />
            <circle cx="560" cy="600" r="3" />

            {/* Right Synapse Nodes */}
            <circle cx="1320" cy="150" r="3.5" />
            <circle cx="1180" cy="150" r="3" />
            <circle cx="1060" cy="230" r="3.5" />
            <circle cx="920" cy="230" r="3" />
            <circle cx="1240" cy="250" r="3.5" />
            <circle cx="1100" cy="250" r="3" />
            <circle cx="960" cy="370" r="3.5" />
            <circle cx="1360" cy="290" r="3" />
            <circle cx="1120" cy="390" r="3" />
            <circle cx="940" cy="430" r="3.5" />
            <circle cx="1340" cy="490" r="3.5" />
            <circle cx="1200" cy="490" r="3" />
            <circle cx="1060" cy="550" r="3.5" />
            <circle cx="920" cy="550" r="3" />
            <circle cx="1280" cy="710" r="3.5" />
            <circle cx="1140" cy="710" r="3" />
            <circle cx="1000" cy="650" r="3.5" />
            <circle cx="880" cy="610" r="3" />
          </g>

          {/* --- ACTIVE COGNITIVE ACTION POTENTIALS (Animated Synaptic Pulses) --- */}

          {/* 1. Pro Calculations (Amber Flash Pathway) */}
          <g className="transition-all duration-300">
            <path
              id="synapse-path-pro-calc"
              d="M 120 140 L 260 140 L 380 220 L 520 220 L 640 460"
              stroke="url(#synapse-amber)"
              strokeWidth={activeGameId === 'anzan' || activeGameId === 'calculation' ? "2.5" : "1.2"}
              strokeDasharray="4 6"
              opacity={activeGameId === 'anzan' || activeGameId === 'calculation' ? "0.95" : "0.4"}
            />
            <circle cx="120" cy="140" r="4.5" fill="#F59E0B" filter="url(#synapse-glow)" />
            <circle cx="640" cy="460" r="4" fill="#F59E0B" filter="url(#synapse-glow)" />
            <circle r="3.5" fill="#F59E0B" filter="url(#synapse-glow)" className="neural-particle">
              <animateMotion
                dur="4.8s"
                repeatCount="indefinite"
                path="M 120 140 L 260 140 L 380 220 L 520 220 L 640 460"
              />
            </circle>
          </g>

          {/* 2. Reasoning Puzzles (Emerald Relational Pathway) */}
          <g className="transition-all duration-300">
            <path
              id="synapse-path-puzzles"
              d="M 100 480 L 240 480 L 380 540 L 520 540 L 650 530"
              stroke="url(#synapse-emerald)"
              strokeWidth={activeGameId === 'zebra' || activeGameId === 'reasoning' ? "2.5" : "1.2"}
              strokeDasharray="4 6"
              opacity={activeGameId === 'zebra' || activeGameId === 'reasoning' ? "0.95" : "0.4"}
            />
            <circle cx="100" cy="480" r="4.5" fill="#10B981" filter="url(#synapse-glow)" />
            <circle cx="650" cy="530" r="4" fill="#10B981" filter="url(#synapse-glow)" />
            <circle r="3.5" fill="#10B981" filter="url(#synapse-glow)" className="neural-particle">
              <animateMotion
                dur="5.6s"
                begin="1.2s"
                repeatCount="indefinite"
                path="M 100 480 L 240 480 L 380 540 L 520 540 L 650 530"
              />
            </circle>
          </g>

          {/* 3. Mind Mix (Indigo Executive Pathway) */}
          <g className="transition-all duration-300">
            <path
              id="synapse-path-mindmix"
              d="M 160 700 L 300 700 L 440 640 L 560 600 L 670 570"
              stroke="url(#synapse-indigo)"
              strokeWidth={activeGameId === 'mindmix' ? "2.5" : "1.2"}
              strokeDasharray="4 6"
              opacity={activeGameId === 'mindmix' ? "0.95" : "0.4"}
            />
            <circle cx="160" cy="700" r="4.5" fill="#6366F1" filter="url(#synapse-glow)" />
            <circle cx="670" cy="570" r="4" fill="#6366F1" filter="url(#synapse-glow)" />
            <circle r="3.5" fill="#6366F1" filter="url(#synapse-glow)" className="neural-particle">
              <animateMotion
                dur="5.2s"
                begin="2.1s"
                repeatCount="indefinite"
                path="M 160 700 L 300 700 L 440 640 L 560 600 L 670 570"
              />
            </circle>
          </g>

          {/* 4. Sudoku Reflex (Violet Constraint Pathway) */}
          <g className="transition-all duration-300">
            <path
              id="synapse-path-sudoku"
              d="M 1320 150 L 1180 150 L 1060 230 L 920 230 L 800 460"
              stroke="url(#synapse-violet)"
              strokeWidth={activeGameId === 'sudoku' || activeGameId === 'logic' ? "2.5" : "1.2"}
              strokeDasharray="4 6"
              opacity={activeGameId === 'sudoku' || activeGameId === 'logic' ? "0.95" : "0.4"}
            />
            <circle cx="1320" cy="150" r="4.5" fill="#8B5CF6" filter="url(#synapse-glow)" />
            <circle cx="800" cy="460" r="4" fill="#8B5CF6" filter="url(#synapse-glow)" />
            <circle r="3.5" fill="#8B5CF6" filter="url(#synapse-glow)" className="neural-particle">
              <animateMotion
                dur="5.0s"
                begin="0.7s"
                repeatCount="indefinite"
                path="M 1320 150 L 1180 150 L 1060 230 L 920 230 L 800 460"
              />
            </circle>
          </g>

          {/* 5. Word Speed (Cyan Verbal Pathway) */}
          <g className="transition-all duration-300">
            <path
              id="synapse-path-wordspeed"
              d="M 1340 490 L 1200 490 L 1060 550 L 920 550 L 790 540"
              stroke="url(#synapse-cyan)"
              strokeWidth={activeGameId === 'wordspeed' || activeGameId === 'verbal_processing' ? "2.5" : "1.2"}
              strokeDasharray="4 6"
              opacity={activeGameId === 'wordspeed' || activeGameId === 'verbal_processing' ? "0.95" : "0.4"}
            />
            <circle cx="1340" cy="490" r="4.5" fill="#0EA5E9" filter="url(#synapse-glow)" />
            <circle cx="790" cy="540" r="4" fill="#0EA5E9" filter="url(#synapse-glow)" />
            <circle r="3.5" fill="#0EA5E9" filter="url(#synapse-glow)" className="neural-particle">
              <animateMotion
                dur="5.4s"
                begin="1.8s"
                repeatCount="indefinite"
                path="M 1340 490 L 1200 490 L 1060 550 L 920 550 L 790 540"
              />
            </circle>
          </g>

          {/* 6. Boggle (Rose Lexical Pathway) */}
          <g className="transition-all duration-300">
            <path
              id="synapse-path-boggle"
              d="M 1280 710 L 1140 710 L 1000 650 L 880 610 L 770 570"
              stroke="url(#synapse-rose)"
              strokeWidth={activeGameId === 'boggle' || activeGameId === 'focus' ? "2.5" : "1.2"}
              strokeDasharray="4 6"
              opacity={activeGameId === 'boggle' || activeGameId === 'focus' ? "0.95" : "0.4"}
            />
            <circle cx="1280" cy="710" r="4.5" fill="#F43F5E" filter="url(#synapse-glow)" />
            <circle cx="770" cy="570" r="4" fill="#F43F5E" filter="url(#synapse-glow)" />
            <circle r="3.5" fill="#F43F5E" filter="url(#synapse-glow)" className="neural-particle">
              <animateMotion
                dur="5.8s"
                begin="2.8s"
                repeatCount="indefinite"
                path="M 1280 710 L 1140 710 L 1000 650 L 880 610 L 770 570"
              />
            </circle>
          </g>

          {/* Central 🧠 Brain Receiving Convergence Rings */}
          <g className="opacity-40 dark:opacity-60">
            <circle cx="720" cy="520" r="95" stroke="#14B8A6" strokeWidth="0.8" strokeDasharray="3 6" className="animate-spin-slow" />
            <circle cx="720" cy="520" r="145" stroke="#6366F1" strokeWidth="0.6" strokeDasharray="2 8" className="animate-spin-reverse-slow" />
            <circle cx="720" cy="520" r="195" stroke="#F59E0B" strokeWidth="0.4" strokeDasharray="1 10" className="animate-spin-slow" />
          </g>
        </svg>
      )}

      {/* 2. Theme: GAME MATRIX (Discrete localized synaptic clusters across the 5 cards) */}
      {theme === 'game-matrix' && (
        <svg 
          className="w-full h-full object-cover opacity-50 dark:opacity-65"
          viewBox="0 0 1200 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="stroke-slate-300/40 dark:stroke-slate-700/40" strokeWidth="0.8" strokeDasharray="2 5">
            {/* Cluster 1: Arithmetic Synapses (Top Left) */}
            <path d="M 80 80 L 180 80 L 260 160 L 360 160" />
            <path d="M 180 80 L 220 220 L 320 220" />
            
            {/* Cluster 2: Verbal Synapses (Top Right) */}
            <path d="M 1120 80 L 1020 80 L 940 160 L 840 160" />
            <path d="M 1020 80 L 980 220 L 880 220" />

            {/* Cluster 3: Spatial / Boggle Synapses (Mid Center) */}
            <path d="M 460 300 L 560 300 L 640 380 L 740 380" />
            <path d="M 560 300 L 600 440 L 700 440" />

            {/* Cluster 4: Constraint / Logic (Bottom Left) */}
            <path d="M 80 500 L 180 500 L 260 420 L 360 420" />

            {/* Cluster 5: Relational Puzzles (Bottom Right) */}
            <path d="M 1120 500 L 1020 500 L 940 420 L 840 420" />
          </g>

          {/* Synapse Nodes */}
          <g className="fill-slate-400 dark:fill-slate-600 opacity-60">
            <circle cx="80" cy="80" r="3" />
            <circle cx="180" cy="80" r="3" />
            <circle cx="260" cy="160" r="3" />
            <circle cx="360" cy="160" r="3" />
            <circle cx="220" cy="220" r="3" />
            <circle cx="320" cy="220" r="3" />

            <circle cx="1120" cy="80" r="3" />
            <circle cx="1020" cy="80" r="3" />
            <circle cx="940" cy="160" r="3" />
            <circle cx="840" cy="160" r="3" />

            <circle cx="460" cy="300" r="3" />
            <circle cx="560" cy="300" r="3" />
            <circle cx="640" cy="380" r="3" />
            <circle cx="740" cy="380" r="3" />
          </g>

          {/* Gentle synaptic pulse particles */}
          <circle r="2.5" fill="#F59E0B" className="neural-particle" opacity="0.8">
            <animateMotion dur="6s" repeatCount="indefinite" path="M 80 80 L 180 80 L 260 160 L 360 160" />
          </circle>
          <circle r="2.5" fill="#0EA5E9" className="neural-particle" opacity="0.8">
            <animateMotion dur="6.5s" begin="1s" repeatCount="indefinite" path="M 1120 80 L 1020 80 L 940 160 L 840 160" />
          </circle>
          <circle r="2.5" fill="#10B981" className="neural-particle" opacity="0.8">
            <animateMotion dur="5.5s" begin="2s" repeatCount="indefinite" path="M 460 300 L 560 300 L 640 380 L 740 380" />
          </circle>
        </svg>
      )}

      {/* 3. Theme: NEURAL PLASTICITY (Long-term memory consolidation lattice for Streaks) */}
      {theme === 'neural-plasticity' && (
        <svg 
          className="w-full h-full object-cover opacity-45 dark:opacity-60"
          viewBox="0 0 800 300" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="stroke-amber-500/30 dark:stroke-amber-400/25" strokeWidth="0.8" strokeDasharray="3 5">
            <path d="M 40 150 L 140 150 L 220 80 L 340 80 L 420 150 L 540 150 L 620 220 L 740 220" />
            <path d="M 140 150 L 220 220 L 340 220 L 420 150 L 540 150 L 620 80 L 740 80" />
          </g>

          <g className="fill-amber-500 opacity-60">
            <circle cx="40" cy="150" r="3" />
            <circle cx="140" cy="150" r="3.5" />
            <circle cx="220" cy="80" r="3" />
            <circle cx="340" cy="80" r="3.5" />
            <circle cx="420" cy="150" r="4" />
            <circle cx="540" cy="150" r="3.5" />
            <circle cx="620" cy="220" r="3" />
            <circle cx="740" cy="220" r="3" />
            <circle cx="220" cy="220" r="3" />
            <circle cx="340" cy="220" r="3.5" />
            <circle cx="620" cy="80" r="3" />
            <circle cx="740" cy="80" r="3" />
          </g>

          {/* Plasticity Action Potential Traveling Pulses */}
          <circle r="3" fill="#F59E0B" className="neural-particle" opacity="0.9">
            <animateMotion dur="5.0s" repeatCount="indefinite" path="M 40 150 L 140 150 L 220 80 L 340 80 L 420 150 L 540 150 L 620 220 L 740 220" />
          </circle>
          <circle r="3" fill="#F97316" className="neural-particle" opacity="0.9">
            <animateMotion dur="5.5s" begin="2.2s" repeatCount="indefinite" path="M 140 150 L 220 220 L 340 220 L 420 150 L 540 150 L 620 80 L 740 80" />
          </circle>
        </svg>
      )}

      {/* 4. Theme: COGNITIVE RADAR (Hexagonal telemetry & assessment cortex) */}
      {theme === 'cognitive-radar' && (
        <svg 
          className="w-full h-full object-cover opacity-45 dark:opacity-60"
          viewBox="0 0 600 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="stroke-teal-500/30 dark:stroke-teal-400/25" strokeWidth="0.8" strokeDasharray="2 4">
            <polygon points="300,50 480,130 480,270 300,350 120,270 120,130" />
            <polygon points="300,90 420,145 420,255 300,310 180,255 180,145" />
            <line x1="300" y1="50" x2="300" y2="350" />
            <line x1="120" y1="130" x2="480" y2="270" />
            <line x1="120" y1="270" x2="480" y2="130" />
          </g>

          <g className="fill-teal-500 opacity-60">
            <circle cx="300" cy="50" r="3.5" />
            <circle cx="480" cy="130" r="3.5" />
            <circle cx="480" cy="270" r="3.5" />
            <circle cx="300" cy="350" r="3.5" />
            <circle cx="120" cy="270" r="3.5" />
            <circle cx="120" cy="130" r="3.5" />
            <circle cx="300" cy="200" r="4" />
          </g>

          {/* Traveling Radar Pulse */}
          <circle r="3" fill="#14B8A6" className="neural-particle">
            <animateMotion 
              dur="6.5s" 
              repeatCount="indefinite" 
              path="M 300 50 L 480 130 L 480 270 L 300 350 L 120 270 L 120 130 Z" 
            />
          </circle>
        </svg>
      )}

      {/* 5. Theme: EDUCATIONAL SYNAPSES (Flowing step paths for WhyTrainMyBrain) */}
      {theme === 'educational-synapses' && (
        <svg 
          className="w-full h-full object-cover opacity-50 dark:opacity-70"
          viewBox="0 0 1000 500" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="stroke-slate-300/50 dark:stroke-slate-700/50" strokeWidth="0.8" strokeDasharray="3 5">
            <path d="M 50 100 L 220 100 L 380 220 L 600 220 L 780 120 L 950 120" />
            <path d="M 50 400 L 220 400 L 380 280 L 600 280 L 780 380 L 950 380" />
            <line x1="380" y1="220" x2="380" y2="280" />
            <line x1="600" y1="220" x2="600" y2="280" />
          </g>

          <g className="fill-teal-500 opacity-60">
            <circle cx="50" cy="100" r="3" />
            <circle cx="220" cy="100" r="3.5" />
            <circle cx="380" cy="220" r="4" />
            <circle cx="600" cy="220" r="4" />
            <circle cx="780" cy="120" r="3.5" />
            <circle cx="950" cy="120" r="3" />
            <circle cx="50" cy="400" r="3" />
            <circle cx="220" cy="400" r="3.5" />
            <circle cx="380" cy="280" r="4" />
            <circle cx="600" cy="280" r="4" />
            <circle cx="780" cy="380" r="3.5" />
            <circle cx="950" cy="380" r="3" />
          </g>

          {/* Educational Signal Pulses */}
          <circle r="3" fill="#0EA5E9" className="neural-particle">
            <animateMotion dur="5.8s" repeatCount="indefinite" path="M 50 100 L 220 100 L 380 220 L 600 220 L 780 120 L 950 120" />
          </circle>
          <circle r="3" fill="#10B981" className="neural-particle">
            <animateMotion dur="6.2s" begin="1.5s" repeatCount="indefinite" path="M 50 400 L 220 400 L 380 280 L 600 280 L 780 380 L 950 380" />
          </circle>
        </svg>
      )}

      {/* 6. Theme: ANALYTICS CORTEX (Deep telemetry grid for ProgressDashboard) */}
      {theme === 'analytics-cortex' && (
        <svg 
          className="w-full h-full object-cover opacity-45 dark:opacity-60"
          viewBox="0 0 1000 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="stroke-indigo-500/25 dark:stroke-indigo-400/20" strokeWidth="0.8" strokeDasharray="3 6">
            <line x1="100" y1="100" x2="900" y2="100" />
            <line x1="100" y1="250" x2="900" y2="250" />
            <line x1="100" y1="400" x2="900" y2="400" />
            <line x1="100" y1="550" x2="900" y2="550" />

            <line x1="200" y1="50" x2="200" y2="550" />
            <line x1="400" y1="50" x2="400" y2="550" />
            <line x1="600" y1="50" x2="600" y2="550" />
            <line x1="800" y1="50" x2="800" y2="550" />
          </g>

          <g className="fill-indigo-500 opacity-50">
            <circle cx="200" cy="100" r="3" />
            <circle cx="400" cy="100" r="3" />
            <circle cx="600" cy="100" r="3" />
            <circle cx="800" cy="100" r="3" />
            <circle cx="200" cy="250" r="3" />
            <circle cx="400" cy="250" r="3.5" />
            <circle cx="600" cy="250" r="3.5" />
            <circle cx="800" cy="250" r="3" />
            <circle cx="200" cy="400" r="3" />
            <circle cx="400" cy="400" r="3" />
            <circle cx="600" cy="400" r="3" />
            <circle cx="800" cy="400" r="3" />
          </g>

          <circle r="3" fill="#8B5CF6" className="neural-particle">
            <animateMotion dur="7s" repeatCount="indefinite" path="M 100 250 L 400 250 L 600 400 L 900 400" />
          </circle>
        </svg>
      )}
    </div>
  );
};
