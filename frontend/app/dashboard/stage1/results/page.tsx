"use client";

import { useEffect, useState } from "react";
import { RecommendationData, StandardRecommendation } from "@/types";
import Link from "next/link";

export default function ResultsPage() {
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get answers from sessionStorage
    const storedAnswers = sessionStorage.getItem("questionnaireAnswers");
    if (!storedAnswers) {
      // Redirect back to questionnaire if no answers
      window.location.href = "/dashboard/stage1";
      return;
    }

    const answers = JSON.parse(storedAnswers);
    
    // TODO: Fetch recommendation from API
    // For now, using mock data based on answers
    const mockRecommendation: RecommendationData = {
      questionnaireAnswers: {
        yearsOfExperience: "≥ 5 years",
        roleType: "Technical",
        leadershipRoles: ["Tech Lead/Principal Engineer"],
        achievements: ["Salary/Equity/Bonus", "Open Source Contributions", "Technical Innovation"],
        hasFinancialProof: true,
      },
      recommendedPath: "ExceptionalTalent",
      recommendedStandards: {
        mc: {
          standardType: "MC",
          name: "Recognition as Leading Talent in Digital Technology",
          recommendedEvidenceTypes: [
            "Proof you lead/work for a product-led technology company (company profile, product deck, org chart)",
            "Leadership impact evidence (team charter, OKRs, stakeholder testimonials)",
            "Career progression documentation (promotion records, performance evaluations)",
            "Industry recognition (media coverage, awards, keynote speaking)",
          ],
          description: "Demonstrate recognition as a leading talent through product-led leadership, impact, and reputation",
        },
        oc1: {
          standardType: "OC1",
          name: "Significant Contribution to Digital Technology",
          recommendedEvidenceTypes: [
            "Product Metrics (Users, Revenue)",
            "Technical Architecture Documents",
            "Project Impact Proof",
          ],
          description: "Show significant contributions through product development, technical innovation, and measurable impact",
        },
        oc3: {
          standardType: "OC3",
          name: "Commercial Success or Product Leadership",
          recommendedEvidenceTypes: [
            "Support letter from employer or commercial partner confirming product leadership",
            "Financial Data (Revenue, Funding)",
            "Product Market Position Proof",
            "Business Contracts",
          ],
          description: "Demonstrate commercial success and product leadership through financial metrics and market position",
        },
      },
      evidenceQuota: {
        mc: 4,
        oc1: 3,
        oc2: 0,
        oc3: 3,
        total: 10,
      },
      successProbability: 85,
    };

    setTimeout(() => {
      setRecommendation(mockRecommendation);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your responses...</p>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">✅</span>
          <h1 className="text-3xl font-bold text-gray-900">
            Recommended Application Path: {recommendation.recommendedPath === "ExceptionalTalent" ? "Exceptional Talent" : "Exceptional Promise"}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Suggested Standard Combination</h2>

        {/* Mandatory Criterion */}
        <div className="mb-8 border-l-4 border-red-500 pl-6">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">🔴</span>
            <h3 className="text-xl font-bold text-gray-900">Mandatory Criterion (MC)</h3>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            {recommendation.recommendedStandards.mc.name}
          </h4>
          <p className="text-gray-600 mb-4">{recommendation.recommendedStandards.mc.description}</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-700 mb-2">Recommended Evidence Types:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {recommendation.recommendedStandards.mc.recommendedEvidenceTypes.map((type, idx) => (
                <li key={idx}>• {type}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Optional Criterion 1 */}
        {recommendation.recommendedStandards.oc1 && (
          <div className="mb-8 border-l-4 border-blue-500 pl-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">🔵</span>
              <h3 className="text-xl font-bold text-gray-900">Optional Criterion 1 (OC1)</h3>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {recommendation.recommendedStandards.oc1.name}
            </h4>
            <p className="text-gray-600 mb-4">{recommendation.recommendedStandards.oc1.description}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-700 mb-2">Recommended Evidence Types:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {recommendation.recommendedStandards.oc1.recommendedEvidenceTypes.map((type, idx) => (
                  <li key={idx}>• {type}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Optional Criterion 3 */}
        {recommendation.recommendedStandards.oc3 && (
          <div className="mb-8 border-l-4 border-green-500 pl-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">🟢</span>
              <h3 className="text-xl font-bold text-gray-900">Optional Criterion 2 (OC3)</h3>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {recommendation.recommendedStandards.oc3.name}
            </h4>
            <p className="text-gray-600 mb-4">{recommendation.recommendedStandards.oc3.description}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-700 mb-2">Recommended Evidence Types:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {recommendation.recommendedStandards.oc3.recommendedEvidenceTypes.map((type, idx) => (
                  <li key={idx}>• {type}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Evidence Quota */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Evidence Quota Allocation Suggestion</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">MC</p>
              <p className="text-2xl font-bold text-indigo-600">{recommendation.evidenceQuota.mc} files</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">OC1</p>
              <p className="text-2xl font-bold text-indigo-600">{recommendation.evidenceQuota.oc1} files</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">OC3</p>
              <p className="text-2xl font-bold text-indigo-600">{recommendation.evidenceQuota.oc3} files</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-indigo-600">{recommendation.evidenceQuota.total} files</p>
            </div>
          </div>
        </div>

        {/* Success Probability */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-lg font-semibold text-gray-900">
            Estimated Success Rate: <span className="text-green-600">{recommendation.successProbability}%</span>
          </p>
        </div>

        {/* Important Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="font-medium text-yellow-800 mb-2">⚠️ Important Note</p>
          <p className="text-yellow-700">
            Mandatory Criterion must include at least one document proving you currently lead or work at a product-led technology company. Each criterion still needs at least two unique evidence files.
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <Link
          href="/dashboard/stage2"
          onClick={() => {
            // Store achievements in sessionStorage for Stage 2
            if (recommendation?.questionnaireAnswers?.achievements) {
              sessionStorage.setItem("userAchievements", JSON.stringify(recommendation.questionnaireAnswers.achievements));
            }
          }}
          className="flex-1 bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors text-center"
        >
          This combination works for me, start uploading materials
        </Link>
        <Link
          href="/dashboard/stage1/select"
          className="flex-1 bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors text-center"
        >
          I want to choose a different standard combination
        </Link>
      </div>
    </div>
  );
}

