import { CandidateResult } from "@/lib/api";
import { Download } from "lucide-react";

interface Props {
  results: CandidateResult[];
}

const ExportButtons = ({ results }: Props) => {
  const exportCSV = () => {
    if (results.length === 0) return;
    const headers = ["Filename", "Matched Skills", "Skill Score", "Semantic Similarity", "Experience Rank", "Education Rank", "Final Score"];
    const rows = results.map((r) => [
      r.filename,
      Array.isArray(r.matched_skills) ? r.matched_skills.join("; ") : r.matched_skills,
      r.skill_score,
      r.semantic_similarity,
      r.experience_rank,
      r.education_rank,
      r.final_score,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    downloadFile(csv, "candidates.csv", "text/csv");
  };

  const exportPDF = () => {
    // Simple printable HTML export
    if (results.length === 0) return;
    const html = `<html><head><title>Candidate Results</title><style>
      body{font-family:Inter,sans-serif;padding:20px}
      table{width:100%;border-collapse:collapse;margin-top:20px}
      th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:13px}
      th{background:#f0f4f8;font-weight:600}
      h1{font-size:20px}
    </style></head><body>
    <h1>Candidate Results</h1>
    <table><thead><tr><th>Filename</th><th>Matched Skills</th><th>Skill Score</th><th>Experience</th><th>Education Rank</th><th>Score</th></tr></thead>
    <tbody>${results.map((r) => `<tr><td>${r.filename}</td><td>${Array.isArray(r.matched_skills) ? r.matched_skills.join(", ") : r.matched_skills}</td><td>${r.skill_score}</td><td>${r.semantic_similarity}</td><td>${r.education_rank}</td><td>${r.final_score}</td></tr>`).join("")}</tbody></table></body></html>`;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.print();
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={exportCSV}
        disabled={results.length === 0}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
      <button
        onClick={exportPDF}
        disabled={results.length === 0}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;
