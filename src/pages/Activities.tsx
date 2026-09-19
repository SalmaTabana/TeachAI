import { useState } from 'react';
import { useNavigate } from 'react-router';
import { generateActivity } from '../lib/api';
import type { ActivityOutput, ActivityType } from '../lib/type';

const ACTIVITY_TYPES = ['Group Activity', 'Discussion', 'Game', 'Problem Solving', 'Creative Activity'];

export default function Activities() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: 'Science', grade: 'Grade 7', topic: 'Photosynthesis', duration: '30', type: 'Group Activity' });
  const [result, setResult] = useState<ActivityOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await generateActivity({
        subject: form.subject,
        grade_level: form.grade,
        duration_minutes: parseInt(form.duration) || 30,
        topic: form.topic,
        activity_type: form.type as ActivityType,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left */}
      <div className="w-full lg:w-80 xl:w-96 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex-shrink-0 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div>
              <h2 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Activity Generator</h2>
              <p className="text-xs text-slate-500">Create engaging classroom activities</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Subject', key: 'subject', options: ['Science', 'Mathematics', 'English', 'History', 'Geography', 'Art'] },
              { label: 'Grade Level', key: 'grade', options: ['Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'] },
              { label: 'Duration (minutes)', key: 'duration', options: ['15','20','30','45','60'] },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                <select value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                  className="input-focus w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 appearance-none">
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic</label>
              <input value={form.topic} onChange={e => setForm({...form, topic: e.target.value})}
                className="input-focus w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Activity Type</label>
              <div className="grid grid-cols-1 gap-1.5">
                {ACTIVITY_TYPES.map(t => (
                  <button key={t} onClick={() => setForm({...form, type: t})}
                    className={`text-left text-sm px-3.5 py-2.5 rounded-xl border transition-all font-medium ${
                      form.type === t
                        ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleGenerate}
            disabled={loading}
            className="generate-btn w-full text-white font-bold py-3.5 rounded-2xl text-sm mt-5 flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Activity...</>
            ) : (
              <><span>✨</span> Generate Activity</>
            )}
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {!result && !loading && !error ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your activity will appear here</h3>
            <p className="text-slate-400 text-sm max-w-xs">Choose an activity type and configure the settings to generate an engaging classroom activity.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg animate-pulse">🎯</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI is designing your activity ✨</h3>
            <div className="flex gap-1.5 mt-4">
              {[0,1,2].map(i => (
                <span key={i} className="thinking-dot w-2 h-2 bg-emerald-400 rounded-full block" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-3xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Could not generate activity</h3>
            <p className="text-slate-500 text-sm max-w-md break-words">{error}</p>
          </div>
        ) : (
          <div className="p-5 lg:p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">✓ AI Generated</span>
              <div className="flex gap-2">
                {['✏️ Edit', '💾 Save', '📥 Export'].map(a => (
                  <button key={a} className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white px-3 py-1.5 rounded-lg transition-all">{a}</button>
                ))}
              </div>
            </div>

            {/* Activity card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 p-6 text-white">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🎭</div>
                  <div>
                    <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{result?.title}</h1>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">{form.type}</span>
                      <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">⏱ {form.duration} minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Goal */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">🎯 Goal</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{result?.overview}</p>
                </div>

                {/* Materials */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>📦 Materials Needed</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {result?.materials.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>📋 Instructions</h3>
                  <div className="space-y-3">
                    {result?.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 leading-relaxed">{instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Outcome */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">🏆 Learning Outcome</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{result?.wrap_up}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
