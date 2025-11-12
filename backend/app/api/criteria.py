"""
API endpoints for criteria matching and recommendations.
"""

from fastapi import APIRouter, HTTPException
from app.schemas.schemas import QuestionnaireAnswers, RecommendationData
from app.services.criteria_matcher import CriteriaMatcher

router = APIRouter()
criteria_matcher = CriteriaMatcher()


@router.post("/match", response_model=RecommendationData)
async def match_criteria(answers: QuestionnaireAnswers):
    """
    Analyze questionnaire answers and return recommendations.
    
    Args:
        answers: User's questionnaire responses
        
    Returns:
        RecommendationData with recommended path, standards, and evidence quotas
    """
    try:
        answers_dict = answers.model_dump()
        recommendation = criteria_matcher.match_criteria(answers_dict)
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error matching criteria: {str(e)}")

