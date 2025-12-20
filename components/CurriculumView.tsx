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
  "Compare": {
    title: "Compare",
    description: "Give an account of the similarities between two (or more) items or situations, referring to both (or all) of them throughout.",
    expectation: "Students must use comparative language like 'similarly' or 'likewise'."
  },
  "Contrast": {
    title: "Contrast",
    description: "Give an account of the differences between two (or more) items or situations, referring to both (or all) of them throughout.",
    expectation: "Focus on distinctions. Example: 'Contrast the governance of ancient Athens with modern democracy.'"
  },
  "Summarize": {
    title: "Summarize",
    description: "Abstract a general theme or major points.",
    expectation: "Condensing information while retaining core meaning."
  },
  "Interpret": {
    title: "Interpret",
    description: "Use knowledge and understanding to recognize trends and draw conclusions from given information.",
    expectation: "Often used with data or political cartoons. 'Interpret the message of this 1920s propaganda poster.'"
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
  },
  "Synthesize": {
    title: "Synthesize",
    description: "Combine different ideas, influences, or objects to form a new whole.",
    expectation: "Integrating various perspectives into a single coherent theory or argument."
  },
  "Critique": {
    title: "Critique",
    description: "Provide a critical assessment or review.",
    expectation: "Identifying flaws or merits in a theory or methodology."
  },
  "Justify": {
    title: "Justify",
    description: "Give valid reasons or evidence to support an answer or conclusion.",
    expectation: "Using data or quotes to defend a position. Example: 'Justify the use of renewable energy over fossil fuels.'"
  },
  "Examine": {
    title: "Examine",
    description: "Consider an argument or concept in a way that uncovers the assumptions and interrelationships of the issue.",
    expectation: "Deep, thorough investigation of a topic's nuances."
  },
  // Skills
  "Map reading & orientation": {
    title: "Map Reading & Orientation",
    description: "Mastery of physical and digital maps including scale, coordinates, and legend interpretation.",
    expectation: "Students can navigate using 4-figure grid references and calculate real-world distances from map scales."
  },
  "Source identification": {
    title: "Source Identification",
    description: "Distinguishing between primary (eyewitness) and secondary (interpretive) evidence.",
    expectation: "Correctly categorizing artifacts like diaries, textbooks, and newspaper reports."
  },
  "Chronological sequencing": {
    title: "Chronological Sequencing",
    description: "Placing events in a logical time order to understand continuity and change.",
    expectation: "Creating accurate timelines with appropriate scaling and periodization."
  },
  "Basic data recording": {
    title: "Basic Data Recording",
    description: "Collecting and organizing raw Humanities data into structured formats.",
    expectation: "Designing simple tally charts and tables for field observations or surveys."
  },
  "Comparative analysis": {
    title: "Comparative Analysis",
    description: "Systematically comparing case studies to find universal versus local trends.",
    expectation: "Identifying shared characteristics between two different cities or historical eras."
  },
  "Trend identification": {
    title: "Trend Identification",
    description: "Recognizing patterns in data, behavior, or historical movements over time.",
    expectation: "Describing line graphs (e.g., population growth) using precise academic vocabulary."
  },
  "Argument construction": {
    title: "Argument Construction",
    description: "Building persuasive points using evidence and logical reasoning.",
    expectation: "Usage of the PEEL (Point, Evidence, Explanation, Link) paragraph structure."
  },
  "Primary research": {
    title: "Primary Research",
    description: "Directly gathering information through interviews, questionnaires, or site visits.",
    expectation: "Designing ethical and unbiased questions for community members."
  },
  "Source evaluation (OPVL)": {
    title: "Source Evaluation (OPVL)",
    description: "The gold standard for Humanities analysis: Origin, Purpose, Value, and Limitation.",
    expectation: "Critiquing the reliability of a source by looking at its author's motives and context."
  },
  "Hypothesis testing": {
    title: "Hypothesis Testing",
    description: "Proposing a tentative explanation for a phenomenon and checking it against evidence.",
    expectation: "Accepting or rejecting a claim based on gathered geographical or sociological data."
  },
  "Statistical synthesis": {
    title: "Statistical Synthesis",
    description: "Combining multiple data points to form a broader conclusion.",
    expectation: "Calculating averages and percentages to support a general humanities claim."
  },
  "Academic referencing": {
    title: "Academic Referencing",
    description: "Properly acknowledging the work and ideas of others.",
    expectation: "Consistent use of YCYW's adapted Harvard style for all bibliographies and in-text citations."
  }
};

const INITIAL_YC_DATA: Record<string, YearFramework> = {
  [YearGroup.YEAR_7]: {
    goals: [
      "Students can explain an answer using the PEEL structure.",
      "Identify and distinguish between primary and secondary historical sources.",
      "Understand the basic concept of identity and how it connects to YCYW pillars.",
      "Locate and label major global landforms and ecosystems on a physical map."
    ],
    skills: ["Map reading & orientation", "Source identification", "Chronological sequencing", "Basic data recording"],
    commandTerms: ["Describe", "Identify", "List", "Label", "Outline"],
    domains: [
      {
        category: "Past & Present",
        icon: "fa-clock-rotate-left",
        color: "bg-amber-500",
        standards: [
          { code: "PP.7.1", title: "Personal & School Heritage", description: "Trace the evolution of the local Yew Chung community within the wider city context." },
          { code: "PP.7.2", title: "Ancient Foundations", description: "Examine key characteristics of ancient civilizations and their lasting legacies." }
        ]
      },
      {
        category: "Our Evolving World",
        icon: "fa-earth-americas",
        color: "bg-emerald-500",
        standards: [
          { code: "EW.7.1", title: "Physical Systems", description: "Describe the water cycle and major weather patterns affecting East Asia." }
        ]
      },
      {
        category: "Responsible Global Citizen",
        icon: "fa-hands-holding-circle",
        color: "bg-indigo-500",
        standards: [
          { code: "RGC.7.1", title: "Cultural Appreciation", description: "Identify the components of culture and how they shape individual identity." }
        ]
      },
      {
        category: "Economics & Business",
        icon: "fa-shop",
        color: "bg-rose-500",
        standards: [
          { code: "EB.7.1", title: "Foundations of Trade", description: "Explain the transition from barter systems to modern currency." }
        ]
      }
    ]
  },
  [YearGroup.YEAR_8]: {
    goals: [
      "Construct a balanced argument using at least two different perspectives.",
      "Explain the causes and consequences of the Industrial Revolution.",
      "Compare urban structures between local and international case studies.",
      "Evaluate the effectiveness of different human rights applications."
    ],
    skills: ["Comparative analysis", "Trend identification", "Argument construction", "Primary research"],
    commandTerms: ["Explain", "Compare", "Contrast", "Summarize", "Interpret"],
    domains: [
      {
        category: "Past & Present",
        icon: "fa-landmark",
        color: "bg-amber-500",
        standards: [
          { code: "PP.8.1", title: "Era of Revolutions", description: "Analyze the social and political changes brought about by the Industrial Revolution." }
        ]
      },
      {
        category: "Our Evolving World",
        icon: "fa-city",
        color: "bg-emerald-500",
        standards: [
          { code: "EW.8.1", title: "Urban Dynamics", description: "Examine the challenges and opportunities of rapid urbanization in developing nations." }
        ]
      },
      {
        category: "Responsible Global Citizen",
        icon: "fa-scale-balanced",
        color: "bg-indigo-500",
        standards: [
          { code: "RGC.8.1", title: "Human Rights Evolution", description: "Trace the development of universal rights and their application in local law." }
        ]
      },
      {
        category: "Economics & Business",
        icon: "fa-chart-pie",
        color: "bg-rose-500",
        standards: [
          { code: "EB.8.1", title: "Market Structures", description: "Differentiate between planned and market economies." }
        ]
      }
    ]
  },
  [YearGroup.YEAR_9]: {
    goals: [
      "Critically evaluate sources using full OPVL (Origin, Purpose, Value, Limitation).",
      "Synthesize geographic and historical data to propose sustainable solutions.",
      "Analyze the ethical implications of globalization on local cultures.",
      "Master academic referencing and the avoidance of plagiarism in inquiry projects."
    ],
    skills: ["Source evaluation (OPVL)", "Hypothesis testing", "Statistical synthesis", "Academic referencing"],
    commandTerms: ["Analyze", "Evaluate", "Synthesize", "Critique", "Justify", "Examine"],
    domains: [
      {
        category: "Past & Present",
        icon: "fa-shield-halved",
        color: "bg-amber-500",
        standards: [
          { code: "PP.9.1", title: "Global Conflicts", description: "Evaluate the causes and consequences of 20th-century geopolitical shifts." }
        ]
      },
      {
        category: "Our Evolving World",
        icon: "fa-leaf",
        color: "bg-emerald-500",
        standards: [
          { code: "EW.9.1", title: "Sustainable Geopolitics", description: "Propose solutions for resource management in a changing global climate." }
        ]
      },
      {
        category: "Responsible Global Citizen",
        icon: "fa-comments-dollar",
        color: "bg-indigo-500",
        standards: [
          { code: "RGC.9.1", title: "Modern Activism", description: "Analyze the role of digital media in modern social movements and global citizenship." }
        ]
      },
      {
        category: "Economics & Business",
        icon: "fa-globe",
        color: "bg-rose-500",
        standards: [
          { code: "EB.9.1", title: "Global Integration", description: "Critically assess the impacts of globalization on national sovereignty and wealth distribution." }
        ]
      }
    ]
  }
};

interface CurriculumViewProps {
  isAdmin?: boolean;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({ isAdmin }) => {
  const [activeYear, setActiveYear] = useState<YearGroup.YEAR_7 | YearGroup.YEAR_8 | YearGroup.YEAR_9>(YearGroup.YEAR_7);
  const [isEditing, setIsEditing] = useState(false);
  const [ycData, setYcData] = useState(INITIAL_YC_DATA);
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<DetailInfo | null>(null);
  const [originalKey, setOriginalKey] = useState<string | null>(null);

  const effectiveIsEditing = isAdmin && isEditing;
  const currentFramework = ycData[activeYear];

  const handleUpdateGoal = (index: number, val: string) => {
    if (!isAdmin) return;
    const newGoals = [...currentFramework.goals];
    newGoals[index] = val;
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...prev[activeYear], goals: newGoals }
    }));
  };

  const handleAddGoal = () => {
    if (!isAdmin) return;
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...prev[activeYear], goals: [...prev[activeYear].goals, "New achievement goal..."] }
    }));
  };

  const handleRemoveGoal = (index: number) => {
    if (!isAdmin) return;
    const newGoals = currentFramework.goals.filter((_, i) => i !== index);
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...prev[activeYear], goals: newGoals }
    }));
  };

  const handleUpdateSkill = (index: number, val: string) => {
    if (!isAdmin) return;
    const newSkills = [...currentFramework.skills];
    newSkills[index] = val;
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...prev[activeYear], skills: newSkills }
    }));
  };

  const handleAddSkill = () => {
    if (!isAdmin) return;
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...prev[activeYear], skills: [...prev[activeYear].skills, "New Skill..."] }
    }));
  };

  const handleRemoveSkill = (index: number) => {
    if (!isAdmin) return;
    const newSkills = currentFramework.skills.filter((_, i) => i !== index);
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...prev[activeYear], skills: newSkills }
    }));
  };

  const handleUpdateTerm = (index: number, val: string) => {
    if (!isAdmin) return;
    const newTerms = [...currentFramework.commandTerms];
    newTerms[index] = val;
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...prev[activeYear], commandTerms: newTerms }
    }));
  };

  const handleAddTerm = () => {
    if (!isAdmin) return;
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...prev[activeYear], commandTerms: [...prev[activeYear].commandTerms, "New Term..."] }
    }));
  };

  const handleRemoveTerm = (index: number) => {
    if (!isAdmin) return;
    const newTerms = currentFramework.commandTerms.filter((_, i) => i !== index);
    setYcData(prev => ({
      ...prev,
      [activeYear]: { ...prev[activeYear], commandTerms: newTerms }
    }));
  };

  const handleSaveModalDetails = () => {
    if (!selectedDetail || !originalKey) return;
    
    // Update the master details map
    setDetails(prev => ({
      ...prev,
      [selectedDetail.title]: { ...selectedDetail }
    }));

    // If the name changed, update the framework reference as well
    if (selectedDetail.title !== originalKey) {
      setYcData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(year => {
          newData[year].skills = newData[year].skills.map(s => s === originalKey ? selectedDetail.title : s);
          newData[year].commandTerms = newData[year].commandTerms.map(t => t === originalKey ? selectedDetail.title : t);
        });
        return newData;
      });
    }

    setSelectedDetail(null);
    setOriginalKey(null);
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSuggestion('');
    }, 4000);
  };

  const openDetail = (key: string) => {
    const info = details[key] || {
      title: key,
      description: "Detailed description for this item is currently being updated in the department handbook.",
      expectation: "Aligned with YCYW KS3 Humanities standards."
    };
    setSelectedDetail({ ...info });
    setOriginalKey(key);
  };

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
                  placeholder="Item Name"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 h-24"
                    value={selectedDetail.description}
                    onChange={e => setSelectedDetail({...selectedDetail, description: e.target.value})}
                    placeholder="Provide a definition..."
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed font-medium">{selectedDetail.description}</p>
                )}
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Assessment Expectation / Example</h4>
                {effectiveIsEditing ? (
                  <textarea 
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 h-24"
                    value={selectedDetail.expectation}
                    onChange={e => setSelectedDetail({...selectedDetail, expectation: e.target.value})}
                    placeholder="Provide an example expectation..."
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

      {/* Header with Admin Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">YCYW Internal</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">KS3 Framework 2024-25</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">Curriculum Standards</h1>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg ${
              isEditing ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <i className={`fa-solid ${isEditing ? 'fa-check' : 'fa-pen-to-square'}`}></i>
            {isEditing ? 'Finish Editing' : 'Edit Framework'}
          </button>
        )}
      </div>

      {/* Year Selection */}
      <div className="flex justify-center">
        <div className="bg-slate-200/50 p-2 rounded-[2.5rem] flex gap-2 w-full md:w-auto overflow-x-auto">
          {[YearGroup.YEAR_7, YearGroup.YEAR_8, YearGroup.YEAR_9].map((yg) => (
            <button
              key={yg}
              onClick={() => setActiveYear(yg as any)}
              className={`flex-1 md:flex-none px-10 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap ${
                activeYear === yg 
                  ? 'bg-white text-indigo-600 shadow-xl shadow-slate-200' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {yg}
            </button>
          ))}
        </div>
      </div>

      {/* Year Goals Card */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10 max-w-4xl">
          <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <i className="fa-solid fa-bullseye"></i>
            End of year goals
          </h2>
          
          <div className="space-y-4">
            {currentFramework.goals.map((goal, idx) => (
              <div key={idx} className="flex items-start gap-4 group/goal">
                <div className="mt-2.5 w-2 h-2 rounded-full bg-indigo-600 shrink-0"></div>
                {effectiveIsEditing ? (
                  <div className="flex-1 flex gap-2">
                    <input 
                      className="flex-1 text-lg font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 transition-all"
                      value={goal}
                      onChange={(e) => handleUpdateGoal(idx, e.target.value)}
                    />
                    <button 
                      onClick={() => handleRemoveGoal(idx)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ) : (
                  <p className="text-xl font-bold text-slate-700 leading-relaxed">
                    {goal}
                  </p>
                )}
              </div>
            ))}
            
            {effectiveIsEditing && (
              <button 
                onClick={handleAddGoal}
                className="mt-4 flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-dashed border-indigo-200"
              >
                <i className="fa-solid fa-plus"></i>
                Add New Goal Point
              </button>
            )}
          </div>
        </div>
        <i className="fa-solid fa-graduation-cap absolute -right-6 -bottom-6 text-[12rem] text-slate-50 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700"></i>
      </div>

      {/* Skills & Command Terms Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
          <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-6 flex items-center gap-2">
            <i className="fa-solid fa-wand-sparkles"></i>
            Core Skills Focus <span className="ml-2 lowercase font-bold opacity-60 text-[8px] tracking-normal italic">(Click for details/edit)</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {currentFramework.skills.map((skill, idx) => (
              effectiveIsEditing ? (
                <div key={idx} className="flex items-center gap-1 bg-white/10 rounded-2xl border border-white/5 pr-2">
                  <button 
                    onClick={() => openDetail(skill)}
                    className="bg-transparent px-4 py-2.5 text-sm font-bold focus:outline-none w-auto max-w-40 truncate text-left hover:text-indigo-300"
                  >
                    {skill}
                  </button>
                  <button onClick={() => handleRemoveSkill(idx)} className="text-white/40 hover:text-rose-400 p-1 transition-colors">
                    <i className="fa-solid fa-circle-xmark"></i>
                  </button>
                </div>
              ) : (
                <button 
                  key={idx} 
                  onClick={() => openDetail(skill)}
                  className="bg-white/10 px-5 py-2.5 rounded-2xl text-sm font-bold border border-white/5 hover:bg-white/20 hover:scale-105 transition-all active:scale-95"
                >
                  {skill}
                </button>
              )
            ))}
            {effectiveIsEditing && (
              <button 
                onClick={handleAddSkill}
                className="bg-white/5 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-dashed border-white/20 hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> Add Skill
              </button>
            )}
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl">
          <h3 className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-6 flex items-center gap-2">
            <i className="fa-solid fa-terminal"></i>
            Key Command Terms <span className="ml-2 lowercase font-bold opacity-60 text-[8px] tracking-normal italic">(Click for details/edit)</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {currentFramework.commandTerms.map((term, idx) => (
              effectiveIsEditing ? (
                <div key={idx} className="flex items-center gap-1 bg-white/20 rounded-2xl border border-white/10 pr-2">
                  <button 
                    onClick={() => openDetail(term)}
                    className="bg-transparent px-4 py-2.5 text-sm font-black focus:outline-none w-auto max-w-40 truncate text-left hover:text-indigo-200"
                  >
                    {term}
                  </button>
                  <button onClick={() => handleRemoveTerm(idx)} className="text-white/50 hover:text-rose-200 p-1 transition-colors">
                    <i className="fa-solid fa-circle-xmark"></i>
                  </button>
                </div>
              ) : (
                <button 
                  key={idx} 
                  onClick={() => openDetail(term)}
                  className="bg-white/20 px-5 py-2.5 rounded-2xl text-sm font-black border border-white/10 hover:bg-white/30 hover:scale-105 transition-all active:scale-95"
                >
                  {term}
                </button>
              )
            ))}
            {effectiveIsEditing && (
              <button 
                onClick={handleAddTerm}
                className="bg-white/10 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-dashed border-white/30 hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> Add Term
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Domains Matrix */}
      <div className="space-y-16">
        {currentFramework.domains.map((domain, i) => (
          <section key={i} className="animate-in fade-in slide-in-from-bottom-6 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Domain Vertical Info */}
              <div className="w-full md:w-1/3 lg:w-1/4 sticky top-32">
                <div className={`${domain.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white text-2xl shadow-xl shadow-slate-200 transition-transform hover:rotate-6`}>
                  <i className={`fa-solid ${domain.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mt-6 mb-2">{domain.category}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Pillar</p>
                <div className="h-1 w-12 bg-slate-200 rounded-full"></div>
              </div>

              {/* Specific Standards Cards */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {domain.standards.map((std, j) => (
                  <div key={j} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group/card">
                    <div className="flex justify-between items-start mb-6">
                      <span className={`${domain.color} text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-sm`}>
                        {std.code}
                      </span>
                      {effectiveIsEditing && (
                        <button className="text-slate-300 hover:text-rose-500 transition-colors">
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      )}
                    </div>
                    {effectiveIsEditing ? (
                      <div className="space-y-4">
                        <input 
                          className="w-full font-black text-slate-800 bg-slate-50 border border-slate-100 rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                          value={std.title}
                          onChange={(e) => {
                            const newDomains = [...currentFramework.domains];
                            newDomains[i].standards[j].title = e.target.value;
                            setYcData(prev => ({...prev, [activeYear]: {...prev[activeYear], domains: newDomains}}));
                          }}
                        />
                        <textarea 
                          className="w-full text-sm text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-3 focus:outline-none focus:border-indigo-500"
                          value={std.description}
                          rows={3}
                          onChange={(e) => {
                            const newDomains = [...currentFramework.domains];
                            newDomains[i].standards[j].description = e.target.value;
                            setYcData(prev => ({...prev, [activeYear]: {...prev[activeYear], domains: newDomains}}));
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-black text-slate-800 text-lg mb-4 group-hover/card:text-indigo-600 transition-colors leading-tight">
                          {std.title}
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          {std.description}
                        </p>
                      </>
                    )}
                  </div>
                ))}
                
                {effectiveIsEditing && (
                  <button 
                    onClick={() => {
                      const newDomains = [...currentFramework.domains];
                      newDomains[i].standards.push({ code: "NEW.1", title: "New Standard", description: "Standard description..." });
                      setYcData(prev => ({...prev, [activeYear]: {...prev[activeYear], domains: newDomains}}));
                    }}
                    className="border-3 border-dashed border-slate-200 rounded-[2.5rem] p-8 text-center group/add hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 group-hover/add:bg-indigo-100 group-hover/add:text-indigo-500 transition-all">
                      <i className="fa-solid fa-plus text-xl"></i>
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover/add:text-indigo-600">Add Standard Object</span>
                  </button>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Suggestion Box Section */}
      <div className="bg-slate-50 rounded-[3rem] p-12 border-2 border-dashed border-slate-200 mt-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-900">Curriculum Feedback</h3>
            <p className="text-slate-500 font-medium">
              We value collaborative refinement. Submit your suggestions for changes or improvements to the {activeYear} framework below.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 text-emerald-600 p-8 rounded-[2rem] border border-emerald-100 animate-in zoom-in-95 duration-300">
              <i className="fa-solid fa-circle-check text-4xl mb-4"></i>
              <p className="font-black">Suggestion Submitted Successfully!</p>
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">This has been sent to all approved curriculum officers (admin staff).</p>
            </div>
          ) : (
            <form onSubmit={handleSuggestionSubmit} className="space-y-4">
              <textarea 
                required
                className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all h-40 text-slate-700 shadow-sm"
                placeholder="Share your thoughts on specific standards, skills, or command terms..."
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
              ></textarea>
              <div className="flex justify-center">
                <button 
                  type="submit"
                  className="bg-slate-900 text-white px-12 py-5 rounded-[1.8rem] font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  Submit to Curriculum Officers
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Official YCYW Humanities Framework • Proprietary Curriculum Information
        </p>
      </div>
    </div>
  );
};

export default CurriculumView;