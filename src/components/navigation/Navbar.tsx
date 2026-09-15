import React, { useState, useEffect, useRef } from 'react';
import { useVocabularyStore } from '../../store/vocabulary-store';
import { usePlayerStore } from '../../store/player-store';
import { useSettingsStore } from '../../store/settings-store';
import { soundManager } from '../../lib/sound';
import { 
  Brain, Zap, Flame, User, Settings, Sun, Moon, 
  Sparkles, Keyboard, BookOpen, MoreVertical, X, ChevronRight 
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'games' | 'progress' | 'challenges';
  onSelectTab: (tab: 'home' | 'games' | 'progress' | 'challenges') => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts?: () => void;
  onOpenVocabulary?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenProfile,
  onOpenSettings,
  onOpenShortcuts,
  onOpenVocabulary
}) => {
  const vocabCount = useVocabularyStore(s => Object.keys(s.words).length);
  const { overallMindLevel, getTrainingTimeBreakdown } = usePlayerStore();
  const { theme, toggleTheme } = useSettingsStore();
  const { shortFormatted, formattedString } = getTrainingTimeBreakdown();
  const [showComingSoonToast, setShowComingSoonToast] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu on click outside or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMobileMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMobileMenu(false);
      }
    };
    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMobileMenu]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B0F17] transition-all select-none shadow-sm">
      
      {/* Synaptic subtle accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-500/30 to-indigo-500/30 dark:via-teal-400/25 dark:to-indigo-400/25" />

      {/* Animated Coming Soon Notification Toast */}
      {showComingSoonToast && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white border border-amber-500/50 shadow-2xl text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Global Challenges & Tournaments — Coming Soon!</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] uppercase font-mono tracking-wider">
              In Labs
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => {
            soundManager.playTap();
            onSelectTab('home');
          }}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md transition-all duration-300 group-hover:scale-105 group-active:scale-95">
            <Brain className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-hover:rotate-3" />
            <Zap className="absolute -bottom-1 -right-1 h-3 sm:h-3.5 w-3 sm:w-3.5 text-amber-400 fill-amber-400 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Train<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-400 dark:to-indigo-400">MyBrain</span>
            </span>
          </div>
        </div>

        {/* Desktop Nav Links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {navLinks.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 dark:bg-slate-800 dark:text-white shadow-sm scale-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
                }`}
              >
                <span>{item.label}</span>
                {item.isSoon && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Right Action Controls (visible on sm and larger) */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
          
          {/* Vocabulary Vault Word Bank Button */}
          {onOpenVocabulary && (
            <button
              onClick={() => {
                soundManager.playTap();
                onOpenVocabulary();
              }}
              title="Vocabulary Vault (Saved Words and Definitions)"
              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-300 dark:hover:border-rose-800 transition-all cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Vault</span>
              <span className="px-1.5 py-0.2 rounded-md bg-rose-200/80 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[10px] font-bold">
                {vocabCount}
              </span>
            </button>
          )}

          {/* Training Time Streak Pill */}
          <div 
            title={`Training Streak: ${formattedString}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold shadow-xs"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{shortFormatted || '0m'}</span>
          </div>

          {/* Mind Level Badge */}
          <div 
            title="Overall Cognitive Level"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 text-indigo-800 dark:text-indigo-300 text-xs font-mono font-bold shadow-xs"
          >
            <Zap className="w-3 h-3 text-indigo-500 fill-indigo-500" />
            <span>Lv.{overallMindLevel}</span>
          </div>

          {/* 1-Click Dark/Light Theme Switcher */}
          <button
            onClick={() => {
              soundManager.playTap();
              toggleTheme();
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="btn-tactile p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
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
              className="btn-tactile p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer hidden md:inline-flex items-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
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
            className="btn-tactile p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
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
            className="btn-tactile p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <User className="w-4 h-4" />
          </button>

        </div>

        {/* Mobile Header Controls: Compact Streak + 3-Dot More Menu */}
        <div className="flex sm:hidden items-center gap-2">
          
          {/* Compact Streak Pill */}
          <div 
            title={`Training Streak: ${formattedString}`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{shortFormatted || '0m'}</span>
          </div>

          {/* 3-Dot Menu Button on Mobile */}
          <button
            onClick={() => {
              soundManager.playTap();
              setShowMobileMenu(prev => !prev);
            }}
            aria-label="More Options Menu"
            aria-expanded={showMobileMenu}
            title="More Options"
            className="btn-tactile p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 text-slate-800 dark:text-slate-100" />
            ) : (
              <MoreVertical className="w-5 h-5 text-slate-800 dark:text-slate-100" />
            )}
          </button>

        </div>

      </div>

      {/* Floating 3-Dot Mobile Menu Drawer (Completely Solid & Opaque) */}
      {showMobileMenu && (
        <>
          {/* Backdrop Dimmer */}
          <div 
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 z-40 bg-black/40 sm:hidden animate-in fade-in duration-150"
          />

          {/* Dropdown Card - 100% Solid & Opaque Background */}
          <div 
            ref={menuRef}
            className="absolute top-16 right-3 z-50 w-72 rounded-2xl p-3 shadow-2xl bg-white dark:bg-[#111726] border-2 border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-150 select-none sm:hidden flex flex-col gap-1.5"
          >
            {/* 1. Mind Level Header Card */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 block">Cognitive Rank</span>
                  <span className="text-xs font-black font-mono text-indigo-800 dark:text-indigo-200">Level {overallMindLevel}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-200/80 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700">
                Active
              </span>
            </div>

            {/* 2. Vocabulary Vault Word Bank */}
            {onOpenVocabulary && (
              <button
                onClick={() => {
                  soundManager.playTap();
                  setShowMobileMenu(false);
                  onOpenVocabulary();
                }}
                className="btn-tactile w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>Vocabulary Vault</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-mono text-[10px] font-bold">
                  {vocabCount} Words
                </span>
              </button>
            )}

            {/* 3. Dark/Light Theme Switcher */}
            <button
              onClick={() => {
                soundManager.playTap();
                toggleTheme();
              }}
              className="btn-tactile w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
                <span>Theme Mode</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 capitalize">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            {/* 4. Player Profile */}
            <button
              onClick={() => {
                soundManager.playTap();
                setShowMobileMenu(false);
                onOpenProfile();
              }}
              className="btn-tactile w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <User className="w-4 h-4" />
                </div>
                <span>Player Profile</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 5. Settings */}
            <button
              onClick={() => {
                soundManager.playTap();
                setShowMobileMenu(false);
                onOpenSettings();
              }}
              className="btn-tactile w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center shadow-xs">
                  <Settings className="w-4 h-4" />
                </div>
                <span>Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 6. Keyboard Shortcuts (if available) */}
            {onOpenShortcuts && (
              <button
                onClick={() => {
                  soundManager.playTap();
                  setShowMobileMenu(false);
                  onOpenShortcuts();
                }}
                className="btn-tactile w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center shadow-xs">
                    <Keyboard className="w-4 h-4" />
                  </div>
                  <span>Shortcuts</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold">?</span>
              </button>
            )}

          </div>
        </>
      )}

    </header>
  );
};
