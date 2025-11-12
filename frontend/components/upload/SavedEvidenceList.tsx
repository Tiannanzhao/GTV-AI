"use client";

import React from "react";
import axios from "axios";

interface SavedEvidence {
  id: string;
  evidenceType: string;
  standard: string;
  textContent: string;
  imageCount: number;
  imageNames: string[];
  createdAt: string;
  status: string;
}

interface SavedEvidenceListProps {
  evidences: SavedEvidence[];
  onRefresh: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";

export default function SavedEvidenceList({ evidences, onRefresh }: SavedEvidenceListProps) {
  const handleDelete = async (evidenceId: string) => {
    if (!confirm("Are you sure you want to delete this evidence?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/evidence/${evidenceId}`);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete evidence:", error);
      alert("Failed to delete evidence. Please try again.");
    }
  };

  const standardColors: Record<string, string> = {
    MC: "bg-red-100 text-red-800 border-red-300",
    OC1: "bg-blue-100 text-blue-800 border-blue-300",
    OC2: "bg-purple-100 text-purple-800 border-purple-300",
    OC3: "bg-green-100 text-green-800 border-green-300",
  };

  if (evidences.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No saved evidence yet. Build your first evidence to see it here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Saved Evidence ({evidences.length})
        </h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {evidences.map((evidence) => (
          <div
            key={evidence.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold border ${
                      standardColors[evidence.standard] || "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {evidence.standard}
                  </span>
                  <h3 className="font-semibold text-gray-900">{evidence.evidenceType}</h3>
                </div>
                
                {evidence.textContent && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {evidence.textContent}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    📷 {evidence.imageCount} image{evidence.imageCount !== 1 ? "s" : ""}
                  </span>
                  <span>
                    📅 {new Date(evidence.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    evidence.status === "Draft" 
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {evidence.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => {
                    // TODO: Open edit/view modal
                    alert("Edit functionality coming soon");
                  }}
                  className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded hover:bg-indigo-50"
                >
                  View/Edit
                </button>
                <button
                  onClick={() => handleDelete(evidence.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

