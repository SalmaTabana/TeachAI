import { Link } from 'react-router';
import { useState } from 'react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">T</div>
              <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#for-teachers" className="hover:text-white transition-colors">For Teachers</a>
              <a href="#impact" className="hover:text-white transition-colors">About</a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">Login</Link>
              <Link to="/register" className="btn-primary text-sm text-white px-5 py-2.5 rounded-xl font-semibold">Get Started</Link>
            </div>
            <button className="md:hidden text-slate-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4 space-y-2">
              <a href="#features" className="block text-slate-400 hover:text-white py-2 text-sm">Features</a>
              <a href="#how-it-works" className="block text-slate-400 hover:text-white py-2 text-sm">How It Works</a>
              <Link to="/login" className="block text-slate-400 hover:text-white py-2 text-sm">Login</Link>
              <Link to="/register" className="btn-primary block text-center text-sm text-white px-5 py-2.5 rounded-xl font-semibold mt-2">Get Started</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg min-h-screen flex items-center relative overflow-hidden pt-16">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full thinking-dot" />
                Built for modern educators
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Teach smarter.{' '}
                <span className="gradient-text-light">Plan faster.</span>{' '}
                Make a bigger impact.
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
                Your AI-powered teaching copilot for lesson planning, assessments, personalized learning, and student insights.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-2xl text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
                  </svg>
                  Start Teaching Smarter
                </Link>
                <a href="#how-it-works" className="inline-flex items-center gap-2 text-slate-300 hover:text-white border border-white/15 hover:border-white/30 font-medium px-7 py-3.5 rounded-2xl text-sm transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  See How It Works
                </a>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#030712] flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                      {['SA', 'MJ', 'AK', '+'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  <span className="text-slate-300 font-semibold">10,000+</span> teachers already using TeachAI
                </p>
              </div>
            </div>

            {/* Right: Floating UI cards */}
            <div className="relative h-[520px] hidden lg:block">
              {/* Main card */}
              <div className="absolute top-12 left-8 right-4 glass rounded-2xl p-5 z-10 float-1">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5">
                      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">AI Assistant</span>
                  <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full thinking-dot" />
                    Ready
                  </span>
                </div>
                <div className="bg-indigo-500/10 rounded-xl p-3 mb-2.5">
                  <p className="text-xs text-slate-400 mb-1">Teacher</p>
                  <p className="text-sm text-slate-200">"Create a lesson about photosynthesis for Grade 7"</p>
                </div>
                <div className="bg-violet-500/10 rounded-xl p-3">
                  <p className="text-xs text-violet-400 mb-1 font-medium flex items-center gap-1">
                    <span>✨</span> TeachAI
                  </p>
                  <p className="text-sm text-slate-200 leading-relaxed">Here's a 45-min lesson plan with objectives, warm-up, and activities...</p>
                </div>
              </div>

              {/* Floating: Lesson generated */}
              <div className="absolute top-4 right-0 glass-light rounded-2xl px-4 py-3 z-20 float-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Lesson generated ✓</span>
                </div>
              </div>

              {/* Floating: 12 students */}
              <div className="absolute bottom-32 left-0 glass-light rounded-2xl px-4 py-3 z-20 float-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">12 students</p>
                    <p className="text-xs text-slate-500">need support</p>
                  </div>
                </div>
              </div>

              {/* Floating: Quiz ready */}
              <div className="absolute bottom-16 right-4 glass-light rounded-2xl px-4 py-3 z-20 float-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Quiz ready ✓</span>
                </div>
              </div>

              {/* Floating: AI suggestion */}
              <div className="absolute bottom-48 right-2 glass rounded-2xl px-4 py-3 z-20 float-2 shadow-lg">
                <p className="text-xs font-medium text-indigo-300 flex items-center gap-1.5">
                  <span>✨</span>
                  AI Suggestion
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Try a visual activity next</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
              Everything you need
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Everything you need to teach better
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              One platform for all your teaching needs. Save hours every week and focus on what matters — your students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📚', color: 'indigo', title: 'AI Lesson Planner', desc: 'Generate complete lesson plans in seconds. Curriculum-aligned, differentiated, and ready to use.', badge: 'Most Popular' },
              { icon: '❓', color: 'violet', title: 'Smart Quiz Generator', desc: 'Create adaptive quizzes with multiple question types. Automatically graded and analyzed.', badge: null },
              { icon: '📄', color: 'cyan', title: 'Worksheet Generator', desc: 'Build professional worksheets for any topic, grade level, and learning style instantly.', badge: null },
              { icon: '🎯', color: 'emerald', title: 'Classroom Activities', desc: 'Discover engaging group activities, games, and projects tailored to your curriculum.', badge: null },
              { icon: '📊', color: 'amber', title: 'Student Insights', desc: 'AI-powered analytics identify learning gaps and suggest interventions before students fall behind.', badge: 'AI Powered' },
              { icon: '🤖', color: 'rose', title: 'AI Teaching Assistant', desc: 'Your always-available copilot. Ask anything, get instant expert teaching strategies.', badge: null },
            ].map((f) => {
              const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
                indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', badge: 'bg-indigo-100 text-indigo-700' },
                violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', badge: 'bg-violet-100 text-violet-700' },
                cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100', badge: 'bg-cyan-100 text-cyan-700' },
                emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700' },
                amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700' },
                rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', badge: 'bg-rose-100 text-rose-700' },
              };
              const c = colorMap[f.color];
              return (
                <div key={f.title} className={`card-hover bg-white rounded-2xl p-6 border ${c.border} shadow-sm`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center text-2xl`}>{f.icon}</div>
                    {f.badge && <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>{f.badge}</span>}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>How it works</h2>
            <p className="text-lg text-slate-500">From idea to classroom-ready in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-cyan-200" />
            {[
              { num: '01', color: 'indigo', title: 'Tell TeachAI what you need', desc: 'Describe your lesson topic, grade level, and goals. Be as specific or as broad as you like.', icon: '💬' },
              { num: '02', color: 'violet', title: 'Customize the AI-generated content', desc: 'Review and edit the generated content. Adjust tone, difficulty, and focus with one click.', icon: '✏️' },
              { num: '03', color: 'cyan', title: 'Teach with confidence', desc: 'Export, print, or use directly in the classroom. Share with students instantly.', icon: '🎓' },
            ].map((s) => {
              const colorMap: Record<string, { num: string; ring: string; line: string }> = {
                indigo: { num: 'text-indigo-600 bg-indigo-50', ring: 'ring-indigo-200', line: '' },
                violet: { num: 'text-violet-600 bg-violet-50', ring: 'ring-violet-200', line: '' },
                cyan: { num: 'text-cyan-600 bg-cyan-50', ring: 'ring-cyan-200', line: '' },
              };
              const c = colorMap[s.color];
              return (
                <div key={s.num} className="text-center relative">
                  <div className={`w-20 h-20 ${c.num} rounded-3xl flex items-center justify-center text-3xl mx-auto mb-5 ring-4 ${c.ring}`}>
                    {s.icon}
                  </div>
                  <div className="text-5xl font-black text-slate-100 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.num}</div>
                  <h3 className="font-bold text-slate-900 mb-2 text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="for-teachers" className="py-24" style={{ background: 'linear-gradient(180deg, #0f0e2e 0%, #1a1750 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-medium mb-6">
                <span>✨</span> AI-Powered
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Your teaching assistant<br />is always ready.
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Ask anything about teaching. Get expert-quality responses instantly. TeachAI learns from millions of educational resources to give you the best possible support.
              </p>
              <div className="space-y-3 mb-8">
                {['Instant lesson plans for any topic or grade', 'Smart quiz questions with answer keys', 'Classroom activity ideas tailored to your students', 'Student performance analysis and insights'].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-300">{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-2xl text-sm">
                Try AI Assistant →
              </Link>
            </div>

            {/* AI Chat preview */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI</span>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full thinking-dot" />
                  Online
                </span>
              </div>

              <div className="space-y-4 mb-5">
                <div className="flex justify-end">
                  <div className="bg-indigo-500/20 border border-indigo-500/25 rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                    <p className="text-sm text-slate-200">"Create a 45-minute lesson about photosynthesis for grade 7 students."</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">✨</span>
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                    <p className="text-xs text-indigo-400 font-semibold mb-2">TeachAI is typing...</p>
                    <p className="text-sm text-slate-300 leading-relaxed mb-3">Absolutely! Here's a complete lesson plan:</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Objective', val: 'Students will understand photosynthesis process' },
                        { label: 'Warm-up (5 min)', val: 'Show a wilting vs healthy plant image' },
                        { label: 'Main Activity (25 min)', val: 'Interactive diagram + note-taking' },
                        { label: 'Assessment (10 min)', val: 'Exit ticket: 3 key facts' },
                      ].map(r => (
                        <div key={r.label} className="flex gap-2 text-xs">
                          <span className="text-indigo-400 font-medium min-w-[100px]">{r.label}</span>
                          <span className="text-slate-400">{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                <span className="text-slate-500 text-sm flex-1">Ask anything about teaching...</span>
                <button className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section id="impact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Trusted by educators worldwide
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '10K+', label: 'Teachers', color: 'indigo' },
              { num: '50K+', label: 'Lessons Created', color: 'violet' },
              { num: '250K+', label: 'Activities Generated', color: 'cyan' },
              { num: '95%', label: 'Teacher Satisfaction', color: 'emerald' },
            ].map(s => {
              const colorMap: Record<string, { num: string; bg: string }> = {
                indigo: { num: 'text-indigo-600', bg: 'bg-indigo-50' },
                violet: { num: 'text-violet-600', bg: 'bg-violet-50' },
                cyan: { num: 'text-cyan-600', bg: 'bg-cyan-50' },
                emerald: { num: 'text-emerald-600', bg: 'bg-emerald-50' },
              };
              const c = colorMap[s.color];
              return (
                <div key={s.label} className={`${c.bg} rounded-3xl p-8 text-center`}>
                  <div className={`text-5xl font-black ${c.num} mb-2`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.num}</div>
                  <div className="text-slate-600 font-medium text-sm">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #312e81 0%, #4c1d95 50%, #164e63 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Spend less time preparing.<br />
            <span className="gradient-text-light">More time teaching.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Join thousands of teachers who've transformed their classroom with TeachAI.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-10 py-4 rounded-2xl text-base hover:bg-slate-50 transition-all hover:shadow-xl">
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <p className="mt-4 text-slate-500 text-sm">No credit card required · Free forever plan available</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030712] border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-xs">T</div>
            <span className="text-slate-400 text-sm font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI</span>
          </div>
          <p className="text-slate-600 text-sm">© 2026 TeachAI. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
