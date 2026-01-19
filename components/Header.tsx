
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  activeTab: string;
  onUploadClick: () => void;
  currentUser: User;
  onLogout: () => void;
  onInboxClick: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  appName: string;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onUploadClick, 
  currentUser, 
  onLogout, 
  onInboxClick,
  searchTerm,
  setSearchTerm,
  appName
}) => {
  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Staff Dashboard';
      case 'curriculum': return 'Assessment Hub';
      case 'primary': return 'Primary Years 1-6';
      case 'years-7-9': return 'Years 7 - 9';
      case 'igcse': return 'IGCSE';
      case 'ib': return 'IB / A-Level';
      case 'pd': return 'Professional Learning Hub';
      case 'admin': return 'Administrator Hub';
      default: return appName;
    }
  };

  const unreadCount = currentUser.notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between z-40">
      <div className="flex-1 max-w-xs hidden lg:block">
        <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">{getTitle()}</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{appName} Portal</p>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl mx-8 relative group">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
        <input 
          type="text" 
          placeholder="Search resources, topics, tags..." 
          className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl py-2.5 pl-11 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 opacity-40 pointer-events-none">
          <span className="text-[10px] font-black border border-slate-400 rounded px-1">⌘</span>
          <span className="text-[10px] font-black border border-slate-400 rounded px-1">K</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onInboxClick}
          className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors group"
          title="Your Inbox"
        >
          <i className="fa-regular fa-bell text-xl group-hover:scale-110 transition-transform"></i>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        <button 
          onClick={onUploadClick}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          <span className="hidden sm:inline font-black text-xs uppercase tracking-widest">New Resource</span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

        <button 
          onClick={onLogout}
          className="text-slate-400 hover:text-rose-500 p-2 transition-colors hidden md:block"
          title="Sign Out"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
