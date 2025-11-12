"use client";

import React, { useState, useRef } from "react";
import axios from "axios";

interface SuggestedEvidence {
  id: string;
  evidenceType: string;
  standard: string;
  standardName: string;
  description: string;
}

interface EvidenceBuilderProps {
  evidence: SuggestedEvidence;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";

async function getCurrentEvidenceCounts() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/evidence/list?applicationId=demo-app`);
    const evidences = response.data.evidence || [];
    return {
      mc: evidences.filter((e: any) => e.standard === "MC").length,
      oc1: evidences.filter((e: any) => e.standard === "OC1").length,
      oc2: evidences.filter((e: any) => e.standard === "OC2").length,
      oc3: evidences.filter((e: any) => e.standard === "OC3").length,
    };
  } catch {
    return { mc: 0, oc1: 0, oc2: 0, oc3: 0 };
  }
}

export default function EvidenceBuilder({ evidence }: EvidenceBuilderProps) {
  const [images, setImages] = useState<File[]>([]);
  const [textContent, setTextContent] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGeneratePreview = async () => {
    if (images.length === 0 && !textContent.trim()) {
      alert("Please upload at least one image or add text content");
      return;
    }

    setGenerating(true);
    try {
      console.log("Generating preview...", {
        images: images.length,
        textLength: textContent.length,
        evidenceType: evidence.evidenceType,
        standard: evidence.standard,
        apiUrl: `${API_BASE_URL}/api/evidence/generate-preview`,
      });

      // Create FormData for file upload
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      formData.append("textContent", textContent);
      formData.append("evidenceType", evidence.evidenceType);
      formData.append("standard", evidence.standard);

      // Call backend API to generate preview
      const response = await axios.post(
        `${API_BASE_URL}/api/evidence/generate-preview`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
          timeout: 30000, // 30 second timeout
        }
      );

      console.log("Response received:", {
        status: response.status,
        contentType: response.headers["content-type"],
        dataSize: response.data?.size,
      });

      // Check if response is valid
      if (!response.data) {
        throw new Error("No data received from server");
      }

      // Check if it's actually a PDF
      if (response.headers["content-type"] !== "application/pdf" && 
          !response.data.type?.includes("pdf")) {
        // Try to read as text to see error message
        const text = await response.data.text();
        console.error("Non-PDF response:", text);
        throw new Error(`Server returned non-PDF response: ${text.substring(0, 200)}`);
      }

      // Create preview URL from blob
      const previewUrl = URL.createObjectURL(response.data);
      console.log("Preview URL created:", previewUrl);
      setPreview(previewUrl);
    } catch (error: any) {
      console.error("Failed to generate preview:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config?.url,
      });
      
      let errorMessage = "Failed to generate preview.";
      
      if (error.code === "ECONNREFUSED" || error.message?.includes("Network Error")) {
        errorMessage = "Cannot connect to backend server. Please make sure the backend is running on http://localhost:8000";
      } else if (error.response?.status === 500) {
        errorMessage = `Server error: ${error.response?.data?.detail || error.message}`;
      } else if (error.response?.data) {
        // Try to parse error response
        const errorData = error.response.data;
        if (typeof errorData === "string") {
          errorMessage = errorData.substring(0, 200);
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } else {
        errorMessage = error.message || "Unknown error occurred";
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (images.length === 0 && !textContent.trim()) {
      alert("Please upload at least one image or add text content");
      return;
    }

    // Check quota before saving (will be validated on backend too)
    // This is a client-side check for better UX
    const currentCounts = await getCurrentEvidenceCounts();
    const standard = evidence.standard.toLowerCase();
    
    if (standard === "mc" && currentCounts.mc >= 4) {
      if (!confirm(`You already have 4 MC evidence files. Adding more may exceed the requirement. Continue?`)) {
        return;
      }
    } else if ((standard === "oc1" || standard === "oc2" || standard === "oc3") && currentCounts[standard] >= 3) {
      if (!confirm(`You already have 3 ${evidence.standard} evidence files. Adding more may exceed the requirement. Continue?`)) {
        return;
      }
    }

    try {
      // Create FormData for saving
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("textContent", textContent);
      formData.append("evidenceType", evidence.evidenceType);
      formData.append("standard", evidence.standard);
      formData.append("applicationId", "demo-app"); // TODO: Get from auth

      const response = await axios.post(
        `${API_BASE_URL}/api/evidence/save`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Evidence saved successfully!");
      
      // Clear form after successful save
      setImages([]);
      setTextContent("");
      setPreview(null);
      
      // Emit event to refresh evidence list
      window.dispatchEvent(new CustomEvent("evidenceSaved", { detail: response.data }));
      
    } catch (error: any) {
      console.error("Failed to save evidence:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to save evidence. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-600 px-2 py-1 bg-gray-100 rounded">
            {evidence.standard}
          </span>
          <h2 className="text-2xl font-bold text-gray-900">{evidence.evidenceType}</h2>
        </div>
        <p className="text-gray-600 text-sm">{evidence.description}</p>
      </div>

      <div className="space-y-6">
        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              + Add Images
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Upload images related to this evidence (screenshots, documents, photos, etc.)
            </p>
          </div>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Text Content Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidence Description / Text Content
          </label>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={6}
            placeholder="Describe this evidence, add key information, metrics, dates, or any relevant details..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">
              This text will be combined with your images to create the evidence preview
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
              <p className="text-xs text-blue-800">
                <strong>AI Enhancement:</strong> Our system will automatically identify organizations, products, events, and programs mentioned in your text and add relevant background information to strengthen your evidence.
              </p>
            </div>
          </div>
        </div>

        {/* Generate Preview Button */}
        <div className="flex gap-3">
          <button
            onClick={handleGeneratePreview}
            disabled={generating || (images.length === 0 && !textContent.trim())}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {generating ? "Generating Preview..." : "Generate AI Preview"}
          </button>
          {preview && (
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Save Evidence
            </button>
          )}
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Generated Preview</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <iframe
                src={preview}
                className="w-full h-[600px] border rounded"
                title="Evidence Preview"
              />
              <div className="mt-4 flex gap-3">
                <a
                  href={preview}
                  download={`evidence-${evidence.id}.pdf`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                  Download Preview PDF
                </a>
                <button
                  onClick={() => setPreview(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

