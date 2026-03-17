# HireMind AI – NLP Resume Screening Demo

## Project Overview

HireMind AI is a Proof-of-Concept (PoC) application demonstrating how Natural Language Processing (NLP) can assist in automated resume screening and candidate ranking.

The system analyzes uploaded resumes and compares them with job descriptions using NLP techniques such as skill extraction, TF-IDF matching, and semantic similarity scoring. Candidates are automatically ranked based on how well their resumes match the requirements of a job posting.

This project was developed as an **Independent ML & Data Engineering demo application**.

---

# Key Features

- Upload multiple PDF resumes
- Extract and clean resume text automatically
- Detect and normalize candidate skills using NLP
- Match resume skills against structured job skill requirements
- Calculate TF-IDF skill relevance
- Compute semantic similarity between resume and job description
- Estimate candidate experience and education level
- Generate a weighted candidate ranking score
- Display score breakdown and candidate explanations
- Identify missing skill gaps and extra skills
- Label candidates with interpretable fit levels (Strong Fit, Moderate Fit, Needs Review, Weak Match)
- Interactive recruiter dashboard with sortable results
- Export ranked results as CSV or PDF

---

# System Architecture

The application consists of two main components:

## Frontend
A React + TypeScript dashboard that allows users to:

- Select job positions
- Upload resumes
- View ranked candidates

### Frontend Development

The frontend dashboard was generated with assistance from Lovable AI.  
However:

- The UI was based on my own dashboard design created in Figma
- I implemented additional modifications and adjustments manually
- Styling and layout were refined after the initial Lovable output

The original dashboard design is included in the repository:
```bash
dashboard_design/dashboard_design.pdf
```

![Dashboard Example](dashboard_design/Dashboard_design.png)

---

## Backend

The backend is implemented using FastAPI and performs the NLP analysis and candidate ranking.

It handles:

- Resume upload
- Text extraction
- NLP processing
- Candidate scoring and ranking

---

# NLP Processing Pipeline

The backend processes resumes through the following steps:

1. **Resume Parsing**  
   Extract text from uploaded PDF resumes.

2. **Text Cleaning**  
   Normalize and preprocess the extracted text.

3. **Skill Extraction**  
   Extract relevant skills from job descriptions and resumes.

4. **Skill Matching**  
   Compare candidate skills with required job skills.

5. **TF-IDF Skill Scoring**  
   Calculate relevance of skills using TF-IDF weighting.

6. **Semantic Similarity Scoring**  
   Compare job descriptions and resumes to determine semantic relevance.

7. **Experience Extraction**  
   Estimate candidate experience level.

8. **Education Ranking**  
   Identify education level from resume text.

9. **Score Normalization and Ranking**  
   Skill score, semantic similarity, experience, and education signals are normalized and combined into a weighted ranking score.

10. **Explainable AI Output**  
   The system generates:
   - score breakdown
   - matched skills
   - missing skill gaps
   - candidate fit labels
   - human-readable explanations for recruiters.

---

# Technology Stack

## Frontend

- React
- TypeScript
- TailwindCSS
- Vite
- Lovable AI (initial UI generation)

## Backend

- Python
- FastAPI
- NLP utilities

### NLP Techniques

- Text preprocessing and normalization
- Skill extraction and matching
- TF-IDF skill relevance scoring
- Semantic similarity computation
- Rule-based information extraction
- Explainable scoring and candidate ranking

---

# 
---

# Installation

## Clone the repository

```bash
git clone <repository-url>
cd hiremind-ai
```
---

## Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on:
http://localhost:8000

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on:
http://localhost:8080


---

# Usage

1. Open the dashboard in your browser
2. Select a job position
3. Upload one or more PDF resumes
4. The system analyzes each resume using NLP
5. Candidates are automatically ranked based on relevance

---
## Example Output

The dashboard allows the user to:

- select a job position
- upload one or more PDF resumes
- process resumes through the NLP pipeline
- view ranked candidate results
- inspect score breakdown and explanations
- analyze matched skills and missing skill gaps
- export the results as CSV or PDF

![Dashboard Example](dashboard_design/Dashboard.png)

---
# Legal and Ethical Considerations

AI-based hiring systems must be used carefully to avoid bias and discrimination.

Important considerations include:

- Transparency of ranking criteria
- Avoidance of biased training data
- Human oversight in hiring decisions
- Compliance with GDPR and data protection laws

This project is a **demonstration prototype** and should not be used for real hiring decisions without further validation.

---

# Future Improvements

Potential improvements include:

- Transformer-based embeddings (Sentence-BERT) for improved semantic similarity
- Named Entity Recognition (NER) for advanced skill extraction
- LLM-assisted resume explanations running locally
- Bias detection and fairness auditing tools
- Recruiter feedback loops to improve ranking accuracy
- Support for multilingual resumes

---

# Author

Alla Heinonen

Independent ML & Data Engineering Proof-of-Concept Project
