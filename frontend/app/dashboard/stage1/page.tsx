"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Questionnaire from "@/components/questionnaire/Questionnaire";
import { QuestionnaireAnswers } from "@/types";

export default function Stage1Page() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Check if all questions are answered
  useEffect(() => {
    const required = ["yearsOfExperience", "selectedRoles", "leadershipRoles", "achievements"];
    const allAnswered = required.every((key) => {
      const value = answers[key as keyof QuestionnaireAnswers];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== "";
    });
    setIsComplete(allAnswered);
  }, [answers]);

  const handleSubmit = async () => {
    if (!isComplete) return;
    
    // Store answers in sessionStorage for results page
    const withFinancial = { ...answers, hasFinancialProof: true };
    sessionStorage.setItem("questionnaireAnswers", JSON.stringify(withFinancial));
    router.push("/dashboard/stage1/results");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Let&apos;s Match Your Tech Nation Criteria
        </h1>
        <p className="text-lg text-gray-600">
          Answer a few questions, and we&apos;ll help you find the strongest application path
        </p>
      </div>

      <Questionnaire
        answers={answers}
        onAnswersChange={setAnswers}
        currentQuestion={currentQuestion}
        onQuestionChange={setCurrentQuestion}
        onSubmit={handleSubmit}
        isComplete={isComplete}
      />
    </div>
  );
}

