import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Teacher' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Please try again.');
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
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold">T</div>
          <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Let's make teaching<br />
            <span className="gradient-text-light">a little easier.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Join 10,000+ educators who have transformed their teaching with AI.
          </p>

          <div className="space-y-3">
            {[
              '✅ Free plan available — no credit card needed',
              '⚡ Get started in under 2 minutes',
              '🎓 Used by teachers in 50+ countries',
              '🔒 Your data is always private and secure',
            ].map(f => (
              <p key={f} className="text-slate-300 text-sm flex items-center gap-2">{f}</p>
            ))}
          </div>
        </div>

        <p className="relative text-slate-600 text-sm">© 2026 TeachAI. All rights reserved.</p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">T</div>
            <span className="font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Create your TeachAI account
          </h1>
          <p className="text-slate-500 mb-8">Let's make teaching a little easier.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Sarah Ahmed"
                className="input-focus w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="sarah@school.edu"
                className="input-focus w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="Create a strong password"
                className="input-focus w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})}
                placeholder="Confirm your password"
                className="input-focus w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {['Teacher', 'School Administrator'].map(r => (
                  <button key={r} type="button" onClick={() => setForm({...form, role: r})}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.role === r
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-50 px-3 text-slate-400">or sign up with</span>
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
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
