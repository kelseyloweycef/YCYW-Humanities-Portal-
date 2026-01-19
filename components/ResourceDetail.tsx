
import React, { useState, useRef } from 'react';
import { Resource, ResourceComment, User, ResourceFile, UserRole, ResourceType } from '../types';

interface ResourceDetailProps {
  resource: Resource;
  onClose: () => void;
  onAddComment: (resourceId: string, comment: ResourceComment) => void;
  onAddFiles: (resourceId: string, files: ResourceFile[]) => void;
  onApproveResource: (id: string) => void;
  onDeleteResource: (id: string) => void;
  currentUser: User;
  onUserClick?: (name: string) => void;
}

const ResourceDetail: React.FC<ResourceDetailProps> = ({ 
  resource, 
  onClose, 
  onAddComment, 
  onAddFiles, 
  onDeleteResource,
  currentUser, 
  onUserClick 
}) => {
  const [newComment, setNewComment] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isAuthor = currentUser.name === resource.author;
  const canModifyFiles = isAuthor || isAdmin;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: ResourceComment = {
      id: Math.random().toString(36).substr(2, 9),
      author: currentUser.name,
      content: newComment,
      date: 'Just now',
      isQuestion: isQuestion
    };

    onAddComment(resource.id, comment);
    setNewComment('');
    setIsQuestion(false);
  };

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newFiles: ResourceFile[] = filesArray.map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
        type: file.type.includes('presentation') || file.name.endsWith('.pptx') ? 'presentation' : 'document'
      }));
      onAddFiles(resource.id, newFiles);
    }
  };

  const handleDownload = (fileName: string) => {
    alert(`Downloading ${fileName}...`);
  };

  const handleSignUp = () => {
    setIsSignedUp(true);
    // Mock signup action: Add a comment automatically
    const comment: ResourceComment = {
      id: Math.random().toString(36).substr(2, 9),
      author: currentUser.name,
      content: "I've signed up for this Professional Development session! Looking forward to it.",
      date: 'Just now'
    };
    onAddComment(resource.id, comment);
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-10 duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <i className="fa-solid fa-arrow-left text-slate-600"></i>
          </button>
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              {resource.type === ResourceType.EXAM_PACKAGE ? 'Exam Package' : 
               resource.type === ResourceType.PROFESSIONAL_DEVELOPMENT ? 'PD Hub' : 'Resource Hub'}
            </span>
            <span className="text-[9px] font-bold text-indigo-500 uppercase mt-1 tracking-tighter">{resource.yearGroup} • {resource.subject}</span>
          </div>
          <div className="flex gap-2">
            {(isAdmin || isAuthor) && (
              <button 
                onClick={() => onDeleteResource(resource.id)}
                className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                title="Delete Resource"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <header>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm ${
                resource.type === ResourceType.ASSESSMENT ? 'bg-rose-100 text-rose-600' : 
                resource.type === ResourceType.LESSON_PLAN ? 'bg-emerald-100 text-emerald-600' : 
                resource.type === ResourceType.EXAM_PACKAGE ? 'bg-amber-500 text-white' :
                resource.type === ResourceType.COURSEWORK || resource.type === ResourceType.INTERNAL_ASSESSMENT ? 'bg-amber-100 text-amber-600' :
                resource.type === ResourceType.PROFESSIONAL_DEVELOPMENT ? 'bg-violet-600 text-white' :
                'bg-indigo-100 text-indigo-600'
              }`}>
                {resource.type}
              </span>
              {resource.type === ResourceType.PROFESSIONAL_DEVELOPMENT && (
                <button 
                  disabled={isSignedUp}
                  onClick={handleSignUp}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-md active:scale-95 ${
                    isSignedUp ? 'bg-emerald-50 text-emerald-600' : 'bg-violet-600 text-white hover:bg-violet-700'
                  }`}
                >
                  {isSignedUp ? <><i className="fa-solid fa-check mr-2"></i>Signed Up</> : 'Sign Up for Session'}
                </button>
              )}
            </div>
            
            <h2 className="text-3xl font-black text-slate-800 mb-4 leading-tight">{resource.title}</h2>
            
            {resource.examPaper && (
              <div className="bg-slate-900 p-4 rounded-2xl mb-6 flex items-center gap-4 text-white">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-file-signature"></i>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">Exam Identifier</p>
                  <p className="text-sm font-black uppercase tracking-widest">{resource.examPaper}</p>
                </div>
                <div className="ml-auto bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                  <span className="text-[10px] font-black uppercase">Standard Verified</span>
                </div>
              </div>
            )}

            <p className="text-slate-600 leading-relaxed mb-6 text-sm font-medium">{resource.description}</p>
            
            <button 
              onClick={() => onUserClick?.(resource.author)}
              className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-8 w-full text-left transition-all hover:bg-slate-100"
            >
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs font-black text-slate-400 shadow-sm overflow-hidden shrink-0">
                {resource.author[0]}
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Staff Contributor</p>
                <p className="text-sm font-bold text-slate-700">{resource.author}</p>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                <i className="fa-regular fa-calendar"></i>
                <span>{resource.date}</span>
              </div>
            </button>
          </header>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <i className={`fa-solid ${resource.type === ResourceType.EXAM_PACKAGE ? 'fa-box-archive text-amber-500' : 'fa-paperclip text-indigo-400'}`}></i>
                {resource.type === ResourceType.EXAM_PACKAGE ? 'Exam Paper & Mark Scheme' : 'Attached Files'}
              </h3>
              {canModifyFiles && (
                <>
                  <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileAdd} />
                  <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all">
                    <i className="fa-solid fa-plus mr-1"></i> Add Files
                  </button>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {resource.files.map(file => (
                <div key={file.id} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:bg-indigo-50 transition-colors">
                      <i className={`fa-solid ${file.type === 'presentation' ? 'fa-file-powerpoint text-orange-500' : 'fa-file-pdf text-rose-500'}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{file.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{file.size}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDownload(file.name)} className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-700 active:scale-90 transition-all shadow-lg shadow-indigo-100 group">
                    <i className="fa-solid fa-download group-hover:animate-bounce"></i>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6 pt-8 border-t border-slate-100 pb-20">
            <h3 className="text-lg font-black text-slate-800">Staff Discussion</h3>
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <div className="relative">
                <textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 transition-all shadow-inner" placeholder="Ask about moderation or content queries..." value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>
                <div className="absolute bottom-4 right-4 flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600" checked={isQuestion} onChange={e => setIsQuestion(e.target.checked)} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Question?</span>
                  </label>
                  <button type="submit" className="bg-indigo-600 text-white p-2 w-12 h-12 rounded-2xl shadow-lg active:scale-90 transition-all"><i className="fa-solid fa-paper-plane"></i></button>
                </div>
              </div>
            </form>

            <div className="space-y-4">
              {resource.comments.map(c => (
                <div key={c.id} className={`p-6 rounded-[2rem] border ${c.isQuestion ? 'bg-amber-50/50 border-amber-100' : 'bg-white border-slate-100'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-300 overflow-hidden shrink-0">
                        {c.author[0]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-700">{c.author}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{c.date}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{c.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
