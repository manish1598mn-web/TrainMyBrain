import React from 'react';
import { Home, Grid3X3, TrendingUp, Trophy } from 'lucide-react';
import { soundManager } from '../../lib/sound';

interface BottomNavProps {
  currentTab: 'home' | 'games' | 'progress' | 'challenges';
  onSelectTab: (tab: 'home' | 'games' | 'progress' | 'challenges') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'games' as const, label: 'Games', icon: Grid3X3 },
    { id: 'progress' as const, label: 'Progress', icon: TrendingUp },
    { id: 'challenges' as const, label: 'Challenges', icon: Trophy }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-[#0B0F17] border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 transition-all select-none shadow-lg">
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playTap();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 font-bold border border-teal-200 dark:border-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${isActive ? 'stroke-[2.5] scale-110' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
