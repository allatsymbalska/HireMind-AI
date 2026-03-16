const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface Job {
  id: string;
  title: string;
  description: string;
}

export interface CandidateResult {
  filename: string;
  matched_skills: string[];
  skill_score: number;
  semantic_similarity: number;
  experience_rank: number;
  education_rank: number;
  final_score: number;
  score_breakdown: {
    skill_match: number;
    semantic_similarity: number;
    experience: number;
    education: number;
  };
  missing_skills: string[];
  extra_skills: string[];
  explanation: string;
  fit_label: string;
}

export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) throw new Error("Failed to fetch jobs");

  const jobsObj = await res.json();

  return Object.entries(jobsObj).map(([id, job]) => {
    const typedJob = job as Omit<Job, "id">;

    return {
      id,
      title: typedJob.title,
      description: typedJob.description,
    };
  });
}

export async function scanResumes(
  positionId: string,
  files: File[]
): Promise<CandidateResult[]> {
  const formData = new FormData();
  formData.append("position_id", positionId);
  files.forEach((f) => formData.append("files", f));

  const res = await fetch(`${API_BASE}/scan-resumes`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to scan resumes");
  const data = await res.json();
  const ranking = Array.isArray(data.ranking) ? data.ranking : [];
  return ranking.map((item: any) => ({
    filename: item.filename ?? "",
    fit_label: item.fit_label ?? "Unknown",
    explanation: item.explanation ?? "",
    score_breakdown: item.score_breakdown || {
      skill_match: 0,
      semantic_similarity: 0,
      experience: 0,
      education: 0
    },
    missing_skills: Array.isArray(item.missing_skills) ? item.missing_skills : [],
    extra_skills: Array.isArray(item.extra_skills) ? item.extra_skills : [],
    matched_skills: Array.isArray(item.matched_skills) ? item.matched_skills : [],
    skill_score: typeof item.skill_score === "number" ? item.skill_score : 0,
    semantic_similarity: typeof item.similarity_score === "number" ? item.similarity_score : 0,
    experience_rank: typeof item.experience === "number" ? item.experience : 0,
    education_rank: typeof item.education_rank === "number" ? item.education_rank : (typeof item.education === "number" ? item.education : 0),
    final_score: typeof item.final_score === "number" ? item.final_score : 0,
  }));
}