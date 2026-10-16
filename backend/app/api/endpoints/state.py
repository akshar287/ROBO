from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.app.db.session import get_db
from backend.app.db.models import SystemState
from backend.app.services.device_manager import device_manager

router = APIRouter()

class StateUpdate(BaseModel):
    state: str  # "ON" or "OFF"

@router.get("/")
def get_state(db: Session = Depends(get_db)):
    result = db.execute(select(SystemState).where(SystemState.id == 1))
    system_state = result.scalar_one_or_none()
    current_state = system_state.agent_state if system_state else "ON"
    return {
        "agent_state": current_state,
        "updated_at": system_state.updated_at.isoformat() if system_state and system_state.updated_at else datetime.utcnow().isoformat()
    }

@router.post("/")
async def set_state(update: StateUpdate, db: Session = Depends(get_db)):
    new_state = "ON" if update.state.upper() == "ON" else "OFF"
    result = db.execute(select(SystemState).where(SystemState.id == 1))
    system_state = result.scalar_one_or_none()
    
    if not system_state:
        system_state = SystemState(id=1, agent_state=new_state, updated_by="user_dashboard")
        db.add(system_state)
    else:
        system_state.agent_state = new_state
        system_state.updated_at = datetime.utcnow()
        system_state.updated_by = "user_dashboard"

    db.commit()

    # Broadcast updated state immediately to all connected Android & Laptop devices
    await device_manager.broadcast_agent_state(new_state)

    return {
        "success": True,
        "agent_state": new_state,
        "message": f"ROBO Agent is now turned {new_state}."
    }
