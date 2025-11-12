// Application Types

export type PathType = "ExceptionalTalent" | "ExceptionalPromise";

export type StandardType = "MC" | "OC1" | "OC2" | "OC3";

export type EvidenceStatus = "Draft" | "Generated" | "Exported";

export type MaterialType = 
  | "Salary Proof"
  | "Media Coverage"
  | "Conference Speaking"
  | "Open Source"
  | "Tech Blog"
  | "Patent"
  | "Mentor Role"
  | "Product Launch"
  | "Technical Innovation"
  | "Industry Award"
  | "Performance Review"
  | "Recommendation Letter"
  | "Promotion Record"
  | "Product Metrics"
  | "Technical Architecture"
  | "Project Impact"
  | "Financial Data"
  | "Market Position"
  | "Business Contract"
  | "Other";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  pathType: PathType;
  mcSelected: boolean;
  oc1Selected: boolean;
  oc2Selected: boolean;
  oc3Selected: boolean;
  recommendationData?: RecommendationData;
  currentStage: number; // 1-5
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationData {
  questionnaireAnswers: QuestionnaireAnswers;
  recommendedPath: PathType;
  recommendedStandards: {
    mc: StandardRecommendation;
    oc1?: StandardRecommendation;
    oc2?: StandardRecommendation;
    oc3?: StandardRecommendation;
  };
  evidenceQuota: {
    mc: number;
    oc1: number;
    oc2: number;
    oc3: number;
    total: number;
  };
  successProbability: number;
}

export interface QuestionnaireAnswers {
  yearsOfExperience: "< 5 years" | "≥ 5 years";
  roleType: "Technical" | "Business" | "Both";
  selectedRoles?: string[]; // Up to two specific roles
  leadershipRoles: string[]; // Founder, C-level, Tech Lead, Product Lead
  achievements: string[]; // From achievement checklist
  hasFinancialProof: boolean;
}

export interface StandardRecommendation {
  standardType: StandardType;
  name: string;
  recommendedEvidenceTypes: string[];
  description: string;
}

export interface Material {
  id: string;
  applicationId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  title?: string;
  materialType?: MaterialType;
  suggestedStandard?: StandardType;
  strengthRating?: number; // 1-5
  classificationData?: ClassificationData;
  evidenceDescription?: string;
  additionalLinks?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClassificationData {
  fileType: string;
  recommendedStandard: StandardType;
  strengthRating: number;
  timeRange?: {
    start?: string;
    end?: string;
    withinFiveYears: boolean;
  };
  mergeSuggestions?: string[]; // Material IDs that can be merged
  aiAnalysis?: string;
}

export interface Evidence {
  id: string;
  applicationId: string;
  evidenceNumber: number;
  standardType: StandardType;
  evidenceType?: string;
  title: string;
  pageCount: number;
  pdfPath?: string;
  status: EvidenceStatus;
  materials?: Material[];
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceMaterial {
  evidenceId: string;
  materialId: string;
  pageRange?: string;
  order: number;
}

export interface QualityCheckResult {
  evidenceCount: number;
  mcCount: number;
  oc1Count: number;
  oc2Count: number;
  oc3Count: number;
  allWithinFiveYears: boolean;
  allWithinPageLimit: boolean;
  filesClearAndReadable: boolean;
  noDuplicateMaterials: boolean;
  warnings: QualityWarning[];
  overallScore: number;
  successProbability: number;
}

export interface QualityWarning {
  type: "high" | "medium" | "low";
  message: string;
  evidenceId?: string;
  materialId?: string;
  suggestion?: string;
}

export interface ExportOptions {
  format: "single-pdf" | "multiple-pdfs" | "zip";
  useStandardNaming: boolean;
  includeEvidenceFiles: boolean;
  includeIndex: boolean;
  includeMappingTable: boolean;
  includeOriginalMaterials: boolean;
}

