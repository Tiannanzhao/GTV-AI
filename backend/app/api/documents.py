"""
Documents API: upload, list, update, delete (MVP, in-memory store for now).
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict
from datetime import date, datetime
import uuid

router = APIRouter()

# In-memory store for MVP demo
MATERIALS: Dict[str, Dict] = {}


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    applicationId: str = Form(...),
):
    if file.spool_max_size and file.spool_max_size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    material_id = str(uuid.uuid4())
    now = datetime.utcnow()
    MATERIALS[material_id] = {
        "id": material_id,
        "applicationId": applicationId,
        "fileName": file.filename,
        "filePath": "memory://uploaded",
        "fileType": file.content_type,
        "fileSize": 0,
        "uploadDate": date.today().isoformat(),
        "title": file.filename,
        "createdAt": now.isoformat(),
        "updatedAt": now.isoformat(),
    }
    return MATERIALS[material_id]


@router.get("")
async def list_documents(applicationId: str):
    return [m for m in MATERIALS.values() if m.get("applicationId") == applicationId]


@router.put("/{material_id}")
async def update_document(material_id: str, data: Dict):
    if material_id not in MATERIALS:
        raise HTTPException(status_code=404, detail="Material not found")
    MATERIALS[material_id].update(data)
    MATERIALS[material_id]["updatedAt"] = datetime.utcnow().isoformat()
    return MATERIALS[material_id]


@router.delete("/{material_id}")
async def delete_document(material_id: str):
    if material_id not in MATERIALS:
        raise HTTPException(status_code=404, detail="Material not found")
    del MATERIALS[material_id]
    return {"ok": True}
