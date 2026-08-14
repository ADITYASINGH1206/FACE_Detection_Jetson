import React, { useEffect, useState } from 'react';
import { Menu, Bell, Search, Sun, Moon } from 'lucide-react';

interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-20 bg-white dark:bg-zinc-950 z-40 flex items-center justify-between px-8 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="flex items-center gap-4">
        <Menu size={24} className="text-zinc-900 dark:text-zinc-100 cursor-pointer hover:opacity-80" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{title || 'Warden OS'}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Live Sync</span>
        </div>
        
        {/* Dark Mode Switcher */}
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-[0.98] flex items-center justify-center"
          title="Toggle Dark Mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-[0.98]">
          <Bell size={18} />
        </button>
        <button className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-[0.98]">
          <Search size={18} />
        </button>
      </div>
    </header>
  );
};
