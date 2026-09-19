import { useState } from 'react';
import { Link } from 'react-router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-8 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Login
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold">T</div>
            <span className="font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI</span>
          </div>

          {!sent ? (
            <>
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Forgot your password?
              </h1>
              <p className="text-slate-500 mb-7 leading-relaxed">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="sarah@school.edu" required
                    className="input-focus w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400" />
                </div>
                <button type="submit" disabled={loading}
                  className="btn-primary w-full text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                  ) : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Check your email</h2>
              <p className="text-slate-500 mb-2">We've sent a reset link to</p>
              <p className="font-semibold text-slate-700 mb-7">{email}</p>
              <p className="text-sm text-slate-400 mb-6">Didn't receive the email? Check your spam folder or try again.</p>
              <button onClick={() => setSent(false)} className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition-colors">
                Try a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
