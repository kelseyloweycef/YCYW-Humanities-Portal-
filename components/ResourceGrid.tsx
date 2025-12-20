
import React from 'react';
import { Resource, YearGroup, ResourceType } from '../types';

interface ResourceGridProps {
  resources: Resource[];
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  filterYear?: YearGroup | 'All';
  setFilterYear?: (year: YearGroup | 'All') => void;
  onResourceClick: (resource: Resource) => void;
  hideFilters?: boolean;
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ 
  resources, 
  searchTerm, 
  setSearchTerm, 
  filterYear, 
  setFilterYear,
  onResourceClick,
  hideFilters = false
}) => {
  return (
    <div className="space-y-6">
      {!hideFilters && (
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex-1 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search resources, topics, tags..." 
              className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <select 
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filterYear}
              onChange={(e) => setFilterYear && setFilterYear(e.target.value as any)}
            >
              <option value="All">All Years</option>
              {Object.values(YearGroup).map(yg => <option key={yg} value={yg}>{yg}</option>)}
            </select>
          </div>
        </div>
      )}

      {resources.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <i className="fa-solid fa-box-open text-4xl text-slate-300 mb-4 block"></i>
          <p className="text-slate-500">No resources found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(res => (
            <div 
              key={res.id} 
              onClick={() => onResourceClick(res)}
              className={`group bg-white rounded-[2rem] p-6 border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full ${
                res.type === ResourceType.COURSEWORK ? 'border-amber-100' : 'border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  res.type === ResourceType.ASSESSMENT ? 'bg-rose-100 text-rose-600' : 
                  res.type === ResourceType.LESSON_PLAN ? 'bg-emerald-100 text-emerald-600' : 
                  res.type === ResourceType.COURSEWORK ? 'bg-amber-100 text-amber-600' :
                  'bg-indigo-100 text-indigo-600'
                }`}>
                  {res.type}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-tighter">{res.yearGroup}</span>
                  <span className="text-[9px] font-black text-indigo-400 mt-1 uppercase">{res.subject}</span>
                </div>
              </div>
              
              <h3 className="font-black text-lg text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                {res.title}
              </h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{res.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-6">
                {res.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-inner">
                    {res.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{res.author}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-comments text-xs"></i>
                    <span className="text-[10px] font-bold">{res.comments.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-download text-xs"></i>
                    <span className="text-[10px] font-bold">{res.downloads}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceGrid;
