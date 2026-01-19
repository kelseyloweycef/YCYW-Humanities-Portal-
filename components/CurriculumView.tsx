
import React, { useState } from 'react';
import { YearGroup } from '../types';

interface Standard {
  code: string;
  title: string;
  description: string;
}

interface Domain {
  category: string;
  icon: string;
  color: string;
  standards: Standard[];
}

interface YearFramework {
  goals: string[];
  skills: string[];
  commandTerms: string[];
  domains: Domain[];
}

interface DetailInfo {
  title: string;
  description: string;
  expectation: string;
}

const PILLAR_TEMPLATES = {
  pastPresent: { category: "Past & Present", icon: "fa-clock-rotate-left", color: "bg-amber-500" },
  evolvingWorld: { category: "Our Evolving World", icon: "fa-earth-americas", color: "bg-emerald-500" },
  globalCitizen: { category: "Responsible Global Citizen", icon: "fa-hands-holding-circle", color: "bg-indigo-500" },
  econBusiness: { category: "Economics & Business", icon: "fa-shop", color: "bg-rose-500" }
};

const INITIAL_DETAILS: Record<string, DetailInfo> = {
  // Command Terms
  "Describe": {
    title: "Describe",
    description: "Give a detailed account or picture of a situation, event, pattern or process.",
    expectation: "Students should provide specific characteristics. Example: 'Describe the living conditions in 19th-century industrial London.'"
  },
  "Identify": {
    title: "Identify",
    description: "Provide an answer from a number of possibilities. Recognize and state briefly a distinguishing fact or feature.",
    expectation: "Clear, concise naming of factors. Example: 'Identify three push factors for rural-to-urban migration.'"
  },
  "List": {
    title: "List",
    description: "Give a sequence of brief answers with no explanation.",
    expectation: "Bullet points are acceptable. Example: 'List the member nations of the UN Security Council.'"
  },
  "Label": {
    title: "Label",
    description: "Add labels to a diagram or graph.",
    expectation: "Precise placement of terms on a visual aid. Example: 'Label the crust, mantle, and core on the diagram.'"
  },
  "Outline": {
    title: "Outline",
    description: "Give a brief summary or account of the main points.",
    expectation: "A structured overview without deep detail. Example: 'Outline the main goals of the YCYW Global Citizenship program.'"
  },
  "Explain": {
    title: "Explain",
    description: "Give a detailed account including reasons or causes.",
    expectation: "Focus on 'why' and 'how'. Example: 'Explain why the Silk Road was vital for cultural exchange.'"
  },
  "Analyze": {
    title: "Analyze",
    description: "Break down in order to bring out the essential elements or structure.",
    expectation: "Students look for patterns and relationships. Example: 'Analyze the impact of industrialisation on child labor laws.'"
  },
  "Evaluate": {
    title: "Evaluate",
    description: "Make an appraisal by weighing up the strengths and limitations.",
    expectation: "Requires a balanced argument and a concluding judgment. Example: 'Evaluate the success of the Green Revolution.'"
  }
};

const INITIAL_YC_DATA: Record<string, YearFramework> = {
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
  [YearGroup.YEAR_2]: {
    goals: ["Understand local neighborhood history.", "Describe community helper roles.", "Identify basic local landmarks."],
    skills: ["Simple interview skills", "Bird's eye view sketching", "Data tallying"],
    commandTerms: ["Describe", "Identify", "List"],
    domains: [
      { ...PILLAR_TEMPLATES.pastPresent, standards: [{ code: "PP.2.1", title: "Our Local Area", description: "How our neighborhood has changed over the last 50 years." }] },
      { ...PILLAR_TEMPLATES.evolvingWorld, standards: [{ code: "EW.2.1", title: "Local Habitats", description: "Identifying plants and animals in the local park or campus." }] },
      { ...PILLAR_TEMPLATES.globalCitizen, standards: [{ code: "RGC.2.1", title: "Helping Others", description: "How community service improves the lives of those around us." }] },
      { ...PILLAR_TEMPLATES.econBusiness, standards: [{ code: "EB.2.1", title: "The Local Market", description: "Basic understanding of where food and goods come from." }] }
    ]
  },
  [YearGroup.YEAR_3]: {
    goals: ["Explore early civilizations.", "Understand the water cycle basics.", "Describe how cities grow."],
    skills: ["Globe navigation", "Inquiry questioning", "Fact vs Opinion"],
    commandTerms: ["Explain", "Describe", "Outline"],
    domains: [
      { ...PILLAR_TEMPLATES.pastPresent, standards: [{ code: "PP.3.1", title: "Early Settlements", description: "Studying Ancient Egypt and the importance of the Nile River." }] },
      { ...PILLAR_TEMPLATES.evolvingWorld, standards: [{ code: "EW.3.1", title: "Water Systems", description: "Basic components of rivers, lakes, and the global water cycle." }] },
      { ...PILLAR_TEMPLATES.globalCitizen, standards: [{ code: "RGC.3.1", title: "Shared Values", description: "Connecting school values to global citizenship attributes." }] },
      { ...PILLAR_TEMPLATES.econBusiness, standards: [{ code: "EB.3.1", title: "Barter to Money", description: "The evolution of currency and basic trading concepts." }] }
    ]
  },
  [YearGroup.YEAR_4]: {
    goals: ["Analyze Roman engineering impacts.", "Explain rainforest ecology.", "Compare rural and urban life."],
    skills: ["4-figure grid references", "Constructing bar charts", "Photo analysis"],
    commandTerms: ["Compare", "Analyze", "Explain"],
    domains: [
      { ...PILLAR_TEMPLATES.pastPresent, standards: [{ code: "PP.4.1", title: "Roman Legacy", description: "Evaluating the technological impact of the Roman Empire on modern life." }] },
      { ...PILLAR_TEMPLATES.evolvingWorld, standards: [{ code: "EW.4.1", title: "Biomes of the World", description: "Focus on Rainforests: Layers, climate, and human impact." }] },
      { ...PILLAR_TEMPLATES.globalCitizen, standards: [{ code: "RGC.4.1", title: "Protecting Nature", description: "The role of the individual in environmental conservation." }] },
      { ...PILLAR_TEMPLATES.econBusiness, standards: [{ code: "EB.4.1", title: "Supply Chains", description: "Tracing a product from raw material to the consumer's hands." }] }
    ]
  },
  [YearGroup.YEAR_5]: {
    goals: ["Describe Victorian social changes.", "Understand mountain formation.", "Explain basic economic systems."],
    skills: ["Compass navigation", "Primary source analysis", "Scale modeling"],
    commandTerms: ["Analyze", "Contrast", "Describe"],
    domains: [
      { ...PILLAR_TEMPLATES.pastPresent, standards: [{ code: "PP.5.1", title: "Victorian Era", description: "The impact of the Industrial Revolution on childhood and labor." }] },
      { ...PILLAR_TEMPLATES.evolvingWorld, standards: [{ code: "EW.5.1", title: "Dynamic Earth", description: "Plate tectonics and the formation of major mountain ranges." }] },
      { ...PILLAR_TEMPLATES.globalCitizen, standards: [{ code: "RGC.5.1", title: "Voices for Change", description: "Studying historical figures who fought for human rights." }] },
      { ...PILLAR_TEMPLATES.econBusiness, standards: [{ code: "EB.5.1", title: "Budgeting Basics", description: "Managing resources and simple financial planning concepts." }] }
    ]
  },
  [YearGroup.YEAR_6]: {
    goals: ["Evaluate WWII impacts on local areas.", "Analyze government structures.", "Interpret complex climate data."],
    skills: ["6-figure grid references", "Essay drafting", "Debating skills"],
    commandTerms: ["Evaluate", "Interpret", "Justify"],
    domains: [
      { ...PILLAR_TEMPLATES.pastPresent, standards: [{ code: "PP.6.1", title: "The Modern World", description: "Key events of the 20th century and their impact on local identity." }] },
      { ...PILLAR_TEMPLATES.evolvingWorld, standards: [{ code: "EW.6.1", title: "Weather & Climate", description: "Differentiating between daily weather and long-term climate patterns." }] },
      { ...PILLAR_TEMPLATES.globalCitizen, standards: [{ code: "RGC.6.1", title: "Global Governance", description: "The role of the UN and NGOs in addressing world crises." }] },
      { ...PILLAR_TEMPLATES.econBusiness, standards: [{ code: "EB.6.1", title: "Global Trade Patterns", description: "How international trade connects diverse economies." }] }
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

interface CurriculumViewProps {
  isAdmin?: boolean;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({ isAdmin }) => {
  const [activeYear, setActiveYear] = useState<string>(YearGroup.YEAR_7);
  const [isEditing, setIsEditing] = useState(false);
  const [ycData, setYcData] = useState(INITIAL_YC_DATA);
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<DetailInfo | null>(null);
  const [originalKey, setOriginalKey] = useState<string | null>(null);

  const effectiveIsEditing = isAdmin && isEditing;
  const currentFramework = ycData[activeYear] || { goals: [], skills: [], commandTerms: [], domains: [] };

  const handleUpdateGoal = (index: number, val: string) => {
    if (!isAdmin) return;
    const newGoals = [...currentFramework.goals];
    newGoals[index] = val;
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...currentFramework, goals: newGoals }
    }));
  };

  const handleAddGoal = () => {
    if (!isAdmin) return;
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...currentFramework, goals: [...currentFramework.goals, "New achievement goal..."] }
    }));
  };

  const handleRemoveGoal = (index: number) => {
    if (!isAdmin) return;
    const newGoals = currentFramework.goals.filter((_, i) => i !== index);
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...currentFramework, goals: newGoals }
    }));
  };

  const handleSaveModalDetails = () => {
    if (!selectedDetail || !originalKey) return;
    setDetails(prev => ({ ...prev, [selectedDetail.title]: { ...selectedDetail } }));
    setSelectedDetail(null);
    setOriginalKey(null);
  };

  const openDetail = (key: string) => {
    const info = details[key] || {
      title: key,
      description: "Detailed description for this item is currently being updated in the department handbook.",
      expectation: "Aligned with YCYW Humanities standards."
    };
    setSelectedDetail({ ...info });
    setOriginalKey(key);
  };

  const yearsToDisplay = [
    YearGroup.YEAR_1, YearGroup.YEAR_2, YearGroup.YEAR_3, 
    YearGroup.YEAR_4, YearGroup.YEAR_5, YearGroup.YEAR_6,
    YearGroup.YEAR_7, YearGroup.YEAR_8, YearGroup.YEAR_9
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-600 p-8 text-white relative">
              <button 
                onClick={() => { setSelectedDetail(null); setOriginalKey(null); }}
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Educational Criteria</h3>
              {effectiveIsEditing ? (
                <input 
                  className="bg-white/10 text-3xl font-black text-white w-full border-b border-white/30 focus:outline-none focus:border-white py-1"
                  value={selectedDetail.title}
                  onChange={e => setSelectedDetail({...selectedDetail, title: e.target.value})}
                />
              ) : (
                <h2 className="text-3xl font-black">{selectedDetail.title}</h2>
              )}
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Formal Definition</h4>
                {effectiveIsEditing ? (
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none h-24"
                    value={selectedDetail.description}
                    onChange={e => setSelectedDetail({...selectedDetail, description: e.target.value})}
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed font-medium">{selectedDetail.description}</p>
                )}
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Assessment Expectation</h4>
                {effectiveIsEditing ? (
                  <textarea 
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none h-24"
                    value={selectedDetail.expectation}
                    onChange={e => setSelectedDetail({...selectedDetail, expectation: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-slate-500 italic leading-relaxed">{selectedDetail.expectation}</p>
                )}
              </div>
              <button 
                onClick={effectiveIsEditing ? handleSaveModalDetails : () => { setSelectedDetail(null); setOriginalKey(null); }}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                {effectiveIsEditing ? 'Save Changes' : 'Got it, thanks'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">YCYW Internal</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Humanities Framework 2024-25</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">Curriculum Standards</h1>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg ${
              isEditing ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            <i className={`fa-solid ${isEditing ? 'fa-check' : 'fa-pen-to-square'}`}></i>
            {isEditing ? 'Finish Editing' : 'Edit Curriculum'}
          </button>
        )}
      </div>

      {/* Year Selection */}
      <div className="flex justify-center">
        <div className="bg-slate-200/50 p-2 rounded-[2.5rem] flex gap-2 w-full max-w-5xl overflow-x-auto no-scrollbar">
          {yearsToDisplay.map((yg) => (
            <button
              key={yg}
              onClick={() => setActiveYear(yg as string)}
              className={`px-6 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${
                activeYear === yg ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500'
              }`}
            >
              {yg}
            </button>
          ))}
        </div>
      </div>

      {/* Achievement Goals */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10 max-w-4xl">
          <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <i className="fa-solid fa-bullseye"></i>
            {activeYear} Achievement Goals
          </h2>
          <div className="space-y-4">
            {currentFramework.goals.map((goal, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="mt-2.5 w-2 h-2 rounded-full bg-indigo-600 shrink-0"></div>
                {effectiveIsEditing ? (
                  <div className="flex-1 flex gap-2">
                    <input 
                      className="flex-1 text-lg font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                      value={goal}
                      onChange={(e) => handleUpdateGoal(idx, e.target.value)}
                    />
                    <button onClick={() => handleRemoveGoal(idx)} className="text-slate-300 hover:text-rose-500"><i className="fa-solid fa-trash-can"></i></button>
                  </div>
                ) : (
                  <p className="text-xl font-bold text-slate-700 leading-relaxed">{goal}</p>
                )}
              </div>
            ))}
            {effectiveIsEditing && (
              <button onClick={handleAddGoal} className="mt-4 flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl border border-dashed border-indigo-200">
                <i className="fa-solid fa-plus"></i> Add Goal Point
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Skills & Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
          <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-6"><i className="fa-solid fa-wand-sparkles mr-2"></i>Core Skills Focus</h3>
          <div className="flex flex-wrap gap-3">
            {currentFramework.skills.map((skill, idx) => (
              <button key={idx} onClick={() => openDetail(skill)} className="bg-white/10 px-5 py-2.5 rounded-2xl text-sm font-bold border border-white/5 hover:bg-white/20 transition-all">{skill}</button>
            ))}
          </div>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl">
          <h3 className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-6"><i className="fa-solid fa-terminal mr-2"></i>Key Command Terms</h3>
          <div className="flex flex-wrap gap-3">
            {currentFramework.commandTerms.map((term, idx) => (
              <button key={idx} onClick={() => openDetail(term)} className="bg-white/20 px-5 py-2.5 rounded-2xl text-sm font-black border border-white/10 hover:bg-white/30 transition-all">{term}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Pillars */}
      <div className="space-y-16">
        {currentFramework.domains.map((domain, i) => (
          <section key={i} className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 lg:w-1/4 sticky top-32">
                <div className={`${domain.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white text-2xl shadow-xl shadow-slate-200 transition-transform hover:rotate-6`}>
                  <i className={`fa-solid ${domain.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mt-6 mb-2">{domain.category}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Pillar</p>
                <div className="h-1 w-12 bg-slate-200 rounded-full"></div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {domain.standards.map((std, j) => (
                  <div key={j} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group/card">
                    <span className={`${domain.color} text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-sm mb-6 inline-block`}>{std.code}</span>
                    <h4 className="font-black text-slate-800 text-lg mb-4 group-hover/card:text-indigo-600 transition-colors leading-tight">{std.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{std.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default CurriculumView;
