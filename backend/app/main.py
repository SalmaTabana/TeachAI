"""
main.py
───────
FastAPI application exposing all TeachAI tools as HTTP endpoints.

Endpoints:
  GET  /                          → health check
  POST /api/lesson-plan           → generate lesson plan
  POST /api/quiz                  → generate quiz
  POST /api/worksheet             → generate worksheet
  POST /api/activity              → generate classroom activity
  POST /api/assistant             → AI Assistant (orchestrator)
  POST /api/materials             → generate teaching materials
  POST /api/student-performance   → analyze student performance
  POST /api/student-questions     → analyze student questions
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db, SessionLocal, Teacher, Resource, AuthSession
from .auth import hash_password, verify_password, create_session, get_current_teacher
from pydantic import BaseModel
from typing import Any
import json

class AuthRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(AuthRequest):
    name: str

class AuthResponse(BaseModel):
    token: str
    user: dict[str, Any]

class ResourceResponse(BaseModel):
    id: int
    title: str
    type: str
    subject: str
    grade: str
    date: str
    icon: str
    color: str
    content: Any

class ResourceCreate(BaseModel):
    title: str
    type: str
    subject: str = "General"
    grade: str = ""
    content: Any


from .schemas import (
    LessonPlanRequest,
    QuizGeneratorRequest,
    WorksheetGeneratorRequest,
    ActivityGeneratorRequest,
    AIAssistantRequest,
    TeachingMaterialsRequest,
    StudentPerformanceRequest,
    StudentQuestionsRequest,
)

from .ai_engine import (
    generate_lesson_plan,
    generate_quiz,
    generate_worksheet,
    generate_activity,
    ai_assistant,
    generate_teaching_materials,
    analyze_student_performance,
    analyze_student_questions,
)


# ═══════════════════════════════════════════════════════════
# App Setup
# ═══════════════════════════════════════════════════════════

app = FastAPI(
    title="TeachAI API",
    description="Backend API for TeachAI — an AI teaching copilot for educators.",
    version="1.0.0",
)


# ═══════════════════════════════════════════════════════════
# CORS (allow the frontend dev server to call this API)
# ═══════════════════════════════════════════════════════════
app.add_middleware( 
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=False, 
    allow_methods=["*"], 
    allow_headers=["*"], 
) 



init_db()


@app.post("/api/auth/register", response_model=AuthResponse)
def register(request: RegisterRequest):
    if len(request.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    with SessionLocal() as db:
        existing = db.query(Teacher).filter(Teacher.email == request.email.lower()).first()
        if existing:
            raise HTTPException(status_code=409, detail="An account with this email already exists.")
        teacher = Teacher(name=request.name.strip(), email=request.email.lower(), password_hash=hash_password(request.password))
        db.add(teacher)
        db.commit()
        db.refresh(teacher)
        token = create_session(teacher.id)
        return {"token": token, "user": {"id": teacher.id, "name": teacher.name, "email": teacher.email, "role": teacher.role, "avatar": ''.join(x[0] for x in teacher.name.split()[:2]).upper()}}

@app.post("/api/auth/login", response_model=AuthResponse)
def login(request: AuthRequest):
    with SessionLocal() as db:
        teacher = db.query(Teacher).filter(Teacher.email == request.email.lower()).first()
        if not teacher or not verify_password(request.password, teacher.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        token = create_session(teacher.id)
        return {"token": token, "user": {"id": teacher.id, "name": teacher.name, "email": teacher.email, "role": teacher.role, "avatar": ''.join(x[0] for x in teacher.name.split()[:2]).upper()}}

@app.post("/api/auth/logout")
def logout(authorization: str | None = Header(default=None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()
        with SessionLocal() as db:
            session = db.get(AuthSession, token)
            if session:
                db.delete(session)
                db.commit()
    return {"status": "ok"}

@app.get("/api/me")
def me(teacher: Teacher = Depends(get_current_teacher)):
    return {"id": teacher.id, "name": teacher.name, "email": teacher.email, "role": teacher.role, "avatar": ''.join(x[0] for x in teacher.name.split()[:2]).upper()}

def _resource_meta(resource_type: str):
    return {
        "Lesson": ("📚", "indigo"), "Quiz": ("❓", "violet"), "Worksheet": ("📄", "cyan"),
        "Activity": ("🎯", "emerald"), "Materials": ("✨", "indigo"), "Student Analysis": ("📊", "emerald"),
    }.get(resource_type, ("📄", "indigo"))

def save_resource(teacher_id: int, title: str, resource_type: str, subject: str, grade: str, content: Any):
    with SessionLocal() as db:
        r = Resource(teacher_id=teacher_id, title=title, resource_type=resource_type, subject=subject or "General", grade=grade or "", content=json.dumps(content, ensure_ascii=False, default=str))
        db.add(r)
        db.commit()
        return r

@app.get("/api/resources")
def resources(teacher: Teacher = Depends(get_current_teacher)):
    with SessionLocal() as db:
        rows = db.query(Resource).filter(Resource.teacher_id == teacher.id).order_by(Resource.created_at.desc()).all()
        result=[]
        for r in rows:
            icon,color=_resource_meta(r.resource_type)
            result.append({"id":r.id,"title":r.title,"type":r.resource_type,"subject":r.subject,"grade":r.grade,"date":r.created_at.isoformat(),"icon":icon,"color":color,"content":json.loads(r.content)})
        return result

@app.delete("/api/resources/{resource_id}")
def delete_resource(resource_id: int, teacher: Teacher = Depends(get_current_teacher)):
    with SessionLocal() as db:
        r=db.query(Resource).filter(Resource.id==resource_id, Resource.teacher_id==teacher.id).first()
        if not r: raise HTTPException(status_code=404, detail="Resource not found.")
        db.delete(r); db.commit(); return {"status":"deleted"}

@app.get("/api/student-insights")
def student_insights(teacher: Teacher = Depends(get_current_teacher)):
    with SessionLocal() as db:
        latest = (db.query(Resource)
                  .filter(Resource.teacher_id == teacher.id, Resource.resource_type == "Student Analysis")
                  .order_by(Resource.created_at.desc())
                  .first())
        if not latest:
            return {
                "has_data": False, "summary": "", "recommendation": "", "subject": "",
                "grade_level": "", "assessment_name": "", "total_students": 0,
                "class_average": 0, "students_needing_support": 0, "concepts": [], "insights": []
            }

        content = json.loads(latest.content)
        meta = content.get("_meta", {}) if isinstance(content, dict) else {}
        raw_concepts = meta.get("concept_results", [])
        raw_insights = content.get("insights", []) if isinstance(content, dict) else []

        concepts = []
        for i, item in enumerate(raw_concepts):
            total = item.get("total_students")
            struggling = int(item.get("students_struggling", 0))
            score = round(max(0, min(100, 100 - (struggling / total * 100))) if total else 0)
            matching = next((x for x in raw_insights if x.get("concept") == item.get("concept")), {})
            severity = matching.get("severity", "low")
            concepts.append({
                "concept": item.get("concept", "Unknown"),
                "students_struggling": struggling,
                "severity": severity,
                "recommendation": matching.get("recommendation", "Review this concept with your class."),
                "score": score,
                "color": {"high": "rose", "moderate": "amber", "low": "emerald"}.get(severity, "indigo")
            })

        concepts.sort(key=lambda x: x["score"])
        total_students = max([int(x.get("total_students") or 0) for x in raw_concepts] or [0])
        if total_students:
            total_struggling = sum(int(x.get("students_struggling", 0)) for x in raw_concepts)
            avg_score = round(sum(x["score"] for x in concepts) / len(concepts)) if concepts else 0
            support = max([int(x.get("students_struggling", 0)) for x in raw_concepts] or [0])
        else:
            avg_score = round(sum(x["score"] for x in concepts) / len(concepts)) if concepts else 0
            support = sum(1 for x in concepts if x["score"] <= 40)

        first = concepts[0] if concepts else None
        return {
            "has_data": True,
            "summary": content.get("summary", "Student performance analysis is available."),
            "recommendation": first["recommendation"] if first else "Review the latest analysis with your class.",
            "subject": meta.get("subject", latest.subject),
            "grade_level": meta.get("grade_level", latest.grade),
            "assessment_name": meta.get("assessment_name", latest.title),
            "total_students": total_students,
            "class_average": avg_score,
            "students_needing_support": support,
            "concepts": concepts,
            "insights": raw_insights
        }


@app.get("/api/dashboard")
def dashboard(teacher: Teacher = Depends(get_current_teacher)):
    with SessionLocal() as db:
        rows=db.query(Resource).filter(Resource.teacher_id==teacher.id).order_by(Resource.created_at.desc()).all()
        counts={t:sum(1 for r in rows if r.resource_type==t) for t in ["Lesson","Quiz","Worksheet","Activity"]}
        recent=[]
        for r in rows[:4]:
            icon,color=_resource_meta(r.resource_type)
            recent.append({"id":r.id,"title":r.title,"type":r.resource_type,"grade":r.grade,"subject":r.subject,"date":r.created_at.isoformat(),"icon":icon,"color":color})
        latest_analysis = next((r for r in rows if r.resource_type == "Student Analysis"), None)
        student_insight = {"has_data": False, "summary": "No student performance analysis yet.", "recommendation": "Run a Student Performance analysis to generate personalized insights."}
        if latest_analysis:
            try:
                content = json.loads(latest_analysis.content)
                student_insight = {
                    "has_data": True,
                    "summary": content.get("summary", "Student performance analysis is available."),
                    "recommendation": ((content.get("insights") or [{}])[0]).get("recommendation", "Review the latest student analysis for recommended actions.")
                }
            except Exception:
                pass
        return {"stats": {"lessons_created":counts["Lesson"],"quizzes_generated":counts["Quiz"],"worksheets":counts["Worksheet"],"activities":counts["Activity"],"resources_total":len(rows)}, "recent_work":recent, "student_insight":student_insight}


# ═══════════════════════════════════════════════════════════
# Health Check
# ═══════════════════════════════════════════════════════════

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "TeachAI API",
        "version": "1.0.0",
        "docs": "/docs",
    }


# ═══════════════════════════════════════════════════════════
# Tool Endpoints
# ═══════════════════════════════════════════════════════════

@app.post("/api/lesson-plan")
def api_lesson_plan(request: LessonPlanRequest, teacher: Teacher = Depends(get_current_teacher)):
    try:
        result = generate_lesson_plan(request)
        save_resource(teacher.id, result["title"], "Lesson", request.subject, request.grade_level, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/quiz")
def api_quiz(request: QuizGeneratorRequest, teacher: Teacher = Depends(get_current_teacher)):
    try:
        result = generate_quiz(request)
        save_resource(teacher.id, result["title"], "Quiz", request.subject, request.grade_level, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/worksheet")
def api_worksheet(request: WorksheetGeneratorRequest, teacher: Teacher = Depends(get_current_teacher)):
    try:
        result = generate_worksheet(request)
        save_resource(teacher.id, result["title"], "Worksheet", request.subject, request.grade_level, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/activity")
def api_activity(request: ActivityGeneratorRequest, teacher: Teacher = Depends(get_current_teacher)):
    try:
        result = generate_activity(request)
        save_resource(teacher.id, result["title"], "Activity", request.subject, request.grade_level, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/assistant")
def api_assistant(request: AIAssistantRequest):
    try:
        return ai_assistant(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/materials")
def api_materials(request: TeachingMaterialsRequest, teacher: Teacher = Depends(get_current_teacher)):
    try:
        result = generate_teaching_materials(request)
        save_resource(teacher.id, f"{request.topic} Teaching Materials", "Materials", request.subject, request.grade_level, result.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/student-performance")
def api_student_performance(request: StudentPerformanceRequest, teacher: Teacher = Depends(get_current_teacher)):
    try:
        result = analyze_student_performance(request)
        result_content = dict(result)
        result_content["_meta"] = {
            "subject": request.subject,
            "grade_level": request.grade_level,
            "assessment_name": request.assessment_name or "Unnamed assessment",
            "concept_results": [c.model_dump() for c in request.concept_results],
        }
        save_resource(teacher.id, request.assessment_name or f"{request.subject} Student Analysis", "Student Analysis", request.subject, request.grade_level, result_content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/student-questions")
def api_student_questions(request: StudentQuestionsRequest, teacher: Teacher = Depends(get_current_teacher)):
    try:
        return analyze_student_questions(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))