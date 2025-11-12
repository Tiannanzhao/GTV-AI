"use client";

import { useRef, useState } from "react";
import { Material } from "@/types";

export default function UploadHub() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);

  const handleClickSelect = () => fileInputRef.current?.click();

  const handleFiles = (files: FileList) => {
    const now = new Date().toISOString();
    const newMaterials: Material[] = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      applicationId: "demo-app",
      fileName: f.name,
      filePath: "local://temp", // placeholder
      fileType: f.type || inferTypeFromName(f.name),
      fileSize: f.size,
      uploadDate: now.substring(0, 10),
      createdAt: now,
      updatedAt: now,
      title: f.name,
    }));
    setMaterials((prev) => [...newMaterials, ...prev]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: Upload Area */}
      <div
        className={`rounded-lg border-2 border-dashed p-8 bg-white ${
          isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">📤</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Drag and drop or click to upload materials</h2>
          <p className="text-gray-600 mb-4">Supported formats: PDF, PNG, JPG, DOCX • Each file &lt; 5MB</p>
          <div className="space-x-3">
            <button
              onClick={handleClickSelect}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Select Files
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          />
          <p className="text-sm text-gray-500 mt-4">
            Tip: You can upload raw materials. We will help you turn them into standardized evidence files.
          </p>
        </div>
      </div>

      {/* Right: Material Library */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Uploaded Materials ({materials.length})</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search"
              className="px-3 py-2 border rounded-md text-sm"
            />
            <select className="px-3 py-2 border rounded-md text-sm">
              <option>Filter by type</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3">
          {materials.map((m) => (
            <div key={m.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{m.fileName}</div>
                <div className="text-sm text-gray-500">
                  Unclassified • {m.uploadDate}
                </div>
              </div>
              <div className="flex gap-3">
                <button className="text-indigo-600 hover:underline text-sm">Preview</button>
                <button className="text-gray-700 hover:underline text-sm">Edit</button>
                <button
                  className="text-red-600 hover:underline text-sm"
                  onClick={() => setMaterials((prev) => prev.filter((x) => x.id !== m.id))}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {materials.length === 0 && (
            <div className="text-center text-gray-500 py-8 border rounded-lg">No materials yet. Upload to get started.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function inferTypeFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".doc")) return "application/msword";
  if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "application/octet-stream";
}
