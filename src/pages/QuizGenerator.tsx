import { useState } from 'react';
import { useNavigate } from 'react-router';
import { generateQuiz } from '../lib/api';

type QuizCard = {
  id: number;
  difficulty: string;
  type: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export default function QuizGenerator() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ subject: 'Science', grade: 'Grade 7', topic: 'Photosynthesis', difficulty: 'Mixed', count: '5', type: 'Multiple Choice' });
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const diffBadge: Record<string, string> = {
    'Easy': 'bg-emerald-100 text-emerald-700',
    'Medium': 'bg-amber-100 text-amber-700',
    'Hard': 'bg-rose-100 text-rose-700',
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
              <h2 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Quiz Generator</h2>
              <p className="text-xs text-slate-500">Configure your quiz</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Subject', key: 'subject', type: 'select', options: ['Science', 'Mathematics', 'English', 'History', 'Geography'] },
              { label: 'Grade Level', key: 'grade', type: 'select', options: ['Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10'] },
              { label: 'Topic', key: 'topic', type: 'text', placeholder: 'e.g. Photosynthesis' },
              { label: 'Difficulty', key: 'difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard', 'Mixed'] },
              { label: 'Number of Questions', key: 'count', type: 'select', options: ['5','10','15','20'] },
              { label: 'Question Type', key: 'type', type: 'select', options: ['Multiple Choice', 'True/False', 'Short Answer', 'Mixed'] },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                {f.type === 'select' ? (
                  <select value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                    className="input-focus w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 appearance-none cursor-pointer">
                    {f.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                    placeholder={(f as any).placeholder}
                    className="input-focus w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400" />
                )}
              </div>
            ))}
          </div>

          <button onClick={async () => {
            setLoading(true);
            setError(null);
            setShowAnswers(false);
            setSelectedAnswers({});
            try {
              const result = await generateQuiz({
                subject: form.subject,
                grade_level: form.grade,
                topic: form.topic,
                difficulty: form.difficulty,
                number_of_questions: parseInt(form.count) || 5,
                question_type: form.type,
              });
              setQuiz(result.questions.map((question, index) => ({
                id: index + 1,
                difficulty: form.difficulty === 'Mixed' ? 'Medium' : form.difficulty,
                type: form.type,
                question: question.question,
                options: question.options ?? [question.correct_answer],
                correct: Math.max(0, (question.options ?? [question.correct_answer]).indexOf(question.correct_answer)),
                explanation: question.explanation ?? '',
              })));
              setGenerated(true);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong');
            } finally {
              setLoading(false);
            }
          }}
            disabled={loading}
            className="generate-btn w-full text-white font-bold py-3.5 rounded-2xl text-sm mt-5 flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating Quiz...</>
            ) : (
              <><span>✨</span> Generate Quiz</>
            )}
          </button>
          {error && <p className="mt-3 text-xs text-red-600 break-words">{error}</p>}
        </div>
      </div>

      {/* Right: Questions */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {!generated && !loading ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-3xl flex items-center justify-center text-3xl mb-4">❓</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your quiz will appear here</h3>
            <p className="text-slate-400 text-sm max-w-xs">Configure the quiz settings and click Generate to create questions with answer keys.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-3xl flex items-center justify-center text-white text-2xl mb-4 shadow-lg animate-pulse">❓</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI is preparing your quiz ✨</h3>
            <p className="text-slate-400 text-sm">Creating questions with answer keys and explanations</p>
            <div className="flex gap-1.5 mt-4">
              {[0,1,2].map(i => (
                <span key={i} className="thinking-dot w-2 h-2 bg-violet-400 rounded-full block" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-5 lg:p-8 max-w-3xl mx-auto">
            {/* Top actions */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">✓ AI Generated</span>
                <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-full">{quiz.length} Questions</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAnswers(current => !current)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white px-3 py-1.5 rounded-lg transition-all">
                  {showAnswers ? 'Hide Answer Key' : 'Show Answer Key'}
                </button>
                {[
                  { l: saved ? 'Saved ✓' : 'Save', onClick: () => setSaved(true) },
                  { l: 'Export PDF' },
                ].map(a => (
                  <button key={a.l} onClick={(a as any).onClick}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all">
                    {a.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{form.topic} Quiz</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{form.grade} · {form.subject} · {quiz.length} Questions</p>
                </div>
                <div className="text-sm font-medium text-slate-600 bg-slate-50 rounded-xl px-3 py-1.5">⏱ 20 min</div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {quiz.map((q, qi) => (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden card-hover">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-7 h-7 bg-indigo-100 rounded-xl flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                          {qi + 1}
                        </div>
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q.question}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diffBadge[q.difficulty]}`}>{q.difficulty}</span>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{q.type}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} type="button"
                          onClick={() => setSelectedAnswers(current => ({ ...current, [q.id]: oi }))}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                            (showAnswers || selectedAnswers[q.id] !== undefined) && oi === q.correct
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : selectedAnswers[q.id] === oi
                                ? 'bg-rose-50 border-rose-200 text-rose-800'
                              : 'bg-slate-50 border-slate-100 text-slate-600'
                          }`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            (showAnswers || selectedAnswers[q.id] !== undefined) && oi === q.correct
                              ? 'border-emerald-500 bg-emerald-500'
                              : selectedAnswers[q.id] === oi
                                ? 'border-rose-500 bg-rose-500'
                                : 'border-slate-300'
                          }`}>
                            {(showAnswers || selectedAnswers[q.id] !== undefined) && oi === q.correct && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                          {(showAnswers || selectedAnswers[q.id] !== undefined) && oi === q.correct && <span className="ml-auto text-xs font-semibold text-emerald-600">Correct</span>}
                          {selectedAnswers[q.id] === oi && oi !== q.correct && <span className="ml-auto text-xs font-semibold text-rose-600">Try again</span>}
                        </button>
                      ))}
                    </div>

                    {selectedAnswers[q.id] !== undefined && (
                      <div className={`mt-3 rounded-xl border px-3 py-2.5 text-xs ${
                        selectedAnswers[q.id] === q.correct
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                          : 'bg-rose-50 border-rose-100 text-rose-800'
                      }`}>
                        <p className="font-bold">{selectedAnswers[q.id] === q.correct ? 'Correct answer' : 'Not quite'}</p>
                        <p className="mt-1 leading-relaxed">{q.explanation || 'Review the highlighted answer and try again.'}</p>
                      </div>
                    )}

                    <button onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                      className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors">
                      {expanded === q.id ? '▲ Hide' : '▼ Show'} Explanation
                    </button>

                    {expanded === q.id && (
                      <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3 slide-in">
                        <p className="text-xs text-indigo-800 leading-relaxed"><span className="font-bold">Explanation: </span>{q.explanation}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 px-5 py-2.5 flex justify-end gap-2">
                    {['✏️ Edit', '🔄 Regenerate', '🗑️ Delete'].map(a => (
                      <button key={a} className="text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-all">{a}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
