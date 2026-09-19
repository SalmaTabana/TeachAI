import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import LessonPlanner from './pages/LessonPlanner';
import QuizGenerator from './pages/QuizGenerator';
import WorksheetGenerator from './pages/WorksheetGenerator';
import Activities from './pages/Activities';
import StudentInsights from './pages/StudentInsights';
import StudentPerformance from './pages/StudentPerformance';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading TeachAI...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading TeachAI...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <DashboardLayout />;
}

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/ai-assistant', element: <AIAssistant /> },
      { path: '/lesson-planner', element: <LessonPlanner /> },
      { path: '/quiz-generator', element: <QuizGenerator /> },
      { path: '/worksheet-generator', element: <WorksheetGenerator /> },
      { path: '/activities', element: <Activities /> },
      { path: '/student-insights', element: <StudentInsights /> },
      { path: '/student-performance', element: <StudentPerformance /> },
      { path: '/library', element: <Library /> },
      { path: '/settings', element: <Settings /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
