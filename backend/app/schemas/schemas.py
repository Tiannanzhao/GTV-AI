"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from enum import Enum


class PathType(str, Enum):
    EXCEPTIONAL_TALENT = "ExceptionalTalent"
    EXCEPTIONAL_PROMISE = "ExceptionalPromise"


class StandardType(str, Enum):
    MC = "MC"
    OC1 = "OC1"
    OC2 = "OC2"
    OC3 = "OC3"


class EvidenceStatus(str, Enum):
    DRAFT = "Draft"
    GENERATED = "Generated"
    EXPORTED = "Exported"


# Questionnaire Schemas
class QuestionnaireAnswers(BaseModel):
    yearsOfExperience: str  # "< 5 years" or "≥ 5 years"
    roleType: str  # "Technical", "Business", or "Both"
    selectedRoles: Optional[List[str]] = None  # Up to two roles
    leadershipRoles: List[str]
    achievements: List[str]
    hasFinancialProof: Optional[bool] = True


class StandardRecommendation(BaseModel):
    standardType: StandardType
    name: str
    recommendedEvidenceTypes: List[str]
    description: str


class EvidenceQuota(BaseModel):
    mc: int
    oc1: int
    oc2: int
    oc3: int
    total: int


class RecommendationData(BaseModel):
    questionnaireAnswers: QuestionnaireAnswers
    recommendedPath: PathType
    recommendedStandards: Dict[str, StandardRecommendation]
    evidenceQuota: EvidenceQuota
    successProbability: int  # 0-100


# Material Schemas
class ClassificationData(BaseModel):
    fileType: str
    recommendedStandard: StandardType
    strengthRating: int  # 1-5
    timeRange: Optional[Dict[str, Any]] = None
    mergeSuggestions: Optional[List[str]] = None
    aiAnalysis: Optional[str] = None


class MaterialCreate(BaseModel):
    applicationId: str
    fileName: str
    fileType: str
    fileSize: int
    uploadDate: date
    title: Optional[str] = None
    materialType: Optional[str] = None


class MaterialUpdate(BaseModel):
    title: Optional[str] = None
    materialType: Optional[str] = None
    suggestedStandard: Optional[StandardType] = None
    strengthRating: Optional[int] = None
    evidenceDescription: Optional[str] = None
    additionalLinks: Optional[List[str]] = None


class MaterialResponse(BaseModel):
    id: str
    applicationId: str
    fileName: str
    filePath: str
    fileType: str
    fileSize: int
    uploadDate: date
    title: Optional[str] = None
    materialType: Optional[str] = None
    suggestedStandard: Optional[StandardType] = None
    strengthRating: Optional[int] = None
    classificationData: Optional[ClassificationData] = None
    evidenceDescription: Optional[str] = None
    additionalLinks: Optional[List[str]] = None
    createdAt: datetime
    updatedAt: datetime


# Evidence Schemas
class EvidenceCreate(BaseModel):
    applicationId: str
    evidenceNumber: int
    standardType: StandardType
    evidenceType: Optional[str] = None
    title: str
    materialIds: List[str]  # Materials to include in this evidence


class EvidenceUpdate(BaseModel):
    title: Optional[str] = None
    evidenceType: Optional[str] = None
    materialIds: Optional[List[str]] = None


class EvidenceResponse(BaseModel):
    id: str
    applicationId: str
    evidenceNumber: int
    standardType: StandardType
    evidenceType: Optional[str] = None
    title: str
    pageCount: int
    pdfPath: Optional[str] = None
    status: EvidenceStatus
    createdAt: datetime
    updatedAt: datetime


# Quality Check Schemas
class QualityWarning(BaseModel):
    type: str  # "high", "medium", "low"
    message: str
    evidenceId: Optional[str] = None
    materialId: Optional[str] = None
    suggestion: Optional[str] = None


class QualityCheckResult(BaseModel):
    evidenceCount: int
    mcCount: int
    oc1Count: int
    oc2Count: int
    oc3Count: int
    allWithinFiveYears: bool
    allWithinPageLimit: bool
    filesClearAndReadable: bool
    noDuplicateMaterials: bool
    warnings: List[QualityWarning]
    overallScore: int  # 0-100
    successProbability: int  # 0-100


# Export Schemas
class ExportOptions(BaseModel):
    format: str  # "single-pdf", "multiple-pdfs", "zip"
    useStandardNaming: bool = True
    includeEvidenceFiles: bool = True
    includeIndex: bool = True
    includeMappingTable: bool = True
    includeOriginalMaterials: bool = False

