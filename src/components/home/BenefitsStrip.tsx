import React from 'react';
import { Flame, TrendingUp, Trophy, Target } from 'lucide-react';

export const BenefitsStrip: React.FC = () => {
  const benefits = [
    {
      icon: Flame,
      title: 'Day Streak',
      desc: 'Keep improving every day with short, consistent routines.',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30'
    },
    {
      icon: TrendingUp,
      title: 'Better Every Day',
      desc: 'Track sub-millisecond reaction speed and accuracy gains.',
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/30'
    },
    {
      icon: Trophy,
      title: 'Daily Challenge',
      desc: 'Compete against identical deterministic daily problem sets.',
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/30'
    },
    {
      icon: Target,
      title: 'Built for Exams',
      desc: 'Sharpen the cognitive reflexes behind Quant & Reasoning sections.',
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30'
    }
  ];

  return (
    <section className="my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.title}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm"
            >
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${b.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {b.title}
              </h4>
              <p className="text-xs font-normal text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                {b.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
