import React, { useEffect, useState } from 'react';
import { X, Keyboard, Zap, Grid3X3, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../lib/sound';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'global' | 'quiz' | 'sudoku' | 'boggle';
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // Live key press highlighter
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      setPressedKey(e.key.toUpperCase());
      const timer = setTimeout(() => setPressedKey(null), 500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts: ShortcutItem[] = [
    // Global Navigation
    { keys: ['?'], description: 'Toggle this Shortcuts Guide', category: 'global' },
    { keys: ['Esc'], description: 'Close any active modal or return to menu', category: 'global' },
    { keys: ['1', '2', '3', '4'], description: 'Switch tabs (Home, Games, Progress, Challenges)', category: 'global' },

    // Speed Drills & Multi-Choice Games (Anzan, Word Speed, Puzzles, Training)
    { keys: ['1', '2', '3', '4'], description: 'Select Multiple Choice options 1 to 4', category: 'quiz' },
    { keys: ['A', 'B', 'C', 'D'], description: 'Alternative option selectors', category: 'quiz' },
    { keys: ['Enter'], description: 'Confirm answer / Advance to next question', category: 'quiz' },
    { keys: ['Space'], description: 'Pause or resume session timer', category: 'quiz' },

    // Sudoku Reflex
    { keys: ['↑', '↓', '←', '→'], description: 'Navigate cursor across grid cells', category: 'sudoku' },
    { keys: ['1', '–', '9'], description: 'Place candidate number into selected cell', category: 'sudoku' },
    { keys: ['Backspace'], description: 'Erase number in selected cell', category: 'sudoku' },
    { keys: ['H'], description: 'Reveal progressive 3-tier hint', category: 'sudoku' },

    // Boggle Lexical Search
    { keys: ['A', '–', 'Z'], description: 'Type adjacent letters to construct words', category: 'boggle' },
    { keys: ['Enter'], description: 'Submit constructed word for Trie verification', category: 'boggle' },
    { keys: ['Backspace'], description: 'Undo last selected letter in path', category: 'boggle' },
    { keys: ['Space'], description: 'Clear current word buffer', category: 'boggle' }
  ];

  const categories = [
    { id: 'global', label: 'Global Navigation', icon: Navigation, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { id: 'quiz', label: 'Speed Drills & Multi-Choice', icon: Zap, color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'sudoku', label: 'Sudoku Reflex', icon: Grid3X3, color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'boggle', label: 'Boggle Lexical Search', icon: Sparkles, color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                Keyboard Shortcuts
              </h2>
              {pressedKey && (
                <span className="px-2 py-0.5 rounded-md bg-teal-500 text-slate-950 text-[10px] font-mono font-bold animate-pulse">
                  Key: {pressedKey}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Train faster with zero-latency hardware keyboard navigation.
            </p>
          </div>
        </div>

        {/* Shortcuts Categorized List */}
        <div className="space-y-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const catShortcuts = shortcuts.filter(s => s.category === cat.id);

            return (
              <div key={cat.id} className="space-y-2.5">
                {/* Category Header */}
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${cat.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {cat.label}
                  </h3>
                </div>

                {/* Shortcuts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {catShortcuts.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-3"
                    >
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {item.description}
                      </span>

                      {/* Keycap Badges */}
                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className={`px-2 py-1 rounded-lg text-xs font-mono font-bold shadow-xs transition-all ${
                              pressedKey === k.toUpperCase()
                                ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400 scale-105'
                                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold">?</kbd> anytime to open</span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold">Esc</kbd> to close</span>
        </div>

      </div>
    </div>
  );
};
