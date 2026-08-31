import React, { useState } from 'react';
import { usePlayerStore } from '../../store/player-store';
import { useSettingsStore } from '../../store/settings-store';
import { soundManager } from '../../lib/sound';
import { Brain, Zap, Flame, User, Settings, Sun, Moon, Sparkles, Lock, Keyboard } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'games' | 'progress' | 'challenges';
  onSelectTab: (tab: 'home' | 'games' | 'progress' | 'challenges') => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenProfile,
  onOpenSettings,
  onOpenShortcuts
}) => {
  const { overallMindLevel, getTrainingTimeBreakdown } = usePlayerStore();
  const { theme, toggleTheme } = useSettingsStore();
  const { shortFormatted, formattedString } = getTrainingTimeBreakdown();
  const [showComingSoonToast, setShowComingSoonToast] = useState(false);

  const navLinks: { id: 'home' | 'games' | 'progress' | 'challenges'; label: string; isSoon?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'games', label: 'Games' },
    { id: 'progress', label: 'Progress' },
    { id: 'challenges', label: 'Challenges', isSoon: true }
  ];

  const handleTabClick = (tabId: 'home' | 'games' | 'progress' | 'challenges') => {
    soundManager.playTap();
    onSelectTab(tabId);
    if (tabId === 'challenges') {
      setShowComingSoonToast(true);
      setTimeout(() => setShowComingSoonToast(false), 3500);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-[#0B0F17]/95 backdrop-blur-md transition-colors select-none">
      
      {/* Animated Coming Soon Notification Toast */}
      {showComingSoonToast && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white border-2 border-amber-500 shadow-2xl backdrop-blur-md text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>⚡ Global Challenges & Tournaments — Coming Soon!</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] uppercase font-mono">
              In Development
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo & Wordmark */}
        <div 
          onClick={() => {
            soundManager.playTap();
            onSelectTab('home');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm transition-transform group-hover:scale-105">
            <Brain className="h-5 w-5" />
            <Zap className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-amber-400 fill-amber-400 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Train<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-400 dark:to-indigo-400">MyBrain</span>
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{item.label}</span>
                {item.isSoon && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Streak, Theme Toggle, Settings, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Training Time Streak Pill */}
          <div 
            title={`Training Streak: ${formattedString}`}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{shortFormatted || '0m'}</span>
          </div>

          {/* Mind Level Badge */}
          <div 
            title="Overall Mind Level"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold"
          >
            <span>Lvl {overallMindLevel}</span>
          </div>

          {/* 1-Click Dark/Light Theme Switcher */}
          <button
            onClick={() => {
              soundManager.playTap();
              toggleTheme();
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Keyboard Shortcuts Trigger */}
          {onOpenShortcuts && (
            <button
              onClick={() => {
                soundManager.playTap();
                onOpenShortcuts();
              }}
              title="Keyboard Shortcuts (?)"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:inline-flex items-center"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}

          {/* Settings Trigger */}
          <button
            onClick={() => {
              soundManager.playTap();
              onOpenSettings();
            }}
            title="Settings"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Profile Trigger */}
          <button
            onClick={() => {
              soundManager.playTap();
              onOpenProfile();
            }}
            title="Player Profile"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
