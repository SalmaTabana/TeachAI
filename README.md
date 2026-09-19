# TeachAI

TeachAI is a React/Vite frontend with a FastAPI backend backed by Groq.

## Requirements

- Node.js 18+
- Python 3.10+
- A Groq API key

## Install

From the project root:

```powershell
npm install
```

Create `backend/.env` and add your Groq API key:

```powershell
New-Item -ItemType File -Path backend/.env -Force
Add-Content backend/.env "GROQ_API_KEY=your_groq_api_key_here"
```

Replace `your_groq_api_key_here` with the key provided to your team. Do not commit `backend/.env`.

Install and run the backend:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

In a second terminal, from the project root, run the frontend:

```powershell
npm run dev
```

Open http://localhost:8443.

The authenticated dashboard shows `AI backend connected` when the frontend can reach `http://localhost:8000`. The API documentation is available at http://localhost:8000/docs.

## Connected AI features

Quiz Generator, Worksheet Generator, Activity Generator, Lesson Planner, and AI Assistant call the FastAPI endpoints. Generated quiz questions and answers come from the backend response; no quiz fixture is used by the frontend.
