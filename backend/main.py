import os
import json
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from PyPDF2 import PdfReader
import io
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_API_KEY or GENAI_API_KEY == "your_gemini_api_key_here":
    print("WARNING: GEMINI_API_KEY is missing or using placeholder.")
    GENAI_API_KEY = None
else:
    genai.configure(api_key=GENAI_API_KEY)
    # Using the standard naming for 1.5 flash
    model = genai.GenerativeModel('gemini-1.5-flash')

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

class RoadmapRequest(BaseModel):
    branch: str
    target_role: str

class InterviewRequest(BaseModel):
    domain: str
    difficulty: str
    answers: List[dict] = []

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not GENAI_API_KEY:
        return {"response": "Hi! I'm in mock mode because no API key was found. I can still help you navigate the app! Try uploading a resume or starting an interview simulation."}
    try:
        # Attempt primary model
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(request.message)
        return {"response": response.text}
    except Exception as e:
        # Fallback to gemini-pro if flash is unavailable
        if "404" in str(e) or "not found" in str(e).lower():
            try:
                fallback_model = genai.GenerativeModel('gemini-pro')
                response = fallback_model.generate_content(request.message)
                return {"response": response.text}
            except Exception as fe:
                raise HTTPException(status_code=500, detail=f"Models unavailable: {str(fe)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-resume")
async def analyze_resume(file: UploadFile = File(...), job_role: str = Form(None)):
    if not GENAI_API_KEY:
        return {
            "ats_score": 85,
            "skills": ["React", "Python", "FastAPI"],
            "keywords_found": ["Development", "AI", "Cloud"],
            "missing_skills": ["Docker", "Kubernetes"],
            "improvement_tips": ["Add more quantifiable achievements.", "Highlight your project leadership roles."],
            "job_match_percentage": 78.5,
            "match_suggestions": "Focus on backend optimizations to better match the Senior Developer role."
        }
    try:
        content = await file.read()
        pdf = PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
        
        prompt = f"""
        Analyze the following resume text and provide feedback in JSON format.
        Resume Text: {text}
        Job Role: {job_role if job_role else "General Placement"}
        
        Return JSON with:
        - ats_score (0-100)
        - skills (list)
        - keywords_found (list)
        - missing_skills (list)
        - improvement_tips (list)
        - job_match_percentage (float, if job_role provided)
        - match_suggestions (string, if job_role provided)
        """
        
        response = model.generate_content(prompt)
        json_str = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(json_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-roadmap")
async def generate_roadmap(request: RoadmapRequest):
    if not GENAI_API_KEY:
        return [
            {"week": 1, "title": "Fundamentals & DSA", "topics": ["Arrays", "Strings", "Complexity Analysis"], "goal": "Master basic data structures."},
            {"week": 2, "title": "Advanced DSA", "topics": ["LinkedLists", "Trees", "Graphs"], "goal": "Solve medium level problems."},
            {"week": 3, "title": "Core Subjects", "topics": ["DBMS", "OS", "Networking"], "goal": "Understand underlying systems."},
            {"week": 4, "title": "Project Phase 1", "topics": ["Frontend Basics", "UI/UX", "Responsive Design"], "goal": "Build a static portfolio."},
        ]
    try:
        prompt = f"""
        Generate a detailed 8-week career roadmap for a {request.branch} student targeting a {request.target_role} role.
        Include weekly topics for: DSA, Tech Stack, Projects, and Aptitude.
        Return as a JSON list of weeks, where each week has 'week' (number), 'title', 'topics' (list), and 'goal'.
        """
        response = model.generate_content(prompt)
        json_str = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(json_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/evaluate")
async def evaluate_interview(request: InterviewRequest):
    if not GENAI_API_KEY:
        return {
            "overall_score": 8,
            "strengths": ["Clear communication", "Good technical knowledge"],
            "weaknesses": ["Pacing was a bit fast", "Could explain edge cases better"],
            "suggestions": ["Practice whiteboarding", "Deepen knowledge in system design"],
            "technical_accuracy": 8.5,
            "clarity_score": 9.0
        }
    try:
        prompt = f"""
        Evaluate this mock interview for {request.domain} at {request.difficulty} difficulty.
        Q&A Pairs: {json.dumps(request.answers)}
        
        Provide feedback in JSON:
        - overall_score (0-10)
        - strengths (list)
        - weaknesses (list)
        - suggestions (list)
        - technical_accuracy (0-10)
        - clarity_score (0-10)
        """
        response = model.generate_content(prompt)
        json_str = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(json_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
