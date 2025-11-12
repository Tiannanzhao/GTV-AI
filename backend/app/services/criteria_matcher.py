"""
Criteria matching service for Tech Nation application recommendations.
Analyzes questionnaire answers and recommends the best application path and standard combinations.
"""

from typing import Dict, List, Any
from app.schemas.schemas import QuestionnaireAnswers, RecommendationData, StandardRecommendation


class CriteriaMatcher:
    """Matches user questionnaire answers to Tech Nation criteria and recommends application path."""
    
    def __init__(self):
        self.standard_definitions = {
            "MC": {
                "name": "Recognition as Leading Talent in Digital Technology",
                "description": "Demonstrate recognition as a leading talent at a product-led technology company",
                "evidence_types": [
                    "Proof you work at/lead a product-led technology company (company profile, product portfolio, org chart)",
                    "Leadership impact report (team charter, scope of responsibility)",
                    "Career progression evidence (promotion records, performance evaluations)",
                    "Industry recognition (media coverage, keynote speaking, awards)",
                ]
            },
            "OC1": {
                "name": "Significant Contribution to Digital Technology",
                "description": "Show significant contributions through product development, technical innovation, and measurable impact",
                "evidence_types": [
                    "Product Metrics (Users, Revenue)",
                    "Technical Architecture Documents",
                    "Project Impact Proof",
                    "Open Source Contributions",
                    "Technical Publications",
                ]
            },
            "OC2": {
                "name": "Innovation in Digital Technology",
                "description": "Demonstrate innovation through patents, novel technical solutions, or groundbreaking research",
                "evidence_types": [
                    "Patents",
                    "Technical Innovation Documentation",
                    "Research Papers",
                    "Novel Technical Solutions",
                ]
            },
            "OC3": {
                "name": "Commercial Success or Product Leadership",
                "description": "Demonstrate commercial success and product leadership through financial metrics and market position",
                "evidence_types": [
                    "Support letter from employer or business partner confirming commercial leadership",
                    "Financial Data (Revenue, Funding)",
                    "Product Market Position Proof",
                    "Business Contracts",
                    "User Growth Metrics",
                ]
            }
        }
    
    def match_criteria(self, answers: Dict[str, Any]) -> RecommendationData:
        """
        Analyze questionnaire answers and generate recommendations.
        
        Args:
            answers: Dictionary containing questionnaire answers
            
        Returns:
            RecommendationData with recommended path, standards, and evidence quotas
        """
        # Determine application path
        years_exp = answers.get("yearsOfExperience", "")
        path_type = "ExceptionalTalent" if years_exp == "≥ 5 years" else "ExceptionalPromise"
        
        # Determine recommended standards
        recommended_standards = self._determine_standards(answers, path_type)
        
        # Calculate evidence quotas
        evidence_quota = self._calculate_evidence_quota(answers, recommended_standards)
        
        # Calculate success probability
        success_probability = self._calculate_success_probability(answers, recommended_standards)
        
        return RecommendationData(
            questionnaireAnswers=answers,
            recommendedPath=path_type,
            recommendedStandards=recommended_standards,
            evidenceQuota=evidence_quota,
            successProbability=success_probability
        )
    
    def _determine_standards(
        self, 
        answers: Dict[str, Any], 
        path_type: str
    ) -> Dict[str, StandardRecommendation]:
        """Determine which optional criteria to recommend based on answers."""
        standards = {}
        
        # MC is always required
        standards["mc"] = StandardRecommendation(
            standardType="MC",
            name=self.standard_definitions["MC"]["name"],
            recommendedEvidenceTypes=self.standard_definitions["MC"]["evidence_types"],
            description=self.standard_definitions["MC"]["description"]
        )
        
        achievements = answers.get("achievements", [])
        has_financial = answers.get("hasFinancialProof", True)
        role_type = answers.get("roleType", "")
        
        # Recommend OC1 if user has product/technical contributions
        if any(ach in achievements for ach in [
            "Product Launch with Users/Revenue",
            "Open Source Contributions",
            "Technical Innovation",
            "Tech Blog/Articles"
        ]):
            standards["oc1"] = StandardRecommendation(
                standardType="OC1",
                name=self.standard_definitions["OC1"]["name"],
                recommendedEvidenceTypes=self.standard_definitions["OC1"]["evidence_types"],
                description=self.standard_definitions["OC1"]["description"]
            )
        
        # Recommend OC3 if user has financial proof or commercial success
        if has_financial or "Product Launch with Users/Revenue" in achievements:
            standards["oc3"] = StandardRecommendation(
                standardType="OC3",
                name=self.standard_definitions["OC3"]["name"],
                recommendedEvidenceTypes=self.standard_definitions["OC3"]["evidence_types"],
                description=self.standard_definitions["OC3"]["description"]
            )
        
        # Recommend OC2 if user has patents or innovation achievements
        if "Technical Innovation" in achievements:
            standards["oc2"] = StandardRecommendation(
                standardType="OC2",
                name=self.standard_definitions["OC2"]["name"],
                recommendedEvidenceTypes=self.standard_definitions["OC2"]["evidence_types"],
                description=self.standard_definitions["OC2"]["description"]
            )
        
        # Default to OC1 and OC3 if no specific matches
        if "oc1" not in standards and "oc3" not in standards:
            standards["oc1"] = StandardRecommendation(
                standardType="OC1",
                name=self.standard_definitions["OC1"]["name"],
                recommendedEvidenceTypes=self.standard_definitions["OC1"]["evidence_types"],
                description=self.standard_definitions["OC1"]["description"]
            )
            standards["oc3"] = StandardRecommendation(
                standardType="OC3",
                name=self.standard_definitions["OC3"]["name"],
                recommendedEvidenceTypes=self.standard_definitions["OC3"]["evidence_types"],
                description=self.standard_definitions["OC3"]["description"]
            )
        
        return standards
    
    def _calculate_evidence_quota(
        self, 
        answers: Dict[str, Any], 
        standards: Dict[str, StandardRecommendation]
    ) -> Dict[str, int]:
        """Calculate suggested evidence file quotas for each standard."""
        quota = {
            "mc": 4,
            "oc1": 0,
            "oc2": 0,
            "oc3": 0,
            "total": 0,
        }

        if "oc1" in standards:
            quota["oc1"] = 3
        if "oc2" in standards:
            quota["oc2"] = 3
        if "oc3" in standards:
            quota["oc3"] = 3

        # Calculate total based on selected standards
        quota["total"] = quota["mc"] + quota["oc1"] + quota["oc2"] + quota["oc3"]
        
        # Ensure total is capped at 10
        if quota["total"] > 10:
            # Reduce optional quotas evenly while keeping MC at 4
            optional_keys = [k for k in ["oc1", "oc2", "oc3"] if quota[k] > 0]
            while quota["total"] > 10 and optional_keys:
                for key in optional_keys:
                    if quota[key] > 2 and quota["total"] > 10:
                        quota[key] -= 1
                        quota["total"] -= 1
            quota["total"] = quota["mc"] + quota["oc1"] + quota["oc2"] + quota["oc3"]
         
        return quota
    
    def _calculate_success_probability(
        self, 
        answers: Dict[str, Any], 
        standards: Dict[str, StandardRecommendation]
    ) -> int:
        """Calculate estimated success probability based on answers and standards."""
        score = 50  # Base score
        
        # Years of experience
        if answers.get("yearsOfExperience") == "≥ 5 years":
            score += 10
        
        # Leadership roles
        leadership_roles = answers.get("leadershipRoles", [])
        if len(leadership_roles) >= 2:
            score += 15
        elif len(leadership_roles) == 1:
            score += 8
        
        # Achievements
        achievements = answers.get("achievements", [])
        if len(achievements) >= 5:
            score += 15
        elif len(achievements) >= 3:
            score += 10
        elif len(achievements) >= 1:
            score += 5
        
        # Financial proof
        if answers.get("hasFinancialProof"):
            score += 10
        
        # Number of standards
        num_standards = len(standards)
        if num_standards >= 3:
            score += 5
        
        return min(score, 95)  # Cap at 95%

