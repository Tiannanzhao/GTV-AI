"""
Mock classification API to simulate AI classifier suggestions.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict

router = APIRouter()


@router.post("/classify/{material_id}")
async def classify_material(material_id: str) -> Dict:
    # Mock logic based on filename keywords
    # In real implementation, call Onerouter API here
    suggested = {
        "recommendedStandard": "MC",
        "fileType": "General Document",
        "strengthRating": 3,
        "aiAnalysis": "General supporting document. Consider pairing with performance review.",
    }
    if "salary" in material_id.lower() or "bonus" in material_id.lower():
        suggested.update({
            "recommendedStandard": "MC",
            "fileType": "Salary Proof",
            "strengthRating": 5,
            "aiAnalysis": "High salary suggests recognition as leading talent. Merge with performance review.",
        })
    elif "metrics" in material_id.lower() or "users" in material_id.lower():
        suggested.update({
            "recommendedStandard": "OC1",
            "fileType": "Product Metrics",
            "strengthRating": 5,
            "aiAnalysis": "Strong product metrics indicate significant contribution.",
        })
    elif "revenue" in material_id.lower() or "contract" in material_id.lower():
        suggested.update({
            "recommendedStandard": "OC3",
            "fileType": "Financial Data / Contract",
            "strengthRating": 4,
            "aiAnalysis": "Financial success supports commercial success criterion.",
        })

    return suggested
