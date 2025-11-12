"""
API endpoints for achievement templates and achievement-based material management.
"""

from fastapi import APIRouter
from app.services.achievement_templates import AchievementTemplates

router = APIRouter()
templates_service = AchievementTemplates()


@router.get("/templates")
async def get_all_templates():
    """Get all available achievement templates."""
    all_templates = templates_service.get_all_templates()
    return {
        "templates": {
            key: {
                "achievement_type": template.achievement_type,
                "name": template.name,
                "description": template.description,
                "required_fields": [
                    {
                        "field_id": field.field_id,
                        "label": field.label,
                        "field_type": field.field_type.value,
                        "required": field.required,
                        "help_text": field.help_text,
                        "validation": field.validation,
                        "multiple": field.multiple,
                    }
                    for field in template.required_fields
                ],
                "optional_fields": [
                    {
                        "field_id": field.field_id,
                        "label": field.label,
                        "field_type": field.field_type.value,
                        "required": field.required,
                        "help_text": field.help_text,
                        "validation": field.validation,
                        "multiple": field.multiple,
                    }
                    for field in template.optional_fields
                ],
                "suggested_standard": template.suggested_standard,
            }
            for key, template in all_templates.items()
        }
    }


@router.get("/templates/{achievement_type}")
async def get_template(achievement_type: str):
    """Get template for a specific achievement type."""
    template = templates_service.get_template(achievement_type)
    if not template:
        return {"error": "Template not found"}
    
    return {
        "achievement_type": template.achievement_type,
        "name": template.name,
        "description": template.description,
        "required_fields": [
            {
                "field_id": field.field_id,
                "label": field.label,
                "field_type": field.field_type.value,
                "required": field.required,
                "help_text": field.help_text,
                "validation": field.validation,
                "multiple": field.multiple,
            }
            for field in template.required_fields
        ],
        "optional_fields": [
            {
                "field_id": field.field_id,
                "label": field.label,
                "field_type": field.field_type.value,
                "required": field.required,
                "help_text": field.help_text,
                "validation": field.validation,
                "multiple": field.multiple,
            }
            for field in template.optional_fields
        ],
        "suggested_standard": template.suggested_standard,
    }

