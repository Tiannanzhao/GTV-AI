"use client";

interface Option {
  value: any;
  label: string;
  note?: string;
}

interface Question {
  id: string;
  question: string;
  type: "single" | "multiple";
  options: Option[];
  note?: string;
}

interface QuestionCardProps {
  question: Question;
  answer: any;
  onAnswer: (value: any) => void;
}

export default function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {question.question}
      </h2>
      
      {question.note && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{question.note}</p>
        </div>
      )}

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = question.type === "multiple"
            ? Array.isArray(answer) && answer.includes(option.value)
            : answer === option.value;

          return (
            <button
              key={index}
              onClick={() => onAnswer(option.value)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{option.label}</span>
                {isSelected && (
                  <span className="text-indigo-600">✓</span>
                )}
              </div>
              {option.note && (
                <p className="text-sm text-gray-600 mt-1">{option.note}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

