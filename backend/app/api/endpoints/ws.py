import json
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.services.device_manager import device_manager

router = APIRouter()

@router.websocket("/{client_type}/{device_id}")
async def websocket_endpoint(websocket: WebSocket, client_type: str, device_id: str):
    await device_manager.connect(device_id, client_type, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                msg_type = msg.get("type")

                if msg_type == "heartbeat":
                    battery = msg.get("battery_level")
                    is_charging = msg.get("is_charging")
                    device_manager.update_heartbeat(device_id, battery, is_charging)
                    await websocket.send_text(json.dumps({"type": "heartbeat_ack", "timestamp": datetime.utcnow().isoformat()}))

                elif msg_type == "task_result":
                    # Device finished executing a task step
                    task_id = msg.get("task_id")
                    status = msg.get("status", "completed")
                    result = msg.get("result")
                    print(f"[WebSocket] Task {task_id} result from {device_id}: {status}")

                    # Broadcast update to web dashboards
                    await device_manager.broadcast_to_websites({
                        "type": "task_updated",
                        "task_id": task_id,
                        "status": status,
                        "device_id": device_id,
                        "result": result
                    })

                elif msg_type == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))

            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        device_manager.disconnect(device_id)
    except Exception as e:
        print(f"[WebSocket] Exception on {device_id}: {e}")
        device_manager.disconnect(device_id)
