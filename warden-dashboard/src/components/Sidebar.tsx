import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/surveillance', label: 'Live Feed', icon: 'videocam' },
  { path: '/attendance', label: 'Attendance', icon: 'fingerprint' },
  { path: '/students', label: 'Enroll Students', icon: 'group' },
  { path: '/devices', label: 'Device Registry', icon: 'router' },
  { path: '/analytics', label: 'AI Analytics', icon: 'psychology' },
  { path: '/insights', label: 'System Health', icon: 'sensors' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col py-8 gap-4 z-50">
      <div className="px-8 mb-8">
        <img 
          alt="OneKByte Labs Logo" 
          className="h-10 w-auto object-contain dark:invert"
          src="/newlogoonekbyte.png"
        />
        <div className="mt-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
            <img 
              alt="Admin Avatar" 
              className="w-full h-full object-cover" 
              src="https://ui-avatars.com/api/?name=Admin+User&background=FFF5EE&color=FF8C42" 
            />
          </div>
          <div>
            <p className="font-medium tracking-wide text-xs text-zinc-900 dark:text-zinc-100">System Controller</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">V2.4 Active</p>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 active:scale-[0.98] ` +
              (isActive 
                ? `bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium shadow-sm` 
                : `text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800`)
            }
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
            <span className="font-medium text-sm tracking-wide">{item.label}</span>
          </NavLink>
        ))}

        <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <NavLink 
            to="/settings"
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 active:scale-[0.98] ` +
              (isActive 
                ? `bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium shadow-sm` 
                : `text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800`)
            }
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
            <span className="font-medium text-sm tracking-wide">Settings</span>
          </NavLink>
          <NavLink 
            to="/login"
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>logout</span>
            <span className="font-medium text-sm tracking-wide">Logout</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};
