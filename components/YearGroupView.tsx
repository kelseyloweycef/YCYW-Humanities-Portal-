
import React, { useState, useEffect } from 'react';
import { Resource, YearGroup, ResourceType, Subject, ForumPost, User } from '../types';
import ResourceGrid from './ResourceGrid';
import Forum from './Forum';

interface YearGroupViewProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
  mode: 'years' | 'igcse' | 'ib';
  forumPosts: ForumPost[];
  setForumPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  currentUser: User;
  onToggleSubscription?: (subject: string) => void;
  onUserClick?: (name: string) => void;
}

const IGCSE_SUBJECTS = [Subject.HISTORY, Subject.GEOGRAPHY, Subject.PSYCHOLOGY, Subject.SOCIOLOGY, Subject.ECONOMICS, Subject.BUSINESS, Subject.ENTERPRISE];
const IB_SUBJECTS = [Subject.HISTORY, Subject.GEOGRAPHY, Subject.PSYCHOLOGY, Subject.ECONOMICS, Subject.BUSINESS, Subject.PHILOSOPHY];
const MODERATION_SUBJECTS = [Subject.HISTORY, Subject.GEOGRAPHY, Subject.ENTERPRISE];
const SENIOR_CURRICULUM_SUBJECTS = [Subject.HISTORY, Subject.ECONOMICS, Subject.BUSINESS, Subject.GEOGRAPHY, Subject.PSYCHOLOGY];

const YearGroupView: React.FC<YearGroupViewProps> = ({ 
  resources, onResourceClick, mode, forumPosts, setForumPosts, currentUser, onToggleSubscription, onUserClick
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<string>('');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('IB');
  const [view, setView] = useState<'resources' | 'discussion' | 'moderation' | 'ia'>('resources');

  useEffect(() => {
    if (mode === 'years') setSelectedSubTab(YearGroup.YEAR_7);
    else if (mode === 'igcse') setSelectedSubTab(Subject.HISTORY);
    else if (mode === 'ib') {
      setSelectedSubTab(Subject.HISTORY);
      setSelectedCurriculum('IB');
    }
    setView('resources');
  }, [mode]);

  useEffect(() => {
    if (view === 'ia' && selectedCurriculum !== 'IB') setView('resources');
  }, [selectedCurriculum, view]);

  const showModerationTab = mode === 'igcse' && MODERATION_SUBJECTS.includes(selectedSubTab as Subject);
  const showIATab = mode === 'ib' && selectedCurriculum === 'IB';
  const showCurriculumSwitcher = mode === 'ib' && SENIOR_CURRICULUM_SUBJECTS.includes(selectedSubTab as Subject);

  const filtered = resources.filter(res => {
    if (mode === 'years') return res.yearGroup === selectedSubTab;
    if (mode === 'igcse') return res.subject === selectedSubTab;
    if (mode === 'ib') {
      const isSubMatch = res.subject === selectedSubTab;
      return isSubMatch && (res.curriculum === selectedCurriculum || !res.curriculum);
    }
    return false;
  });

  const renderSectionHeader = (title: string, icon: string, count: number) => (
    <div className="flex items-center gap-3 mb-6 mt-10 border-b border-slate-200 pb-4 first:mt-0">
      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><i className={`fa-solid ${icon}`}></i></div>
      <div>
        <h3 className="text-xl font-black text-slate-800">{title}</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{count} Items</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/50 rounded-2xl">
          {(mode === 'years' ? [YearGroup.YEAR_7, YearGroup.YEAR_8, YearGroup.YEAR_9] : mode === 'igcse' ? IGCSE_SUBJECTS : IB_SUBJECTS).map(opt => (
            <button key={opt} onClick={() => setSelectedSubTab(opt)} className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all ${selectedSubTab === opt ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{opt}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setView('resources')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase ${view === 'resources' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Resources</button>
        <button onClick={() => setView('discussion')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase ${view === 'discussion' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Forum</button>
        {showIATab && <button onClick={() => setView('ia')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase ${view === 'ia' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>IA Moderation</button>}
        {showModerationTab && <button onClick={() => setView('moderation')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase ${view === 'moderation' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>Moderation</button>}
      </div>

      {showCurriculumSwitcher && (
        <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
          {['IB', 'A-Level', 'DSE'].map(c => (
            <button key={c} onClick={() => setSelectedCurriculum(c)} className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase ${selectedCurriculum === c ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{c}</button>
          ))}
        </div>
      )}

      {view === 'resources' ? (
        <div className="space-y-12">
          <section>
            {renderSectionHeader("Lesson Materials", "fa-book-open", filtered.length)}
            <ResourceGrid resources={filtered} onResourceClick={onResourceClick} hideFilters={true} />
          </section>
        </div>
      ) : view === 'ia' || view === 'moderation' ? (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h2 className="text-3xl font-black mb-4">{view === 'ia' ? 'IA Samples & Moderation' : 'IGCSE Coursework Moderation'}</h2>
          <p className="text-slate-500 mb-8">Share samples and provide criteria-based feedback to maintain department standards.</p>
          <ResourceGrid resources={filtered.filter(r => r.type === ResourceType.INTERNAL_ASSESSMENT || r.type === ResourceType.COURSEWORK)} onResourceClick={onResourceClick} hideFilters={true} />
        </div>
      ) : (
        <Forum posts={forumPosts} setPosts={setForumPosts} currentUser={currentUser} contextSubject={selectedSubTab as Subject} />
      )}
    </div>
  );
};

export default YearGroupView;
