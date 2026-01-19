
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

// Curriculum Data integrated from the old CurriculumView
const PILLAR_TEMPLATES = {
  pastPresent: { category: "Past & Present", icon: "fa-clock-rotate-left", color: "bg-amber-500" },
  evolvingWorld: { category: "Our Evolving World", icon: "fa-earth-americas", color: "bg-emerald-500" },
  globalCitizen: { category: "Responsible Global Citizen", icon: "fa-hands-holding-circle", color: "bg-indigo-500" },
  econBusiness: { category: "Economics & Business", icon: "fa-shop", color: "bg-rose-500" }
};

const YEARLY_CURRICULUM_DATA: Record<string, any> = {
  [YearGroup.YEAR_1]: {
    goals: ["Identify family members and explain roles.", "Recognize their place in the school community.", "Identify basic cardinal directions."],
    skills: ["Source identification", "Map reading & orientation", "Chronological sequencing"],
    commandTerms: ["Identify", "Label", "List"],
    domains: [
      { ...PILLAR_TEMPLATES.pastPresent, standards: [{ code: "PP.1.1", title: "My Family History", description: "Exploring personal and family backgrounds through artifacts." }] },
      { ...PILLAR_TEMPLATES.evolvingWorld, standards: [{ code: "EW.1.1", title: "Our Playground", description: "Mapping immediate surroundings and identifying physical features." }] },
      { ...PILLAR_TEMPLATES.globalCitizen, standards: [{ code: "RGC.1.1", title: "Being a Kind Peer", description: "Understanding basic rights and responsibilities in a classroom." }] },
      { ...PILLAR_TEMPLATES.econBusiness, standards: [{ code: "EB.1.1", title: "Needs vs Wants", description: "Differentiating between essential items and luxury desires." }] }
    ]
  },
  [YearGroup.YEAR_7]: {
    goals: ["Explain answers using PEEL structure.", "Distinguish primary/secondary sources.", "Locate global landforms."],
    skills: ["Map reading & orientation", "Source identification", "Argument construction"],
    commandTerms: ["Describe", "Identify", "Outline"],
    domains: [
      { ...PILLAR_TEMPLATES.pastPresent, standards: [{ code: "PP.7.1", title: "Ancient Foundations", description: "Examining key characteristics of ancient civilizations." }] },
      { ...PILLAR_TEMPLATES.evolvingWorld, standards: [{ code: "EW.7.1", title: "Physical Systems", description: "The water cycle and major weather patterns affecting East Asia." }] },
      { ...PILLAR_TEMPLATES.globalCitizen, standards: [{ code: "RGC.7.1", title: "Cultural Appreciation", description: "How culture and values shape individual and group identity." }] },
      { ...PILLAR_TEMPLATES.econBusiness, standards: [{ code: "EB.7.1", title: "Foundations of Trade", description: "From barter systems to modern currency and market basics." }] }
    ]
  },
  [YearGroup.YEAR_8]: {
    goals: ["Construct balanced arguments.", "Compare urban structures.", "Evaluate human rights applications."],
    skills: ["Comparative analysis", "Trend identification", "Primary research"],
    commandTerms: ["Explain", "Compare", "Contrast", "Interpret"],
    domains: [
      { ...PILLAR_TEMPLATES.pastPresent, standards: [{ code: "PP.8.1", title: "Era of Revolutions", description: "Analyzing the social changes of the Industrial Revolution." }] },
      { ...PILLAR_TEMPLATES.evolvingWorld, standards: [{ code: "EW.8.1", title: "Urban Dynamics", description: "Challenges and opportunities of rapid global urbanization." }] },
      { ...PILLAR_TEMPLATES.globalCitizen, standards: [{ code: "RGC.8.1", title: "Human Rights Evolution", description: "Tracing the development of universal rights in law." }] },
      { ...PILLAR_TEMPLATES.econBusiness, standards: [{ code: "EB.8.1", title: "Market Structures", description: "Differentiating between planned and market economies." }] }
    ]
  },
  [YearGroup.YEAR_9]: {
    goals: ["Full OPVL source evaluation.", "Synthesize geographic/historical data.", "Analyze ethical implications of globalization."],
    skills: ["Source evaluation (OPVL)", "Hypothesis testing", "Statistical synthesis"],
    commandTerms: ["Analyze", "Evaluate", "Synthesize", "Examine"],
    domains: [
      { ...PILLAR_TEMPLATES.pastPresent, standards: [{ code: "PP.9.1", title: "Global Conflicts", description: "Evaluating 20th-century geopolitical shifts." }] },
      { ...PILLAR_TEMPLATES.evolvingWorld, standards: [{ code: "EW.9.1", title: "Sustainable Geopolitics", description: "Resource management in a changing global climate." }] },
      { ...PILLAR_TEMPLATES.globalCitizen, standards: [{ code: "RGC.9.1", title: "Modern Activism", description: "The role of digital media in social movements." }] },
      { ...PILLAR_TEMPLATES.econBusiness, standards: [{ code: "EB.9.1", title: "Global Integration", description: "Impacts of globalization on national sovereignty." }] }
    ]
  }
};

const YEARLY_ASSESSMENT_MAP: Record<string, any[]> = {
  [YearGroup.YEAR_1]: [
    { title: "Family History Poster", type: "Summative", term: "Term 1", focus: "Timeline Skills" },
    { title: "Local Map Drawing", type: "Formative", term: "Term 2", focus: "Spatial Awareness" }
  ],
  [YearGroup.YEAR_7]: [
    { title: "Ancient Civilizations Inquiry", type: "Summative", term: "Term 1", focus: "Source Analysis", requirement: "Students must use at least 3 primary sources and follow PEEL structure." },
    { title: "Global Landforms Test", type: "Formative", term: "Term 2", focus: "Map Skills", requirement: "Closed book. Requires identification of 15 major world landforms." },
    { title: "The Silk Road Project", type: "Summative", term: "Term 3", focus: "Synthesis", requirement: "Group presentation and individual 500-word reflection." }
  ],
  [YearGroup.YEAR_8]: [
    { title: "Industrial Revolution Essay", type: "Summative", term: "Term 1", focus: "Causality", requirement: "Comparative essay on living conditions vs economic growth." },
    { title: "Urban Dynamics Investigation", type: "Summative", term: "Term 2", focus: "Data Handling", requirement: "Fieldwork required. Data analysis of local urban changes." },
    { title: "Human Rights Case Study", type: "Formative", term: "Term 3", focus: "Evaluation", requirement: "Choose one modern case study and evaluate legal frameworks." }
  ],
  [YearGroup.YEAR_9]: [
    { title: "20th Century Conflict Mock", type: "Summative", term: "Term 1", focus: "OPVL Skills", requirement: "Full mock exam following IGCSE transition standards." },
    { title: "Globalization Portfolio", type: "Summative", term: "Term 2", focus: "Global Perspectives", requirement: "Digital portfolio documenting impact of MNCs on local markets." },
    { title: "Final Year Humanities Exam", type: "Summative", term: "Term 3", focus: "All Standards", requirement: "End-of-year comprehensive exam covering all four pillars." }
  ],
};

const YearGroupView: React.FC<YearGroupViewProps> = ({ 
  resources, onResourceClick, mode, forumPosts, setForumPosts, currentUser, onUserClick, onContributePreset, onToggleSubscription, globalSearchTerm = '', initialSubTab, isAdmin
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<string>('');
  const [view, setView] = useState<'resources' | 'discussion' | 'assessments' | 'coursework' | 'ia' | 'exams' | 'standards'>('standards');
  
  useEffect(() => {
    let newSubTab = '';
    if (initialSubTab) {
      newSubTab = initialSubTab;
    } else {
      if (mode === 'primary') newSubTab = YearGroup.YEAR_1;
      else if (mode === 'years') newSubTab = YearGroup.YEAR_7;
      else if (mode === 'igcse') newSubTab = Subject.HISTORY;
      else if (mode === 'ib') newSubTab = Subject.HISTORY;
    }
    setSelectedSubTab(newSubTab);

    // Set "Standards" as the opening page if data exists for this year group
    const hasStandards = YEARLY_CURRICULUM_DATA[newSubTab];
    setView(hasStandards ? 'standards' : 'resources');
  }, [mode, initialSubTab]);

  const searchFilter = (res: Resource) => {
    if (!globalSearchTerm) return true;
    const term = globalSearchTerm.toLowerCase();
    return (
      res.title.toLowerCase().includes(term) ||
      res.description.toLowerCase().includes(term) ||
      res.tags.some(t => t.toLowerCase().includes(term))
    );
  };

  const filtered = resources.filter(res => {
    const matchesContext = (mode === 'primary' || mode === 'years') ? res.yearGroup === selectedSubTab : res.subject === selectedSubTab;
    return matchesContext && searchFilter(res);
  });

  const isSubscribed = currentUser.subscriptions.includes(selectedSubTab);

  const showCourseworkTab = mode === 'igcse' && (selectedSubTab === Subject.HISTORY || selectedSubTab === Subject.GEOGRAPHY || selectedSubTab === Subject.ENTERPRISE);
  const showIATab = mode === 'ib' && [Subject.HISTORY, Subject.GEOGRAPHY, Subject.PSYCHOLOGY, Subject.ECONOMICS, Subject.BUSINESS, Subject.PHILOSOPHY].includes(selectedSubTab as Subject);
  const showStandardsTab = YEARLY_CURRICULUM_DATA[selectedSubTab];

  const handleContribute = (type: ResourceType, extraTags: string[] = []) => {
    if (onContributePreset) {
      onContributePreset({
        subject: mode === 'igcse' || mode === 'ib' ? (selectedSubTab as Subject) : (mode === 'primary' ? Subject.YEAR_1_6 : Subject.YEAR_7_9),
        yearGroup: (mode === 'primary' || mode === 'years') ? (selectedSubTab as YearGroup) : (mode === 'igcse' ? YearGroup.IGCSE : YearGroup.IB_ALEVEL),
        type: type,
        tags: extraTags
      });
    }
  };

  const currentCurriculum = YEARLY_CURRICULUM_DATA[selectedSubTab];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Selection Summary Header with Subscription Box */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
            <i className={`fa-solid ${mode === 'primary' || mode === 'years' ? 'fa-children' : 'fa-book-open'}`}></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">{selectedSubTab}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mode.toUpperCase()} Overview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${isSubscribed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex flex-col">
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isSubscribed ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isSubscribed ? 'Following Sub-Hub' : 'Follow this Area'}
              </span>
              <p className="text-[9px] text-slate-500 font-medium">Get notifications for new uploads & chats</p>
            </div>
            <button 
              onClick={() => onToggleSubscription?.(selectedSubTab)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isSubscribed 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                  : 'bg-white text-slate-400 border border-slate-200 hover:text-indigo-600'
              }`}
            >
              <i className={`fa-solid ${isSubscribed ? 'fa-bell' : 'fa-bell-slash'}`}></i>
            </button>
          </div>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">Active Workspace</span>
        </div>
      </div>

      {/* Main View Toggle */}
      <div className="flex flex-wrap gap-2">
        {showStandardsTab && (
          <button onClick={() => setView('standards')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'standards' ? 'bg-indigo-900 text-white shadow-md' : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'}`}>Standards</button>
        )}
        <button onClick={() => setView('resources')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'resources' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Resources</button>
        <button onClick={() => setView('discussion')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'discussion' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Forum</button>
        
        {(mode === 'primary' || mode === 'years') && (
          <button onClick={() => setView('assessments')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'assessments' ? 'bg-rose-600 text-white shadow-md' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>Assessments</button>
        )}
        
        {showCourseworkTab && (
          <button onClick={() => setView('coursework')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'coursework' ? 'bg-amber-600 text-white shadow-md' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>Coursework Hub</button>
        )}
        
        {showIATab && (
          <button onClick={() => setView('ia')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'ia' ? 'bg-indigo-900 text-white shadow-md' : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'}`}>IA Hub</button>
        )}

        {(mode === 'igcse' || mode === 'ib') && (
          <button onClick={() => setView('exams')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === 'exams' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Exam Hub</button>
        )}
      </div>

      {/* Content Rendering */}
      {view === 'standards' && currentCurriculum && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fa-solid fa-bullseye"></i>
              {selectedSubTab} Achievement Goals
            </h2>
            <div className="space-y-4">
              {currentCurriculum.goals.map((goal: string, idx: number) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-2.5 w-2 h-2 rounded-full bg-indigo-600 shrink-0"></div>
                  <p className="text-xl font-bold text-slate-700 leading-relaxed">{goal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
              <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-6"><i className="fa-solid fa-wand-sparkles mr-2"></i>Core Skills Focus</h3>
              <div className="flex flex-wrap gap-3">
                {currentCurriculum.skills.map((skill: string, idx: number) => (
                  <span key={idx} className="bg-white/10 px-5 py-2.5 rounded-2xl text-sm font-bold border border-white/5">{skill}</span>
                ))}
              </div>
            </div>
            <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl">
              <h3 className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-6"><i className="fa-solid fa-terminal mr-2"></i>Key Command Terms</h3>
              <div className="flex flex-wrap gap-3">
                {currentCurriculum.commandTerms.map((term: string, idx: number) => (
                  <span key={idx} className="bg-white/20 px-5 py-2.5 rounded-2xl text-sm font-black border border-white/10">{term}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {currentCurriculum.domains.map((domain: any, i: number) => (
              <section key={i} className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3 lg:w-1/4">
                  <div className={`${domain.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white text-2xl shadow-xl shadow-slate-200`}>
                    <i className={`fa-solid ${domain.icon}`}></i>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mt-6 mb-2">{domain.category}</h3>
                  <div className="h-1 w-12 bg-slate-200 rounded-full"></div>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {domain.standards.map((std: any, j: number) => (
                    <div key={j} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                      <span className={`${domain.color} text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-sm mb-6 inline-block`}>{std.code}</span>
                      <h4 className="font-black text-slate-800 text-lg mb-4 leading-tight">{std.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{std.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {view === 'resources' && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><i className="fa-solid fa-book-open"></i></div>
              <div>
                <h3 className="text-xl font-black text-slate-800">{selectedSubTab} Learning Materials</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filtered.length} Items Available</p>
              </div>
            </div>
          </div>
          <ResourceGrid resources={filtered} onResourceClick={onResourceClick} hideFilters={true} />
        </section>
      )}

      {view === 'assessments' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          
          {/* Section 1: Assessment Requirements */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-clipboard-list text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Assessment Requirements</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Standardized Expectations for {selectedSubTab}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(YEARLY_ASSESSMENT_MAP[selectedSubTab] || []).map((asm, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-full uppercase">{asm.term}</span>
                  </div>
                  <div className={`w-10 h-10 mb-4 rounded-xl flex items-center justify-center ${asm.type === 'Summative' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <i className={`fa-solid ${asm.type === 'Summative' ? 'fa-pen-nib' : 'fa-vial'}`}></i>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 group-hover:text-rose-600 transition-colors mb-2">{asm.title}</h4>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <i className="fa-solid fa-crosshairs"></i> Focus: {asm.focus}
                    </p>
                    <div className="pt-3 border-t border-slate-200 mt-2">
                      <p className="text-xs text-slate-500 leading-relaxed italic">
                        <span className="font-black text-[9px] uppercase tracking-tighter text-slate-400 block mb-1">Requirement:</span>
                        {asm.requirement || "See departmental handbook for detailed instructions."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Mark Schemes Hub */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                  <i className="fa-solid fa-file-invoice text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Mark Schemes Hub</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Official and community-shared criteria</p>
                </div>
              </div>
              <button 
                onClick={() => handleContribute(ResourceType.MARK_SCHEME)} 
                className="bg-slate-800 text-white px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-slate-700 transition-all shadow-md active:scale-95"
              >
                Upload Mark Scheme
              </button>
            </div>
            <ResourceGrid 
              resources={filtered.filter(r => r.type === ResourceType.MARK_SCHEME)} 
              onResourceClick={onResourceClick} 
              hideFilters={true} 
            />
            {filtered.filter(r => r.type === ResourceType.MARK_SCHEME).length === 0 && (
              <div className="py-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase">No mark schemes uploaded for this context yet.</p>
              </div>
            )}
          </section>

          {/* Section 3: Example Assessments & Support */}
          <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-handshake-angle text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Example Assessments & Support</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Moderation support and teaching aids</p>
                </div>
              </div>
              <button 
                onClick={() => handleContribute(ResourceType.EXAMPLE_WORK)} 
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                Add Assessment Example
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-star"></i> High-Quality Samples
                </h4>
                <ResourceGrid 
                  resources={filtered.filter(r => r.type === ResourceType.EXAMPLE_WORK)} 
                  onResourceClick={onResourceClick} 
                  hideFilters={true} 
                />
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 h-fit">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-circle-info"></i> Support Materials
                </h4>
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Use this space to share assessment scaffolds, writing frames, and moderation guides tailored for {selectedSubTab}.
                  </p>
                  <ResourceGrid 
                    resources={filtered.filter(r => r.tags.includes('Support') || r.tags.includes('Guide'))} 
                    onResourceClick={onResourceClick} 
                    hideFilters={true} 
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {view === 'exams' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl font-black mb-4">{selectedSubTab} Exam Hub</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">Access community-uploaded exam papers, mark schemes, and paired packages.</p>
              <div className="flex gap-3">
                <button onClick={() => handleContribute(ResourceType.EXAM_PACKAGE)} className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs hover:bg-amber-50 transition-all">Upload Paper & MS Pair</button>
                <button onClick={() => handleContribute(ResourceType.ASSESSMENT)} className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-slate-700 transition-all">Upload Single Paper</button>
              </div>
            </div>
            <i className="fa-solid fa-file-pen absolute -right-12 -bottom-12 text-[20rem] text-white/5 -rotate-12 pointer-events-none"></i>
          </div>
          
          <div className="flex flex-col gap-10">
            <section>
              <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-box-open text-amber-500"></i> Paired Exam Packages
              </h3>
              <ResourceGrid resources={filtered.filter(r => r.type === ResourceType.EXAM_PACKAGE)} onResourceClick={onResourceClick} hideFilters={true} />
              {filtered.filter(r => r.type === ResourceType.EXAM_PACKAGE).length === 0 && (
                <p className="text-xs font-bold text-slate-400 uppercase italic py-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">No paired packages yet. Contributor staff are encouraged to upload Paper & MS together.</p>
              )}
            </section>

            <section>
              <h3 className="text-xl font-black text-slate-800 mb-6">Individual Exam Components</h3>
              <ResourceGrid resources={filtered.filter(r => r.type === ResourceType.ASSESSMENT || r.type === ResourceType.MARK_SCHEME)} onResourceClick={onResourceClick} hideFilters={true} />
            </section>
          </div>
        </div>
      )}

      {(view === 'coursework' || view === 'ia') && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <div className={`p-10 rounded-[3.5rem] text-white relative overflow-hidden ${view === 'coursework' ? 'bg-amber-600' : 'bg-indigo-900'}`}>
            <h2 className="text-3xl font-black uppercase tracking-tight">{selectedSubTab} {view === 'coursework' ? 'Coursework' : 'IA'} Central</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-2xl font-black text-slate-800">Supportive Toolkits</h3>
              <ResourceGrid resources={filtered.filter(r => (r.type === ResourceType.COURSEWORK || r.type === ResourceType.INTERNAL_ASSESSMENT) && !r.tags.includes('Moderation Support'))} onResourceClick={onResourceClick} hideFilters={true} />
            </div>
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 space-y-8">
              <h3 className="text-2xl font-black text-slate-800">Moderation Gallery</h3>
              <ResourceGrid resources={filtered.filter(r => (r.type === ResourceType.EXAMPLE_WORK || r.type === ResourceType.COURSEWORK || r.type === ResourceType.INTERNAL_ASSESSMENT) && r.tags.includes('Moderation Support'))} onResourceClick={onResourceClick} hideFilters={true} />
            </div>
          </div>
        </div>
      )}

      {view === 'discussion' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Forum 
            posts={forumPosts} 
            setPosts={setForumPosts} 
            currentUser={currentUser} 
            contextSubject={mode === 'igcse' || mode === 'ib' ? (selectedSubTab as Subject) : undefined} 
            contextYear={mode === 'primary' || mode === 'years' ? (selectedSubTab as YearGroup) : undefined}
            onUserClick={onUserClick} 
          />
        </div>
      )}
    </div>
  );
};

export default YearGroupView;
