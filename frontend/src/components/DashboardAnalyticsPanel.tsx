import { CandidateResult } from "@/lib/api";

export const DashboardAnalyticsPanel = ({ results }: { results: CandidateResult[] }) => {
  if (!results || results.length === 0) return null;

  const avgScore = results.reduce((acc, r) => acc + r.final_score, 0) / results.length;
  const bestScore = Math.max(...results.map(r => r.final_score));
  
  const allSkills = results.flatMap(r => Array.isArray(r.matched_skills) ? r.matched_skills : []);
  const skillCounts = allSkills.reduce((acc: Record<string, number>, skill: string) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});
  const sortedSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]);
  const topSkill = sortedSkills[0] || ["None", 0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
        <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">Total Candidates</h3>
        <p className="text-2xl font-bold text-foreground">{results.length}</p>
      </div>
      <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
        <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">Avg. Score / Best</h3>
        <p className="text-2xl font-bold text-foreground">{avgScore.toFixed(2)} <span className="text-sm text-muted-foreground font-normal">/ {bestScore.toFixed(2)}</span></p>
      </div>
      <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
        <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">Most Common Skill</h3>
        <p className="text-2xl font-bold text-foreground truncate">{topSkill[0]} <span className="text-sm text-muted-foreground font-normal">({topSkill[1]})</span></p>
      </div>
    </div>
  );
};
