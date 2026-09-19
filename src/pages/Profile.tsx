import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const stats = [
    { label: 'Lessons Created', value: 24, icon: '📚', color: 'indigo' },
    { label: 'Quizzes Created', value: 18, icon: '❓', color: 'violet' },
    { label: 'Activities Created', value: 31, icon: '🎯', color: 'emerald' },
    { label: 'Students Helped', value: 86, icon: '👥', color: 'cyan' },
  ];

  const badges = [
    { label: 'Early Adopter', icon: '🌟', desc: 'Joined in the first 1,000' },
    { label: 'Lesson Master', icon: '📚', desc: 'Created 20+ lesson plans' },
    { label: 'Quiz Champion', icon: '🏆', desc: 'Generated 15+ quizzes' },
    { label: 'AI Explorer', icon: '🤖', desc: 'Used all AI features' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Profile card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              SA
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)}
                className="text-sm font-semibold text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors">
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button onClick={handleLogout}
                className="text-sm font-medium text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
                Logout
              </button>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              {[
                { label: 'Full Name', val: user?.name || 'Sarah Ahmed' },
                { label: 'Email', val: user?.email || 'sarah.ahmed@school.edu' },
                { label: 'School', val: 'Riverside Elementary School' },
                { label: 'Subject', val: 'Science' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                  <input defaultValue={f.val}
                    className="input-focus w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900" />
                </div>
              ))}
              <button className="btn-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm" onClick={() => setEditing(false)}>
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-900 mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {user?.name || 'Sarah Ahmed'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {user?.email || 'sarah.ahmed@school.edu'}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  Riverside Elementary School
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">{user?.role || 'Teacher'}</span>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Active
                </span>
                <span className="text-xs text-slate-400">Member since Jan 2025</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const colorCls = { indigo: 'bg-indigo-50 text-indigo-600', violet: 'bg-violet-50 text-violet-600', emerald: 'bg-emerald-50 text-emerald-600', cyan: 'bg-cyan-50 text-cyan-600' }[s.color];
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
              <div className={`w-12 h-12 ${colorCls?.split(' ')[0]} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3`}>{s.icon}</div>
              <div className="text-3xl font-black text-slate-900 mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-900 text-base mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map(b => (
            <div key={b.label} className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">{b.icon}</div>
              <p className="text-xs font-bold text-slate-800 mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.label}</p>
              <p className="text-xs text-slate-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-900 text-base mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Quick Links</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'My Library', path: '/library' },
            { label: 'Settings', path: '/settings' },
            { label: 'Student Insights', path: '/student-insights' },
          ].map(l => (
            <Link key={l.label} to={l.path}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 px-4 py-2 rounded-xl transition-colors hover:bg-indigo-50">
              {l.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
