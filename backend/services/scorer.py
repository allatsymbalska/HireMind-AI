from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")

def compute_similarity(job_description: str, resume_text: str) -> float:
    """
    Compute semantic similarity between job description and resume using embeddings.
    Returns float between 0 and 1.
    """
    job_vec = model.encode([job_description])
    resume_vec = model.encode([resume_text])
    similarity = cosine_similarity(job_vec, resume_vec)[0][0]
    return float(similarity)