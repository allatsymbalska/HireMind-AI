def rank_education(text: str) -> int:
    """
    Rank education level: PhD=5, Master=4, Bachelor=3, Diploma=2, else=1
    """
    text = text.lower()
    if "phd" in text:
        return 5
    elif "master" in text or "msc" in text:
        return 4
    elif "bachelor" in text or "bsc" in text:
        return 3
    elif "diploma" in text:
        return 2
    return 1