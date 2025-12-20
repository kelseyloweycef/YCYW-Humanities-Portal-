
import React, { useState } from 'react';
import { getLessonIdea, searchSocialStudiesEvents } from '../services/geminiService';
import { YearGroup } from '../types';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'plan' | 'search'>('plan');
  const [input, setInput] = useState('');
  const [yearGroup, setYearGroup] = useState<YearGroup>(YearGroup.YEAR_9);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);

  const handleAction = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setResponse(null);
    setSources([]);

    if (mode === 'plan') {
      const res = await getLessonIdea(input, yearGroup);
      setResponse(res || null);
    } else {
      const { text, sources: resSources } = await searchSocialStudiesEvents(input);
      setResponse(text);
      setSources(resSources);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white w-80 md:w-[400px] rounded-[2rem] shadow-2xl border border-indigo-100 overflow-hidden flex flex-col max-h-[600px] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <span className="font-bold">Humanities Copilot</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="p-4 bg-slate-50 flex gap-2 border-b border-slate-200">
            <button 
              onClick={() => setMode('plan')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'plan' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              Lesson Planner
            </button>
            <button 
              onClick={() => setMode('search')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'search' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
            >
              Current Affairs
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {!response && !isLoading ? (
              <div className="text-center py-8">
                <i className="fa-solid fa-lightbulb text-indigo-300 text-3xl mb-3"></i>
                <p className="text-sm text-slate-500 px-8">
                  {mode === 'plan' 
                    ? "Enter a topic and I'll draft a 50-minute lesson structure for you." 
                    : "Ask about current events to find relevant grounding for your class."}
                </p>
              </div>
            ) : null}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-indigo-500">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-xs font-bold animate-pulse">Consulting the curriculum...</p>
              </div>
            )}

            {response && !isLoading && (
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed animate-in fade-in zoom-in-95">
                {response}
                
                {sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-indigo-200">
                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Sources Found</p>
                    <div className="space-y-1">
                      {sources.map((src, idx) => (
                        <a 
                          key={idx} 
                          href={src.web?.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="block text-[11px] text-indigo-600 hover:underline truncate"
                        >
                          <i className="fa-solid fa-link mr-1"></i>
                          {src.web?.title || 'External Resource'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white space-y-3">
            {mode === 'plan' && (
              <select 
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none"
                value={yearGroup}
                onChange={(e) => setYearGroup(e.target.value as YearGroup)}
              >
                {Object.values(YearGroup).map(yg => <option key={yg} value={yg}>{yg}</option>)}
              </select>
            )}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder={mode === 'plan' ? "Topic (e.g. Plate Tectonics)" : "Event (e.g. COP28 Outcomes)"}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAction()}
              />
              <button 
                onClick={handleAction}
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-2xl group-hover:rotate-12 transition-all"></i>
          <span className="absolute right-16 bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Humanities Copilot
          </span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
