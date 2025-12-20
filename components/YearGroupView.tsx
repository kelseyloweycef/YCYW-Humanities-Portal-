
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
  onReplyToPost?: (postId: string, content: string) => void;
  currentUser: User;
  onToggleSubscription?: (subject: string) => void;
  onUserClick?: (name: string) => void;
}

const IGCSE_SUBJECTS = [
  Subject.HISTORY, Subject.GEOGRAPHY, Subject.PSYCHOLOGY, 
  Subject.SOCIOLOGY, Subject.ECONOMICS, Subject.BUSINESS, Subject.ENTERPRISE
];

const IB_SUBJECTS = [
  Subject.HISTORY, Subject.GEOGRAPHY, Subject.PSYCHOLOGY, 
  Subject.ECONOMICS, Subject.BUSINESS, Subject.PHILOSOPHY
];

const MODERATION_SUBJECTS = [Subject.HISTORY, Subject.GEOGRAPHY, Subject.ENTERPRISE];

const SENIOR_CURRICULUM_SUBJECTS = [
  Subject.HISTORY, Subject.ECONOMICS, Subject.BUSINESS, Subject.GEOGRAPHY, Subject.PSYCHOLOGY
];

const DSE_ELIGIBLE_SUBJECTS = [Subject.ECONOMICS, Subject.BUSINESS];

const YearGroupView: React.FC<YearGroupViewProps> = ({ 
  resources, 
  onResourceClick, 
  mode, 
  forumPosts, 
  setForumPosts, 
  onReplyToPost,
  currentUser,
  onToggleSubscription,
  onUserClick
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<string>('');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('IB');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Reset view to resources if the current curriculum doesn't support the active IA view
  useEffect(() => {
    if (view === 'ia' && selectedCurriculum !== 'IB') {
      setView('resources');
    }
  }, [selectedCurriculum, view]);

  const showModerationTab = mode === 'igcse' && MODERATION_SUBJECTS.includes(selectedSubTab as Subject);
  
  // Logic: IA moderation tab ONLY for IB selection, not A-Level
  const showIATab = mode === 'ib' && selectedCurriculum === 'IB';
  
  const showCurriculumSwitcher = mode === 'ib' && 
    SENIOR_CURRICULUM_SUBJECTS.includes(selectedSubTab as Subject);

  const isSubscribed = currentUser.subscriptions.includes(selectedSubTab);

  const getFilteredResources = () => {
    return resources.filter(res => {
      const searchMatch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!searchMatch) return false;

      if (mode === 'years') {
        return [YearGroup.YEAR_7, YearGroup.YEAR_8, YearGroup.YEAR_9].includes(res.yearGroup) && 
               res.yearGroup === selectedSubTab;
      }
      
      if (mode === 'igcse') {
        return [YearGroup.YEAR_10, YearGroup.YEAR_11].includes(res.yearGroup) && 
               res.subject === selectedSubTab;
      }

      if (mode === 'ib') {
        const isSubjectMatch = res.subject === selectedSubTab;
        const isYearMatch = [YearGroup.YEAR_12, YearGroup.YEAR_13].includes(res.yearGroup);
        
        if (isSubjectMatch && isYearMatch) {
          if (SENIOR_CURRICULUM_SUBJECTS.includes(selectedSubTab as Subject)) {
            return res.curriculum === selectedCurriculum || !res.curriculum;
          }
          return true;
        }
        return false;
      }

      return false;
    });
  };

  const filtered = getFilteredResources();

  const schemesOfWork = filtered.filter(r => r.type === ResourceType.SCHEME_OF_WORK);
  const assessmentsAndMarks = filtered.filter(r => r.type === ResourceType.ASSESSMENT || r.type === ResourceType.MARK_SCHEME);
  const generalResources = filtered.filter(r => 
    [ResourceType.LESSON_PLAN, ResourceType.PRESENTATION, ResourceType.WORKSHEET, ResourceType.EXAMPLE_WORK].includes(r.type)
  );
  const moderationResources = filtered.filter(r => 
    r.type === ResourceType.COURSEWORK || r.type === ResourceType.INTERNAL_ASSESSMENT
  );

  const renderSectionHeader = (title: string, icon: string, count: number) => (
    <div className="flex items-center gap-3 mb-6 mt-10 border-b border-slate-200 pb-4 first:mt-0">
      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-800">{title}</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{count} Items Available</p>
      </div>
    </div>
  );

  const getSubTabOptions = () => {
    if (mode === 'years') return [YearGroup.YEAR_7, YearGroup.YEAR_8, YearGroup.YEAR_9];
    if (mode === 'igcse') return IGCSE_SUBJECTS;
    if (mode === 'ib') return IB_SUBJECTS;
    return [];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="sticky top-[73px] bg-slate-50/95 backdrop-blur-md z-30 py-4 -mx-4 px-4 border-b border-slate-200">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/50 rounded-[1.8rem] w-full lg:w-auto">
              {getSubTabOptions().map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelectedSubTab(opt)}
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-[1.4rem] text-[11px] font-black transition-all whitespace-nowrap ${
                    selectedSubTab === opt 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:bg-white/40'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            
            <div className="relative flex-1 w-full">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder={`Search in ${selectedSubTab}...`} 
                className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-2">
                <button 
                  onClick={() => setView('resources')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'resources' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  Resources
                </button>
                <button 
                  onClick={() => setView('discussion')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'discussion' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  Discussion Board
                </button>
                {showIATab && (
                  <button 
                    onClick={() => setView('ia')}
                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'ia' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                  >
                    <i className="fa-solid fa-file-shield text-sm"></i>
                    Internal Assessments (IA)
                  </button>
                )}
                {showModerationTab && (
                  <button 
                    onClick={() => setView('moderation')}
                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'moderation' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                  >
                    <i className="fa-solid fa-scale-balanced text-sm"></i>
                    Coursework Moderation
                  </button>
                )}
              </div>
              
              <button 
                onClick={() => onToggleSubscription?.(selectedSubTab)}
                className={`ml-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border shadow-sm ${
                  isSubscribed 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                    : 'bg-white text-slate-400 border-slate-200 hover:text-indigo-500 hover:border-indigo-100'
                }`}
                title={isSubscribed ? "Unsubscribe from alerts" : "Get notified for new content"}
              >
                <i className={`fa-solid ${isSubscribed ? 'fa-bell' : 'fa-bell-slash'}`}></i>
                <span className="hidden sm:inline">Receive notifications for this subject</span>
              </button>
            </div>

            {showCurriculumSwitcher && (
              <div className="flex items-center gap-1.5 p-1 bg-slate-200/50 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setSelectedCurriculum('IB')}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedCurriculum === 'IB' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  IB
                </button>
                <button
                  onClick={() => setSelectedCurriculum('A-Level')}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedCurriculum === 'A-Level' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  A-Level
                </button>
                {DSE_ELIGIBLE_SUBJECTS.includes(selectedSubTab as Subject) && (
                  <button
                    onClick={() => setSelectedCurriculum('DSE')}
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedCurriculum === 'DSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    DSE
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {view === 'resources' ? (
        <div className="space-y-12">
          {showCurriculumSwitcher && (
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-3xl shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 text-xs">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <p className="text-sm font-bold text-slate-700">
                Viewing <span className="text-indigo-600">{selectedCurriculum}</span> Resources for {selectedSubTab}
              </p>
            </div>
          )}
          
          <section>
            {renderSectionHeader("Schemes of Work", "fa-sitemap", schemesOfWork.length)}
            {schemesOfWork.length > 0 ? (
              <ResourceGrid resources={schemesOfWork} onResourceClick={onResourceClick} hideFilters={true} />
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No {selectedCurriculum} Schemes of Work for {selectedSubTab}</p>
              </div>
            )}
          </section>

          <section>
            {renderSectionHeader("Lesson Resources", "fa-book-open", generalResources.length)}
            {generalResources.length > 0 ? (
              <ResourceGrid resources={generalResources} onResourceClick={onResourceClick} hideFilters={true} />
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No {selectedCurriculum} resources for {selectedSubTab}</p>
              </div>
            )}
          </section>

          <section>
            {renderSectionHeader("Assessments & Marking", "fa-vial-circle-check", assessmentsAndMarks.length)}
            {assessmentsAndMarks.length > 0 ? (
              <ResourceGrid resources={assessmentsAndMarks} onResourceClick={onResourceClick} hideFilters={true} />
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No {selectedCurriculum} assessments for {selectedSubTab}</p>
              </div>
            )}
          </section>
        </div>
      ) : view === 'ia' || view === 'moderation' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden ${view === 'ia' ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl font-black mb-4">{view === 'ia' ? 'IA Moderation & Feedback' : 'Coursework Standardisation'}</h2>
              <p className="text-lg opacity-90 leading-relaxed">
                {view === 'ia' 
                  ? 'A dedicated space for sharing and reviewing IB Internal Assessment samples. Peer feedback here helps maintain high standards across the department.' 
                  : 'Collaboratively moderate IGCSE coursework and ensure marking consistency through shared samples.'}
              </p>
            </div>
            <i className={`fa-solid ${view === 'ia' ? 'fa-file-shield' : 'fa-scale-balanced'} absolute -right-12 -bottom-12 text-[20rem] opacity-10 -rotate-12`}></i>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800">Samples for Peer Review</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                <i className="fa-solid fa-circle-info"></i>
                <span>Click a sample to leave feedback</span>
              </div>
            </div>

            {moderationResources.length > 0 ? (
              <ResourceGrid resources={moderationResources} onResourceClick={onResourceClick} hideFilters={true} />
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <i className="fa-solid fa-folder-open text-4xl text-slate-200 mb-4 block"></i>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No samples posted for {selectedSubTab} yet.</p>
                <p className="text-[10px] text-slate-300 mt-2">Upload your samples to start the moderation process.</p>
              </div>
            )}
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 text-2xl shrink-0">
              <i className="fa-solid fa-lightbulb"></i>
            </div>
            <div>
              <h4 className="font-black text-slate-800">Moderation Best Practice</h4>
              <p className="text-sm text-slate-600 mt-1">When providing feedback, please reference the specific examination board marking criteria. Keep comments constructive to support our fellow educators.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Forum 
            posts={forumPosts} 
            setPosts={setForumPosts} 
            onReplyToPost={onReplyToPost}
            currentUser={currentUser} 
            contextYear={mode === 'years' ? selectedSubTab as YearGroup : undefined}
            contextSubject={mode !== 'years' ? selectedSubTab as Subject : undefined}
            onUserClick={onUserClick}
          />
        </div>
      )}
    </div>
  );
};

export default YearGroupView;
