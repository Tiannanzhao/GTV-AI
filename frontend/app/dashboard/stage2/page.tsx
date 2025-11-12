"use client";

import { useState, useEffect } from "react";
import AchievementMaterialCollector from "@/components/upload/AchievementMaterialCollector";

export default function Stage2Page() {
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    // Get achievements from Stage 1 results (stored in sessionStorage)
    // Try both locations (from results page or from questionnaire)
    const storedAchievements = sessionStorage.getItem("userAchievements");
    if (storedAchievements) {
      const userAchievements = JSON.parse(storedAchievements);
      setAchievements(userAchievements);
    } else {
      // Fallback to questionnaire answers
      const storedAnswers = sessionStorage.getItem("questionnaireAnswers");
      if (storedAnswers) {
        const answers = JSON.parse(storedAnswers);
        const userAchievements = answers.achievements || [];
        setAchievements(userAchievements);
      }
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Collect Materials by Achievement</h1>
        <p className="text-lg text-gray-600">
          Each achievement requires specific materials. Upload files or write content based on what Tech Nation requires for each achievement type.
        </p>
      </div>

      {achievements.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            No achievements selected. Please complete Stage 1 first to see your achievements.
          </p>
        </div>
      ) : (
        <AchievementMaterialCollector achievements={achievements} />
      )}
    </div>
  );
}
