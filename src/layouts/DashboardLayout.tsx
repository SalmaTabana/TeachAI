import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { healthCheck } from '../lib/api';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: GridIcon },
  { path: '/ai-assistant', label: 'AI Assistant', icon: SparkleIcon },
  { path: '/lesson-planner', label: 'Lesson Planner', icon: BookIcon },
  { path: '/quiz-generator', label: 'Quiz Generator', icon: QuizIcon },
  { path: '/worksheet-generator', label: 'Worksheets', icon: FileIcon },
  { path: '/activities', label: 'Activities', icon: ActivityIcon },
  { path: '/student-performance', label: 'Student Performance', icon: ChartIcon },
  { path: '/student-insights', label: 'Student Insights', icon: ChartIcon },
  { path: '/library', label: 'My Library', icon: LibraryIcon },
];

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /><path d="M4 19l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L2 21l1.5-.5z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function QuizIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function LibraryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

const pageLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/ai-assistant': 'AI Assistant',
  '/lesson-planner': 'Lesson Planner',
  '/quiz-generator': 'Quiz Generator',
  '/worksheet-generator': 'Worksheet Generator',
  '/activities': 'Activities',
  '/student-performance': 'Student Performance',
  '/student-insights': 'Student Insights',
  '/library': 'My Library',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0 || location.pathname === '/dashboard') return null;

  const crumbs = [{ label: 'Dashboard', path: '/dashboard' }];
  let built = '';
  for (const seg of segments) {
    built += '/' + seg;
    const label = pageLabels[built];
    if (label && built !== '/dashboard') crumbs.push({ label, path: built });
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-1">
      {crumbs.map((c, i) => (
        <span key={c.path} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-slate-300">/</span>}
          {i === crumbs.length - 1 ? (
            <span className="text-slate-700 font-medium">{c.label}</span>
          ) : (
            <Link to={c.path} className="hover:text-indigo-600 transition-colors">{c.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}

function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        await healthCheck();
        if (active) setStatus('online');
      } catch {
        if (active) setStatus('offline');
      }
    };
    check();
    const timer = window.setInterval(check, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const styles = {
    checking: 'bg-amber-50 text-amber-700',
    online: 'bg-emerald-50 text-emerald-700',
    offline: 'bg-red-50 text-red-700',
  };

  return (
    <span
      className={`hidden sm:inline-flex items-center justify-center w-7 h-7 rounded-full ${styles[status]}`}
      title={`TeachAI API status: ${status}`}
      aria-label={`TeachAI API status: ${status}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
    </span>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const currentLabel = pageLabels[location.pathname] || 'Dashboard';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm">T</div>
        <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TeachAI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-400 pl-[10px]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}

        <div className="pt-2 mt-2 border-t border-white/10">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-400 pl-[10px]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            <SettingsIcon />
            Settings
          </NavLink>
        </div>
      </nav>

      {/* Profile */}
      <div className="px-3 py-4 border-t border-white/10">
        <NavLink to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.avatar || 'SA'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'Sarah Ahmed'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role || 'Teacher'}</p>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); logout(); navigate('/login'); }}
            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
            title="Logout"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'}`}
        style={{ background: 'linear-gradient(180deg, #0f0e2e 0%, #1a1750 100%)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col z-10" style={{ background: 'linear-gradient(180deg, #0f0e2e 0%, #1a1750 100%)' }}>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            className="text-slate-500 hover:text-slate-900 transition-colors"
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setMobileSidebarOpen(!mobileSidebarOpen);
            }}
          >
            <MenuIcon />
          </button>

          <div className="flex-1 min-w-0">
            <Breadcrumbs />
            <h1 className="text-base font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {currentLabel}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <BackendStatus />
            <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors">
              <BellIcon />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <NavLink to="/profile">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                SA
              </div>
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 min-h-0 ${location.pathname === '/ai-assistant' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
