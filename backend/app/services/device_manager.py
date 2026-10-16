import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import WebSocket

class DeviceManager:
    """
    Manages live WebSocket connections, heartbeats, and message routing
    across Android, Laptop, and Website clients.
    """

    def __init__(self):
        # Map: device_id -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}
        # Map: device_id -> metadata
        self.device_meta: Dict[str, Dict[str, Any]] = {}

    async def connect(self, device_id: str, device_type: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[device_id] = websocket
        self.device_meta[device_id] = {
            "device_id": device_id,
            "device_type": device_type,
            "connected_at": datetime.utcnow().isoformat(),
            "last_heartbeat": datetime.utcnow().isoformat(),
            "is_online": True,
            "battery_level": 90.0,
            "is_charging": False
        }
        print(f"[DeviceManager] Connected: {device_id} ({device_type})")

    def disconnect(self, device_id: str):
        if device_id in self.active_connections:
            del self.active_connections[device_id]
        if device_id in self.device_meta:
            self.device_meta[device_id]["is_online"] = False
            self.device_meta[device_id]["last_heartbeat"] = datetime.utcnow().isoformat()
        print(f"[DeviceManager] Disconnected: {device_id}")

    async def send_to_device(self, device_id: str, message: Dict[str, Any]) -> bool:
        ws = self.active_connections.get(device_id)
        if ws:
            try:
                await ws.send_text(json.dumps(message))
                return True
            except Exception as e:
                print(f"[DeviceManager] Error sending to {device_id}: {e}")
                self.disconnect(device_id)
        return False

    async def send_to_device_type(self, device_type: str, message: Dict[str, Any]) -> int:
        """
        Sends command to any connected device of the given type (e.g., 'android' or 'laptop').
        """
        sent_count = 0
        for dev_id, meta in list(self.device_meta.items()):
            if meta.get("device_type") == device_type and dev_id in self.active_connections:
                if await self.send_to_device(dev_id, message):
                    sent_count += 1
        return sent_count

    async def broadcast_to_websites(self, message: Dict[str, Any]):
        """
        Broadcasts status or notification to all connected dashboard browser tabs.
        """
        for dev_id, meta in list(self.device_meta.items()):
            if meta.get("device_type") == "website" and dev_id in self.active_connections:
                await self.send_to_device(dev_id, message)

    async def broadcast_agent_state(self, new_state: str):
        """
        Broadcasts persistent master agent state (ON / OFF) to every connected device.
        """
        payload = {
            "type": "agent_state_update",
            "state": new_state,
            "timestamp": datetime.utcnow().isoformat()
        }
        for dev_id in list(self.active_connections.keys()):
            await self.send_to_device(dev_id, payload)

    def update_heartbeat(self, device_id: str, battery: Optional[float] = None, is_charging: Optional[bool] = None):
        if device_id in self.device_meta:
            self.device_meta[device_id]["last_heartbeat"] = datetime.utcnow().isoformat()
            self.device_meta[device_id]["is_online"] = True
            if battery is not None:
                self.device_meta[device_id]["battery_level"] = battery
            if is_charging is not None:
                self.device_meta[device_id]["is_charging"] = is_charging

    def get_devices_status(self) -> List[Dict[str, Any]]:
        # Return status with reasonable defaults if device is registered in DB
        return list(self.device_meta.values())

device_manager = DeviceManager()
