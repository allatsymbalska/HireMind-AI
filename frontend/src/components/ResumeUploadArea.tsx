import { useCallback, useState } from "react";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";

interface UploadedFile {
  file: File;
  status: "uploading" | "success" | "error";
}

interface Props {
  jobTitle: string;
  onFilesSelected: (files: File[]) => void;
  isScanning: boolean;
  uploadedFiles: UploadedFile[];
}

const ResumeUploadArea = ({ jobTitle, onFilesSelected, isScanning, uploadedFiles }: Props) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(
          (f) => f.type === "application/pdf"
        );
        const nonPdfs = Array.from(e.dataTransfer.files).filter(
          (f) => f.type !== "application/pdf"
        );
        if (nonPdfs.length > 0) {
          alert("Please upload a PDF file.");
        }
        if (files.length > 0) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
      const pdfs = files.filter((file) => file.type === "application/pdf");
      const nonPdfs = files.filter((file) => file.type !== "application/pdf");
      if (nonPdfs.length > 0) {
        alert("Please upload a PDF file.");
      }
      if (pdfs.length > 0) {
        onFilesSelected(pdfs);
      }
    e.target.value = "";
  };

  const totalFiles = uploadedFiles.length;
  const successFiles = uploadedFiles.filter((f) => f.status === "success").length;
  const progressPercent = totalFiles > 0 ? (successFiles / totalFiles) * 100 : 0;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Upload Resumes for {jobTitle}
      </h2>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 p-10 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragOver
            ? "border-upload-zone-border bg-upload-zone-bg scale-[1.01]"
            : "border-upload-zone-border/50 bg-card hover:border-upload-zone-border hover:bg-upload-zone-bg/50"
        }`}
      >
        <Upload className="w-10 h-10 text-upload-zone-border" />
        <span className="text-base font-medium text-foreground">
          Drag & Drop Resumes Here or Click to Upload
        </span>
        <input
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={handleFileInput}
          disabled={isScanning}
        />
      </label>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-success font-medium mb-2">Files uploaded:</p>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-4">
            <div
              className="h-full bg-progress-bar rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            {uploadedFiles.map((uf, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 bg-card"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-destructive" />
                  <span className="text-sm font-medium text-foreground">{uf.file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {uf.status === "uploading" ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">Uploaded Successfully</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isScanning && (
        <div className="flex items-center gap-3 mt-4 p-4 rounded-lg bg-primary/5">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm font-medium text-primary">Scanning resumes...</span>
        </div>
      )}
    </section>
  );
};

export default ResumeUploadArea;
