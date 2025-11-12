import axios from "axios";
import { QuestionnaireAnswers, RecommendationData } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Criteria API
export const criteriaApi = {
  match: async (answers: QuestionnaireAnswers): Promise<RecommendationData> => {
    const response = await apiClient.post<RecommendationData>("/api/criteria/match", answers);
    return response.data;
  },
};

// Achievements API
export const achievementsApi = {
  getTemplates: async () => {
    const response = await apiClient.get("/api/achievements/templates");
    return response.data;
  },
  
  getTemplate: async (achievementType: string) => {
    const response = await apiClient.get(`/api/achievements/templates/${achievementType}`);
    return response.data;
  },
};

// Documents API (to be implemented)
export const documentsApi = {
  upload: async (file: File, applicationId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("applicationId", applicationId);
    
    const response = await apiClient.post("/api/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  
  list: async (applicationId: string) => {
    const response = await apiClient.get(`/api/documents?applicationId=${applicationId}`);
    return response.data;
  },
  
  update: async (materialId: string, data: any) => {
    const response = await apiClient.put(`/api/documents/${materialId}`, data);
    return response.data;
  },
  
  delete: async (materialId: string) => {
    const response = await apiClient.delete(`/api/documents/${materialId}`);
    return response.data;
  },
};

// Classification API (to be implemented)
export const classificationApi = {
  classify: async (materialId: string) => {
    const response = await apiClient.post(`/api/classification/classify/${materialId}`);
    return response.data;
  },
};

// Assembly API (to be implemented)
export const assemblyApi = {
  createEvidence: async (data: any) => {
    const response = await apiClient.post("/api/assembly/evidence", data);
    return response.data;
  },
  
  updateEvidence: async (evidenceId: string, data: any) => {
    const response = await apiClient.put(`/api/assembly/evidence/${evidenceId}`, data);
    return response.data;
  },
  
  generatePDF: async (evidenceId: string) => {
    const response = await apiClient.post(`/api/assembly/generate-pdf/${evidenceId}`);
    return response.data;
  },
  
  getOptimizationSuggestions: async (applicationId: string) => {
    const response = await apiClient.get(`/api/assembly/optimization/${applicationId}`);
    return response.data;
  },
};

// Evidence API
export const evidenceApi = {
  generatePreview: async (formData: FormData) => {
    const response = await apiClient.post("/api/evidence/generate-preview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    });
    return response.data;
  },
  
  save: async (formData: FormData) => {
    const response = await apiClient.post("/api/evidence/save", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  
  list: async (applicationId: string) => {
    const response = await apiClient.get(`/api/evidence/list?applicationId=${applicationId}`);
    return response.data;
  },
  
  get: async (evidenceId: string) => {
    const response = await apiClient.get(`/api/evidence/${evidenceId}`);
    return response.data;
  },
  
  delete: async (evidenceId: string) => {
    const response = await apiClient.delete(`/api/evidence/${evidenceId}`);
    return response.data;
  },
};

// Export API (to be implemented)
export const exportApi = {
  qualityCheck: async (applicationId: string) => {
    const response = await apiClient.get(`/api/export/quality-check/${applicationId}`);
    return response.data;
  },
  
  export: async (applicationId: string, options: any) => {
    const response = await apiClient.post(`/api/export/${applicationId}`, options, {
      responseType: "blob",
    });
    return response.data;
  },
};

