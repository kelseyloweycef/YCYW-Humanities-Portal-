
import React, { useState, useEffect } from 'react';
import { Resource, YearGroup, ResourceType, Subject, ForumPost, User, UserRole } from '../types';
import ResourceGrid from './ResourceGrid';
import Forum from './Forum';

interface YearGroupViewProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
  mode: 'primary' | 'years' | 'igcse' | 'ib';
  forumPosts: ForumPost[];
  setForumPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  currentUser: User;
  onUserClick?: (name: string) => void;
  onContributePreset?: (presets: Partial<Resource>) => void;
  onToggleSubscription?: (subId: string) => void;
  globalSearchTerm?: string;
  initialSubTab?: string;
  isAdmin?: boolean;
}

const YearGroupView: React.FC<YearGroupViewProps> = ({ 
  resources, onResourceClick, mode, forumPosts, setForumPosts, currentUser, onContributePreset, onToggleSubscription, globalSearchTerm = '', initialSubTab 
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<string>('');
  const [view, setView] = useState<'resources' | 'discussion' | 'standards' | 'assessments'>('resources');

  useEffect(() => {
    let newSubTab = initialSubTab || (mode === 'primary' ? YearGroup.YEAR_1 : mode === 'years' ? YearGroup.YEAR_7 : Subject.HISTORY);
    setSelectedSubTab(newSubTab);
  }, [mode, initialSubTab]);

  const filtered = resources.filter(res => {
    const matchesContext = (mode === 'primary' || mode === 'years') ? res.yearGroup === selectedSubTab : res.subject === selectedSubTab;
    return matchesContext && (!globalSearchTerm || res.title.toLowerCase().includes(globalSearchTerm.toLowerCase()));
  });

  const isSubscribed = currentUser.subscriptions.includes(selectedSubTab);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
            <i className={`fa-solid ${mode === 'primary' || mode === 'years' ? 'fa-children' : 'fa-book-open'}`}></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">{selectedSubTab}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mode.toUpperCase()} Sub-Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${isSubscribed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex flex-col">
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isSubscribed ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isSubscribed ? 'Following Sub-Hub' : 'Follow this Area'}
              </span>
              <p className="text-[9px] text-slate-500 font-medium leading-none mt-1">Receive updates on your dashboard</p>
            </div>
            <button 
              onClick={() => onToggleSubscription?.(selectedSubTab)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isSubscribed ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:text-indigo-600'
              }`}
            >
              <i className={`fa-solid ${isSubscribed ? 'fa-bell' : 'fa-bell-slash'}`}></i>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setView('resources')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'resources' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Resources</button>
        <button onClick={() => setView('discussion')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'discussion' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Forum</button>
      </div>

      {view === 'resources' && <ResourceGrid resources={filtered} onResourceClick={onResourceClick} hideFilters={true} />}
      {view === 'discussion' && <Forum posts={forumPosts} setPosts={setForumPosts as any} currentUser={currentUser} contextSubject={mode === 'igcse' || mode === 'ib' ? (selectedSubTab as Subject) : undefined} contextYear={mode === 'primary' || mode === 'years' ? (selectedSubTab as YearGroup) : undefined} />}
    </div>
  );
};

export default YearGroupView;
