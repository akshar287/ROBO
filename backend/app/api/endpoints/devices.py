from typing import List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.app.db.session import get_db
from backend.app.db.models import Device
from backend.app.services.device_manager import device_manager

router = APIRouter()

class DeviceHeartbeatRequest(BaseModel):
    device_id: str
    battery_level: Optional[float] = None
    is_charging: Optional[bool] = None

class DevicePairRequest(BaseModel):
    device_id: str
    device_name: str
    device_type: str
    os_version: Optional[str] = None
    pairing_code: str

@router.get("/")
def list_devices(db: Session = Depends(get_db)):
    result = db.execute(select(Device))
    devices = result.scalars().all()
    
    output = []
    for d in devices:
        # Strictly verify live connection in WebSocket pool
        is_live = d.device_id in device_manager.active_connections
        live_meta = device_manager.device_meta.get(d.device_id, {})
        
        # Real battery reported from the live agent, or None if offline
        real_battery = live_meta.get("battery_level") if is_live else None
        real_charging = live_meta.get("is_charging") if is_live else None

        output.append({
            "device_id": d.device_id,
            "device_name": d.device_name,
            "device_type": d.device_type,
            "os_version": d.os_version,
            "is_online": is_live,  # True ONLY if actively connected right now!
            "last_seen": live_meta.get("last_heartbeat", d.last_seen.isoformat() if d.last_seen else None),
            "battery_level": real_battery,
            "is_charging": real_charging
        })
    return output

@router.post("/heartbeat")
def receive_heartbeat(hb: DeviceHeartbeatRequest, db: Session = Depends(get_db)):
    device_manager.update_heartbeat(hb.device_id, hb.battery_level, hb.is_charging)
    
    result = db.execute(select(Device).where(Device.device_id == hb.device_id))
    dev = result.scalar_one_or_none()
    if dev:
        dev.is_online = True
        if hb.battery_level is not None:
            dev.battery_level = hb.battery_level
        if hb.is_charging is not None:
            dev.is_charging = hb.is_charging
        db.commit()
        
    return {"status": "ok"}
