import os
import json
from openai import AsyncOpenAI
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from PyPDF2 import PdfReader
import io
from docx import Document
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

# Configure Grok API
GROK_API_KEY = os.getenv("GROK_API_KEY")
if not GROK_API_KEY or GROK_API_KEY == "your_grok_api_key_here":
    print("WARNING: GROK_API_KEY is missing or using placeholder.")
    GROK_API_KEY = None
    client = None
else:
    client = AsyncOpenAI(
        api_key=GROK_API_KEY,
        base_url="https://api.groq.com/openai/v1",
    )

class ChatRequest(BaseModel):
    message: str
    user_name: Optional[str] = "User"
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
    if not GROK_API_KEY:
        return {"response": f"Hi {request.user_name}! I'm in mock mode because no Grok API key was found. I can still help you navigate the app! Try uploading a resume or starting an interview simulation."}
    try:
        system_instruction = f"""You are Ascendia AI, a helpful placement assistant. The user's name is {request.user_name}. 

FORMATTING RULES (STRICT):
- **Differences**: When comparing two or more concepts, ALWAYS use a Markdown table.
- **Code Blocks**: Only include code blocks if specifically asked or when explaining a complex algorithm. DO NOT include code for simple definitions.
- **Sections**: Break responses into clear sections using ### headings.
- **Bolding**: Use **bold text** for key terms.
- **Concise**: Use bullet points. Keep each point max 1-2 lines. No long paragraphs.
- **Visuals**: Use relevant emojis (📌, ✅, 💡, 🔥, ⚡) sparingly.
- **Structure**: Always include a 💡 **Pro Tip** or **Example** section only if it adds real value."""
        
        messages = [{"role": "system", "content": system_instruction}]
        for msg in request.history:
            messages.append({"role": "user" if msg["role"] == "user" else "assistant", "content": msg["content"]})
        messages.append({"role": "user", "content": request.message})

        completion = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        print(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-resume")
async def analyze_resume(file: UploadFile = File(...), job_role: str = Form(None)):
    if not GROK_API_KEY:
        return {
            "ats_score": 85,
            "skills": ["React", "Python", "FastAPI"],
            "keywords_found": ["Development", "AI", "Cloud"],
            "missing_skills": ["Docker", "Kubernetes"],
            "improvement_tips": ["Add more quantifiable achievements.", "Highlight your project leadership roles."],
            "job_match_percentage": 78.5,
            "match_suggestions": "Focus on backend optimizations to better match the Senior Developer role.",
            "improved_resume": "John Doe\\nSoftware Engineer\\n\\nProfessional Summary... (This is mock improved text)"
        }
    try:
        content = await file.read()
        text = ""
        
        if file.filename.endswith(".docx"):
            doc = Document(io.BytesIO(content))
            text = "\\n".join([para.text for para in doc.paragraphs])
        else:
            pdf = PdfReader(io.BytesIO(content))
            for page in pdf.pages:
                text += page.extract_text()
        
        prompt = f"""
        Analyze the following resume text and provide feedback in JSON format.
        Resume Text: {text}
        Job Role: {job_role if job_role else "General Placement"}
        
        Also, provide an "improved_resume" field where you rewrite the resume text to be highly professional, ATS-friendly, and impactful.
        
        Return JSON strictly matching this schema with no markdown formatting:
        {{
            "ats_score": int (0-100),
            "skills": [string],
            "keywords_found": [string],
            "missing_skills": [string],
            "improvement_tips": [string],
            "job_match_percentage": float,
            "match_suggestions": string,
            "improved_resume": string
        }}
        """
        
        completion = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
        )
        json_str = completion.choices[0].message.content.replace("```json", "").replace("```", "").strip()
        return json.loads(json_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-roadmap")
async def generate_roadmap(request: RoadmapRequest):
    if not GROK_API_KEY:
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
        Return as a JSON list of objects strictly matching this schema with no markdown formatting:
        [{{
            "week": int,
            "title": string,
            "topics": [string],
            "goal": string
        }}]
        """
        completion = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
        )
        json_str = completion.choices[0].message.content.replace("```json", "").replace("```", "").strip()
        return json.loads(json_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/evaluate")
async def evaluate_interview(request: InterviewRequest):
    if not GROK_API_KEY:
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
        
        Provide feedback in JSON strictly matching this schema with no markdown formatting:
        {{
            "overall_score": int (0-10),
            "strengths": [string],
            "weaknesses": [string],
            "suggestions": [string],
            "technical_accuracy": float (0-10),
            "clarity_score": float (0-10)
        }}
        """
        completion = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
        )
        json_str = completion.choices[0].message.content.replace("```json", "").replace("```", "").strip()
        return json.loads(json_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
