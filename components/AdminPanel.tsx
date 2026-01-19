
import React, { useState, useRef } from 'react';
import { Resource, User, UserRole } from '../types';

interface AdminPanelProps {
  resources: Resource[];
  users: User[];
  onApproveResource: (id: string) => void;
  onDeleteResource: (id: string) => void;
  onApproveUser: (id: string, role: UserRole) => void;
  schoolLogo: string | null;
  onUpdateLogo: (logo: string | null) => void;
  appName: string;
  onUpdateAppName: (name: string) => void;
  onUserClick?: (name: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  resources, 
  users, 
  onApproveResource, 
  onDeleteResource, 
  onApproveUser, 
  schoolLogo, 
  onUpdateLogo, 
  appName,
  onUpdateAppName,
  onUserClick 
}) => {
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>({});
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleRoleChange = (userId: string, role: UserRole) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: role }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-slate-800">Pending Staff Requests</h2>
            <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs font-black uppercase">
              {users.length} Awaiting
            </span>
          </div>
          
          {users.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <i className="fa-solid fa-user-check text-slate-300 text-4xl mb-4"></i>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No pending account requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => onUserClick?.(user.name)}>
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                        <i className="fa-solid fa-user text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 hover:text-indigo-600 transition-colors">{user.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                        <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-0.5">
                          {user.school || 'Unspecified Campus'} • {user.subjectsTaught?.join(', ') || 'General Humanities'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                    <div className="flex-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Assign Role</label>
                      <select 
                        value={selectedRoles[user.id] || UserRole.STAFF}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value={UserRole.STAFF}>Staff Member</option>
                        <option value={UserRole.ADMIN}>Administrator</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => onApproveUser(user.id, selectedRoles[user.id] || UserRole.STAFF)}
                      className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95 transition-all h-[38px] flex items-center"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-slate-800">Platform Branding</h2>
            <i className="fa-solid fa-palette text-slate-300"></i>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 ml-1">App Name / Department Name</label>
              <div className="relative group">
                <i className="fa-solid fa-pen-nib absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
                <input 
                  type="text" 
                  value={appName}
                  onChange={(e) => onUpdateAppName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-black focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                  placeholder="e.g. YCYW Humanities"
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 pt-4 border-t border-slate-50">
              <div className={`w-32 h-32 rounded-[2rem] flex items-center justify-center shadow-inner overflow-hidden border-4 border-slate-50 ${schoolLogo ? 'bg-white' : 'bg-indigo-500 text-white'}`}>
                {schoolLogo ? (
                  <img src={schoolLogo} alt="Current School Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <i className="fa-solid fa-graduation-cap text-5xl"></i>
                )}
              </div>
              
              <div className="text-center">
                <h4 className="font-black text-slate-800">Department Identity Logo</h4>
                <p className="text-xs text-slate-500 mt-1">Upload your logo to update the sidebar and portal header.</p>
              </div>

              <div className="flex flex-col w-full gap-3">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={logoInputRef} 
                  onChange={handleLogoUpload} 
                />
                <button 
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  Upload New Logo
                </button>
                {schoolLogo && (
                  <button 
                    onClick={() => onUpdateLogo(null)}
                    className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="p-12 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
        <i className="fa-solid fa-bolt-lightning text-amber-400 text-4xl mb-4"></i>
        <h3 className="text-xl font-black text-slate-800">Instant Publishing is Active</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">All staff resources are now published immediately to the platform to foster rapid collaboration and sharing within the humanities department.</p>
      </div>
    </div>
  );
};

export default AdminPanel;
