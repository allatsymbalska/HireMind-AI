from pdfminer.high_level import extract_text

def parse_resume(file_path: str) -> str:
    """
    Extract raw text from PDF resume
    """
    text = extract_text(file_path)
    return text