import { Job } from "@/lib/api";

interface Props {
  jobs: Job[];
  selectedJobId: string | null;
  onSelect: (job: Job) => void;
  isLoading: boolean;
  error: string | null;
}

const JobPositionsPanel = ({ jobs, selectedJobId, onSelect, isLoading, error }: Props) => {
  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Open Job Positions</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[180px] h-[120px] rounded-lg border-2 border-border bg-card animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Open Job Positions</h2>
        <p className="text-destructive">{error}</p>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Open Job Positions</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.isArray(jobs) && jobs.length > 0 ? (
          jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => onSelect(job)}
              className={`min-w-[180px] max-w-[200px] p-4 rounded-lg border-2 text-left transition-all duration-200 cursor-pointer flex-shrink-0 ${
                selectedJobId === job.id
                  ? "border-job-card-border bg-job-card-selected-bg shadow-md"
                  : "border-job-card-border/40 bg-card hover:border-job-card-border hover:shadow-sm"
              }`}
            >
              <h3 className="font-semibold text-sm text-primary mb-2 leading-tight">{job.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{job.description}</p>
            </button>
          ))
        ) : (
          <div className="text-muted-foreground text-sm">No jobs available.</div>
        )}
      </div>
    </section>
  );
};

export default JobPositionsPanel;
