"use client";

import { useState, useEffect } from "react";
import EvidenceBuilder from "@/components/upload/EvidenceBuilder";
import SavedEvidenceList from "@/components/upload/SavedEvidenceList";
import { RecommendationData } from "@/types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";

interface SuggestedEvidence {
  id: string;
  evidenceType: string;
  standard: string;
  standardName: string;
  description: string;
}

export default function Stage2Page() {
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [suggestedEvidences, setSuggestedEvidences] = useState<SuggestedEvidence[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<SuggestedEvidence | null>(null);
  const [savedEvidences, setSavedEvidences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"build" | "saved">("build");
  
  // Evidence quota tracking
  const [evidenceQuota, setEvidenceQuota] = useState({
    mc: { required: 4, current: 0 },
    oc1: { required: 3, current: 0 },
    oc2: { required: 3, current: 0 },
    oc3: { required: 3, current: 0 },
  });

  const loadSavedEvidences = async () => {
    if (!recommendation) return; // Don't load if recommendation not ready
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/evidence/list?applicationId=demo-app`);
      const evidences = response.data.evidence || [];
      setSavedEvidences(evidences);
      
      // Calculate current evidence counts by standard (only count saved evidences)
      const counts = {
        mc: evidences.filter((e: any) => e.standard === "MC").length,
        oc1: evidences.filter((e: any) => e.standard === "OC1").length,
        oc2: evidences.filter((e: any) => e.standard === "OC2").length,
        oc3: evidences.filter((e: any) => e.standard === "OC3").length,
      };
      
      // Update quota based on recommendation
      const required = {
        mc: 4, // Always 4 for MC
        oc1: recommendation.recommendedStandards.oc1 ? 3 : 0,
        oc2: recommendation.recommendedStandards.oc2 ? 3 : 0,
        oc3: recommendation.recommendedStandards.oc3 ? 3 : 0,
      };
      
      setEvidenceQuota({
        mc: { required: required.mc, current: counts.mc },
        oc1: { required: required.oc1, current: counts.oc1 },
        oc2: { required: required.oc2, current: counts.oc2 },
        oc3: { required: required.oc3, current: counts.oc3 },
      });
    } catch (error) {
      console.error("Failed to load saved evidences:", error);
    }
  };

  useEffect(() => {
    // Get recommendation data from Stage 1
    const storedRecommendation = sessionStorage.getItem("recommendationData");
    if (storedRecommendation) {
      const rec: RecommendationData = JSON.parse(storedRecommendation);
      setRecommendation(rec);
      
      // Build suggested evidence list from recommendation
      const evidences: SuggestedEvidence[] = [];
      let evidenceId = 1;
      
      // MC evidences
      if (rec.recommendedStandards.mc) {
        rec.recommendedStandards.mc.recommendedEvidenceTypes.forEach((evidenceType, index) => {
          evidences.push({
            id: `mc-${evidenceId++}`,
            evidenceType,
            standard: "MC",
            standardName: rec.recommendedStandards.mc.name,
            description: rec.recommendedStandards.mc.description,
          });
        });
      }
      
      // OC1 evidences
      const oc1 = rec.recommendedStandards.oc1;
      if (oc1) {
        oc1.recommendedEvidenceTypes.forEach((evidenceType) => {
          evidences.push({
            id: `oc1-${evidenceId++}`,
            evidenceType,
            standard: "OC1",
            standardName: oc1.name,
            description: oc1.description,
          });
        });
      }
      
      // OC2 evidences
      const oc2 = rec.recommendedStandards.oc2;
      if (oc2) {
        oc2.recommendedEvidenceTypes.forEach((evidenceType) => {
          evidences.push({
            id: `oc2-${evidenceId++}`,
            evidenceType,
            standard: "OC2",
            standardName: oc2.name,
            description: oc2.description,
          });
        });
      }
      
      // OC3 evidences
      const oc3 = rec.recommendedStandards.oc3;
      if (oc3) {
        oc3.recommendedEvidenceTypes.forEach((evidenceType) => {
          evidences.push({
            id: `oc3-${evidenceId++}`,
            evidenceType,
            standard: "OC3",
            standardName: oc3.name,
            description: oc3.description,
          });
        });
      }
      
      setSuggestedEvidences(evidences);
      setLoading(false);
      
      // Auto-select first evidence if available
      if (evidences.length > 0) {
        setSelectedEvidence(evidences[0]);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (recommendation) {
      loadSavedEvidences();
    }

    // Listen for evidence saved events
    const handleEvidenceSaved = () => {
      if (recommendation) {
        loadSavedEvidences();
      }
      setActiveTab("saved"); // Switch to saved tab after saving
    };
    window.addEventListener("evidenceSaved", handleEvidenceSaved);

    return () => {
      window.removeEventListener("evidenceSaved", handleEvidenceSaved);
    };
  }, [recommendation]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading suggested evidence files...</p>
        </div>
      </div>
    );
  }

  if (!recommendation || suggestedEvidences.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            No recommendation data found. Please complete Stage 1 first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Evidence Files</h1>
        <p className="text-lg text-gray-600 mb-4">
          Select a suggested evidence file below and upload images/text to build your evidence. AI will combine them into a preview.
        </p>
        
        {/* Requirements reminder */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Requirements:</strong> You need 4 MC evidence files and 3 evidence files for each selected OC standard.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab("build")}
            className={`px-4 py-2 font-medium ${
              activeTab === "build"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Build Evidence ({suggestedEvidences.length})
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 font-medium ${
              activeTab === "saved"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Saved Evidence ({savedEvidences.length})
          </button>
        </div>
      </div>

      {activeTab === "build" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Suggested Evidence Files List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Suggested Evidence Files</h2>
              <div className="space-y-3">
                {suggestedEvidences.map((evidence) => {
                const isSelected = selectedEvidence?.id === evidence.id;
                const standardColors: Record<string, string> = {
                  MC: "border-red-500 bg-red-50",
                  OC1: "border-blue-500 bg-blue-50",
                  OC2: "border-purple-500 bg-purple-50",
                  OC3: "border-green-500 bg-green-50",
                };
                const colorClass = standardColors[evidence.standard] || "border-gray-300 bg-gray-50";

                return (
                  <button
                    key={evidence.id}
                    onClick={() => setSelectedEvidence(evidence)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `${colorClass} ring-2 ring-indigo-500`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600 px-2 py-1 bg-white rounded">
                        {evidence.standard}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {evidence.evidenceType}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {evidence.standardName}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

          {/* Right: Evidence Builder */}
          <div className="lg:col-span-2">
            {selectedEvidence ? (
              <EvidenceBuilder evidence={selectedEvidence} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                Select an evidence file to start building
              </div>
            )}
          </div>
        </div>
      ) : (
        <SavedEvidenceList 
          evidences={savedEvidences} 
          onRefresh={loadSavedEvidences}
        />
      )}
    </div>
  );
}
