import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getDashboard, type DashboardData } from '../lib/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(setData).catch(() => {}).finally(() => setDashboardLoading(false));
  }, []);

  const quickActions = [
    { label: 'Lesson Plan', path: '/lesson-planner', icon: '📚', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
    { label: 'Quiz', path: '/quiz-generator', icon: '❓', color: 'bg-violet-100 text-violet-700 hover:bg-violet-200' },
    { label: 'Worksheet', path: '/worksheet-generator', icon: '📄', color: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' },
    { label: 'Activity', path: '/activities', icon: '🎯', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  ];

  const stats = [
    { label: 'Lessons Created', value: data?.stats.lessons_created ?? 0, icon: '📚', change: 'Saved to your library', color: 'indigo' },
    { label: 'Quizzes Generated', value: data?.stats.quizzes_generated ?? 0, icon: '❓', change: 'Saved to your library', color: 'violet' },
    { label: 'Worksheets', value: data?.stats.worksheets ?? 0, icon: '📄', change: 'Saved to your library', color: 'cyan' },
    { label: 'Activities', value: data?.stats.activities ?? 0, icon: '🎯', change: 'Saved to your library', color: 'emerald' },
  ];

  const colorMap: Record<string, { stat: string; badge: string; bg: string }> = {
    indigo: { stat: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700', bg: 'bg-indigo-50' },
    violet: { stat: 'text-violet-600', badge: 'bg-violet-100 text-violet-700', bg: 'bg-violet-50' },
    cyan: { stat: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700', bg: 'bg-cyan-50' },
    emerald: { stat: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', bg: 'bg-emerald-50' },
  };

  const handleAIPrompt = () => {
    if (prompt.trim()) navigate('/ai-assistant');
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Good morning, {user?.name?.split(' ')[0] || 'Sarah'} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Let's make today's teaching easier.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Hero AI Card */}
      <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #1e40af 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-400/10 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              What can I help you teach today?
            </h2>
          </div>
          <p className="text-indigo-200 text-sm mb-6">Create lessons, quizzes, activities and more with AI.</p>

          <div className="flex gap-2 items-center bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
            </svg>
            <input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAIPrompt()}
              placeholder="Ask AI to create something for your classroom..."
              className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none"
            />
            <button onClick={handleAIPrompt}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-xs font-medium transition-colors">
              Generate
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickActions.map(a => (
              <Link key={a.label} to={a.path}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5">
                <span>{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const c = colorMap[s.color];
          return (
            <div key={s.label} className="card-hover bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
              <div className={`text-3xl font-black ${c.stat} mb-0.5`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div className="text-sm font-medium text-slate-700">{s.label}</div>
              <div className={`text-xs ${c.badge} mt-2 inline-block px-2 py-0.5 rounded-full font-medium`}>{s.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Work */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Work</h3>
            <Link to="/library" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {dashboardLoading ? <div className="px-5 py-8 text-sm text-slate-400">Loading your recent work...</div> : (data?.recent_work ?? []).length === 0 ? <div className="px-5 py-8 text-sm text-slate-400">No saved resources yet. Generate a lesson, quiz, worksheet, or activity to see it here.</div> : (data?.recent_work ?? []).map(item => {
              const c = colorMap[item.color];
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.grade} · {item.subject}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>{item.type}</span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 hover:bg-indigo-50 rounded-lg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insight */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-indigo-700">AI Teaching Insight</span>
            </div>
            <p className="text-sm font-bold text-slate-900 mb-2 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {data?.student_insight?.has_data ? data.student_insight.summary : "No student insight yet."}
            </p>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              <span className="font-medium text-violet-700">Suggested Action:</span>{' '}
              {data?.student_insight?.has_data
                ? data.student_insight.recommendation
                : "Run a Student Performance analysis to generate personalized insights."}
            </p>
            <Link to="/student-insights"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white rounded-lg px-3 py-2 border border-indigo-100 hover:border-indigo-200 transition-all">
              View Student Insights →
            </Link>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Quick Create</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(a => (
                <Link key={a.label} to={a.path}
                  className={`${a.color} flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-semibold transition-all`}>
                  <span className="text-xl">{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
