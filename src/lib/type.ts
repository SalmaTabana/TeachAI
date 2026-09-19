// src/lib/types.ts
// ═══════════════════════════════════════════════════════════
// TypeScript types matching the FastAPI backend schemas.
// Keep in sync with: backend/app/schemas.py
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// Lesson Plan
// ═══════════════════════════════════════════════════════════

export type StudentLevel = "Beginner" | "Intermediate" | "Advanced";

export interface LessonPlanRequest {
  subject: string;
  grade_level: string;
  topic: string;
  duration_minutes: number;
  student_level?: StudentLevel;
  learning_objectives?: string[] | null;
}

export interface LessonPlanOutput {
  title: string;
  objectives: string[];
  materials: string[];
  warm_up: string;
  main_activities: string[];
  assessment: string;
  closure: string;
}

// ═══════════════════════════════════════════════════════════
// Quiz
// ═══════════════════════════════════════════════════════════

export type Difficulty = "Easy" | "Medium" | "Hard" | "Mixed";

export type QuestionType =
  | "Multiple Choice"
  | "True/False"
  | "Short Answer"
  | "Fill in the Blank"
  | "Mixed";

export interface QuizGeneratorRequest {
  subject: string;
  grade_level: string;
  topic: string;
  difficulty?: Difficulty;
  number_of_questions: number;
  question_type?: QuestionType;
}

export interface QuizQuestion {
  question: string;
  options?: string[] | null;
  correct_answer: string;
  explanation?: string | null;
}

export interface QuizOutput {
  title: string;
  questions: QuizQuestion[];
}

// ═══════════════════════════════════════════════════════════
// Worksheet
// ═══════════════════════════════════════════════════════════

export interface WorksheetGeneratorRequest {
  subject: string;
  grade_level: string;
  topic: string;
  difficulty?: Difficulty;
  number_of_questions: number;
}

export interface WorksheetProblem {
  prompt: string;
  answer?: string | null;
}

export interface WorksheetOutput {
  title: string;
  instructions: string;
  problems: WorksheetProblem[];
}

// ═══════════════════════════════════════════════════════════
// Activity
// ═══════════════════════════════════════════════════════════

export type ActivityType =
  | "Group Activity"
  | "Discussion"
  | "Game"
  | "Problem Solving"
  | "Creative Activity";

export interface ActivityGeneratorRequest {
  subject: string;
  grade_level: string;
  topic: string;
  duration_minutes: number;
  activity_type?: ActivityType;
}

export interface ActivityOutput {
  title: string;
  overview: string;
  materials: string[];
  instructions: string[];
  wrap_up: string;
}

// ═══════════════════════════════════════════════════════════
// AI Assistant
// ═══════════════════════════════════════════════════════════

export type QuickAction =
  | "Create a lesson plan"
  | "Explain this topic simply"
  | "Create a classroom activity"
  | "Generate quiz questions"
  | "Analyze student performance"
  | "Write learning objectives";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string | null;
}

export interface AIAssistantRequest {
  message: string;
  conversation_id?: string | null;
  quick_action?: QuickAction | null;
  history?: ChatMessage[] | null;
}

export interface AIAssistantResponse {
  tool_used: "lesson_plan" | "quiz" | "worksheet" | "activity" | "general";
  response?: string;
  parameters?: Record<string, unknown>;
  result?: unknown;
}

// ═══════════════════════════════════════════════════════════
// Teaching Materials
// ═══════════════════════════════════════════════════════════

export type MaterialFormat =
  | "presentation_outline"
  | "worksheet"
  | "flashcards"
  | "real_life_examples"
  | "mcqs"
  | "short_answer_questions"
  | "discussion_activities";

export interface TeachingMaterialsRequest {
  subject: string;
  grade_level: string;
  topic: string;
  formats?: MaterialFormat[];
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface MaterialMCQ {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface TeachingMaterialsOutput {
  presentation_outline?: string[] | null;
  worksheet?: string[] | null;
  flashcards?: Flashcard[] | null;
  real_life_examples?: string[] | null;
  mcqs?: MaterialMCQ[] | null;
  short_answer_questions?: string[] | null;
  discussion_activities?: string[] | null;
}

// ═══════════════════════════════════════════════════════════
// Student Performance
// ═══════════════════════════════════════════════════════════

export interface ConceptResult {
  concept: string;
  students_struggling: number;
  total_students?: number ;
}

export interface StudentPerformanceRequest {
  subject: string;
  grade_level: string;
  assessment_name?: string | null;
  concept_results: ConceptResult[];
}

export interface ConceptInsight {
  concept: string;
  students_struggling: number;
  severity: "low" | "moderate" | "high";
  recommendation: string;
}

export interface MiniLesson {
  concept: string;
  title: string;
  objective: string;
  quick_explanation: string;
  activity: string;
}

export interface StudentPerformanceOutput {
  summary: string;
  insights: ConceptInsight[];
  targeted_mini_lessons: MiniLesson[];
}

// ═══════════════════════════════════════════════════════════
// Student Questions
// ═══════════════════════════════════════════════════════════

export interface StudentQuestionsRequest {
  subject: string;
  grade_level: string;
  topic: string;
  student_questions: string[];
}

export interface ConfusionTheme {
  theme: string;
  question_count: number;
  example_questions: string[];
}

export interface StudentQuestionsOutput {
  summary: string;
  themes: ConfusionTheme[];
  clarification_lesson: MiniLesson;
}