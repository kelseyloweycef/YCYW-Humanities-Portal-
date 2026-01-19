
import React from 'react';
import { Resource, ForumPost, User, ResourceStatus, CalendarEvent, ResourceType } from '../types';

interface DashboardProps {
  resources: Resource[];
  posts: ForumPost[];
  calendarEvents: CalendarEvent[];
  isAdmin?: boolean;
  currentUser: User;
  onUserClick?: (name: string) => void;
  onResourceClick?: (resource: Resource) => void;
  onEventClick?: (event: CalendarEvent) => void;
  globalSearchTerm?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  resources, 
  posts, 
  calendarEvents,
  isAdmin, 
  currentUser, 
  onUserClick, 
  onResourceClick,
  onEventClick,
  globalSearchTerm = ''
}) => {
  const searchFilter = (item: Resource | ForumPost) => {
    if (!globalSearchTerm) return true;
    const term = globalSearchTerm.toLowerCase();
    const title = 'title' in item ? item.title.toLowerCase() : '';
    const desc = 'description' in item ? item.description.toLowerCase() : '';
    return title.includes(term) || desc.includes(term);
  };

  // Only show notifications for subjects they subscribe to or professional development.
  const relevantResources = resources.filter(r => 
    (currentUser.subscriptions.includes(r.subject) || 
     currentUser.subscriptions.includes(r.yearGroup) || 
     r.type === ResourceType.PROFESSIONAL_DEVELOPMENT) && 
    r.status === ResourceStatus.APPROVED &&
    searchFilter(r)
  );

  const relevantPosts = posts.filter(p => 
    ((p.subject && currentUser.subscriptions.includes(p.subject)) || 
     (p.yearGroup && currentUser.subscriptions.includes(p.yearGroup))) &&
    searchFilter(p)
  );

  const stats = [
    { label: 'Verified Resources', value: resources.filter(r => r.status === ResourceStatus.APPROVED).length, icon: 'fa-file-lines', color: 'bg-blue-500' },
    { label: 'Downloads', value: resources.reduce((acc, curr) => acc + curr.downloads, 0), icon: 'fa-download', color: 'bg-emerald-500' },
    { label: 'Forum Topics', value: posts.length, icon: 'fa-comments', color: 'bg-amber-500' },
    { label: 'Active Staff', value: '14', icon: 'fa-users', color: 'bg-indigo-500' },
  ];

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${s.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg`}>
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
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Your Activity Feed</h2>
                <p className="text-sm text-slate-400 mt-1">Updates based on followed subjects & Professional Development.</p>
              </div>
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                <i className="fa-solid fa-bell"></i>
              </div>
            </div>

            {currentUser.subscriptions.length === 0 && relevantResources.filter(r => r.type === ResourceType.PROFESSIONAL_DEVELOPMENT).length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                <p className="text-slate-500 text-sm italic">You aren't following any sub-hubs yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-file-invoice text-indigo-400"></i> Relevant Resources
                  </p>
                  {relevantResources.slice(0, 5).map(res => (
                    <div key={res.id} onClick={() => onResourceClick?.(res)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${res.type === ResourceType.PROFESSIONAL_DEVELOPMENT ? 'bg-violet-50/30 border-violet-100' : 'bg-indigo-50/30 border-indigo-100'}`}>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 truncate">{res.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{res.subject || 'PD'} • {res.date}</p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-300"></i>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-comments text-emerald-400"></i> Discussions
                  </p>
                  {relevantPosts.slice(0, 5).map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 hover:bg-white transition-all cursor-pointer group">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 truncate">{post.title}</p>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase">{post.subject || post.yearGroup} • {post.replies.length} replies</p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-300"></i>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
              <i className="fa-solid fa-calendar-day text-indigo-600"></i> Staff Calendar
            </h3>
            <div className="space-y-4">
              {calendarEvents.map(event => (
                <div key={event.id} onClick={() => onEventClick?.(event)} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${event.type === 'pd' ? 'bg-indigo-50 border-indigo-100' : 'bg-rose-50 border-rose-100'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${event.type === 'pd' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'}`}>{event.type === 'pd' ? 'PD' : 'Deadline'}</span>
                    <span className="text-[10px] font-bold text-slate-400">{event.date}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-800">{event.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Department Alerts</span>
              <h2 className="text-2xl font-black mb-4 mt-2">Foundation Feed</h2>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <p className="text-xs font-bold leading-relaxed">Please ensure all moderation materials for Coursework are uploaded 48 hours before the deadline.</p>
              </div>
            </div>
            <i className="fa-solid fa-bullhorn absolute -right-6 -bottom-6 text-[10rem] text-white/5 -rotate-12"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
