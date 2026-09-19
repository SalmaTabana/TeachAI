from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Literal
from enum import Enum
from datetime import datetime


# LESSON PLAN

class StudentLevel(str, Enum):
    beginner = "Beginner"
    intermediate = "Intermediate"
    advanced = "Advanced"


class LessonPlanRequest(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    subject: str = Field(..., description="Subject of the lesson")
    grade_level: str = Field(..., description="Grade level")
    topic: str = Field(..., description="Specific topic of the lesson")
    duration_minutes: int = Field(..., gt=0, le=240, description="Lesson duration in minutes")
    student_level: StudentLevel = Field(
        default=StudentLevel.intermediate,
        description="Overall proficiency level of the students"
    )
    learning_objectives: Optional[List[str]] = Field(
        default=None,
        description="Optional list of specific learning objectives / outcomes for the lesson"
    )


class LessonPlanOutput(BaseModel):
    title: str = Field(..., description="Title of the lesson")
    objectives: List[str] = Field(..., description="Learning objectives covered")
    materials: List[str] = Field(..., description="Materials/resources needed")
    warm_up: str = Field(..., description="Warm-up / hook activity")
    main_activities: List[str] = Field(..., description="Step-by-step main lesson activities")
    assessment: str = Field(..., description="How student understanding will be checked")
    closure: str = Field(..., description="Wrap-up / closing activity")


# QUIZ GENERATOR

class Difficulty(str, Enum):
    easy = "Easy"
    medium = "Medium"
    hard = "Hard"
    mixed = "Mixed"


class QuestionType(str, Enum):
    multiple_choice = "Multiple Choice"
    true_false = "True/False"
    short_answer = "Short Answer"
    fill_in_the_blank = "Fill in the Blank"
    mixed = "Mixed"


class QuizGeneratorRequest(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    subject: str = Field(..., description="Subject of the quiz")
    grade_level: str = Field(..., description="Grade level, e.g. 'Grade 7'")
    topic: str = Field(..., description="Specific topic of the quiz")
    difficulty: Difficulty = Field(
        default=Difficulty.mixed,
        description="Difficulty level of the quiz questions"
    )
    number_of_questions: int = Field(..., gt=0, le=50, description="Total number of quiz questions to generate")
    question_type: QuestionType = Field(
        default=QuestionType.multiple_choice,
        description="Type of questions to generate"
    )


class QuizQuestion(BaseModel):
    question: str = Field(..., description="The question text")
    options: Optional[List[str]] = Field(default=None, description="Answer choices, if applicable")
    correct_answer: str = Field(..., description="The correct answer")
    explanation: Optional[str] = Field(default=None, description="Brief explanation of the correct answer")


class QuizOutput(BaseModel):
    title: str = Field(..., description="Title of the quiz")
    questions: List[QuizQuestion] = Field(..., description="List of generated quiz questions")


# WORKSHEET

class WorksheetGeneratorRequest(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    subject: str = Field(..., description="Subject of the worksheet, e.g. 'Science'")
    grade_level: str = Field(..., description="Grade level, e.g. 'Grade 7'")
    difficulty: Difficulty = Field(
        default=Difficulty.medium,
        description="Difficulty level of the worksheet questions"
    )
    number_of_questions: int = Field(..., gt=0, le=50, description="Total number of worksheet questions to generate")
    topic: str = Field(..., description="Specific topic of the worksheet, e.g. 'Photosynthesis'")


class WorksheetProblem(BaseModel):
    prompt: str = Field(..., description="The worksheet question/problem text")
    answer: Optional[str] = Field(default=None, description="Answer key entry for this problem")


class WorksheetOutput(BaseModel):
    title: str = Field(..., description="Title of the worksheet")
    instructions: str = Field(..., description="Instructions shown to students at the top of the worksheet")
    problems: List[WorksheetProblem] = Field(..., description="List of worksheet problems with answer key")


# ═══════════════════════════════════════════════════════════
# ACTIVITY
# ═══════════════════════════════════════════════════════════

class ActivityType(str, Enum):
    group_activity = "Group Activity"
    discussion = "Discussion"
    game = "Game"
    problem_solving = "Problem Solving"
    creative_activity = "Creative Activity"


class ActivityGeneratorRequest(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    subject: str = Field(..., description="Subject of the activity, e.g. 'Science'")
    grade_level: str = Field(..., description="Grade level, e.g. 'Grade 7'")
    duration_minutes: int = Field(..., gt=0, le=240, description="Activity duration in minutes")
    topic: str = Field(..., description="Specific topic of the activity, e.g. 'Photosynthesis'")
    activity_type: ActivityType = Field(
        default=ActivityType.group_activity,
        description="Type/format of the classroom activity to generate"
    )


class ActivityOutput(BaseModel):
    title: str = Field(..., description="Title of the activity")
    overview: str = Field(..., description="Brief overview of the activity")
    materials: List[str] = Field(..., description="Materials/resources needed")
    instructions: List[str] = Field(..., description="Step-by-step instructions for running the activity")
    wrap_up: str = Field(..., description="How to wrap up / debrief the activity")


# AI ASSISTANT

class QuickAction(str, Enum):
    create_lesson_plan = "Create a lesson plan"
    explain_topic = "Explain this topic simply"
    create_activity = "Create a classroom activity"
    generate_quiz_questions = "Generate quiz questions"
    analyze_student_performance = "Analyze student performance"
    write_learning_objectives = "Write learning objectives"


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"] = Field(..., description="Who sent the message")
    content: str = Field(..., description="Message text")
    timestamp: Optional[datetime] = Field(default=None, description="When the message was sent")


class Attachment(BaseModel):
    filename: str = Field(..., description="Name of the attached file")
    file_type: Optional[str] = Field(default=None, description="MIME type or extension")
    url: Optional[str] = Field(default=None, description="Location/URL of the uploaded file")


class AIAssistantRequest(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    conversation_id: Optional[str] = Field(
        default=None,
        description="ID of an existing conversation to continue"
    )
    message: str = Field(..., description="The user's current message/prompt")
    quick_action: Optional[QuickAction] = Field(
        default=None,
        description="Optional shortcut selected from the suggestion cards"
    )
    history: Optional[List[ChatMessage]] = Field(
        default=None,
        description="Prior turns in this conversation, for context"
    )
    attachments: Optional[List[Attachment]] = Field(
        default=None,
        description="Optional files attached via the paperclip icon"
    )


class ToolChoice(BaseModel):
    tool: Literal["lesson_plan", "quiz", "worksheet", "activity", "general"] = Field(
        ..., description="Which tool best answers the user's message"
    )


# TEACHING MATERIALS

class TeachingMaterialsRequest(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    subject: str = Field(..., description="Subject, e.g. 'Science'")
    grade_level: str = Field(..., description="Grade level, e.g. 'Grade 8'")
    topic: str = Field(..., description="Specific topic, e.g. 'Photosynthesis'")
    formats: List[Literal[
        "presentation_outline", "worksheet", "flashcards",
        "real_life_examples", "mcqs", "short_answer_questions", "discussion_activities"
    ]] = Field(
        default=[
            "presentation_outline", "worksheet", "flashcards",
            "real_life_examples", "mcqs", "short_answer_questions", "discussion_activities"
        ],
        description="Which material formats to generate from the same topic"
    )


class Flashcard(BaseModel):
    front: str = Field(..., description="Term or question side")
    back: str = Field(..., description="Definition or answer side")


class MaterialMCQ(BaseModel):
    question: str
    options: List[str]
    correct_answer: str


class TeachingMaterialsOutput(BaseModel):
    presentation_outline: Optional[List[str]] = Field(default=None, description="Slide-by-slide outline")
    worksheet: Optional[List[str]] = Field(default=None, description="Worksheet problems")
    flashcards: Optional[List[Flashcard]] = Field(default=None, description="Flashcard front/back pairs")
    real_life_examples: Optional[List[str]] = Field(default=None, description="Real-world examples of the topic")
    mcqs: Optional[List[MaterialMCQ]] = Field(default=None, description="Multiple choice questions")
    short_answer_questions: Optional[List[str]] = Field(default=None, description="Short-answer questions")
    discussion_activities: Optional[List[str]] = Field(default=None, description="Discussion prompts/activities")


# STUDENT PERFORMANCE

class ConceptResult(BaseModel):
    concept: str = Field(..., description="Concept/topic name, e.g. 'Cellular Respiration'")
    students_struggling: int = Field(..., ge=0, description="Number of students struggling with this concept")
    total_students: Optional[int] = Field(default=None, description="Total students assessed, if known")


class StudentPerformanceRequest(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    subject: str = Field(..., description="Subject, e.g. 'Science'")
    grade_level: str = Field(..., description="Grade level, e.g. 'Grade 8'")
    assessment_name: Optional[str] = Field(default=None, description="Name of the quiz/assignment analyzed")
    concept_results: List[ConceptResult] = Field(..., description="Per-concept struggle counts from quiz/assignment results")


class ConceptInsight(BaseModel):
    concept: str
    students_struggling: int
    severity: Literal["low", "moderate", "high"] = Field(..., description="Urgency of intervention needed")
    recommendation: str = Field(..., description="Actionable recommendation")


class MiniLesson(BaseModel):
    concept: str
    title: str
    objective: str
    quick_explanation: str
    activity: str


class StudentPerformanceOutput(BaseModel):
    summary: str = Field(..., description="Overall plain-language summary of class performance")
    insights: List[ConceptInsight] = Field(..., description="Per-concept insights, ranked by severity")
    targeted_mini_lessons: List[MiniLesson] = Field(..., description="Mini re-teach lesson for each high-severity concept")


# STUDENT QUESTIONS

class StudentQuestionsRequest(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    subject: str = Field(..., description="Subject, e.g. 'Science'")
    grade_level: str = Field(..., description="Grade level, e.g. 'Grade 8'")
    topic: str = Field(..., description="Topic the questions relate to, e.g. 'Photosynthesis'")
    student_questions: List[str] = Field(..., description="Raw list of questions submitted by students after the lesson/video")


class ConfusionTheme(BaseModel):
    theme: str = Field(..., description="Short label for the confusion cluster, e.g. 'Role of chlorophyll'")
    question_count: int = Field(..., ge=0, description="Number of student questions falling into this theme")
    example_questions: List[str] = Field(..., description="A few representative questions from this cluster")


class StudentQuestionsOutput(BaseModel):
    summary: str = Field(..., description="One-line summary")
    themes: List[ConfusionTheme] = Field(..., description="Confusion themes ranked by question_count descending")
    clarification_lesson: MiniLesson = Field(..., description="A clarification mini-lesson addressing the top theme(s)")