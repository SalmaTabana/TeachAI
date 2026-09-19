import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message.replace('API error: ', '') : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0f0e2e 0%, #1a1750 50%, #1e1b4b 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold">T</div>
          <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Your classroom,<br />
            <span className="gradient-text-light">powered by AI.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Spend less time preparing and more time inspiring your students.
          </p>

          <div className="space-y-4">
            {[
              { icon: '✨', title: 'AI Lesson Planning', desc: 'Generate complete lesson plans in seconds' },
              { icon: '📝', title: 'Smart Assessments', desc: 'Create quizzes and worksheets instantly' },
              { icon: '📊', title: 'Student Insights', desc: 'Identify learning gaps with AI analytics' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 glass rounded-2xl p-4">
                <div className="text-2xl">{f.icon}</div>
                <div>
                  <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-slate-600 text-sm">© 2026 TeachAI. All rights reserved.</p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">T</div>
            <span className="font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back, teacher 👋
          </h1>
          <p className="text-slate-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sarah@school.edu"
                className="input-focus w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-focus w-full px-4 py-3 pr-11 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Login'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-50 px-3 text-slate-400">or continue with</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
