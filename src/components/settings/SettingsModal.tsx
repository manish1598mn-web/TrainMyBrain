import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settings-store';
import { useProgressStore } from '../../store/progress-store';
import { soundManager } from '../../lib/sound';
import { X, Volume2, VolumeX, Moon, Sun, ShieldAlert, Check, Smartphone, Play } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBackupSync?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenBackupSync
}) => {
  const { 
    soundEnabled, 
    soundPack, 
    setSoundPack, 
    toggleSound, 
    theme, 
    toggleTheme, 
    reducedMotion, 
    toggleReducedMotion 
  } = useSettingsStore();
  const { resetAllProgress } = useProgressStore();

  const [confirmReset, setConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePerformReset = () => {
    soundManager.playTap();
    resetAllProgress();
    setConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      onClose();
    }, 1200);
  };

  const soundPacks = [
    { id: 'zen', name: 'Zen Chimes', desc: 'Harmonic bells with soft decay', badge: '🔔' },
    { id: 'tech', name: 'Subtle Tech', desc: 'High-precision micro clicks', badge: '⚡' },
    { id: 'retro', name: 'Retro Arcade', desc: '8-bit playful arpeggios', badge: '🎮' },
    { id: 'mute', name: 'Mute Effects', desc: 'Silent focused training', badge: '🔇' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in select-none">
      <div className="glass-panel-elevated relative w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/80 dark:border-slate-800">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Settings
        </h3>
        <p className="text-xs text-slate-400 mb-5 font-normal">
          Customize audio, appearance, and data preferences.
        </p>

        <div className="space-y-3.5">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-800 dark:text-slate-200">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>Sound Effects</span>
            </div>
            <button
              onClick={() => {
                toggleSound();
                soundManager.playTap();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                soundEnabled ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Soundscape Pack Selector */}
          {soundEnabled && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 animate-in fade-in">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Soundscape Theme
                </span>
                <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold uppercase">
                  Procedural Audio
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {soundPacks.map((pack) => {
                  const isSelected = soundPack === pack.id;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => {
                        soundManager.playTap();
                        setSoundPack(pack.id as any);
                      }}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white dark:bg-slate-800 border-teal-500 shadow-xs ring-1 ring-teal-500/50'
                          : 'bg-white/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-700/40 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <span>{pack.badge}</span>
                          <span>{pack.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundManager.playSample(pack.id as any);
                          }}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-500 hover:text-white transition-colors"
                          title="Audition sound"
                        >
                          <span className="flex items-center gap-1"><Play className="w-2.5 h-2.5 fill-current" /> Test</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                        {pack.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Theme */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-800 dark:text-slate-200">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Appearance</span>
            </div>
            <button
              onClick={() => {
                toggleTheme();
                soundManager.playTap();
              }}
              className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold transition-all"
            >
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-800 dark:text-slate-200">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span>Reduced Motion</span>
            </div>
            <button
              onClick={() => {
                toggleReducedMotion();
                soundManager.playTap();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                reducedMotion ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Backup & Device Sync (Clean user data tool) */}
          {onOpenBackupSync && (
            <button
              onClick={() => {
                soundManager.playTap();
                onOpenBackupSync();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100/80 dark:hover:bg-teal-900/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <Smartphone className="w-4 h-4 text-teal-600" />
                <span>Backup & Device Sync</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase bg-teal-600/15 px-2 py-0.5 rounded-md">
                Transfer
              </span>
            </button>
          )}

        </div>

        {/* Reset Progress Section with Confirmation */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          {resetSuccess ? (
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center justify-center gap-2 animate-in zoom-in-95">
              <Check className="w-4 h-4" />
              <span>Progress Reset Successfully</span>
            </div>
          ) : confirmReset ? (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 animate-in fade-in">
              <div className="flex items-start gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-800 dark:text-rose-200 font-medium">
                  Are you sure? This will permanently delete all training records and scores.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePerformReset}
                  className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full text-center text-xs font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 py-1 transition-colors"
            >
              Reset All Progress
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
