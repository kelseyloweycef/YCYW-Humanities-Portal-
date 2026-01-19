
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
  const stats = [
    { label: 'Verified Resources', value: resources.filter(r => r.status === ResourceStatus.APPROVED).length, icon: 'fa-file-lines', color: 'bg-blue-500' },
    { label: 'Downloads', value: resources.reduce((acc, curr) => acc + curr.downloads, 0), icon: 'fa-download', color: 'bg-emerald-500' },
    { label: 'Forum Topics', value: posts.length, icon: 'fa-comments', color: 'bg-amber-500' },
    { label: 'Active Staff', value: '14', icon: 'fa-users', color: 'bg-indigo-500' },
  ];

  const searchFilter = (item: Resource | ForumPost) => {
    if (!globalSearchTerm) return true;
    const term = globalSearchTerm.toLowerCase();
    const title = 'title' in item ? item.title.toLowerCase() : '';
    const desc = 'description' in item ? item.description.toLowerCase() : '';
    const tags = 'tags' in item ? item.tags.join(' ').toLowerCase() : '';
    const content = 'content' in item ? item.content.toLowerCase() : '';
    return title.includes(term) || desc.includes(term) || tags.includes(term) || content.includes(term);
  };

  // On the dashboard, we only show notifications for subjects they subscribe to or professional development.
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

  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();

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
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Your Activity Feed</h2>
                <p className="text-sm text-slate-400 mt-1">Focused on followed subjects and Professional Development.</p>
              </div>
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                <i className="fa-solid fa-bell"></i>
              </div>
            </div>

            {currentUser.subscriptions.length === 0 && relevantResources.filter(r => r.type === ResourceType.PROFESSIONAL_DEVELOPMENT).length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                <p className="text-slate-500 text-sm italic">You aren't following any sub-hubs yet.</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Visit a Subject or Year Group and click the bell icon to receive notifications here.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentUser.subscriptions.map(sub => (
                  <span key={sub} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-wider border border-indigo-100">
                    {sub}
                  </span>
                ))}
                <span className="px-4 py-2 bg-violet-50 text-violet-600 rounded-xl text-xs font-black uppercase tracking-wider border border-violet-100">
                  Professional Development
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Latest Relevant Resources */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-file-invoice text-indigo-400"></i> Relevant Uploads
                </p>
                {relevantResources.length > 0 ? (
                  relevantResources.slice(0, 5).map(res => (
                    <div 
                      key={res.id} 
                      onClick={() => onResourceClick?.(res)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
                        res.type === ResourceType.PROFESSIONAL_DEVELOPMENT 
                        ? 'bg-violet-50/30 border-violet-100 hover:bg-white' 
                        : 'bg-indigo-50/30 border-indigo-100 hover:bg-white'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 truncate">{res.title}</p>
                        <p className={`text-[10px] font-black uppercase tracking-tighter ${
                          res.type === ResourceType.PROFESSIONAL_DEVELOPMENT ? 'text-violet-400' : 'text-indigo-400'
                        }`}>
                          {res.type === ResourceType.PROFESSIONAL_DEVELOPMENT ? 'PD Hub' : res.subject} • {res.date}
                        </p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-300 group-hover:translate-x-1 transition-transform ml-2"></i>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">No recent activity in followed areas.</p>
                )}
              </div>

              {/* Latest Relevant Forum Posts */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-comments text-emerald-400"></i> Relevant Conversations
                </p>
                {relevantPosts.length > 0 ? (
                  relevantPosts.slice(0, 5).map(post => (
                    <div 
                      key={post.id} 
                      className="flex items-center justify-between p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 hover:bg-white transition-all cursor-pointer group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 truncate">{post.title}</p>
                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter">
                          {post.subject || post.yearGroup} • {post.replies.length} replies
                        </p>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-300 group-hover:translate-x-1 transition-transform ml-2"></i>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">No recent discussions in followed areas.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Staff Calendar Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-calendar-day text-indigo-600"></i>
                Staff Calendar
              </h3>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {currentMonth} {currentYear}
              </span>
            </div>

            <div className="space-y-4">
              {calendarEvents.map(event => (
                <div 
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg active:scale-95 ${
                    event.type === 'pd' 
                      ? 'bg-indigo-50 border-indigo-100 hover:border-indigo-500' 
                      : 'bg-rose-50 border-rose-100 hover:border-rose-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      event.type === 'pd' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {event.type === 'pd' ? 'PD Session' : 'Deadline'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{event.date}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-800 leading-tight">
                    {event.title}
                  </h4>
                  {event.type === 'pd' && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Click to View & Sign Up</span>
                      <i className="fa-solid fa-arrow-right text-[10px] text-indigo-400"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">
                Check PD Hub for more sessions
              </p>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white relative overflow-hidden h-fit flex flex-col">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-bullhorn text-indigo-200"></i>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Department Alerts</span>
                </div>
              </div>
              <h2 className="text-2xl font-black mb-4 leading-tight">Foundation Feed</h2>
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl mb-6 border border-white/10 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Announcements</span>
                    <span className="text-[9px] font-bold opacity-60">Just now</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-indigo-50">Sharing resources helps all our teachers grow! All uploads are instantly live.</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Curriculum Update</span>
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
