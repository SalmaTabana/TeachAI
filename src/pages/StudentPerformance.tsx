import { useState } from 'react';
import { analyzeStudentPerformance } from '../lib/api';
import type {
  StudentPerformanceOutput,
  ConceptResult,
} from '../lib/type';

interface ConceptRow extends ConceptResult {
  id: number;
}

export default function StudentPerformance() {
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [assessmentName, setAssessmentName] = useState('');

  const [concepts, setConcepts] = useState<ConceptRow[]>([
    {
      id: 1,
      concept: '',
      students_struggling: 0,
      total_students: 0,
    },
  ]);

  const [result, setResult] = useState<StudentPerformanceOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addConcept = () => {
    setConcepts([
      ...concepts,
      {
        id: Date.now(),
        concept: '',
        students_struggling: 0,
        total_students: 0,
      },
    ]);
  };

  const removeConcept = (id: number) => {
    if (concepts.length === 1) return;

    setConcepts(concepts.filter((c) => c.id !== id));
  };

const updateConcept = (
  id: number,
  field: keyof ConceptResult,
  value: string | number
) => {
  setConcepts(
    concepts.map((c) => {
      if (c.id !== id) return c;

      if (field === 'concept') {
        return {
          ...c,
          concept: String(value),
        };
      }

      if (field === 'total_students') {
        return {
          ...c,
          total_students: Number(value),
        };
      }

      return {
        ...c,
        students_struggling: Number(value),
      };
    })
  );
};
  const handleAnalyze = async () => {
    setError('');
    setResult(null);

    if (!subject || !gradeLevel || !assessmentName) {
      setError('Please fill in all the basic information.');
      return;
    }

   if (
  concepts.some((c) => {
    const totalStudents = Number(c.total_students);
    const strugglingStudents = Number(c.students_struggling);

    return (
      !c.concept.trim() ||
      totalStudents <= 0 ||
      strugglingStudents < 0 ||
      strugglingStudents > totalStudents
    );
  })
) {
  setError(
    'Please enter valid concept data. Struggling students cannot be greater than total students.'
  );
  return;
}
    setLoading(true);

    try {
      const response = await analyzeStudentPerformance({
        subject,
        grade_level: gradeLevel,
        assessment_name: assessmentName,
        concept_results: concepts.map(
          ({ id, ...concept }) => concept
        ),
      });

      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not analyze student performance.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-4 lg:p-6 space-y-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold text-slate-900"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Student Performance
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Analyze your students' performance and identify concepts that need
          attention.
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3
          className="font-bold text-slate-900 mb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Assessment Information
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Subject
            </label>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Grade Level
            </label>

            <input
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              placeholder="e.g. Grade 8"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Assessment Name
            </label>

            <input
              value={assessmentName}
              onChange={(e) => setAssessmentName(e.target.value)}
              placeholder="e.g. Midterm Exam"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* Concepts */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3
              className="font-bold text-slate-900"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Concept Performance
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Enter how many students are struggling with each concept.
            </p>
          </div>

          <button
            onClick={addConcept}
            className="bg-indigo-50 text-indigo-700 font-semibold px-3 py-2 rounded-xl text-sm hover:bg-indigo-100"
          >
            + Add Concept
          </button>
        </div>

        <div className="space-y-3">
          {concepts.map((item, index) => (
            <div
              key={item.id}
              className="grid md:grid-cols-[1fr_180px_180px_auto] gap-3 items-end p-4 bg-slate-50 rounded-xl"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Concept {index + 1}
                </label>

                <input
                  value={item.concept}
                  onChange={(e) =>
                    updateConcept(item.id, 'concept', e.target.value)
                  }
                  placeholder="e.g. Algebra"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Total Students
                </label>

                <input
                  type="number"
                  min="1"
                  value={item.total_students}
                  onChange={(e) =>
                    updateConcept(
                      item.id,
                      'total_students',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Students Struggling
                </label>

                <input
                  type="number"
                  min="0"
                  value={item.students_struggling}
                  onChange={(e) =>
                    updateConcept(
                      item.id,
                      'students_struggling',
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <button
                onClick={() => removeConcept(item.id)}
                disabled={concepts.length === 1}
                className="px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 disabled:opacity-30"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-5 w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Analyzing Performance...' : '✨ Analyze Student Performance'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
            <div className="text-sm font-semibold text-indigo-200 mb-2">
              AI Performance Summary
            </div>

            <p className="text-lg font-bold leading-relaxed">
              {result.summary}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3
              className="font-bold text-slate-900 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              AI Insights
            </h3>

            <div className="space-y-3">
              {result.insights.map((insight) => (
                <div
                  key={insight.concept}
                  className="border border-slate-100 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h4 className="font-semibold text-slate-800">
                      {insight.concept}
                    </h4>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        insight.severity === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : insight.severity === 'moderate'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {insight.severity}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500">
                    {insight.students_struggling} student(s) struggling
                  </p>

                  <p className="text-sm text-slate-600 mt-2">
                    {insight.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}