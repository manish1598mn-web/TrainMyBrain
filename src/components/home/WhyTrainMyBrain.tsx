import React, { useState } from 'react';
import { 
  Brain, Eye, Target, Layers, Sparkles, Zap, ShieldCheck, 
  Grid3X3, ArrowRight, CheckCircle2, TrendingUp, Lock, Award, Shuffle, Clock, ChevronRight
} from 'lucide-react';
import { soundManager } from '../../lib/sound';
import { NeuronActivityPulseBackground } from '../background/NeuronActivityPulseBackground';

export const WhyTrainMyBrain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'games' | 'features' | 'matrix'>('games');
  const [selectedGameId, setSelectedGameId] = useState<string>('anzan');

  const gamesData = [
    {
      id: 'anzan',
      name: 'Pro Calculations',
      badge: 'Flash Arithmetic',
      icon: Zap,
      accentGradient: 'from-amber-400 via-orange-500 to-amber-600',
      pillBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
      oneLiner: 'Calculate fast flashing numbers directly in your head — zero rough sheets needed.',
      flowSteps: [
        { label: 'Step 1', value: 'Flash 48', tag: 'Buffer Init' },
        { label: 'Step 2', value: '+ 19 ➔ 67', tag: 'Mental Add' },
        { label: 'Step 3', value: '- 14 ➔ 53', tag: 'Mental Sub' },
        { label: 'Output', value: 'Answer: 53', tag: 'Fast Input' }
      ],
      points: [
        { title: 'Core Feature', text: 'Multi-operator arithmetic (+, -, ×, ÷, %, √) with 1200ms to 250ms flash speeds.' },
        { title: 'Exam Impact', text: 'Cuts calculation time by 50%+ in Quant, Data Interpretation & speed tests.' },
        { title: 'Brain Faculty', text: 'Expands Frontal Lobe working memory buffer capacity and numerical agility.' }
      ]
    },
    {
      id: 'wordspeed',
      name: 'Word Speed',
      badge: 'Verbal Processing',
      icon: Eye,
      accentGradient: 'from-sky-400 via-blue-500 to-indigo-600',
      pillBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-300 dark:border-sky-700/60',
      oneLiner: 'Sub-second word recognition, tricky paronym differentiation & fast reading agility.',
      flowSteps: [
        { label: 'Trap', value: 'PRINCIPAL vs PRINCIPLE', tag: 'Head vs Rule' },
        { label: 'Root', value: 'CHRON = Time', tag: 'Chronology' },
        { label: 'Match', value: 'CANDID ➔ FRANK', tag: 'Synonym' },
        { label: 'Speed', value: '< 1.2s Decision', tag: 'Fast Verdict' }
      ],
      points: [
        { title: 'Core Feature', text: 'Synonyms, antonyms, roots, and easily confused paronyms scaling up to 35 options.' },
        { title: 'Exam Impact', text: 'Accelerates reading comprehension, cloze test solving, and verbal accuracy.' },
        { title: 'Brain Faculty', text: 'Trains Language Cortex orthographic discrimination and verbal working memory.' }
      ]
    },
    {
      id: 'boggle',
      name: 'Boggle',
      badge: 'Lexical Search',
      icon: Sparkles,
      accentGradient: 'from-rose-400 via-pink-500 to-rose-600',
      pillBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-700/60',
      oneLiner: '8-way dynamic grid letter pathing powered by instant dictionary Trie verification.',
      flowSteps: [
        { label: 'Grid', value: '4x4 to 25x25 Dice', tag: 'Vowel Balanced' },
        { label: 'Link', value: 'T ➔ E ➔ S ➔ T', tag: 'Adjacent Path' },
        { label: 'Check', value: 'Valid Dictionary Word', tag: 'Trie Verified' },
        { label: 'Timer', value: '10s Per Target Word', tag: 'Dynamic Time' }
      ],
      points: [
        { title: 'Core Feature', text: '4x4 to 25x25 dynamic grids with sub-millisecond Prefix Trie verification.' },
        { title: 'Exam Impact', text: 'Builds sharp peripheral scanning for data tables and rapid anagram recognition.' },
        { title: 'Brain Faculty', text: 'Engages Occipital-Temporal pathways for spatial search and executive focus.' }
      ]
    },
    {
      id: 'sudoku',
      name: 'Sudoku Reflex',
      badge: 'Constraint Logic',
      icon: Grid3X3,
      accentGradient: 'from-purple-400 via-indigo-500 to-purple-600',
      pillBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-300 dark:border-purple-700/60',
      oneLiner: 'Spot missing numbers & eliminate invalid choices with 14 pure logic techniques — 0% guessing.',
      flowSteps: [
        { label: 'Row', value: 'Candidates {3, 5, 8}', tag: 'Initial Range' },
        { label: 'Col Block', value: 'Col contains 5 & 8', tag: 'Elimination' },
        { label: 'Result', value: 'Naked Single = 3', tag: 'Pure Logic' },
        { label: 'Rule', value: '100% Zero Guessing', tag: 'Deterministic' }
      ],
      points: [
        { title: 'Core Feature', text: 'S1 to S14 deduction taxonomy (Naked Singles to X-Wing) with 3-tier progressive hints.' },
        { title: 'Exam Impact', text: 'Instantly identifies invalid options in seating, floor, and arrangement puzzles.' },
        { title: 'Brain Faculty', text: 'Sharpens Parietal Lobe constraint reasoning and candidate filtering.' }
      ]
    },
    {
      id: 'zebra',
      name: 'Puzzles',
      badge: 'Relational Logic',
      icon: Layers,
      accentGradient: 'from-emerald-400 via-teal-500 to-emerald-600',
      pillBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60',
      oneLiner: 'Transform tangled multi-variable clues into clean mental coordinate deduction maps.',
      flowSteps: [
        { label: 'Clue 1', value: 'B is North of A', tag: 'Vertical Axis' },
        { label: 'Clue 2', value: 'C is East of B', tag: 'Horizontal Axis' },
        { label: 'Map', value: 'C is North-East of A', tag: 'Coordinate Link' },
        { label: 'Solve', value: 'Full Matrix Resolved', tag: 'Puzzle Solved' }
      ],
      points: [
        { title: 'Core Feature', text: '8 categories (Linear, Circular, Floor, Box Stacking, Blood Relations) scaling up to 12+ entities.' },
        { title: 'Exam Impact', text: 'Direct mastery over complex seating arrangements and scheduling questions.' },
        { title: 'Brain Faculty', text: 'Strengthens Temporal Lobe relational mapping and multi-variable synthesis.' }
      ]
    },
    {
      id: 'training',
      name: 'Training Mode',
      badge: 'Fundamentals',
      icon: Target,
      accentGradient: 'from-amber-400 via-yellow-500 to-orange-500',
      pillBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
      oneLiner: 'Ultra-gentle 10-level stepping stone starting at ~1% difficulty to build speed & confidence.',
      flowSteps: [
        { label: 'Level T1', value: '1.00% of L1', tag: 'Ultra-Gentle Entry' },
        { label: 'Level T5', value: '7.72% of L1', tag: 'Gentle Step' },
        { label: 'Level T9', value: '59.52% of L1', tag: 'Gateway Sprint' },
        { label: 'Level T10', value: '100% = Main L1', tag: '🎓 Graduation' }
      ],
      points: [
        { title: 'Core Feature', text: 'Exact 0.60x formula (T(N-1) = T(N) * 0.60) with 15–20 mixed adaptive problems per session.' },
        { title: 'Beginner Impact', text: 'Zero-pressure skill builder for beginners before tackling standard Level 1.' },
        { title: 'Zero Repetition', text: 'Protected by Question History engine so every practice session is fresh.' }
      ]
    }
  ];

  const platformEngines = [
    {
      icon: TrendingUp,
      title: '1.5× Progressive Scaling',
      desc: 'Difficulty scales across cognitive load and variables — never artificially by just cutting time.',
      accent: 'from-amber-500 to-orange-500'
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Repetition Invariant',
      desc: 'Multi-layer fingerprinting ensures you will never receive the same or near-duplicate question on replay.',
      accent: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Clock,
      title: 'Time-Spent Focus Streak',
      desc: 'Streaks track real active mind time (hours & minutes), problems solved, and levels conquered.',
      accent: 'from-sky-500 to-blue-500'
    },
    {
      icon: Lock,
      title: '100% Local-First Privacy',
      desc: 'Zero signup, no accounts, and no tracking. Everything is saved locally on your device.',
      accent: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Shuffle,
      title: 'Mind Mix Rapid Shifts',
      desc: 'Rotates across all 5 faculties in quick succession to train sectional agility and mental endurance.',
      accent: 'from-rose-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Cognitive Calibration',
      desc: 'Every game maps to specific anatomical lobes for targeted, measurable brain training.',
      accent: 'from-teal-500 to-cyan-500'
    }
  ];

  const activeGame = gamesData.find(g => g.id === selectedGameId) || gamesData[0];
  const ActiveIcon = activeGame.icon;

  return (
    <section className="my-14 select-none animate-in fade-in duration-300 font-sans relative overflow-hidden py-4">
      
      {/* Brain Activity Pulse = Neuron System Background (Educational Synapses) */}
      <NeuronActivityPulseBackground theme="educational-synapses" />

      {/* 1. Header Section */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold mb-3 shadow-xs">
          <Brain className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>COGNITIVE TRAINING ARCHITECTURE</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Why{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500">
            TrainMyBrain?
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 font-medium max-w-xl mx-auto leading-relaxed">
          Master the core cognitive reflexes behind rapid problem solving — speed, working memory, constraint logic, and visual search.
        </p>

        {/* View Selector Tabs */}
        <div className="flex items-center justify-center gap-1.5 mt-6 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 max-w-md mx-auto shadow-inner">
          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('games');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-mono font-black transition-all ${
              activeTab === 'games'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            5 Games & Training
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('features');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-mono font-black transition-all ${
              activeTab === 'features'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Platform Engines
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setActiveTab('matrix');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-mono font-black transition-all ${
              activeTab === 'matrix'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Exam & Skill Matrix
          </button>
        </div>
      </div>

      {/* 2. Interactive Games Tab */}
      {activeTab === 'games' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          
          {/* Game Selector Chips */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {gamesData.map((g) => {
              const isSelected = g.id === selectedGameId;
              const Icon = g.icon;

              return (
                <button
                  key={g.id}
                  onClick={() => {
                    soundManager.playTap();
                    setSelectedGameId(g.id);
                  }}
                  className={`px-3.5 py-2 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md scale-102'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{g.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Game Card with Visual Flow Diagram */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-md">
            
            {/* Header with Icon & Punchy One-Liner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeGame.accentGradient} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                      {activeGame.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${activeGame.pillBg}`}>
                      {activeGame.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                    {activeGame.oneLiner}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Step-by-Step Flow Diagram */}
            <div className="my-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-2.5">
                VISUAL SOLVING FLOW & MECHANISM
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeGame.flowSteps.map((st, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        {st.label}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {st.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono truncate">
                      {st.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Punchy Bullet Cards: Feature | Exam Impact | Brain Faculty */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {activeGame.points.map((pt, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    {pt.title}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {pt.text}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* 3. Platform Engines Tab */}
      {activeTab === 'features' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {platformEngines.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div>
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${feat.accent} text-white flex items-center justify-center mb-3.5 shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Exam & Skill Matrix Tab */}
      {activeTab === 'matrix' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-x-auto max-w-5xl mx-auto">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
              Cognitive Faculty & Exam Transfer Matrix
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Direct mapping between each brain game and competitive examination sections.
            </p>
          </div>

          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="pb-3 pr-4 font-bold">Game</th>
                <th className="pb-3 px-4 font-bold">Cognitive Faculty</th>
                <th className="pb-3 px-4 font-bold">Exam Section</th>
                <th className="pb-3 pl-4 font-bold">Key Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Pro Calculations
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">Working Memory Flash Buffer</td>
                <td className="py-3.5 px-4 text-teal-600 dark:text-teal-400 font-bold font-mono">Quantitative Aptitude</td>
                <td className="py-3.5 pl-4 text-slate-500 dark:text-slate-400">Fast mental arithmetic & approximations</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <Eye className="w-4 h-4 text-sky-500" /> Word Speed
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">Language Cortex Discrimination</td>
                <td className="py-3.5 px-4 text-sky-600 dark:text-sky-400 font-bold font-mono">English & Verbal Ability</td>
                <td className="py-3.5 pl-4 text-slate-500 dark:text-slate-400">Reading speed, cloze tests & paronym traps</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" /> Boggle
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">Visual Search & Spatial Scanning</td>
                <td className="py-3.5 px-4 text-rose-600 dark:text-rose-400 font-bold font-mono">Visual Search & Speed</td>
                <td className="py-3.5 pl-4 text-slate-500 dark:text-slate-400">Rapid spatial pattern & anagram discovery</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-purple-500" /> Sudoku Reflex
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">Parietal Constraint Deduction</td>
                <td className="py-3.5 px-4 text-purple-600 dark:text-purple-400 font-bold font-mono">Logical Reasoning</td>
                <td className="py-3.5 pl-4 text-slate-500 dark:text-slate-400">Instant elimination of invalid branch options</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" /> Puzzles
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">Relational Coordinate Mapping</td>
                <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">Analytical Puzzles</td>
                <td className="py-3.5 pl-4 text-slate-500 dark:text-slate-400">Seating arrangements, floors & scheduling</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-500" /> Training Mode
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">Gentle Multi-Faculty Foundation</td>
                <td className="py-3.5 px-4 text-amber-600 dark:text-amber-400 font-bold font-mono">All Competitive Exams</td>
                <td className="py-3.5 pl-4 text-slate-500 dark:text-slate-400">10-level gentle step ramp to build speed</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </section>
  );
};
