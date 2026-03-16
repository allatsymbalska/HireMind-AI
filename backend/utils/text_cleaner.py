import re

def clean_text(text: str) -> str:
    """
    Lowercase, remove newlines and punctuation
    """
    text = text.lower()
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'[^a-zA-Z0-9 ]', '', text)
    return text