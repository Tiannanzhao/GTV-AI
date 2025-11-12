from sqlalchemy import Column, String, Integer, Boolean, Text, Date, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.models.database import Base
import enum

class PathType(str, enum.Enum):
    EXCEPTIONAL_TALENT = "ExceptionalTalent"
    EXCEPTIONAL_PROMISE = "ExceptionalPromise"

class StandardType(str, enum.Enum):
    MC = "MC"  # Mandatory Criterion
    OC1 = "OC1"  # Optional Criterion 1
    OC2 = "OC2"  # Optional Criterion 2
    OC3 = "OC3"  # Optional Criterion 3

class EvidenceStatus(str, enum.Enum):
    DRAFT = "Draft"
    GENERATED = "Generated"
    EXPORTED = "Exported"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    applications = relationship("Application", back_populates="user")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    path_type = Column(Enum(PathType), nullable=False)
    mc_selected = Column(Boolean, default=False)
    oc1_selected = Column(Boolean, default=False)
    oc2_selected = Column(Boolean, default=False)
    oc3_selected = Column(Boolean, default=False)
    recommendation_data = Column(JSON)  # Stores questionnaire answers and recommendations
    current_stage = Column(Integer, default=1)  # 1-5 for stages
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="applications")
    materials = relationship("Material", back_populates="application")
    evidence = relationship("Evidence", back_populates="application")

class Material(Base):
    __tablename__ = "materials"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=False)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)  # S3 path
    file_type = Column(String, nullable=False)  # PDF, PNG, JPG, DOCX
    file_size = Column(Integer, nullable=False)  # in bytes
    upload_date = Column(Date, nullable=False)
    title = Column(String)
    material_type = Column(String)  # Salary Proof, Media Coverage, etc.
    suggested_standard = Column(Enum(StandardType))  # MC, OC1, OC2, OC3
    strength_rating = Column(Integer)  # 1-5 stars
    classification_data = Column(JSON)  # Onerouter response
    evidence_description = Column(Text)
    additional_links = Column(JSON)  # Array of URLs
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    application = relationship("Application", back_populates="materials")
    evidence_materials = relationship("EvidenceMaterial", back_populates="material")

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=False)
    evidence_number = Column(Integer, nullable=False)
    standard_type = Column(Enum(StandardType), nullable=False)  # MC, OC1, OC2, OC3
    evidence_type = Column(String)  # Salary Proof, Product Metrics, etc.
    title = Column(String, nullable=False)
    page_count = Column(Integer, default=0)
    pdf_path = Column(String)  # S3 path to generated PDF
    status = Column(Enum(EvidenceStatus), default=EvidenceStatus.DRAFT)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    application = relationship("Application", back_populates="evidence")
    evidence_materials = relationship("EvidenceMaterial", back_populates="evidence")

class EvidenceMaterial(Base):
    __tablename__ = "evidence_materials"
    
    evidence_id = Column(UUID(as_uuid=True), ForeignKey("evidence.id"), primary_key=True)
    material_id = Column(UUID(as_uuid=True), ForeignKey("materials.id"), primary_key=True)
    page_range = Column(String)  # e.g., "1-2" if only using pages 1-2
    order = Column(Integer, nullable=False)  # Order of materials in evidence
    
    evidence = relationship("Evidence", back_populates="evidence_materials")
    material = relationship("Material", back_populates="evidence_materials")

