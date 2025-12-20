
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  activeTab: string;
  onUploadClick: () => void;
  currentUser: User;
  onLogout: () => void;
  onInboxClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onUploadClick, currentUser, onLogout, onInboxClick }) => {
  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Staff Dashboard';
      case 'curriculum': return 'Curriculum Standards';
      case 'years-7-9': return 'Years 7 - 9';
      case 'igcse': return 'IGCSE';
      case 'ib': return 'IB / A-Level';
      case 'pd': return 'Professional Learning Hub';
      case 'admin': return 'Administrator Hub';
      default: return 'YCYW Humanities';
    }
  };

  const unreadCount = currentUser.notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between z-40">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 capitalize">{getTitle()}</h1>
        <p className="text-sm text-slate-500 hidden sm:block">Hello, {currentUser.name}. Humanities Department Standards & Compliance.</p>
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
          <span className="hidden sm:inline font-medium">New Resource</span>
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
