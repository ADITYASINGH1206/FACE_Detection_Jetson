import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const Layout: React.FC = () => {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 pt-20 flex flex-col min-h-screen w-full relative">
        <Outlet />
      </div>
      
      {/* Floating Action Button (Global) */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};
