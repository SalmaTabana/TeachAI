import { useState } from 'react';
import { useNavigate } from 'react-router';
import { generateWorksheet } from '../lib/api';
import type { Difficulty, WorksheetOutput } from '../lib/type';

export default function WorksheetGenerator() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: 'Science', grade: 'Grade 7', topic: 'Photosynthesis', difficulty: 'Medium' as Difficulty, count: '5' });
  const [result, setResult] = useState<WorksheetOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await generateWorksheet({
        subject: form.subject,
        grade_level: form.grade,
        topic: form.topic,
        difficulty: form.difficulty,
        number_of_questions: parseInt(form.count) || 5,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full lg:w-80 xl:w-96 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex-shrink-0 overflow-y-auto p-5">
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">←</button>
          <div><h2 className="font-bold text-slate-900 text-base">Worksheet Generator</h2><p className="text-xs text-slate-500">Configure your worksheet</p></div>
        </div>
        <div className="space-y-4">
          <Field label="Subject" value={form.subject} options={['Science', 'Mathematics', 'English', 'History', 'Geography']} onChange={value => update('subject', value)} />
          <Field label="Grade Level" value={form.grade} options={['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10']} onChange={value => update('grade', value)} />
          <label className="block text-sm font-medium text-slate-700">Topic<input value={form.topic} onChange={event => update('topic', event.target.value)} className="input-focus mt-1.5 w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm" /></label>
          <Field label="Difficulty" value={form.difficulty} options={['Easy', 'Medium', 'Hard', 'Mixed']} onChange={value => update('difficulty', value)} />
          <Field label="Number of Questions" value={form.count} options={['5', '10', '15', '20']} onChange={value => update('count', value)} />
        </div>
        <button onClick={handleGenerate} disabled={loading} className="generate-btn w-full text-white font-bold py-3.5 rounded-2xl text-sm mt-5 disabled:opacity-70">
          {loading ? 'Generating Worksheet...' : '✨ Generate Worksheet'}
        </button>
        {error && <p className="mt-3 text-xs text-red-600 break-words">{error}</p>}
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-50 p-5 lg:p-8">
        {!result && !loading && !error && <EmptyState />}
        {loading && <EmptyState message="TeachAI is preparing your worksheet..." />}
        {result && <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">✓ AI Generated</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">{result.title}</h1>
          <p className="text-sm text-slate-600 mt-2">{result.instructions}</p>
          <ol className="mt-6 space-y-4 list-decimal list-inside">
            {result.problems.map((problem, index) => <li key={index} className="text-sm text-slate-800 border-b border-slate-100 pb-4">{problem.prompt}{problem.answer && <p className="text-xs text-emerald-700 mt-1 ml-5">Answer: {problem.answer}</p>}</li>)}
          </ol>
        </div>}
      </div>
    </div>
  );
}

function Field({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<select value={value} onChange={event => onChange(event.target.value)} className="input-focus mt-1.5 w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm">{options.map(option => <option key={option}>{option}</option>)}</select></label>;
}

function EmptyState({ message = 'Your worksheet will appear here' }: { message?: string }) {
  return <div className="flex flex-col items-center justify-center h-full text-center"><div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center text-3xl mb-4">📝</div><h3 className="text-lg font-bold text-slate-700">{message}</h3><p className="text-slate-400 text-sm mt-2">Configure the worksheet and generate it with TeachAI.</p></div>;
}
