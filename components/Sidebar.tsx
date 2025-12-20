
import React from 'react';
import { NavItem, User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin?: boolean;
  currentUser: User;
  schoolLogo: string | null;
  onProfileClick: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge' },
  { id: 'curriculum', label: 'Curriculum Standards', icon: 'fa-list-check' },
  { id: 'years-7-9', label: 'Years 7 - 9', icon: 'fa-seedling' },
  { id: 'igcse', label: 'IGCSE', icon: 'fa-book-bookmark' },
  { id: 'ib', label: 'IB / A-Level', icon: 'fa-graduation-cap' },
  { id: 'pd', label: 'Professional Learning', icon: 'fa-chalkboard-user' },
  { id: 'admin', label: 'Admin Hub', icon: 'fa-shield-halved', adminOnly: true },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isAdmin, currentUser, schoolLogo, onProfileClick }) => {
  return (
    <div className="w-20 md:w-64 bg-slate-900 text-white flex flex-col transition-all duration-300 z-50 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className={`flex items-center justify-center rounded-xl shadow-lg transition-all duration-500 ${schoolLogo ? 'bg-white w-12 h-12 p-1.5' : 'bg-indigo-500 text-white p-2 shadow-indigo-500/20'}`}>
          {schoolLogo ? (
            <img src={schoolLogo} alt="School Logo" className="w-full h-full object-contain rounded-lg" />
          ) : (
            <i className="fa-solid fa-graduation-cap text-xl"></i>
          )}
        </div>
        <span className="hidden md:block font-black text-lg tracking-tight overflow-hidden text-ellipsis whitespace-nowrap text-indigo-100">YCYW Humanities</span>
      </div>

      <nav className="flex-1 px-3 space-y-1.5 mt-4 overflow-y-auto">
        {NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg w-6 text-center`}></i>
            <span className="hidden md:block font-bold text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={onProfileClick}
          className="w-full hidden md:flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 shadow-md bg-slate-600 flex items-center justify-center text-xs font-black overflow-hidden shrink-0">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name[0]
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate group-hover:text-indigo-300 transition-colors">{currentUser.name}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">
              My Profile
            </p>
          </div>
          <i className="fa-solid fa-chevron-right text-slate-600 text-[10px] group-hover:translate-x-1 transition-transform"></i>
        </button>
        <button 
          onClick={onProfileClick}
          className="md:hidden w-12 h-12 mx-auto bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-indigo-400 overflow-hidden"
        >
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
          ) : (
            <i className="fa-solid fa-user"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
