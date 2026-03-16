import { useCallback, useRef, useState } from "react";
import { Upload, FileText, CheckCircle, Loader2, XCircle } from "lucide-react";
import { uploadPdf } from "../lib/upload";

interface UploadedFile {
  file: File;
  status: "uploading" | "success" | "error";
  errorMsg?: string;
}

interface Props {
  onUploadSuccess?: (filename: string) => void;
}

const DragAndDropPdfUpload = ({ onUploadSuccess }: Props) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    const pdfs = files.filter((f) => f.type === "application/pdf");
    const nonPdfs = files.filter((f) => f.type !== "application/pdf");
    const newUploads: UploadedFile[] = pdfs.map((file) => ({ file, status: "uploading" }));
    setUploadedFiles((prev) => [...prev, ...newUploads]);

    for (const file of pdfs) {
      try {
        const res = await uploadPdf(file);
        setUploadedFiles((prev) =>
          prev.map((uf) =>
            uf.file === file ? { ...uf, status: "success" } : uf
          )
        );
        onUploadSuccess?.(res.filename);
      } catch (err: any) {
        setUploadedFiles((prev) =>
          prev.map((uf) =>
            uf.file === file ? { ...uf, status: "error", errorMsg: err.message } : uf
          )
        );
      }
    }
    // Mark non-PDFs as error
    if (nonPdfs.length > 0) {
      setUploadedFiles((prev) => [
        ...prev,
        ...nonPdfs.map((file) => ({ file, status: "error", errorMsg: "Only PDF files allowed" })),
      ]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
    e.target.value = "";
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Upload PDF Resume</h2>
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
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-10 h-10 text-upload-zone-border" />
        <span className="text-base font-medium text-foreground">
          Drag & Drop PDF Here or Click to Upload
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileInput}
        />
      </label>
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
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
                  {uf.status === "uploading" && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                  {uf.status === "success" && (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">Uploaded</span>
                    </>
                  )}
                  {uf.status === "error" && (
                    <>
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">{uf.errorMsg || "Error"}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default DragAndDropPdfUpload;
