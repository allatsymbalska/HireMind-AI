import spacy

nlp = spacy.load("en_core_web_sm")

def extract_job_skills(job_description: str):
    """
    Extract skills from job description using NLP POS tagging (NOUN/PROPN)
    """
    doc = nlp(job_description.lower())
    skills = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"]]
    return list(set(skills))

def match_resume_skills(resume_text: str, job_skills: list):
    """
    Match job skills with resume text
    """
    resume_text = resume_text.lower()
    matched = [skill for skill in job_skills if skill in resume_text]
    return matched