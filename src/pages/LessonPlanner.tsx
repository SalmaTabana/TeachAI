import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { generateLessonPlan } from '../lib/api';
import type { LessonPlanOutput, StudentLevel } from '../lib/type';

export default function LessonPlanner() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: 'Science',
    grade: 'Grade 7',
    topic: 'Photosynthesis',
    duration: '45',
    objectives: '',
    level: 'Intermediate' as StudentLevel,
  });
  const [result, setResult] = useState<LessonPlanOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const data = await generateLessonPlan({
        subject: form.subject,
        grade_level: form.grade,
        topic: form.topic,
        duration_minutes: parseInt(form.duration) || 45,
        student_level: form.level,
        learning_objectives: form.objectives
          ? form.objectives.split('\n').map((s) => s.trim()).filter(Boolean)
          : null,
      });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left: Form */}
      <div className="w-full lg:w-80 xl:w-96 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex-shrink-0 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div>
              <h2 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lesson Planner</h2>
              <p className="text-xs text-slate-500">Configure your lesson details</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Subject', key: 'subject', type: 'select', options: ['Science', 'Mathematics', 'English', 'History', 'Geography', 'Art', 'Music', 'PE'] },
              { label: 'Grade Level', key: 'grade', type: 'select', options: ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'] },
              { label: 'Topic', key: 'topic', type: 'text', placeholder: 'e.g. Photosynthesis' },
              { label: 'Duration (minutes)', key: 'duration', type: 'number', placeholder: '45' },
              { label: 'Student Level', key: 'level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                {field.type === 'select' ? (
                  <select value={(form as any)[field.key]} onChange={e => setForm({...form, [field.key]: e.target.value})}
                    className="input-focus w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 appearance-none cursor-pointer">
                    {field.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={field.type || 'text'} value={(form as any)[field.key]}
                    onChange={e => setForm({...form, [field.key]: e.target.value})}
                    placeholder={(field as any).placeholder}
                    className="input-focus w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400" />
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Learning Objectives <span className="text-slate-400">(optional, one per line)</span></label>
              <textarea value={form.objectives} onChange={e => setForm({...form, objectives: e.target.value})}
                placeholder="What should students know by the end?"
                rows={3}
                className="input-focus w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 resize-none" />
            </div>
          </div>

          <button onClick={handleGenerate} disabled={loading}
            className="generate-btn w-full text-white font-bold py-3.5 rounded-2xl text-sm mt-5 flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                TeachAI is preparing your lesson ✨
              </>
            ) : (
              <><span>✨</span> Generate Lesson Plan</>
            )}
          </button>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5">
              <p className="font-semibold mb-1">Error</p>
              <p className="break-words">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {!result && !loading && !error ? (
          <EmptyState />
        ) : loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : result ? (
          <LessonDocument lesson={result} saved={saved} onSave={() => setSaved(true)} />
        ) : null}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center text-3xl mb-4">📚</div>
      <h3 className="text-lg font-bold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your lesson plan will appear here</h3>
      <p className="text-slate-400 text-sm max-w-xs">Fill in the lesson details on the left and click Generate to create a complete lesson plan.</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-3xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg">
        <span className="animate-spin">✨</span>
      </div>
      <h3 className="text-lg font-bold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI is preparing your lesson...</h3>
      <p className="text-slate-400 text-sm">Creating a complete, curriculum-aligned lesson plan</p>
      <div className="flex gap-1.5 mt-4">
        {[0,1,2].map(i => (
          <span key={i} className="thinking-dot w-2 h-2 bg-indigo-400 rounded-full block" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-3xl mb-4">⚠️</div>
      <h3 className="text-lg font-bold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Could not generate lesson</h3>
      <p className="text-slate-500 text-sm max-w-md break-words">{message}</p>
      <p className="text-slate-400 text-xs mt-4">
        Make sure the backend is running at <code className="bg-slate-100 px-1.5 py-0.5 rounded">http://localhost:8000</code>
      </p>
    </div>
  );
}

interface LessonDocumentProps {
  lesson: LessonPlanOutput;
  saved: boolean;
  onSave: () => void;
}

function LessonDocument({ lesson, saved, onSave }: LessonDocumentProps) {
  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto">
      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          AI Generated
        </span>
        <div className="flex items-center gap-2">
          {[
            { label: 'Edit', icon: '✏️' },
            { label: saved ? 'Saved ✓' : 'Save', icon: '💾', onClick: onSave },
            { label: 'Export PDF', icon: '📥' },
          ].map((a) => (
            <button key={a.label} onClick={(a as any).onClick}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
              <span>{a.icon}</span>{a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson document */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lesson.title}</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Objectives */}
          {lesson.objectives.length > 0 && (
            <>
              <Section icon="🎯" iconBg="bg-indigo-100" title="Learning Objectives">
                <ul className="space-y-2">
                  {lesson.objectives.map((o, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              </Section>
              <div className="border-t border-slate-100" />
            </>
          )}

          {/* Materials */}
          {lesson.materials.length > 0 && (
            <>
              <Section icon="📦" iconBg="bg-cyan-100" title="Materials">
                <div className="flex flex-wrap gap-2">
                  {lesson.materials.map((m, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
              </Section>
              <div className="border-t border-slate-100" />
            </>
          )}

          {/* Lesson Flow */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lesson Flow</h3>
            <div className="space-y-3">
              <FlowCard color="amber" icon="🌅" label="Warm-Up" content={lesson.warm_up} />
              <FlowCard
                color="violet"
                icon="📖"
                label="Main Activities"
                content={
                  <ol className="list-decimal ml-4 space-y-1.5">
                    {lesson.main_activities.map((a, i) => (
                      <li key={i} className="text-sm text-slate-600 leading-relaxed">{a}</li>
                    ))}
                  </ol>
                }
              />
              <FlowCard color="cyan" icon="📝" label="Assessment" content={lesson.assessment} />
              <FlowCard color="emerald" icon="✅" label="Closure" content={lesson.closure} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, iconBg, title, children }: { icon: string; iconBg: string; title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <span className={`w-6 h-6 ${iconBg} rounded-lg flex items-center justify-center text-xs`}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

const flowColors = {
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
} as const;

function FlowCard({ color, icon, label, content }: { color: keyof typeof flowColors; icon: string; label: string; content: ReactNode }) {
  const c = flowColors[color];
  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <span className={`text-sm font-bold ${c.text}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</span>
      </div>
      <div className="text-slate-700">
        {typeof content === 'string' ? <p className="text-sm leading-relaxed">{content}</p> : content}
      </div>
    </div>
  );
}