
import React, { useState } from 'react';
import { ForumPost, YearGroup, Subject, User } from '../types';

interface ForumProps {
  posts: ForumPost[];
  setPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  onReplyToPost?: (postId: string, content: string) => void;
  currentUser: User;
  contextYear?: YearGroup;
  contextSubject?: Subject;
  onUserClick?: (name: string) => void;
}

const Forum: React.FC<ForumProps> = ({ posts, setPosts, onReplyToPost, currentUser, contextYear, contextSubject, onUserClick }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const filteredPosts = posts.filter(post => {
    if (contextYear) return post.yearGroup === contextYear;
    if (contextSubject) return post.subject === contextSubject;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const post: ForumPost = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      content: newContent,
      author: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      replies: [],
      yearGroup: contextYear,
      subject: contextSubject
    };
    setPosts(prev => [post, ...prev]);
    setNewTitle('');
    setNewContent('');
    setIsPosting(false);
  };

  const handleReplyInternal = (postId: string, content: string) => {
    if (!content.trim()) return;
    if (onReplyToPost) {
      onReplyToPost(postId, content);
    } else {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, { id: Math.random().toString(36).substr(2, 9), author: currentUser.name, content, date: 'Just now' }]
          };
        }
        return post;
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-1">
            {contextYear ? `${contextYear} Discussion` : contextSubject ? `${contextSubject} Discussion` : 'Staff Discussions'}
          </h2>
          <p className="text-xs opacity-80 uppercase font-bold tracking-widest">Share knowledge and collaborate with the team.</p>
        </div>
        <button onClick={() => setIsPosting(true)} className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-md active:scale-95">New Topic</button>
      </div>

      {isPosting && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-1 ml-1 tracking-widest">Topic Title</label>
            <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="What's on your mind?" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-1 ml-1 tracking-widest">Description</label>
            <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Provide some details..." value={newContent} onChange={(e) => setNewContent(e.target.value)} required></textarea>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setIsPosting(false)} className="px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">Post Topic</button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <i className="fa-solid fa-comments text-slate-200 text-5xl mb-4 block"></i>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No discussions started here yet.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => onUserClick?.(post.author)}
                  className="flex items-center gap-3 text-left group"
                >
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center font-bold text-xs overflow-hidden group-hover:bg-indigo-100 transition-colors">
                    {post.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{post.author}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{post.date}</p>
                  </div>
                </button>
                {(post.yearGroup || post.subject) && (
                  <div className="ml-auto flex gap-2">
                    {post.yearGroup && <span className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase px-2 py-1 rounded border border-slate-100 tracking-tighter">{post.yearGroup}</span>}
                    {post.subject && <span className="bg-indigo-50 text-indigo-400 text-[10px] font-black uppercase px-2 py-1 rounded border border-indigo-100 tracking-tighter">{post.subject}</span>}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{post.title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed text-sm font-medium">{post.content}</p>
              
              <div className="space-y-4 border-t border-slate-50 pt-6">
                {post.replies.map(reply => (
                  <div key={reply.id} className="bg-slate-50 p-5 rounded-2xl ml-8 border-l-4 border-indigo-500 relative">
                    <button 
                      onClick={() => onUserClick?.(reply.author)}
                      className="flex items-center gap-2 mb-2 text-left group"
                    >
                      <span className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{reply.author}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{reply.date}</span>
                    </button>
                    <p className="text-sm text-slate-600 font-medium">{reply.content}</p>
                  </div>
                ))}
                
                <form className="flex gap-2 ml-8 pt-4" onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.elements.namedItem('reply') as HTMLInputElement; handleReplyInternal(post.id, input.value); input.value = ''; }}>
                  <input name="reply" type="text" placeholder="Write a response..." className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" required />
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">Reply</button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Forum;
