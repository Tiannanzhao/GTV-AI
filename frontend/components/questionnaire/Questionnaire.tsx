"use client";

import { useState } from "react";
import { QuestionnaireAnswers } from "@/types";
import QuestionCard from "./QuestionCard";

interface QuestionnaireProps {
  answers: Partial<QuestionnaireAnswers>;
  onAnswersChange: (answers: Partial<QuestionnaireAnswers>) => void;
  currentQuestion: number;
  onQuestionChange: (index: number) => void;
  onSubmit: () => void;
  isComplete: boolean;
}

type QuestionDef = {
  id: string;
  question: string;
  type: "single" | "multiple";
  options: { value: any; label: string; note?: string }[];
  note?: string;
};

const questions: QuestionDef[] = [
  {
    id: "yearsOfExperience",
    question: "How many years of experience do you have in the tech field?",
    type: "single",
    options: [
      { value: "< 5 years", label: "Less than 5 years", note: "Recommended: Exceptional Promise" },
      { value: "≥ 5 years", label: "5 years or more", note: "Recommended: Exceptional Talent. Note: Professionals with more than 5 years cannot apply for Exceptional Promise" },
    ],
  },
  {
    id: "selectedRoles",
    question: "What is your role? (Select up to 2)",
    type: "multiple",
    options: [
      { value: "Software Engineer / Developer", label: "Software Engineer / Developer" },
      { value: "Frontend Engineer", label: "Frontend Engineer" },
      { value: "Backend Engineer", label: "Backend Engineer" },
      { value: "Full-stack Engineer", label: "Full-stack Engineer" },
      { value: "Engineering Manager / Tech Lead", label: "Engineering Manager / Tech Lead" },
      { value: "Solutions Architect", label: "Solutions Architect" },
      { value: "DevOps / SRE", label: "DevOps / SRE" },
      { value: "Data Scientist / ML Engineer", label: "Data Scientist / ML Engineer" },
      { value: "AI Researcher", label: "AI Researcher" },
      { value: "Cybersecurity Specialist", label: "Cybersecurity Specialist" },
      { value: "Mobile Engineer", label: "Mobile Engineer" },
      { value: "Product Manager", label: "Product Manager" },
      { value: "Product Designer / UX", label: "Product Designer / UX" },
      { value: "Founder / Co-founder", label: "Founder / Co-founder" },
      { value: "CTO / VP Engineering", label: "CTO / VP Engineering" },
      { value: "CPO / Head of Product", label: "CPO / Head of Product" },
      { value: "CEO / COO (Product-led)", label: "CEO / COO (Product-led)" },
      { value: "Growth / Growth Product", label: "Growth / Growth Product" },
      { value: "Sales Engineer / Solutions Engineer", label: "Sales Engineer / Solutions Engineer" },
      { value: "Technical Program Manager", label: "Technical Program Manager" },
    ],
    note: "You can select one or two roles. We will help you choose the best final role when your 10 evidences are ready.",
  },
  {
    id: "leadershipRoles",
    question: "Have you held any of the following roles in the past 5 years?",
    type: "multiple",
    options: [
      { value: "Founder/Co-founder", label: "Founder/Co-founder" },
      { value: "C-level Executive", label: "C-level Executive" },
      { value: "Tech Lead/Principal Engineer", label: "Tech Lead/Principal Engineer" },
      { value: "Product Lead", label: "Product Lead" },
    ],
  },
  {
    id: "achievements",
    question: "Which of the following achievements do you have?",
    type: "multiple",
    options: [
      { value: "Salary/Equity/Bonus", label: "Salary, Equity, Bonus" },
      { value: "Media Coverage/Interviews", label: "Media Coverage/Interviews" },
      { value: "Conference Speaking", label: "Conference Speaking" },
      { value: "Open Source Contributions", label: "Open Source Contributions" },
      { value: "Tech Blog/Articles", label: "Tech Blog/Articles Published" },
      { value: "Mentor/Reviewer Role", label: "Mentor/Reviewer Role" },
      { value: "Product Launch with Users/Revenue", label: "Product Launch with Users/Revenue Data" },
      { value: "Technical Innovation", label: "Technical Innovation" },
      { value: "Industry Awards", label: "Industry Awards" },
      // New options
      { value: "Leading a Project", label: "Leading a Project" },
      { value: "Innovative Product/Concept", label: "Worked on an Innovative Product or Concept" },
      { value: "Industry Community Leadership", label: "Industry Community Leadership" },
      { value: "Generated Substantial Profits", label: "Generated Substantial Profits" },
      { value: "Other__INPUT__", label: "Other (specify)" },
    ],
  },
];

export default function Questionnaire({
  answers,
  onAnswersChange,
  currentQuestion,
  onQuestionChange,
  onSubmit,
  isComplete,
}: QuestionnaireProps) {
  const [localAnswers, setLocalAnswers] = useState(answers);
  const [otherAchievement, setOtherAchievement] = useState("");

  const handleAnswer = (questionId: string, value: any) => {
    const newAnswers = { ...localAnswers };
    
    if (questionId === "leadershipRoles" || questionId === "achievements" || questionId === "selectedRoles") {
      const currentArray = (newAnswers[questionId as keyof QuestionnaireAnswers] as string[]) || [];
      if (currentArray.includes(value)) {
        newAnswers[questionId as keyof QuestionnaireAnswers] = currentArray.filter((v) => v !== value) as any;
      } else {
        // Limit to max 2 selections for selectedRoles
        if (questionId === "selectedRoles" && currentArray.length >= 2) {
          // ignore extra selections beyond 2
          setLocalAnswers(newAnswers);
          onAnswersChange(newAnswers);
          return;
        }
        // For achievements: handle special Other__INPUT__ toggle
        if (questionId === "achievements" && value === "Other__INPUT__") {
          // toggle presence of placeholder; actual text managed separately
          newAnswers[questionId as keyof QuestionnaireAnswers] = [...currentArray, value] as any;
          setLocalAnswers(newAnswers);
          onAnswersChange(newAnswers);
          return;
        }
        newAnswers[questionId as keyof QuestionnaireAnswers] = [...currentArray, value] as any;
      }

      // Infer roleType automatically from selectedRoles
      if (questionId === "selectedRoles") {
        const roles = (newAnswers["selectedRoles" as keyof QuestionnaireAnswers] as string[]) || [];
        const technicalSet = new Set([
          "Software Engineer / Developer",
          "Frontend Engineer",
          "Backend Engineer",
          "Full-stack Engineer",
          "Engineering Manager / Tech Lead",
          "Solutions Architect",
          "DevOps / SRE",
          "Data Scientist / ML Engineer",
          "AI Researcher",
          "Cybersecurity Specialist",
          "Mobile Engineer",
          "Sales Engineer / Solutions Engineer",
          "Technical Program Manager",
          "CTO / VP Engineering",
        ]);
        const businessSet = new Set([
          "Product Manager",
          "Product Designer / UX",
          "Founder / Co-founder",
          "CPO / Head of Product",
          "CEO / COO (Product-led)",
          "Growth / Growth Product",
        ]);
        const hasTech = roles.some((r) => technicalSet.has(r));
        const hasBiz = roles.some((r) => businessSet.has(r));
        (newAnswers as any).roleType = hasTech && hasBiz ? "Both" : hasTech ? "Technical" : hasBiz ? "Business" : "Technical";
      }
    } else {
      newAnswers[questionId as keyof QuestionnaireAnswers] = value as any;
    }
    
    setLocalAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      onQuestionChange(currentQuestion + 1);
    } else {
      // Submit questionnaire
      onSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      onQuestionChange(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <QuestionCard
        question={currentQ}
        answer={localAnswers[currentQ.id as keyof QuestionnaireAnswers]}
        onAnswer={(value) => handleAnswer(currentQ.id, value)}
      />

      {/* Other achievements input */}
      {currentQ.id === "achievements" && Array.isArray(localAnswers.achievements) && localAnswers.achievements.includes("Other__INPUT__") && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Please specify other achievements</label>
          <input
            type="text"
            value={otherAchievement}
            onChange={(e) => {
              const text = e.target.value;
              setOtherAchievement(text);
              const base = (localAnswers.achievements || []).filter((v) => !String(v).startsWith("Other:"));
              const withOther = text.trim() ? [...base, `Other: ${text.trim()}`] : base;
              const newAnswers = { ...localAnswers, achievements: withOther };
              setLocalAnswers(newAnswers);
              onAnswersChange(newAnswers);
            }}
            placeholder="Describe your achievement"
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">This will be saved as an achievement entry.</p>
        </div>
      )}

      {/* Financial proof reminder (shown near achievements) */}
      {currentQ.id === "achievements" && (
        <div className="mt-6 mb-2 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
          <p className="text-sm text-yellow-800">
            Reminder: You will need to provide financial proof (e.g., product revenue, company revenue, contracts). Tech Nation expects evidence of commercial outcomes.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={
            currentQuestion === questions.length - 1 && 
            (!Array.isArray(localAnswers.achievements) || localAnswers.achievements.length === 0)
          }
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === questions.length - 1 ? "Get Recommendations" : "Next"}
        </button>
      </div>
    </div>
  );
}

