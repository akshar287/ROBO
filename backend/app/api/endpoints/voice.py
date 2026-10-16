from fastapi import APIRouter, Depends, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.services.task_orchestrator import TaskOrchestrator

router = APIRouter()

class VoiceCommandRequest(BaseModel):
    transcript: str
    language: Optional[str] = None
    user_id: int = 1

@router.post("/command")
async def process_voice_command(req: VoiceCommandRequest, db: Session = Depends(get_db)):
    result = await TaskOrchestrator.process_prompt(
        db=db,
        user_id=req.user_id,
        prompt=req.transcript
    )
    return result

@router.post("/upload")
async def upload_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    content = await file.read()
    filename = file.filename
    return {
        "success": True,
        "filename": filename,
        "size_bytes": len(content),
        "message": "Audio received successfully"
    }
