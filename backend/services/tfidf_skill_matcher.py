from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

def compute_skill_tfidf_score(job_description: str, resume_text: str, job_skills: list) -> float:
    """
    Compute TF-IDF weighted score for skills match between resume and job description
    """
    corpus = [job_description, resume_text]
    vectorizer = TfidfVectorizer(ngram_range=(1,2), stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(corpus)
    feature_names = vectorizer.get_feature_names_out()
    
    resume_vector = tfidf_matrix[1].toarray()[0]
    skill_scores = []

    for skill in job_skills:
        if skill in feature_names:
            idx = list(feature_names).index(skill)
            skill_scores.append(resume_vector[idx])
    
    return float(np.mean(skill_scores)) if skill_scores else 0