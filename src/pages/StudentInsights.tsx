import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { getStudentInsights, type StudentInsightsData } from '../lib/api';

const colorMap: Record<string, { bar: string; text: string; bg: string }> = {
  emerald: { bar: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  indigo: { bar: 'bg-indigo-400', text: 'text-indigo-700', bg: 'bg-indigo-50' },
  amber: { bar: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50' },
  rose: { bar: 'bg-rose-400', text: 'text-rose-700', bg: 'bg-rose-50' },
  cyan: { bar: 'bg-cyan-400', text: 'text-cyan-700', bg: 'bg-cyan-50' },
  violet: { bar: 'bg-violet-400', text: 'text-violet-700', bg: 'bg-violet-50' },
};

const statusConfig: Record<string, { label: string; cls: string }> = {
  excellent: { label: 'Excellent', cls: 'bg-emerald-100 text-emerald-700' },
  good: { label: 'On Track', cls: 'bg-blue-100 text-blue-700' },
  support: { label: 'Needs Support', cls: 'bg-amber-100 text-amber-700' },
  urgent: { label: 'Urgent', cls: 'bg-rose-100 text-rose-700' },
};

function severityStyle(severity: string) {
  if (severity === 'high') return { label: 'High', cls: 'bg-rose-100 text-rose-700', color: 'rose' };
  if (severity === 'moderate') return { label: 'Moderate', cls: 'bg-amber-100 text-amber-700', color: 'amber' };
  return { label: 'Low', cls: 'bg-emerald-100 text-emerald-700', color: 'emerald' };
}

export default function StudentInsights() {
  const [data, setData] = useState<StudentInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStudentInsights()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load student insights.'))
      .finally(() => setLoading(false));
  }, []);

  const concepts = data?.concepts ?? [];
  const maxScore = useMemo(() => Math.max(...concepts.map(c => c.score), 100), [concepts]);

  if (loading) {
    return <div className="p-6 text-sm text-slate-400">Loading your student insights...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-rose-600">{error}</div>;
  }

  if (!data?.has_data) {
    return (
      <div className="p-4 lg:p-6 space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            No student analysis yet
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
            Generate a Student Performance analysis first. Once you analyze your students, the results will appear here automatically.
          </p>
          <Link to="/student-insights" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-indigo-700">
            Refresh Insights
          </Link>
        </div>
      </div>
    );
  }

  const avgScore = data.class_average;
  const needSupport = data.students_needing_support;
  const hardest = concepts.length ? concepts[0] : null;

  return (
    <div className="p-4 lg:p-6 space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Class Average', value: `${avgScore}%`, icon: '📊', change: data.assessment_name || 'Latest assessment', color: 'indigo', subtext: `${data.total_students} students assessed` },
          { label: 'Need Support', value: `${needSupport}`, icon: '⚠️', change: needSupport > 0 ? 'Needs attention' : 'No immediate concern', color: 'amber', subtext: 'students at 40% or below' },
          { label: 'Hardest Topic', value: hardest?.concept || '—', icon: '📉', change: hardest ? `${hardest.score}% estimated score` : 'No topic data', color: 'rose', subtext: 'Based on latest analysis' },
          { label: 'Concepts Analyzed', value: `${concepts.length}`, icon: '📈', change: data.subject || 'Latest results', color: 'emerald', subtext: data.grade_level || 'Current class' },
        ].map(s => {
          const c = { indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100', amber: 'bg-amber-50 text-amber-600 border-amber-100', rose: 'bg-rose-50 text-rose-600 border-rose-100', emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100' }[s.color];
          return (
            <div key={s.label} className={`rounded-2xl border p-5 ${c?.split(' ').slice(0,1).join(' ')} ${c?.split(' ').slice(2).join(' ')} bg-white border-slate-100`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black text-slate-900 mb-0.5 truncate" title={s.value} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div className="text-xs font-medium text-slate-600">{s.label}</div>
              <div className="text-xs text-slate-400 mt-1 truncate">{s.subtext}</div>
              <div className={`text-xs font-medium mt-2 px-2 py-0.5 rounded-full inline-block ${{ indigo: 'bg-indigo-100 text-indigo-700', amber: 'bg-amber-100 text-amber-700', rose: 'bg-rose-100 text-rose-700', emerald: 'bg-emerald-100 text-emerald-700' }[s.color]}`}>{s.change}</div>
            </div>
          );
        })}
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">✨</span>
            <span className="text-sm font-bold text-indigo-200">AI Teaching Insight</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {data.summary}
          </h3>
          {data.recommendation && (
            <p className="text-indigo-200 text-sm mb-4">
              <span className="font-semibold text-white">Suggested Action:</span> {data.recommendation}
            </p>
          )}
          <Link to="/activities" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors">
            Create Practice Activity →
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Topic performance */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Topic Performance</h3>
            <span className="text-xs text-slate-400">{data.assessment_name || 'Latest analysis'}</span>
          </div>
          <div className="space-y-4">
            {concepts.map(t => {
              const c = colorMap[t.color] || colorMap.indigo;
              return (
                <div key={t.concept}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{t.concept}</span>
                    <span className={`text-xs font-bold ${c.text}`}>{t.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bar} rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, Math.max(0, (t.score / maxScore) * 100))}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest analysis details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 text-base mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Latest Analysis</h3>
          <div className="space-y-3">
            {data.insights.map(insight => {
              const severity = severityStyle(insight.severity);
              return (
                <div key={insight.concept} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className="text-sm font-semibold text-slate-800">{insight.concept}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severity.cls}`}>{severity.label}</span>
                  </div>
                  <p className="text-xs text-slate-500">{insight.students_struggling} student(s) struggling</p>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{insight.recommendation}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance details */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Student Performance Insights</h3>
            <p className="text-xs text-slate-400 mt-1">Generated from your latest student-performance analysis.</p>
          </div>
          <span className="text-xs text-slate-400">{data.subject} · {data.grade_level}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Concept</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Estimated Score</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Students Struggling</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {concepts.map((c) => {
                const severity = severityStyle(c.severity);
                return (
                  <tr key={c.concept} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{c.concept}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-700">{c.score}%</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.students_struggling}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${severity.cls}`}>{severity.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
