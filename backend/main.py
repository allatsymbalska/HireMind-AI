from fastapi import FastAPI, UploadFile, File, Form
from typing import List
import os, shutil, json

from services.resume_parser import parse_resume
from services.skill_extractor import extract_job_skills, match_resume_skills
from services.experience_extractor import extract_experience
from services.education_ranker import rank_education
from services.tfidf_skill_matcher import compute_skill_tfidf_score
from services.scorer import compute_similarity  # semantic similarity
from utils.text_cleaner import clean_text

from fastapi.responses import JSONResponse
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads'))
os.makedirs(UPLOAD_DIR, exist_ok=True)

# PDF upload endpoint
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    # validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return JSONResponse(content={"filename": file.filename, "message": "Upload successful."})

# load updated job descriptions
with open("config/jobs.json") as f:
    JOBS = json.load(f)


@app.post("/scan-resumes")
async def scan_resumes(
    position_id: str = Form(...),
    files: List[UploadFile] = File(...)
):
    """
    Process resumes for the selected job position.
    Ranking is primarily based on TF-IDF weighted skill matching.
    Semantic similarity, experience, and education are secondary factors.
    """
    if position_id not in JOBS:
        return {"error": "Invalid position_id"}

    job_description = JOBS[position_id]["description"]
    job_skills = extract_job_skills(job_description)

    results = []

    for file in files:
        # save uploaded PDF
        path = f"{UPLOAD_DIR}/{file.filename}"
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # extract and clean resume text
        resume_text = parse_resume(path)
        resume_text = clean_text(resume_text)

        # NLP skill matching
        matched_skills = match_resume_skills(resume_text, job_skills)
        skill_score = compute_skill_tfidf_score(job_description, resume_text, job_skills)

        # semantic similarity from scorer.py (secondary)
        similarity_score = compute_similarity(job_description, resume_text)

        # experience and education (minor factors)
        experience = extract_experience(resume_text)
        education = rank_education(resume_text)

        # final weighted score
        final_score = (
            # main factor
            skill_score * 0.65 +  
            # secondary NLP factor      
            similarity_score * 0.20 + 
            # minor   
            (experience / 10) * 0.10 +   
            # minor
            (education / 5) * 0.05       
        )

        results.append({
            "filename": file.filename,
            "matched_skills": matched_skills,
            "skill_score": skill_score,
            "similarity_score": similarity_score,
            "experience": experience,
            "education_rank": education,
            "final_score": final_score
        })

    # sort candidates by final score descending
    results = sorted(results, key=lambda x: x["final_score"], reverse=True)

    return {
        "position": JOBS[position_id]["title"],
        "best_candidate": results[0] if results else None,
        "ranking": results
    }


@app.get("/jobs")
def list_jobs():
    """
    Return all available job positions.
    """
    return JOBS


@app.get("/jobs/{position_id}")
def get_job(position_id: str):
    """
    Return a single job by its ID.
    """
    if position_id not in JOBS:
        return {"error": "Invalid position_id"}
    return JOBS[position_id]