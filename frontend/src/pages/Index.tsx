import { useState, useEffect, useCallback } from "react";
import { FileText } from "lucide-react";
import { fetchJobs, scanResumes, Job, CandidateResult } from "@/lib/api";
import JobPositionsPanel from "@/components/JobPositionsPanel";
import ResumeUploadArea from "@/components/ResumeUploadArea";
import CandidateResultsTable from "@/components/CandidateResultsTable";
import ExportButtons from "@/components/ExportButtons";

interface UploadedFile {
  file: File;
  status: "uploading" | "success" | "error";
}

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<CandidateResult[]>([]);

  useEffect(() => {
    setJobsLoading(true);
    fetchJobs()
      .then((jobsArr) => setJobs(Array.isArray(jobsArr) ? jobsArr : []))
      .catch((e) => setJobsError(e.message))
      .finally(() => setJobsLoading(false));
  }, []);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setUploadedFiles([]);
    setResults([]);
  };

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      if (!selectedJob) return;

      const newUploaded: UploadedFile[] = files.map((f) => ({
        file: f,
        status: "uploading" as const,
      }));
      setUploadedFiles((prev) => [...prev, ...newUploaded]);

      // Mark all as success after a brief delay to simulate upload feel
      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((uf) =>
            newUploaded.some((nu) => nu.file === uf.file)
              ? { ...uf, status: "success" as const }
              : uf
          )
        );
      }, 600);

      setIsScanning(true);
      try {
        const allFiles = [
          ...uploadedFiles.map((uf) => uf.file),
          ...files,
        ];
        const data = await scanResumes(selectedJob.id, allFiles);
        setResults(data);
      } catch (e: any) {
        console.error("Scan failed:", e);
      } finally {
        setIsScanning(false);
      }
    },
    [selectedJob, uploadedFiles]
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">AI Resume Scanner</h1>
          </div>
          <ExportButtons results={results} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <JobPositionsPanel
          jobs={jobs}
          selectedJobId={selectedJob?.id ?? null}
          onSelect={handleSelectJob}
          isLoading={jobsLoading}
          error={jobsError}
        />

        {selectedJob && (
          <>
            <div className="border-t border-border my-6" />
            <ResumeUploadArea
              jobTitle={selectedJob.title}
              onFilesSelected={handleFilesSelected}
              isScanning={isScanning}
              uploadedFiles={uploadedFiles}
            />
          </>
        )}

        {selectedJob && (
          <>
            <div className="border-t border-border my-6" />
            <CandidateResultsTable
              results={results}
              onReorder={setResults}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
