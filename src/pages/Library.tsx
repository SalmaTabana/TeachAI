import { useEffect, useState } from 'react';
import { getResources, deleteResource, type LibraryResource } from '../lib/api';

const TABS = ['All', 'Lessons', 'Quizzes', 'Worksheets', 'Activities'];

const colorMap: Record<string, { badge: string; bg: string }> = {
  indigo: { badge: 'bg-indigo-100 text-indigo-700', bg: 'bg-indigo-50' },
  violet: { badge: 'bg-violet-100 text-violet-700', bg: 'bg-violet-50' },
  cyan: { badge: 'bg-cyan-100 text-cyan-700', bg: 'bg-cyan-50' },
  emerald: { badge: 'bg-emerald-100 text-emerald-700', bg: 'bg-emerald-50' },
};

export default function Library() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [gradeFilter, setGradeFilter] = useState('All Grades');
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResources = () => {
    setLoading(true);
    getResources().then(setResources).catch(() => setResources([])).finally(() => setLoading(false));
  };

  useEffect(loadResources, []);

  const filtered = resources.filter(r => {
    const matchTab = tab === 'All' || r.type === tab.slice(0, -1) || (tab === 'Worksheets' && r.type === 'Worksheet') || (tab === 'Activities' && r.type === 'Activity') || (tab === 'Lessons' && r.type === 'Lesson') || (tab === 'Quizzes' && r.type === 'Quiz');
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === 'All Subjects' || r.subject === subjectFilter;
    const matchGrade = gradeFilter === 'All Grades' || r.grade === gradeFilter;
    return matchTab && matchSearch && matchSubject && matchGrade;
  });

  return (
    <div className="p-4 lg:p-6 space-y-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="input-focus w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400" />
        </div>
        <div className="flex gap-2">
          <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}
            className="input-focus text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 appearance-none cursor-pointer">
            {['All Subjects', ...Array.from(new Set(resources.map(r => r.subject).filter(Boolean)))].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}
            className="input-focus text-sm px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 appearance-none cursor-pointer">
            {['All Grades', ...Array.from(new Set(resources.map(r => r.grade).filter(Boolean)))].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              tab === t ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {resources.filter(r => t === 'All' || r.type === t.slice(0, -1) || (t === 'Worksheets' && r.type === 'Worksheet') || (t === 'Activities' && r.type === 'Activity')).length}
            </span>
          </button>
        ))}
      </div>

      {/* Resources grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-base font-bold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No resources found</h3>
          <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => {
            const c = colorMap[r.color] || colorMap.indigo;
            return (
              <div key={r.id} className="card-hover bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center text-xl`}>{r.icon}</div>
                    <span className={`text-xs font-semibold ${c.badge} px-2.5 py-1 rounded-full`}>{r.type}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{r.grade} · {r.subject}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="border-t border-slate-100 px-5 py-2.5 flex justify-between">
                  {['Open', 'Edit', 'Duplicate', 'Delete'].map((a, i) => (
                    <button key={a}
                      onClick={async () => { if (a === 'Delete') { await deleteResource(r.id); loadResources(); } }}
                      className={`text-xs font-medium px-2 py-1 rounded-lg transition-all ${
                        a === 'Delete' ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
                        : a === 'Open' ? 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                      }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
