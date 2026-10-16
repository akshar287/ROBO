from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from backend.app.db.session import get_db
from backend.app.db.models import TaskModel, TaskStepModel
from backend.app.services.task_orchestrator import TaskOrchestrator

router = APIRouter()

class ExecuteTaskRequest(BaseModel):
    prompt: str
    user_id: int = 1

@router.post("/execute")
async def execute_task(req: ExecuteTaskRequest, db: Session = Depends(get_db)):
    result = await TaskOrchestrator.process_prompt(
        db=db,
        user_id=req.user_id,
        prompt=req.prompt
    )
    return result

@router.get("/")
def list_tasks(limit: int = 20, db: Session = Depends(get_db)):
    result = db.execute(select(TaskModel).order_by(desc(TaskModel.created_at)).limit(limit))
    tasks = result.scalars().all()
    
    output = []
    for t in tasks:
        steps_result = db.execute(select(TaskStepModel).where(TaskStepModel.task_id == t.task_id))
        steps = steps_result.scalars().all()
        
        output.append({
            "task_id": t.task_id,
            "original_prompt": t.original_prompt,
            "detected_language": t.detected_language,
            "priority": t.priority,
            "status": t.status,
            "requires_approval": t.requires_approval,
            "approval_reason": t.approval_reason,
            "result_summary": t.result_summary,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "logs": t.get_logs(),
            "steps": [
                {
                    "step_id": s.step_id,
                    "target_device": s.target_device,
                    "action": s.action,
                    "parameters": s.get_parameters(),
                    "status": s.status,
                    "requires_approval": s.requires_approval
                }
                for s in steps
            ]
        })
    return output

@router.get("/approvals")
def list_pending_approvals(db: Session = Depends(get_db)):
    result = db.execute(
        select(TaskModel)
        .where(TaskModel.status == "pending_approval")
        .order_by(desc(TaskModel.created_at))
    )
    tasks = result.scalars().all()
    
    approvals = []
    for t in tasks:
        steps_result = db.execute(select(TaskStepModel).where(TaskStepModel.task_id == t.task_id))
        steps = steps_result.scalars().all()
        approvals.append({
            "task_id": t.task_id,
            "original_prompt": t.original_prompt,
            "approval_reason": t.approval_reason,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "steps": [
                {
                    "step_id": s.step_id,
                    "target_device": s.target_device,
                    "action": s.action,
                    "parameters": s.get_parameters()
                }
                for s in steps
            ]
        })
    return approvals

@router.post("/{task_id}/approve")
async def approve_task(task_id: str, db: Session = Depends(get_db)):
    result = await TaskOrchestrator.approve_task(db, task_id)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to approve"))
    return result

@router.post("/{task_id}/reject")
def reject_task(task_id: str, db: Session = Depends(get_db)):
    result = db.execute(select(TaskModel).where(TaskModel.task_id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = "rejected"
    task.add_log("Task rejected by user.")
    
    steps_result = db.execute(select(TaskStepModel).where(TaskStepModel.task_id == task_id))
    for s in steps_result.scalars().all():
        s.status = "rejected"

    db.commit()
    return {"success": True, "task_id": task_id, "status": "rejected"}
