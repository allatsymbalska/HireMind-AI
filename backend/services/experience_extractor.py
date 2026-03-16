import re

def extract_experience(text: str) -> int:
    """
    Extract years of experience from resume text using regex
    """
    pattern = r'(\d+)\+?\s*(years|yrs)'
    matches = re.findall(pattern, text.lower())
    years = [int(m[0]) for m in matches]
    return max(years) if years else 0