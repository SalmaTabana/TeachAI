"""
ai_engine.py
────────────
All AI logic for TeachAI (Prompts + LLM + Routing + Generation Functions).

Transferred from the original Notebook with minor adjustments:
- Removed Google Colab dependency
- GROQ_API_KEY is now loaded from a .env file
- Imports are relative (from .schemas import ...)
"""

import os
import json
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

from .schemas import (
    # Lesson Plan
    LessonPlanRequest, LessonPlanOutput,
    # Quiz
    QuizGeneratorRequest, QuizOutput,
    # Worksheet
    WorksheetGeneratorRequest, WorksheetOutput,
    # Activity
    ActivityGeneratorRequest, ActivityOutput,
    # AI Assistant
    AIAssistantRequest, ToolChoice,
    # Teaching Materials
    TeachingMaterialsRequest, TeachingMaterialsOutput,
    # Student Performance
    StudentPerformanceRequest, StudentPerformanceOutput,
    # Student Questions
    StudentQuestionsRequest, StudentQuestionsOutput,
)


# ═══════════════════════════════════════════════════════════
# Environment Setup
# ═══════════════════════════════════════════════════════════

load_dotenv()  # reads from backend/.env

if not os.getenv("GROQ_API_KEY"):
    raise RuntimeError(
        "GROQ_API_KEY is missing. Make sure a .env file exists in the "
        "backend/ folder with the line: GROQ_API_KEY=your_key_here"
    )


# ═══════════════════════════════════════════════════════════
# LLM Setup + Router
# ═══════════════════════════════════════════════════════════

llm_primary = ChatGroq(model="openai/gpt-oss-20b", temperature=0.7, max_tokens=8192)
llm_fallback = ChatGroq(model="openai/gpt-oss-120b", temperature=0.7, max_tokens=8192)


class LLMRouter:
    """
    Thin routing wrapper around two LangChain chat models.

    DATA CONTRACT:
      version: "1.0"
      input_schema:
        primary: LangChain chat model, tried first on every invoke().
        fallback: LangChain chat model, used only if primary raises.
      behavior:
        invoke(prompt_str) calls primary.invoke(...); on any exception it
        logs the failure and retries once against fallback.invoke(...).
      status: active
    """
    def __init__(self, primary, fallback):
        self.primary = primary
        self.fallback = fallback

    def invoke(self, prompt_str: str):
        try:
            return self.primary.invoke(prompt_str)
        except Exception as e:
            print(f"[LLMRouter] Primary model failed ({e}), falling back...")
            return self.fallback.invoke(prompt_str)


llm = LLMRouter(llm_primary, llm_fallback)


# ═══════════════════════════════════════════════════════════
# Lesson Plan
# ═══════════════════════════════════════════════════════════

lesson_plan_parser = PydanticOutputParser(pydantic_object=LessonPlanOutput)

lesson_plan_prompt = PromptTemplate(
    template=(
        "You are an expert curriculum designer. Create a detailed lesson plan.\n"
        "Use every supplied input to make this plan specific and distinct. Do not return a generic or previously used plan.\n"
        "Subject: {subject}\n"
        "Grade Level: {grade_level}\n"
        "Topic: {topic}\n"
        "Duration: {duration_minutes} minutes\n"
        "Student Level: {student_level}\n"
        "Learning Objectives (if provided): {learning_objectives}\n\n"
        "{format_instructions}"
    ),
    input_variables=["subject", "grade_level", "topic", "duration_minutes", "student_level", "learning_objectives"],
    partial_variables={"format_instructions": lesson_plan_parser.get_format_instructions()},
)


def generate_lesson_plan(request: LessonPlanRequest) -> dict:
    inputs = {
        "subject": request.subject,
        "grade_level": request.grade_level,
        "topic": request.topic,
        "duration_minutes": request.duration_minutes,
        "student_level": request.student_level,
        "learning_objectives": request.learning_objectives or "None specified",
    }
    chain = lesson_plan_prompt | llm.primary | lesson_plan_parser
    try:
        result = chain.invoke(inputs)
    except Exception as e:
        print(f"[LessonPlanner] Primary failed ({e}), falling back...")
        chain = lesson_plan_prompt | llm.fallback | lesson_plan_parser
        result = chain.invoke(inputs)
    return json.loads(result.model_dump_json())


# ═══════════════════════════════════════════════════════════
# Quiz Generator
# ═══════════════════════════════════════════════════════════

quiz_parser = PydanticOutputParser(pydantic_object=QuizOutput)

quiz_prompt = PromptTemplate(
    template=(
        "You are an expert teacher creating a quiz.\n"
        "Subject: {subject}\n"
        "Grade Level: {grade_level}\n"
        "Topic: {topic}\n"
        "Difficulty: {difficulty}\n"
        "Number of Questions: {number_of_questions}\n"
        "Question Type: {question_type}\n\n"
        "{format_instructions}"
    ),
    input_variables=["subject", "grade_level", "topic", "difficulty", "number_of_questions", "question_type"],
    partial_variables={"format_instructions": quiz_parser.get_format_instructions()},
)


def generate_quiz(request: QuizGeneratorRequest) -> dict:
    inputs = {
        "subject": request.subject,
        "grade_level": request.grade_level,
        "topic": request.topic,
        "difficulty": request.difficulty,
        "number_of_questions": request.number_of_questions,
        "question_type": request.question_type,
    }
    chain = quiz_prompt | llm.primary | quiz_parser
    try:
        result = chain.invoke(inputs)
    except Exception as e:
        print(f"[QuizGenerator] Primary failed ({e}), falling back...")
        chain = quiz_prompt | llm.fallback | quiz_parser
        result = chain.invoke(inputs)
    return json.loads(result.model_dump_json())


# ═══════════════════════════════════════════════════════════
# Worksheet Generator
# ═══════════════════════════════════════════════════════════

worksheet_parser = PydanticOutputParser(pydantic_object=WorksheetOutput)

worksheet_prompt = PromptTemplate(
    template=(
        "You are an expert teacher creating a print-ready worksheet.\n"
        "Subject: {subject}\n"
        "Grade Level: {grade_level}\n"
        "Topic: {topic}\n"
        "Difficulty: {difficulty}\n"
        "Number of Questions: {number_of_questions}\n\n"
        "{format_instructions}"
    ),
    input_variables=["subject", "grade_level", "topic", "difficulty", "number_of_questions"],
    partial_variables={"format_instructions": worksheet_parser.get_format_instructions()},
)


def generate_worksheet(request: WorksheetGeneratorRequest) -> dict:
    inputs = {
        "subject": request.subject,
        "grade_level": request.grade_level,
        "topic": request.topic,
        "difficulty": request.difficulty,
        "number_of_questions": request.number_of_questions,
    }
    chain = worksheet_prompt | llm.primary | worksheet_parser
    try:
        result = chain.invoke(inputs)
    except Exception as e:
        print(f"[WorksheetGenerator] Primary failed ({e}), falling back...")
        chain = worksheet_prompt | llm.fallback | worksheet_parser
        result = chain.invoke(inputs)
    return json.loads(result.model_dump_json())


# ═══════════════════════════════════════════════════════════
# Activity Generator
# ═══════════════════════════════════════════════════════════

activity_parser = PydanticOutputParser(pydantic_object=ActivityOutput)

activity_prompt = PromptTemplate(
    template=(
        "You are an expert teacher designing an engaging classroom activity.\n"
        "Subject: {subject}\n"
        "Grade Level: {grade_level}\n"
        "Topic: {topic}\n"
        "Duration: {duration_minutes} minutes\n"
        "Activity Type: {activity_type}\n\n"
        "{format_instructions}"
    ),
    input_variables=["subject", "grade_level", "topic", "duration_minutes", "activity_type"],
    partial_variables={"format_instructions": activity_parser.get_format_instructions()},
)


def generate_activity(request: ActivityGeneratorRequest) -> dict:
    inputs = {
        "subject": request.subject,
        "grade_level": request.grade_level,
        "topic": request.topic,
        "duration_minutes": request.duration_minutes,
        "activity_type": request.activity_type,
    }
    chain = activity_prompt | llm.primary | activity_parser
    try:
        result = chain.invoke(inputs)
    except Exception as e:
        print(f"[ActivityGenerator] Primary failed ({e}), falling back...")
        chain = activity_prompt | llm.fallback | activity_parser
        result = chain.invoke(inputs)
    return json.loads(result.model_dump_json())


# ═══════════════════════════════════════════════════════════
# AI Assistant (Orchestrator)
# ═══════════════════════════════════════════════════════════

tool_choice_parser = PydanticOutputParser(pydantic_object=ToolChoice)

router_prompt = PromptTemplate(
    template=(
        "Decide which teaching tool should handle this user request.\n"
        "- lesson_plan: user wants a full lesson plan\n"
        "- quiz: user wants quiz/test questions\n"
        "- worksheet: user wants a printable worksheet\n"
        "- activity: user wants a classroom activity/game/discussion\n"
        "- general: anything else (explaining a concept, analysis, general Q&A)\n\n"
        "User message: {message}\n\n"
        "{format_instructions}"
    ),
    input_variables=["message"],
    partial_variables={"format_instructions": tool_choice_parser.get_format_instructions()},
)

extraction_parsers = {
    "lesson_plan": PydanticOutputParser(pydantic_object=LessonPlanRequest),
    "quiz": PydanticOutputParser(pydantic_object=QuizGeneratorRequest),
    "worksheet": PydanticOutputParser(pydantic_object=WorksheetGeneratorRequest),
    "activity": PydanticOutputParser(pydantic_object=ActivityGeneratorRequest),
}

extraction_prompt_template = PromptTemplate(
    template=(
        "Extract structured parameters from the user's message to call the {tool_name} tool. "
        "If a field isn't mentioned, make a reasonable assumption appropriate for a classroom teacher.\n\n"
        "User message: {message}\n\n"
        "{format_instructions}"
    ),
    input_variables=["tool_name", "message"],
    partial_variables={},
)

tool_dispatch = {
    "lesson_plan": generate_lesson_plan,
    "quiz": generate_quiz,
    "worksheet": generate_worksheet,
    "activity": generate_activity,
}


def _invoke_with_fallback(chain_primary, chain_fallback, inputs):
    try:
        return chain_primary.invoke(inputs)
    except Exception as e:
        print(f"[Orchestrator] Primary failed ({e}), falling back...")
        return chain_fallback.invoke(inputs)


def _format_tool_result_human_readable(tool_name: str, result: dict) -> str:
    if not isinstance(result, dict):
        return str(result)

    title = result.get("title") or result.get("name") or "Here is your teaching material"
    if tool_name == "lesson_plan":
        objectives = result.get("objectives") or []
        materials = result.get("materials") or []
        activities = result.get("main_activities") or []
        lines = [
            f"Here’s a clear lesson plan for {title}.",
            "",
            "Objectives:",
        ]
        for i, item in enumerate(objectives, 1):
            lines.append(f"{i}. {item}")
        if materials:
            lines.extend(["", "Materials:"])
            for i, item in enumerate(materials, 1):
                lines.append(f"{i}. {item}")
        if activities:
            lines.extend(["", "Main activities:"])
            for i, item in enumerate(activities, 1):
                lines.append(f"{i}. {item}")
        if result.get("warm_up"):
            lines.extend(["", f"Warm-up: {result.get('warm_up')}"])
        if result.get("assessment"):
            lines.extend(["", f"Assessment: {result.get('assessment')}"])
        if result.get("closure"):
            lines.extend(["", f"Closure: {result.get('closure')}"])
        return "\n".join(lines)

    if tool_name == "quiz":
        questions = result.get("questions") or []
        lines = [f"I created a quiz titled {title} with {len(questions)} questions."]
        for i, q in enumerate(questions, 1):
            lines.append("")
            lines.append(f"{i}. {q.get('question', '')}")
            options = q.get("options") or []
            if options:
                for j, option in enumerate(options, 1):
                    lines.append(f"   {chr(96 + j)}. {option}")
            if q.get("correct_answer"):
                lines.append(f"   Correct answer: {q.get('correct_answer')}")
            if q.get("explanation"):
                lines.append(f"   Explanation: {q.get('explanation')}")
        return "\n".join(lines)

    if tool_name == "worksheet":
        problems = result.get("problems") or []
        lines = [f"I prepared a worksheet called {title}."]
        if result.get("instructions"):
            lines.append("")
            lines.append(result.get("instructions"))
        for i, problem in enumerate(problems, 1):
            lines.append("")
            lines.append(f"{i}. {problem.get('prompt', '')}")
            if problem.get("answer"):
                lines.append(f"   Sample answer: {problem.get('answer')}")
        return "\n".join(lines)

    if tool_name == "activity":
        materials = result.get("materials") or []
        instructions = result.get("instructions") or []
        lines = [f"Here is an activity idea called {title}."]
        if result.get("overview"):
            lines.extend(["", result.get("overview")])
        if materials:
            lines.extend(["", "Materials:"])
            for i, item in enumerate(materials, 1):
                lines.append(f"{i}. {item}")
        if instructions:
            lines.extend(["", "Instructions:"])
            for i, item in enumerate(instructions, 1):
                lines.append(f"{i}. {item}")
        if result.get("wrap_up"):
            lines.extend(["", f"Wrap-up: {result.get('wrap_up')}"])
        return "\n".join(lines)

    return json.dumps(result, ensure_ascii=False, indent=2)


def ai_assistant(request: AIAssistantRequest) -> dict:
    message = request.quick_action if request.quick_action else request.message

    router_chain_p = router_prompt | llm.primary | tool_choice_parser
    router_chain_f = router_prompt | llm.fallback | tool_choice_parser
    tool_choice = _invoke_with_fallback(router_chain_p, router_chain_f, {"message": message})

    if tool_choice.tool == "general":
        general_prompt = PromptTemplate(
            template=(
                "You are a helpful AI teaching copilot. Answer the teacher's question clearly and practically.\n\n"
                "Question: {message}"
            ),
            input_variables=["message"],
        )
        chain_p = general_prompt | llm.primary
        chain_f = general_prompt | llm.fallback
        response = _invoke_with_fallback(chain_p, chain_f, {"message": message})
        return {
            "tool_used": "general",
            "response": response.content if hasattr(response, "content") else str(response),
        }

    parser = extraction_parsers[tool_choice.tool]
    extraction_prompt = PromptTemplate(
        template=extraction_prompt_template.template,
        input_variables=["tool_name", "message"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    chain_p = extraction_prompt | llm.primary | parser
    chain_f = extraction_prompt | llm.fallback | parser
    extracted_request = _invoke_with_fallback(
        chain_p, chain_f, {"tool_name": tool_choice.tool, "message": message}
    )

    result = tool_dispatch[tool_choice.tool](extracted_request)
    human_response = _format_tool_result_human_readable(tool_choice.tool, result)

    return {
        "tool_used": tool_choice.tool,
        "parameters": json.loads(extracted_request.model_dump_json()),
        "response": human_response,
        "result": result,
    }


# ═══════════════════════════════════════════════════════════
# Teaching Materials
# ═══════════════════════════════════════════════════════════

materials_parser = PydanticOutputParser(pydantic_object=TeachingMaterialsOutput)

materials_prompt = PromptTemplate(
    template=(
        "You are an expert teacher creating multiple teaching materials from a single topic, "
        "so the teacher doesn't have to rewrite the same content repeatedly.\n"
        "Subject: {subject}\n"
        "Grade Level: {grade_level}\n"
        "Topic: {topic}\n"
        "Only generate these formats, leave the rest null: {formats}\n\n"
        "{format_instructions}"
    ),
    input_variables=["subject", "grade_level", "topic", "formats"],
    partial_variables={"format_instructions": materials_parser.get_format_instructions()},
)


def generate_teaching_materials(request: TeachingMaterialsRequest) -> dict:
    inputs = {
        "subject": request.subject,
        "grade_level": request.grade_level,
        "topic": request.topic,
        "formats": ", ".join(request.formats),
    }
    chain = materials_prompt | llm.primary | materials_parser
    try:
        result = chain.invoke(inputs)
    except Exception as e:
        print(f"[TeachingMaterials] Primary failed ({e}), falling back...")
        chain = materials_prompt | llm.fallback | materials_parser
        result = chain.invoke(inputs)
    return json.loads(result.model_dump_json())


# ═══════════════════════════════════════════════════════════
# Student Performance Analysis
# ═══════════════════════════════════════════════════════════

performance_parser = PydanticOutputParser(pydantic_object=StudentPerformanceOutput)

performance_prompt = PromptTemplate(
    template=(
        "You are an expert teaching analyst. A teacher uploaded quiz/assignment results broken down by concept.\n"
        "Subject: {subject}\n"
        "Grade Level: {grade_level}\n"
        "Assessment: {assessment_name}\n"
        "Concept results (concept, students_struggling, total_students):\n{concept_results}\n\n"
        "Identify which concepts need the most attention, explain severity, give a clear recommendation per concept "
        "(e.g. 'X students are struggling with Y. Consider revisiting this concept before moving forward.'), "
        "and generate a targeted mini-lesson for every concept marked 'high' severity.\n\n"
        "{format_instructions}"
    ),
    input_variables=["subject", "grade_level", "assessment_name", "concept_results"],
    partial_variables={"format_instructions": performance_parser.get_format_instructions()},
)


def analyze_student_performance(request: StudentPerformanceRequest) -> dict:
    concept_lines = "\n".join(
        f"- {c.concept}: {c.students_struggling} struggling"
        + (f" / {c.total_students} total" if c.total_students else "")
        for c in request.concept_results
    )
    inputs = {
        "subject": request.subject,
        "grade_level": request.grade_level,
        "assessment_name": request.assessment_name or "Unnamed assessment",
        "concept_results": concept_lines,
    }
    chain = performance_prompt | llm.primary | performance_parser
    try:
        result = chain.invoke(inputs)
    except Exception as e:
        print(f"[StudentPerformance] Primary failed ({e}), falling back...")
        chain = performance_prompt | llm.fallback | performance_parser
        result = chain.invoke(inputs)
    return json.loads(result.model_dump_json())


# ═══════════════════════════════════════════════════════════
# Student Questions Analysis
# ═══════════════════════════════════════════════════════════

questions_parser = PydanticOutputParser(pydantic_object=StudentQuestionsOutput)

questions_prompt = PromptTemplate(
    template=(
        "You are an expert teaching analyst. Students submitted questions after a lesson. "
        "Cluster the questions into confusion themes (do not use quiz scores, use the questions themselves).\n"
        "Subject: {subject}\n"
        "Grade Level: {grade_level}\n"
        "Topic: {topic}\n"
        "Student questions:\n{student_questions}\n\n"
        "Rank themes by how many questions fall into each, and generate one clarification mini-lesson "
        "targeting the biggest theme(s).\n\n"
        "{format_instructions}"
    ),
    input_variables=["subject", "grade_level", "topic", "student_questions"],
    partial_variables={"format_instructions": questions_parser.get_format_instructions()},
)


def analyze_student_questions(request: StudentQuestionsRequest) -> dict:
    inputs = {
        "subject": request.subject,
        "grade_level": request.grade_level,
        "topic": request.topic,
        "student_questions": "\n".join(f"- {q}" for q in request.student_questions),
    }
    chain = questions_prompt | llm.primary | questions_parser
    try:
        result = chain.invoke(inputs)
    except Exception as e:
        print(f"[StudentQuestions] Primary failed ({e}), falling back...")
        chain = questions_prompt | llm.fallback | questions_parser
        result = chain.invoke(inputs)
    return json.loads(result.model_dump_json())