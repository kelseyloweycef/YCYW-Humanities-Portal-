
import React from 'react';
import { Notification, User } from '../types';

interface InboxProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (notif: Notification) => void;
}

const Inbox: React.FC<InboxProps> = ({ isOpen, onClose, user, onMarkRead, onClearAll, onNavigate }) => {
  if (!isOpen) return null;

  const unreadCount = user.notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-10 duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <i className="fa-solid fa-arrow-left text-slate-600"></i>
            </button>
            <h2 className="text-xl font-black text-slate-800">Your Inbox</h2>
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          {user.notifications.length > 0 && (
            <button 
              onClick={onClearAll}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {user.notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-envelope-open text-slate-200 text-3xl"></i>
              </div>
              <h3 className="font-bold text-slate-800">Inbox Empty</h3>
              <p className="text-sm text-slate-400 mt-1">We'll notify you here when someone interacts with your posts or comments.</p>
            </div>
          ) : (
            user.notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => onNavigate(notif)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${
                  notif.isRead 
                    ? 'bg-white border-slate-100 opacity-75' 
                    : 'bg-indigo-50/50 border-indigo-100 shadow-sm hover:border-indigo-300'
                }`}
              >
                {!notif.isRead && (
                  <span className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                )}
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'comment' ? 'bg-emerald-100 text-emerald-600' : 
                    notif.type === 'reply' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <i className={`fa-solid ${
                      notif.type === 'comment' ? 'fa-comment-dots' : 
                      notif.type === 'reply' ? 'fa-reply-all' : 'fa-bell'
                    }`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter mb-1">
                      {notif.authorName} • {notif.timestamp}
                    </p>
                    <p className="text-sm font-bold text-slate-800 leading-snug truncate group-hover:text-indigo-600">
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {notif.message}
                    </p>
                  </div>
                </div>
                {!notif.isRead && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead(notif.id);
                    }}
                    className="mt-3 text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
