import React, { useState, useCallback } from "react";
import { CandidateResult } from "@/lib/api";
import { ChevronDown, ChevronUp, GripVertical, FileText } from "lucide-react";

type SortKey = keyof CandidateResult;

interface Props {
  results: CandidateResult[];
  onReorder: (results: CandidateResult[]) => void;
}

const CandidateResultsTable = ({ results, onReorder }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Guard: always use an array
  const safeResults: CandidateResult[] = Array.isArray(results) ? results : [];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = sortKey
    ? [...safeResults].sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        if (typeof va === "number" && typeof vb === "number") {
          return sortAsc ? va - vb : vb - va;
        }
        return sortAsc
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      })
    : safeResults;

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = useCallback(
    (targetIdx: number) => {
      if (dragIdx === null || dragIdx === targetIdx) return;
      const updated = [...results];
      const [moved] = updated.splice(dragIdx, 1);
      updated.splice(targetIdx, 0, moved);
      onReorder(updated);
      setDragIdx(null);
      setSortKey(null);
    },
    [dragIdx, results, onReorder]
  );

  const columns: { key: SortKey; label: string }[] = [
    { key: "filename", label: "Candidate Name" },
    { key: "matched_skills", label: "Matched Skills" },
    { key: "skill_score", label: "Skill Score" },
    { key: "semantic_similarity", label: "Experience" },
    { key: "education_rank", label: "Education Rank" },
    { key: "final_score", label: "Score" },
  ];

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortAsc ? (
      <ChevronUp className="w-3 h-3 inline ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-1" />
    );
  };



  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-foreground">Candidate Results</h2>
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No candidates to display yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-8 px-2 py-3" />
                  <th className="w-8 px-2 py-3" />
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer select-none hover:bg-muted/80 transition-colors"
                    >
                      {col.label}
                      <SortIcon col={col.key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, idx) => (
                  <React.Fragment key={r.filename + idx}>
                    <tr
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx)}
                      className={`border-t border-border bg-card hover:bg-muted/30 transition-colors ${
                        dragIdx === idx ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-2 py-3">
                        <button
                          onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedRow === idx ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-2 py-3 cursor-grab">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-destructive flex-shrink-0" />
                          <span className="font-medium">{r.filename}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(r.matched_skills)
                            ? r.matched_skills.slice(0, 3).map((s, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                                >
                                  {s}
                                </span>
                              ))
                            : r.matched_skills}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{r.skill_score}</td>
                      <td className="px-4 py-3 font-medium">{r.semantic_similarity}</td>
                      <td className="px-4 py-3 font-medium">{r.education_rank}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-primary">{r.final_score}</span>
                      </td>
                    </tr>
                    {expandedRow === idx && (
                      <tr key={`exp-${idx}`} className="bg-muted/20">
                        <td colSpan={8} className="px-8 py-4 space-y-4">
                          <div className="flex flex-col gap-2 p-3 bg-muted rounded-md mb-4">
                            <h4 className="font-semibold text-primary text-sm flex items-center justify-between">
                              Candidate Explanation
                              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs">
                                {r.fit_label || "Unknown Fit"}
                              </span>
                            </h4>
                            <p className="text-sm text-foreground/80">{r.explanation}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-4">
                            <div>
                              <span className="text-muted-foreground block mb-2 font-semibold">Score Breakdown</span>
                              <ul className="space-y-1 text-sm text-foreground/80 list-disc list-inside">
                                <li>Skill Match: <span className="font-medium">{r.score_breakdown?.skill_match?.toFixed(3)}</span></li>
                                <li>Similarity: <span className="font-medium">{r.score_breakdown?.semantic_similarity?.toFixed(3)}</span></li>
                                <li>Experience: <span className="font-medium">{r.score_breakdown?.experience?.toFixed(3)}</span></li>
                                <li>Education: <span className="font-medium">{r.score_breakdown?.education?.toFixed(3)}</span></li>
                              </ul>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground block mb-2 font-semibold">Matched Skills</span>
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(r.matched_skills) && r.matched_skills.length > 0
                                  ? r.matched_skills.map((s, i) => (
                                      <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                        {s}
                                      </span>
                                    ))
                                  : <span className="text-sm text-muted-foreground">None</span>}
                              </div>
                            </div>

                            <div>
                              <span className="text-muted-foreground block mb-2 font-semibold">Missing Skills Gap</span>
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(r.missing_skills) && r.missing_skills.length > 0 
                                  ? r.missing_skills.map((s, i) => (
                                      <span key={i} className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                                        {s}
                                      </span>
                                    ))
                                  : <span className="text-sm text-muted-foreground">No missing skills</span>}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground block mb-2 font-semibold">Extra Skills (Resume)</span>
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(r.extra_skills) && r.extra_skills.length > 0 
                                  ? r.extra_skills.slice(0, 10).map((s, i) => ( // show up to 10
                                      <span key={i} className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-medium">
                                        {s}
                                      </span>
                                    ))
                                  : <span className="text-sm text-muted-foreground">No extra skills identified</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default CandidateResultsTable;
