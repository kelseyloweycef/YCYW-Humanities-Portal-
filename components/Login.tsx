import React, { useState } from 'react';
import { User, UserRole, Subject } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const SCHOOL_OPTIONS = [
  "Hong Kong", 
  "Guangzhou", 
  "Chongqing", 
  "Tongxiang", 
  "Qingdao", 
  "Beijing", 
  "Puxi", 
  "Pudong"
];

// Mock list of already approved staff for demonstration purposes
const MOCK_APPROVED_STAFF = [
  { email: 'teacher@hk.ycef.com', name: 'Mister Teacher', school: 'Hong Kong', subjects: [Subject.HISTORY] },
  { email: 'staff@hk.ycef.com', name: 'Sarah Staff', school: 'Pudong', subjects: [Subject.GEOGRAPHY] }
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState(SCHOOL_OPTIONS[0]);
  const [primarySubject, setPrimarySubject] = useState(Subject.GENERAL);
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const domain = '@hk.ycef.com';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail.endsWith(domain)) {
      setError(`Please use your official ${domain} email address.`);
      return;
    }

    // Admin login with specific credentials
    if (trimmedEmail === 'kelsey.lowe@hk.ycef.com') {
      if (password === 'Camkel30') {
        onLogin({
          id: 'admin-1',
          email: 'kelsey.lowe@hk.ycef.com',
          name: 'Kelsey Lowe',
          role: UserRole.ADMIN,
          isApproved: true,
          avatar: 'https://picsum.photos/seed/kelsey/40/40',
          school: 'Hong Kong',
          subjectsTaught: [Subject.GENERAL],
          subscriptions: [],
          notifications: []
        });
        return;
      } else {
        setError("Invalid password for administrator account.");
        return;
      }
    }

    // Check mock approved staff (assuming password 'password' for demo purposes)
    const approvedUser = MOCK_APPROVED_STAFF.find(u => u.email === trimmedEmail);
    if (approvedUser) {
      if (password.length >= 6) {
        onLogin({
          id: `staff-${Math.random()}`,
          email: approvedUser.email,
          name: approvedUser.name,
          role: UserRole.STAFF,
          isApproved: true,
          avatar: `https://picsum.photos/seed/${approvedUser.name}/40/40`,
          school: approvedUser.school,
          subjectsTaught: approvedUser.subjects,
          subscriptions: [],
          notifications: []
        });
      } else {
        setError("Invalid password. Please enter at least 6 characters.");
      }
    } else {
      setError("Account not found or still pending admin approval. If you've just signed up, please wait for a Curriculum Officer to approve your access.");
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail.endsWith(domain)) {
      setError(`Please use your official ${domain} email address.`);
      return;
    }

    if (password.length < 6) {
      setError("Please choose a stronger password (min. 6 characters).");
      return;
    }

    if (trimmedEmail === 'kelsey.lowe@hk.ycef.com') {
      setError("This email is the primary administrator account. Please log in.");
      return;
    }

    setRequestSent(true);
  };

  if (requestSent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            <i className="fa-solid fa-envelope-circle-check"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-800">Request Sent</h1>
          <p className="text-slate-500 leading-relaxed">
            Your registration request for <strong>{email}</strong> has been sent to our Curriculum Officers. You will be able to log in once your account is approved.
          </p>
          <button 
            onClick={() => { setRequestSent(false); setMode('login'); setPassword(''); }}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
          >
            Back to Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-12">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-xl shadow-indigo-500/30 mb-4">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Staff Portal</h1>
          <p className="text-slate-500 text-sm">Official YCYW Humanities Resource Platform</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Log In
          </button>
          <button 
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <i className="fa-solid fa-circle-exclamation text-base"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-medium" 
                    placeholder="Jane Smith"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">School Campus</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-medium appearance-none cursor-pointer"
                    value={school}
                    onChange={e => setSchool(e.target.value)}
                  >
                    {SCHOOL_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Primary Subject Taught</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-medium appearance-none cursor-pointer"
                    value={primarySubject}
                    onChange={e => setPrimarySubject(e.target.value as Subject)}
                  >
                    {Object.values(Subject).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Work Email</label>
              <input 
                required
                type="email" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-medium" 
                placeholder="name@hk.ycef.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Password</label>
              <input 
                required
                type="password" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-medium" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all mt-2"
          >
            {mode === 'login' ? 'Sign In to Portal' : 'Register Account'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
            {mode === 'login' ? "Secure Staff Access" : "Accounts require manual approval by the Curriculum Officers (admin staff)."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;