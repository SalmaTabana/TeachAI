import { useState } from 'react';

const SECTIONS = ['Profile', 'Account', 'Notifications', 'AI Preferences', 'Security'];

export default function Settings() {
  const [section, setSection] = useState('Profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 lg:p-6 max-w-5xl" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {SECTIONS.map(s => (
              <button key={s} onClick={() => setSection(s)}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-all border-b border-slate-50 last:border-b-0 ${
                  section === s ? 'bg-indigo-50 text-indigo-700 border-l-2 border-l-indigo-500 pl-[14px]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {saved && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2 slide-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Settings saved successfully.
            </div>
          )}

          {section === 'Profile' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Profile Settings</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">SA</div>
                <div>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors">Change Photo</button>
                  <p className="text-xs text-slate-400 mt-1">JPG, GIF or PNG. Max 2MB.</p>
                </div>
              </div>
              {[
                { label: 'Full Name', val: 'Sarah Ahmed', type: 'text' },
                { label: 'Email', val: 'sarah.ahmed@school.edu', type: 'email' },
                { label: 'Phone', val: '+1 (555) 234-5678', type: 'tel' },
                { label: 'School', val: 'Riverside Elementary School', type: 'text' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                  <input type={f.type} defaultValue={f.val}
                    className="input-focus w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                <textarea rows={3} defaultValue="Grade 7 Science Teacher with 8 years of experience."
                  className="input-focus w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 resize-none" />
              </div>
              <button onClick={handleSave} className="btn-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Save Changes</button>
            </div>
          )}

          {section === 'Account' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Account Settings</h3>
              <div className="space-y-3">
                {[
                  { label: 'Plan', val: 'TeachAI Pro', badge: 'Pro', badgeCls: 'bg-indigo-100 text-indigo-700' },
                  { label: 'Member Since', val: 'January 2025', badge: null, badgeCls: '' },
                  { label: 'Usage this month', val: '247 AI generations used', badge: '247/500', badgeCls: 'bg-slate-100 text-slate-600' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{row.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{row.val}</p>
                    </div>
                    {row.badge && <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${row.badgeCls}`}>{row.badge}</span>}
                  </div>
                ))}
              </div>
              <div className="border border-red-100 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-red-700 mb-1">Danger Zone</h4>
                <p className="text-xs text-slate-500 mb-3">Permanently delete your account and all data. This action cannot be undone.</p>
                <button className="text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">Delete Account</button>
              </div>
            </div>
          )}

          {section === 'Notifications' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'AI Generation Complete', desc: 'Get notified when your AI content is ready', on: true },
                  { label: 'Weekly Insights Report', desc: 'Receive a weekly summary of student performance', on: true },
                  { label: 'Student Alerts', desc: 'Alert when a student falls below performance threshold', on: true },
                  { label: 'New Features', desc: 'Updates about new TeachAI features and improvements', on: false },
                  { label: 'Marketing Emails', desc: 'Tips, resources, and promotional offers', on: false },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{n.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                    <ToggleSwitch defaultChecked={n.on} />
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="btn-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Save Preferences</button>
            </div>
          )}

          {section === 'AI Preferences' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Preferences</h3>
              {[
                { label: 'Default Grade Level', options: ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'], default: 'Grade 7' },
                { label: 'Default Subject', options: ['Science', 'Mathematics', 'English', 'History', 'Geography'], default: 'Science' },
                { label: 'Default Language', options: ['English', 'Spanish', 'French', 'Arabic', 'Mandarin'], default: 'English' },
                { label: 'Content Style', options: ['Formal', 'Conversational', 'Engaging', 'Technical'], default: 'Engaging' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                  <select defaultValue={f.default}
                    className="input-focus w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 appearance-none">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">AI Response Detail Level</label>
                <div className="flex gap-3">
                  {['Brief', 'Standard', 'Detailed'].map(l => (
                    <button key={l}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        l === 'Standard' ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Save AI Settings</button>
            </div>
          )}

          {section === 'Security' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                  <input type="password" placeholder="Enter current password"
                    className="input-focus w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                  <input type="password" placeholder="Enter new password"
                    className="input-focus w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password"
                    className="input-focus w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
                <button onClick={handleSave} className="btn-primary text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Update Password</button>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <ToggleSwitch defaultChecked={false} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ defaultChecked }: { defaultChecked: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button onClick={() => setOn(!on)}
      className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${on ? 'bg-indigo-500' : 'bg-slate-200'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}
