
import React, { useState, useRef } from 'react';
import { User, Subject, UserRole } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  isOwnProfile: boolean;
  onUpdate?: (updatedUser: User) => void;
}

const SCHOOL_OPTIONS = [
  "Hong Kong", "Guangzhou", "Chongqing", "Tongxiang", "Qingdao", "Beijing", "Puxi", "Pudong"
];

// Fix: Destructured onUpdate instead of onAddUpdate to align with ProfileModalProps interface.
const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, isOwnProfile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    // Fix: Updated to use onUpdate.
    if (onUpdate) onUpdate(editedUser);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSubject = (sub: Subject) => {
    const currentSubs = editedUser.subjectsTaught || [];
    const newSubs = currentSubs.includes(sub)
      ? currentSubs.filter(s => s !== sub)
      : [...currentSubs, sub];
    setEditedUser({ ...editedUser, subjectsTaught: newSubs });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-slate-900 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[2rem] bg-indigo-500 border-4 border-white/20 overflow-hidden flex items-center justify-center text-3xl font-black">
                {editedUser.avatar ? (
                  <img src={editedUser.avatar} alt={editedUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{editedUser.name[0]}</span>
                )}
              </div>
              {isOwnProfile && isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fa-solid fa-camera text-xl"></i>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </button>
              )}
            </div>
            
            <div className="text-center">
              {isEditing ? (
                <input 
                  className="bg-white/10 border-b-2 border-indigo-400 text-center text-2xl font-black focus:outline-none w-full px-2"
                  value={editedUser.name}
                  onChange={e => setEditedUser({...editedUser, name: e.target.value})}
                />
              ) : (
                <h2 className="text-2xl font-black">{user.name}</h2>
              )}
              <p className="text-indigo-300 text-xs font-black uppercase tracking-[0.2em] mt-1">
                {user.role} • {user.school}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">School</label>
              {isEditing ? (
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                  value={editedUser.school}
                  onChange={e => setEditedUser({...editedUser, school: e.target.value})}
                >
                  {SCHOOL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <p className="text-sm font-bold text-slate-700">{user.school}</p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Work Email</label>
              {isEditing ? (
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                  value={editedUser.email}
                  readOnly
                />
              ) : (
                <p className="text-sm font-bold text-slate-700">{user.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Subjects Taught</label>
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                Object.values(Subject).map(sub => (
                  <button
                    key={sub}
                    onClick={() => toggleSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border ${
                      editedUser.subjectsTaught?.includes(sub)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))
              ) : (
                user.subjectsTaught?.map(sub => (
                  <span key={sub} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase border border-indigo-100">
                    {sub}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
            {isOwnProfile ? (
              isEditing ? (
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setIsEditing(false); setEditedUser({...user}); }}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-user-pen"></i>
                  Edit My Profile
                </button>
              )
            ) : (
              <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-3">
                <i className="fa-solid fa-envelope text-indigo-400"></i>
                <p className="text-xs font-bold text-indigo-600">Contact via email: {user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
