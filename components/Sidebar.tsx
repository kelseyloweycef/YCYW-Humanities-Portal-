
import React, { useState } from 'react';
import { NavItem, User, YearGroup, Subject } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin?: boolean;
  currentUser: User;
  schoolLogo: string | null;
  appName: string;
  onProfileClick: () => void;
  onSubTabSelect?: (id: string) => void;
  activeSubTab?: string;
}

interface NavGroup extends NavItem {
  children?: { id: string, label: string, value: string }[];
}

const IGCSE_SUBJECTS = [Subject.HISTORY, Subject.GEOGRAPHY, Subject.PSYCHOLOGY, Subject.SOCIOLOGY, Subject.ECONOMICS, Subject.BUSINESS, Subject.ENTERPRISE];
const IB_SUBJECTS = [Subject.HISTORY, Subject.GEOGRAPHY, Subject.PSYCHOLOGY, Subject.ECONOMICS, Subject.BUSINESS, Subject.PHILOSOPHY];

const NAV_GROUPS: NavGroup[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge' },
  { 
    id: 'primary', 
    label: 'Primary Years 1-6', 
    icon: 'fa-children',
    children: [
      { id: 'primary-y1', label: 'Year 1', value: YearGroup.YEAR_1 },
      { id: 'primary-y2', label: 'Year 2', value: YearGroup.YEAR_2 },
      { id: 'primary-y3', label: 'Year 3', value: YearGroup.YEAR_3 },
      { id: 'primary-y4', label: 'Year 4', value: YearGroup.YEAR_4 },
      { id: 'primary-y5', label: 'Year 5', value: YearGroup.YEAR_5 },
      { id: 'primary-y6', label: 'Year 6', value: YearGroup.YEAR_6 },
    ]
  },
  { 
    id: 'years-7-9', 
    label: 'Years 7 - 9', 
    icon: 'fa-seedling',
    children: [
      { id: 'years-y7', label: 'Year 7', value: YearGroup.YEAR_7 },
      { id: 'years-y8', label: 'Year 8', value: YearGroup.YEAR_8 },
      { id: 'years-y9', label: 'Year 9', value: YearGroup.YEAR_9 },
    ]
  },
  { 
    id: 'igcse', 
    label: 'IGCSE', 
    icon: 'fa-book-bookmark',
    children: IGCSE_SUBJECTS.map(s => ({ id: `igcse-${s}`, label: s, value: s }))
  },
  { 
    id: 'ib', 
    label: 'IB / A-Level', 
    icon: 'fa-graduation-cap',
    children: IB_SUBJECTS.map(s => ({ id: `ib-${s}`, label: s, value: s }))
  },
  { id: 'pd', label: 'Professional Learning', icon: 'fa-chalkboard-user' },
  { id: 'admin', label: 'Admin Hub', icon: 'fa-shield-halved', adminOnly: true },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  currentUser, 
  schoolLogo, 
  appName, 
  onProfileClick,
  onSubTabSelect,
  activeSubTab
}) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['primary', 'years-7-9', 'igcse', 'ib']);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleItemClick = (item: NavGroup) => {
    if (item.children) {
      toggleGroup(item.id);
    }
    setActiveTab(item.id);
  };

  return (
    <div className="w-20 md:w-64 bg-slate-900 text-white flex flex-col transition-all duration-300 z-50 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className={`flex items-center justify-center rounded-xl shadow-lg transition-all duration-500 shrink-0 ${schoolLogo ? 'bg-white w-12 h-12 p-1.5' : 'bg-indigo-500 text-white p-2 shadow-indigo-500/20'}`}>
          {schoolLogo ? (
            <img src={schoolLogo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
          ) : (
            <i className="fa-solid fa-graduation-cap text-xl"></i>
          )}
        </div>
        <span className="hidden md:block font-black text-lg tracking-tight overflow-hidden text-ellipsis whitespace-nowrap text-indigo-100">{appName}</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto no-scrollbar">
        {NAV_GROUPS.filter(item => !item.adminOnly || isAdmin).map((item) => {
          const isExpanded = expandedGroups.includes(item.id);
          const isActive = activeTab === item.id;

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all group ${
                  isActive && !item.children
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-lg w-6 text-center`}></i>
                <div className="hidden md:flex flex-1 items-center justify-between overflow-hidden">
                  <span className="font-bold text-sm tracking-wide truncate">{item.label}</span>
                  {item.children && (
                    <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
                  )}
                </div>
              </button>

              {item.children && isExpanded && (
                <div className="hidden md:block ml-10 space-y-1 pb-2 animate-in slide-in-from-top-2 duration-300">
                  {item.children.map((child) => {
                    const isChildActive = activeSubTab === child.value && isActive;
                    return (
                      <button
                        key={child.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          onSubTabSelect?.(child.value);
                        }}
                        className={`w-full text-left py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                          isChildActive 
                            ? 'text-indigo-400 bg-indigo-500/10' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <div className={`w-1 h-1 rounded-full ${isChildActive ? 'bg-indigo-400 scale-150' : 'bg-slate-700'}`}></div>
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
      </div>
    </div>
  );
};

export default Sidebar;
