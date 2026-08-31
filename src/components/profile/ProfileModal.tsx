import React, { useState } from 'react';
import { usePlayerStore } from '../../store/player-store';
import { useProgressStore } from '../../store/progress-store';
import { useSettingsStore } from '../../store/settings-store';
import { soundManager } from '../../lib/sound';
import { X, User, Flame, Volume2, VolumeX, Moon, Sun, Download, Check } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { playerId, displayName, currentStreak, longestStreak, totalGamesPlayed, totalWorkoutsCompleted, overallMindLevel, setDisplayName } = usePlayerStore();
  const { games } = useProgressStore();
  const { soundEnabled, toggleSound, theme, toggleTheme } = useSettingsStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(displayName);

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (tempName.trim()) {
      setDisplayName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleExportData = () => {
    soundManager.playTap();
    const data = {
      playerId,
      displayName,
      overallMindLevel,
      currentStreak,
      longestStreak,
      totalGamesPlayed,
      totalWorkoutsCompleted,
      games,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trainmybrain-backup-${playerId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={() => {
            soundManager.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Avatar & Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-xl font-bold mb-2.5 shadow-sm">
            <User className="w-6 h-6" />
          </div>

          {isEditingName ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                maxLength={20}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
              <button
                onClick={handleSaveName}
                className="p-1 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <h3 
              onClick={() => setIsEditingName(true)}
              title="Click to rename"
              className="text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-teal-600 transition-colors"
            >
              {displayName}
            </h3>
          )}

          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-mono mt-1">
            <span>ID: {playerId}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Mind Level</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">{overallMindLevel}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Day Streak</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              {currentStreak}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Games</p>
            <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">{totalGamesPlayed}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center">
            <p className="text-[10px] font-semibold uppercase text-slate-400">Workouts</p>
            <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">{totalWorkoutsCompleted}</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-5 space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Preferences</p>
          
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-teal-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>Sound Feedback</span>
            </div>
            <button
              onClick={() => {
                toggleSound();
                soundManager.playTap();
              }}
              className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold transition-colors ${
                soundEnabled ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span>Appearance</span>
            </div>
            <button
              onClick={() => {
                toggleTheme();
                soundManager.playTap();
              }}
              className="px-2.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold"
            >
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>

        {/* Export Data */}
        <button
          onClick={handleExportData}
          className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs active:scale-98 transition-all flex items-center justify-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Local Profile (JSON)</span>
        </button>

      </div>
    </div>
  );
};
