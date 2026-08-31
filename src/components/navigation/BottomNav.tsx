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
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#0B0F17]/95 border-t border-slate-200/80 dark:border-slate-800 backdrop-blur-md px-3 py-1.5 transition-colors select-none">
      <div className="grid grid-cols-4 gap-1">
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
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
