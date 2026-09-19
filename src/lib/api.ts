// src/lib/api.ts
// ═══════════════════════════════════════════════════════════
// API client for TeachAI backend (FastAPI).
//
// Base URL:
//   - Local: http://localhost:8000 (default)
//   - Production: set VITE_API_URL in .env / Vercel
// ═══════════════════════════════════════════════════════════

import type {
  LessonPlanRequest,
  LessonPlanOutput,
  QuizGeneratorRequest,
  QuizOutput,
  WorksheetGeneratorRequest,
  WorksheetOutput,
  ActivityGeneratorRequest,
  ActivityOutput,
  AIAssistantRequest,
  AIAssistantResponse,
  TeachingMaterialsRequest,
  TeachingMaterialsOutput,
  StudentPerformanceRequest,
  StudentPerformanceOutput,
  StudentQuestionsRequest,
  StudentQuestionsOutput,
} from "./type";


export interface AuthUser { id: number; name: string; email: string; role: string; avatar: string; }
export interface AuthResult { token: string; user: AuthUser; }
export interface LibraryResource { id: number; title: string; type: string; subject: string; grade: string; date: string; icon: string; color: string; content: unknown; }
export interface StudentInsightItem { concept: string; students_struggling: number; severity: string; recommendation: string; score: number; color: string; }
export interface StudentInsightsData { has_data: boolean; summary: string; recommendation: string; subject: string; grade_level: string; assessment_name: string; total_students: number; class_average: number; students_needing_support: number; concepts: StudentInsightItem[]; insights: Array<{ concept: string; students_struggling: number; severity: string; recommendation: string }>; }
export interface DashboardData { stats: { lessons_created: number; quizzes_generated: number; worksheets: number; activities: number; resources_total: number }; recent_work: Array<{ id:number; title:string; type:string; grade:string; subject:string; date:string; icon:string; color:string }>; student_insight?: { has_data: boolean; summary: string; recommendation: string; }; }

const API_URL: string =
  (import.meta.env.VITE_API_URL as string) || "";

// ═══════════════════════════════════════════════════════════
// Core fetch helper
// ═══════════════════════════════════════════════════════════

async function request<TRes>(path: string, options: RequestInit = {}): Promise<TRes> {
  let res: Response;
  try {
    const token = localStorage.getItem("teachai_token");
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(`Cannot reach backend at ${API_URL}. Make sure the server is running.`);
  }
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try { const err = await res.json(); detail = err.detail || JSON.stringify(err); }
    catch { detail = await res.text(); }
    throw new Error(`API error: ${detail}`);
  }
  return res.json() as Promise<TRes>;
}

async function post<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  return request<TRes>(path, { method: "POST", body: JSON.stringify(body) });
}

export function authLogin(email: string, password: string) {
  return post<{email:string;password:string}, AuthResult>("/api/auth/login", { email, password });
}
export function authRegister(name: string, email: string, password: string) {
  return post<{name:string;email:string;password:string}, AuthResult>("/api/auth/register", { name, email, password });
}
export function authLogout() { return request<{status:string}>("/api/auth/logout", { method: "POST" }); }
export function getMe() { return request<AuthUser>("/api/me"); }
export function getResources() { return request<LibraryResource[]>("/api/resources"); }
export function deleteResource(id: number) { return request<{status:string}>(`/api/resources/${id}`, { method: "DELETE" }); }
export function getDashboard() { return request<DashboardData>("/api/dashboard"); }
export function getStudentInsights() { return request<StudentInsightsData>("/api/student-insights"); }

// ═══════════════════════════════════════════════════════════
// Health check
// ═══════════════════════════════════════════════════════════

export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw new Error("Backend is not reachable");
  return res.json();
}

// ═══════════════════════════════════════════════════════════
// Lesson Plan
// ═══════════════════════════════════════════════════════════

export function generateLessonPlan(
  data: LessonPlanRequest
): Promise<LessonPlanOutput> {
  return post<LessonPlanRequest, LessonPlanOutput>("/api/lesson-plan", data);
}

// ═══════════════════════════════════════════════════════════
// Quiz
// ═══════════════════════════════════════════════════════════

export function generateQuiz(
  data: QuizGeneratorRequest
): Promise<QuizOutput> {
  return post<QuizGeneratorRequest, QuizOutput>("/api/quiz", data);
}

// ═══════════════════════════════════════════════════════════
// Worksheet
// ═══════════════════════════════════════════════════════════

export function generateWorksheet(
  data: WorksheetGeneratorRequest
): Promise<WorksheetOutput> {
  return post<WorksheetGeneratorRequest, WorksheetOutput>(
    "/api/worksheet",
    data
  );
}

// ═══════════════════════════════════════════════════════════
// Activity
// ═══════════════════════════════════════════════════════════

export function generateActivity(
  data: ActivityGeneratorRequest
): Promise<ActivityOutput> {
  return post<ActivityGeneratorRequest, ActivityOutput>("/api/activity", data);
}

// ═══════════════════════════════════════════════════════════
// AI Assistant
// ═══════════════════════════════════════════════════════════

export function askAssistant(
  data: AIAssistantRequest
): Promise<AIAssistantResponse> {
  return post<AIAssistantRequest, AIAssistantResponse>("/api/assistant", data);
}

// ═══════════════════════════════════════════════════════════
// Teaching Materials
// ═══════════════════════════════════════════════════════════

export function generateTeachingMaterials(
  data: TeachingMaterialsRequest
): Promise<TeachingMaterialsOutput> {
  return post<TeachingMaterialsRequest, TeachingMaterialsOutput>(
    "/api/materials",
    data
  );
}

// ═══════════════════════════════════════════════════════════
// Student Performance
// ═══════════════════════════════════════════════════════════

export function analyzeStudentPerformance(
  data: StudentPerformanceRequest
): Promise<StudentPerformanceOutput> {
  return post<StudentPerformanceRequest, StudentPerformanceOutput>(
    "/api/student-performance",
    data
  );
}

// ═══════════════════════════════════════════════════════════
// Student Questions
// ═══════════════════════════════════════════════════════════

export function analyzeStudentQuestions(
  data: StudentQuestionsRequest
): Promise<StudentQuestionsOutput> {
  return post<StudentQuestionsRequest, StudentQuestionsOutput>(
    "/api/student-questions",
    data
  );
}