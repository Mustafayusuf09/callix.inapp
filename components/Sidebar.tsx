import React, { useState } from 'react';
import {
  MessageSquare,
  LayoutDashboard,
  Calendar,
  User,
  Smile,
  PenTool,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'chat' as ViewState, label: 'AI Chat', icon: <MessageSquare size={18} /> },
    { id: 'dashboard' as ViewState, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'calendar' as ViewState, label: 'Calendar', icon: <Calendar size={18} /> },
    { id: 'analysis' as ViewState, label: 'Deal Analysis', icon: <User size={18} /> },
    { id: 'avatars' as ViewState, label: 'Avatars', icon: <Smile size={18} /> },
    { id: 'creatives' as ViewState, label: 'Generate Creatives', icon: <PenTool size={18} /> },
  ];

  return (
    <aside className={`h-full ${isCollapsed ? 'w-20' : 'w-64'} bg-white/10 dark:bg-zinc-900/40 backdrop-blur-2xl border-r border-white/20 dark:border-white/5 flex flex-col z-30 relative shadow-[1px_0_30px_0_rgba(31,38,135,0.05)] transition-all duration-300 ease-in-out`}>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-9 w-6 h-6 bg-white/80 dark:bg-zinc-800 border border-white dark:border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-orange-600 hover:scale-110 shadow-sm z-50 transition-all"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand */}
      <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} transition-all duration-300 overflow-hidden`}>
        {isCollapsed ? (
          <img
            src="/favicon.png"
            alt="CalliX"
            className="w-10 h-10 object-contain drop-shadow-md"
          />
        ) : (
          <img
            src="/logo.png"
            alt="CalliX"
            className="h-14 object-contain drop-shadow-sm"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        <div className={`px-4 mb-4 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Workspace</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 py-3 text-sm rounded-xl transition-all duration-300 group relative overflow-hidden ${isCollapsed ? 'justify-center px-2' : 'px-4'
              } ${currentView === item.id
                ? 'bg-gradient-to-r from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 shadow-lg border border-white/40 dark:border-white/10 text-orange-600 font-semibold backdrop-blur-sm'
                : 'text-zinc-600 dark:text-zinc-200 hover:bg-white/20 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white border border-transparent'
              }`}
            title={isCollapsed ? item.label : undefined}
          >
            <span className={`${currentView === item.id ? 'text-orange-600' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'} transition-colors flex-shrink-0 duration-300`}>
              {item.icon}
            </span>
            <span className={`relative z-10 whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              {item.label}
            </span>
            {currentView === item.id && (
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 bg-orange-500 rounded-r-full transition-all duration-300 shadow-[0_0_10px_rgba(255,79,24,0.5)] ${isCollapsed ? 'w-1 h-1.5 left-0.5' : 'w-1 h-8'}`}></div>
            )}
          </button>
        ))}
      </nav>

      {/* System Status / Bottom */}
      <div className={`p-4 ${isCollapsed ? 'px-2' : 'px-6'} transition-all duration-300`}>
        <button
          onClick={() => onChangeView('settings')}
          className={`w-full flex items-center gap-3 py-2 text-sm rounded-lg transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${currentView === 'settings' ? 'text-orange-600 bg-white dark:bg-zinc-800 shadow-sm font-semibold' : 'text-glass-subtext dark:text-zinc-300 hover:text-glass-text dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'}`}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings size={16} />
          <span className={`${isCollapsed ? 'hidden' : 'block'} whitespace-nowrap`}>Settings</span>
        </button>
        <button className={`w-full flex items-center gap-3 py-2 text-sm text-glass-subtext dark:text-zinc-300 hover:text-glass-text dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'}`} title={isCollapsed ? "Sign Out" : undefined}>
          <LogOut size={16} />
          <span className={`${isCollapsed ? 'hidden' : 'block'} whitespace-nowrap`}>Sign Out</span>
        </button>
      </div>

      {/* User Tiny Profile */}
      <div className={`py-4 flex items-center gap-3 bg-white/10 dark:bg-zinc-900/40 backdrop-blur-sm transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : 'px-6'}`}>
        <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-white dark:border-zinc-700 shadow-sm flex items-center justify-center text-xs font-bold text-glass-text dark:text-zinc-200 flex-shrink-0">
          LB
        </div>
        <div className={`flex-1 min-w-0 transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
          <div className="text-xs font-bold text-glass-text dark:text-zinc-200 truncate">L. Berger</div>
          <div className="text-[10px] text-glass-subtext dark:text-zinc-400 truncate">Administrator</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;