"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface AchievementTemplate {
  achievement_type: string;
  name: string;
  description: string;
  required_fields: MaterialField[];
  optional_fields: MaterialField[];
  suggested_standard: string | null;
}

interface MaterialField {
  field_id: string;
  label: string;
  field_type: string;
  required: boolean;
  help_text: string;
  validation: Record<string, any>;
  multiple: boolean;
}

interface AchievementMaterialCollectorProps {
  achievements: string[];
}

interface AchievementProgress {
  achievement: string;
  completed: number;
  total: number;
  template?: AchievementTemplate;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";

export default function AchievementMaterialCollector({ achievements }: AchievementMaterialCollectorProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Record<string, AchievementTemplate>>({});
  const [progress, setProgress] = useState<Record<string, AchievementProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load templates for all achievements
    const loadTemplates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/achievements/templates`);
        const allTemplates = response.data.templates;
        
        const achievementTemplates: Record<string, AchievementTemplate> = {};
        const initialProgress: Record<string, AchievementProgress> = {};
        
        achievements.forEach((achievement) => {
          // Handle "Other: ..." achievements
          const achievementKey = achievement.startsWith("Other:") ? "Other" : achievement;
          const template = allTemplates[achievementKey];
          
          if (template) {
            achievementTemplates[achievement] = template;
            initialProgress[achievement] = {
              achievement,
              completed: 0,
              total: template.required_fields.length,
              template,
            };
          }
        });
        
        setTemplates(achievementTemplates);
        setProgress(initialProgress);
        setLoading(false);
        
        // Auto-select first achievement
        if (achievements.length > 0) {
          setSelectedAchievement(achievements[0]);
        }
      } catch (error) {
        console.error("Failed to load templates:", error);
        setLoading(false);
      }
    };

    loadTemplates();
  }, [achievements]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading achievement templates...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Achievements List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement) => {
              const prog = progress[achievement];
              const template = templates[achievement];
              const isSelected = selectedAchievement === achievement;
              const completionPercent = prog ? (prog.completed / prog.total) * 100 : 0;

              return (
                <button
                  key={achievement}
                  onClick={() => setSelectedAchievement(achievement)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 text-sm">
                      {template?.name || achievement}
                    </span>
                    {prog && (
                      <span className="text-xs text-gray-500">
                        {prog.completed}/{prog.total}
                      </span>
                    )}
                  </div>
                  {prog && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Material Collection Form */}
      <div className="lg:col-span-2">
        {selectedAchievement && templates[selectedAchievement] ? (
          <AchievementForm
            achievement={selectedAchievement}
            template={templates[selectedAchievement]}
            onProgressUpdate={(completed, total) => {
              setProgress((prev) => ({
                ...prev,
                [selectedAchievement]: {
                  achievement: selectedAchievement,
                  completed,
                  total,
                  template: templates[selectedAchievement],
                },
              }));
            }}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
            Select an achievement to start collecting materials
          </div>
        )}
      </div>
    </div>
  );
}

interface AchievementFormProps {
  achievement: string;
  template: AchievementTemplate;
  onProgressUpdate: (completed: number, total: number) => void;
}

function AchievementForm({ achievement, template, onProgressUpdate }: AchievementFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});

  useEffect(() => {
    // Calculate progress
    const requiredFields = template.required_fields;
    const completed = requiredFields.filter((field) => {
      if (field.field_type === "file_upload") {
        return files[field.field_id] && files[field.field_id].length > 0;
      }
      return formData[field.field_id] && String(formData[field.field_id]).trim() !== "";
    }).length;
    
    onProgressUpdate(completed, requiredFields.length);
  }, [formData, files, template, onProgressUpdate]);

  const handleFileChange = (fieldId: string, fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    setFiles((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), ...newFiles],
    }));
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleRemoveFile = (fieldId: string, index: number) => {
    setFiles((prev) => ({
      ...prev,
      [fieldId]: prev[fieldId]?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h2>
        <p className="text-gray-600">{template.description}</p>
        {template.suggested_standard && (
          <div className="mt-2 inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
            Suggested: {template.suggested_standard}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Required Fields */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Materials</h3>
          <div className="space-y-6">
            {template.required_fields.map((field) => (
              <MaterialFieldInput
                key={field.field_id}
                field={field}
                value={formData[field.field_id]}
                files={files[field.field_id] || []}
                onFileChange={(fileList) => handleFileChange(field.field_id, fileList)}
                onInputChange={(value) => handleInputChange(field.field_id, value)}
                onRemoveFile={(index) => handleRemoveFile(field.field_id, index)}
              />
            ))}
          </div>
        </div>

        {/* Optional Fields */}
        {template.optional_fields.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional Materials</h3>
            <div className="space-y-6">
              {template.optional_fields.map((field) => (
                <MaterialFieldInput
                  key={field.field_id}
                  field={field}
                  value={formData[field.field_id]}
                  files={files[field.field_id] || []}
                  onFileChange={(fileList) => handleFileChange(field.field_id, fileList)}
                  onInputChange={(value) => handleInputChange(field.field_id, value)}
                  onRemoveFile={(index) => handleRemoveFile(field.field_id, index)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-6 border-t">
          <button className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
            Save Materials for {template.name}
          </button>
        </div>
      </div>
    </div>
  );
}

interface MaterialFieldInputProps {
  field: MaterialField;
  value: any;
  files: File[];
  onFileChange: (fileList: FileList | null) => void;
  onInputChange: (value: any) => void;
  onRemoveFile: (index: number) => void;
}

function MaterialFieldInput({
  field,
  value,
  files,
  onFileChange,
  onInputChange,
  onRemoveFile,
}: MaterialFieldInputProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (field.field_type === "file_upload") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.help_text && (
          <p className="text-sm text-gray-500 mb-2">{field.help_text}</p>
        )}
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple={field.multiple}
            onChange={(e) => onFileChange(e.target.files)}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            + Add {field.multiple ? "Files" : "File"}
          </button>
        </div>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{file.name}</span>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (field.field_type === "textarea") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.help_text && (
          <p className="text-sm text-gray-500 mb-2">{field.help_text}</p>
        )}
        <textarea
          value={value || ""}
          onChange={(e) => onInputChange(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required={field.required}
        />
      </div>
    );
  }

  if (field.field_type === "date") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.help_text && (
          <p className="text-sm text-gray-500 mb-2">{field.help_text}</p>
        )}
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required={field.required}
        />
      </div>
    );
  }

  if (field.field_type === "number") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.help_text && (
          <p className="text-sm text-gray-500 mb-2">{field.help_text}</p>
        )}
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onInputChange(e.target.value ? Number(e.target.value) : "")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required={field.required}
        />
      </div>
    );
  }

  if (field.field_type === "link") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.help_text && (
          <p className="text-sm text-gray-500 mb-2">{field.help_text}</p>
        )}
        <input
          type="url"
          value={value || ""}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required={field.required}
        />
      </div>
    );
  }

  // Default: text input
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.help_text && (
        <p className="text-sm text-gray-500 mb-2">{field.help_text}</p>
      )}
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onInputChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required={field.required}
      />
    </div>
  );
}

