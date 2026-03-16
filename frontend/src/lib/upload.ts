const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function uploadPdf(file: File): Promise<{ filename: string; message: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload-pdf`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to upload PDF");
  }
  return res.json();
}
