
import React, { useState } from 'react';
import { Resource, ResourceType } from '../types';
import ResourceGrid from './ResourceGrid';

interface PDViewProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
}

const PD_TAGS = ['Pedagogy', 'AI & Tech', 'Wellbeing', 'Leadership', 'Assessment', 'EAL'];

const PDView: React.FC<PDViewProps> = ({ resources, onResourceClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const pdResources = resources.filter(res => 
    res.type === ResourceType.PROFESSIONAL_DEVELOPMENT &&
    (searchTerm === '' || 
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      res.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (activeTag === 'All' || res.tags.includes(activeTag))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="bg-gradient-to-br from-indigo-700 to-violet-800 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
              Lifelong Learning
            </span>
          </div>
          <h2 className="text-5xl font-black mb-6 leading-tight">Professional Learning Hub</h2>
          <p className="text-lg font-medium text-indigo-100/90 leading-relaxed mb-8">
            Elevate your practice. Access pedagogy research, AI integration guides, and leadership frameworks shared by our YCYW Humanities community.
          </p>
          <div className="flex flex-wrap gap-2">
            {PD_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? 'All' : tag)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all ${
                  activeTag === tag 
                    ? 'bg-white text-indigo-700 border-white shadow-lg' 
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <i className="fa-solid fa-chalkboard-user absolute -right-12 -bottom-12 text-[24rem] text-white/5 -rotate-12 pointer-events-none"></i>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800">Learning Resources</h3>
          <p className="text-sm text-slate-400 font-medium">Browse shared expertise and workshop materials.</p>
        </div>
        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search PD resources..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ResourceGrid 
        resources={pdResources} 
        onResourceClick={onResourceClick} 
        hideFilters={true}
      />

      {pdResources.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <i className="fa-solid fa-lightbulb text-4xl"></i>
          </div>
          <h4 className="text-lg font-black text-slate-700">No resources found</h4>
          <p className="text-slate-400 max-w-xs mx-auto mt-2">Try adjusting your filters or be the first to contribute a PD resource!</p>
        </div>
      )}
    </div>
  );
};

export default PDView;
