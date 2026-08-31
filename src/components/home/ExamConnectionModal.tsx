import React from 'react';
import { X, Sparkles, Brain, Eye, Calculator, Target, Layers, ShieldCheck } from 'lucide-react';
import { soundManager } from '../../lib/sound';

interface ExamConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamConnectionModal: React.FC<ExamConnectionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const mappings = [
    {
      game: 'Sudoku Reflex',
      skill: 'Constraint Reasoning & Candidate Elimination',
      icon: Brain,
      color: 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
      examTopic: 'Floor Puzzles, Seating Arrangements & Box Puzzles',
      why: 'Trains you to spot what CANNOT go into a position, preventing wasted branching during exam reasoning puzzles.'
    },
    {
      game: 'Puzzles',
      skill: 'Language-to-Mental Structure Conversion',
      icon: Layers,
      color: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40',
      examTopic: 'Complex Multi-Parameter Blood Relations & Tabulation',
      why: 'Quickly translates verbal constraints (e.g. "2nd to the left of X who owns Y") into structured mental coordinates.'
    },
    {
      game: 'Speed Search',
      skill: 'Peripheral Visual Scanning & Attention',
      icon: Eye,
      color: 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40',
      examTopic: 'Data Interpretation (DI) Tables, Bar Charts & Number Series',
      why: 'Expands your field of visual search so you can locate relevant numbers across large tabular data in milliseconds.'
    },
    {
      game: 'Pro Calculations',
      skill: 'Rapid Mental Arithmetic & Working Memory Buffer',
      icon: Calculator,
      color: 'text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
      examTopic: 'Simplification, Approximation & Quick Mental Totals',
      why: 'Eliminates the friction of reaching for rough paper for basic arithmetic intermediate sums.'
    },
    {
      game: 'Colour Focus',
      skill: 'Selective Attention & Inhibitory Control',
      icon: Target,
      color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
      examTopic: 'Speed-Accuracy Tradeoffs, Error Traps & Mental Switching',
      why: 'Trains inhibitory control to prevent hasty incorrect answers when exam questions present subtle distractor options.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Cognitive & Competitive Exam Blueprint
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Why These 5 Brain Games?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-0.5 mb-5 font-normal">
          TrainMyBrain targets the core cognitive processing reflexes that drive speed in quantitative, logical, and verbal problem solving.
        </p>

        {/* Mappings */}
        <div className="space-y-3 mb-5">
          {mappings.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.game}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex flex-col sm:flex-row items-start gap-3.5"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${m.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.game}</h4>
                    <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">{m.examTopic}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">{m.skill}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-normal">{m.why}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Responsible Scientific Note */}
        <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-800 dark:text-slate-200 font-semibold">Responsible Design:</strong> This platform measures and trains specific cognitive reflexes. Performance gains inside games represent strengthened processing speed and working memory habits.
          </p>
        </div>

      </div>
    </div>
  );
};
