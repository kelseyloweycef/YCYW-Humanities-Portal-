
import React from 'react';
import { Resource, ForumPost, User, ResourceStatus } from '../types';

interface DashboardProps {
  resources: Resource[];
  posts: ForumPost[];
  isAdmin?: boolean;
  currentUser: User;
  onUserClick?: (name: string) => void;
  onResourceClick?: (resource: Resource) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ resources, posts, isAdmin, currentUser, onUserClick, onResourceClick }) => {
  const stats = [
    { label: 'Verified Resources', value: resources.filter(r => r.status === ResourceStatus.APPROVED).length, icon: 'fa-file-lines', color: 'bg-blue-500' },
    { label: 'Downloads', value: resources.reduce((acc, curr) => acc + curr.downloads, 0), icon: 'fa-download', color: 'bg-emerald-500' },
    { label: 'Forum Topics', value: posts.length, icon: 'fa-comments', color: 'bg-amber-500' },
    { label: 'Active Staff', value: '14', icon: 'fa-users', color: 'bg-indigo-500' },
  ];

  const subscribedResources = resources.filter(r => currentUser.subscriptions.includes(r.subject) && r.status === ResourceStatus.APPROVED);
  const myPendingSubmissions = resources.filter(r => r.author === currentUser.name && r.status === ResourceStatus.PENDING);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`${s.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200`}>
              <i className={`fa-solid ${s.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-black text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Submissions in Queue (Personal Feedback) */}
          {!isAdmin && myPendingSubmissions.length > 0 && (
            <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 shadow-sm animate-in slide-in-from-top-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-amber-900">Your Submissions Queue</h2>
                  <p className="text-sm text-amber-600 mt-1">Awaiting approval by Curriculum Officers.</p>
                </div>
                <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-700">
                  <i className="fa-solid fa-hourglass-half"></i>
                </div>
              </div>
              <div className="space-y-3">
                {myPendingSubmissions.map(res => (
                  <div 
                    key={res.id} 
                    onClick={() => onResourceClick?.(res)}
                    className="flex items-center justify-between p-4 bg-white/80 rounded-2xl border border-amber-200 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-400 text-white flex items-center justify-center text-xs">
                        <i className="fa-solid fa-file-pen"></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-amber-700">{res.title}</p>
                        <p className="text-[10px] text-amber-500 font-black uppercase tracking-tighter">{res.subject} • Submitted {res.date}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-700 px-3 py-1 rounded-lg">Review Pending</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Your Notified Subjects</h2>
                <p className="text-sm text-slate-400 mt-1">Activity from subjects you've subscribed to.</p>
              </div>
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                <i className="fa-solid fa-bell"></i>
              </div>
            </div>

            {currentUser.subscriptions.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                <p className="text-slate-500 text-sm italic">You haven't subscribed to any subjects yet.</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Go to a Year Group and click "Receive notifications" to stay updated.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentUser.subscriptions.map(subject => (
                  <span key={subject} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-wider border border-indigo-100">
                    {subject}
                  </span>
                ))}
              </div>
            )}

            {subscribedResources.length > 0 && (
              <div className="space-y-3 mt-6">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Latest from your subjects</p>
                {subscribedResources.slice(0, 3).map(res => (
                  <div 
                    key={res.id} 
                    onClick={() => onResourceClick?.(res)}
                    className="flex items-center justify-between p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 hover:bg-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs">
                        <i className="fa-solid fa-file-invoice"></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600">{res.title}</p>
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter">{res.subject} • {res.date}</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-slate-300 group-hover:translate-x-1 transition-transform"></i>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Latest Shared Resources</h2>
                <p className="text-sm text-slate-400 mt-1">Verified community contributions.</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <i className="fa-solid fa-circle-check"></i>
              </div>
            </div>
            
            <div className="space-y-4">
              {resources.filter(r => r.status === ResourceStatus.APPROVED).length === 0 ? (
                <p className="text-slate-400 text-sm italic text-center py-8">No approved resources yet.</p>
              ) : (
                resources.filter(r => r.status === ResourceStatus.APPROVED).slice(0, 5).map(res => (
                  <div 
                    key={res.id} 
                    onClick={() => onResourceClick?.(res)}
                    className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white w-11 h-11 rounded-full flex items-center justify-center text-indigo-500 shadow-sm border border-slate-200 group-hover:text-white group-hover:bg-indigo-500 transition-colors shrink-0">
                        <i className="fa-solid fa-file-lines text-sm"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{res.title}</p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onUserClick?.(res.author); }}
                            className="text-[10px] text-slate-400 font-bold uppercase tracking-tight hover:text-indigo-500 transition-colors"
                          >
                            {res.author}
                          </button>
                          <span className="text-[10px] text-slate-300">•</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{res.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-slate-500 border border-slate-200 uppercase tracking-tighter">
                        {res.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white relative overflow-hidden h-fit flex flex-col">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-bullhorn text-indigo-200"></i>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Department Feed</span>
                </div>
              </div>
              <h2 className="text-2xl font-black mb-4 leading-tight">YCYW Notices</h2>
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl mb-6 border border-white/10 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">New Rule</span>
                    <span className="text-[9px] font-bold opacity-60">Just now</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-indigo-50">All shared files now require Curriclum Officer verification for security.</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Notice</span>
                    <span className="text-[9px] font-bold opacity-60">Today</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-indigo-50">Please use the discussion boards for moderation questions.</p>
                </div>
              </div>
            </div>
            <i className="fa-solid fa-newspaper absolute -right-6 -bottom-6 text-[12rem] text-indigo-700/20 -rotate-12 pointer-events-none"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
