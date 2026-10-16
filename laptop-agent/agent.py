import asyncio
import json
import os
import sys
import time
import psutil
import websockets
from datetime import datetime

# Add laptop-agent directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from config import DEVICE_ID, DEVICE_NAME, BACKEND_WS_URL, BACKEND_HTTP_URL
from tools import DesktopToolExecutor

class LaptopAgent:
    """
    Independent background agent for Windows / Linux laptops.
    Receives tasks from ROBO backend over secure WebSockets, executes safe tools,
    and returns progress and results in real time.
    """

    def __init__(self):
        self.device_id = DEVICE_ID
        self.device_name = DEVICE_NAME
        self.ws_url = f"{BACKEND_WS_URL}/{self.device_id}"
        self.is_running = True
        self.current_agent_state = "ON"

    def get_system_battery(self):
        try:
            battery = psutil.sensors_battery()
            if battery:
                return battery.percent, battery.power_plugged
        except Exception:
            pass
        return 95.0, True

    async def heartbeat_loop(self, websocket):
        while self.is_running:
            try:
                battery_pct, is_plugged = self.get_system_battery()
                hb_payload = {
                    "type": "heartbeat",
                    "device_id": self.device_id,
                    "battery_level": battery_pct,
                    "is_charging": is_plugged,
                    "status": "idle" if self.current_agent_state == "ON" else "disabled"
                }
                await websocket.send(json.dumps(hb_payload))
                await asyncio.sleep(15)  # Every 15 seconds
            except Exception as e:
                print(f"[LaptopAgent] Heartbeat error: {e}")
                break

    async def run(self):
        print(f"==================================================")
        print(f"  ROBO Laptop Agent - {self.device_name}")
        print(f"  Connected Device ID: {self.device_id}")
        print(f"  Backend URL: {self.ws_url}")
        print(f"==================================================")

        backoff = 2
        while self.is_running:
            try:
                print(f"[LaptopAgent] Connecting to ROBO Backend...")
                async with websockets.connect(self.ws_url) as ws:
                    print(f"[LaptopAgent] Connected successfully! Agent is ONLINE.")
                    backoff = 2

                    # Start background heartbeat task
                    heartbeat_task = asyncio.create_task(self.heartbeat_loop(ws))

                    while self.is_running:
                        message = await ws.recv()
                        try:
                            data = json.loads(message)
                            msg_type = data.get("type")

                            if msg_type == "agent_state_update":
                                self.current_agent_state = data.get("state", "ON")
                                print(f"[LaptopAgent] Desired Agent State updated to: {self.current_agent_state}")

                            elif msg_type == "execute_task":
                                if self.current_agent_state == "OFF":
                                    print(f"[LaptopAgent] Ignored task because Agent is OFF.")
                                    continue

                                task_id = data.get("task_id")
                                step_id = data.get("step_id")
                                action = data.get("action")
                                params = data.get("parameters", {})

                                print(f"\n[LaptopAgent] >>> Executing Task: {task_id}")
                                print(f"  Action: {action}")
                                print(f"  Params: {params}")

                                result = DesktopToolExecutor.execute(action, params)
                                print(f"  Result: {result}")

                                # Send back result
                                response_payload = {
                                    "type": "task_result",
                                    "task_id": task_id,
                                    "step_id": step_id,
                                    "status": "completed" if result.get("success") else "failed",
                                    "result": result
                                }
                                await ws.send(json.dumps(response_payload))

                        except json.JSONDecodeError:
                            pass

                    heartbeat_task.cancel()

            except (websockets.ConnectionClosed, ConnectionRefusedError, OSError) as e:
                print(f"[LaptopAgent] Connection lost: {e}. Reconnecting in {backoff}s...")
                await asyncio.sleep(backoff)
                backoff = min(backoff * 1.5, 30)
            except Exception as e:
                print(f"[LaptopAgent] Unexpected error: {e}")
                await asyncio.sleep(5)

def install_windows_startup():
    try:
        startup_dir = Path(os.environ["APPDATA"]) / "Microsoft" / "Windows" / "Start Menu" / "Programs" / "Startup"
        bat_file = startup_dir / "StartRoboLaptopAgent.bat"
        script_path = os.path.abspath(__file__)
        python_exe = sys.executable

        bat_content = f'@echo off\n"{python_exe}" "{script_path}"\n'
        bat_file.write_text(bat_content)
        print(f"[Install] Successfully registered ROBO Agent in Windows Startup:\n  {bat_file}")
    except Exception as e:
        print(f"[Install] Error registering startup: {e}")

if __name__ == "__main__":
    if "--install-startup" in sys.argv:
        install_windows_startup()
    else:
        agent = LaptopAgent()
        try:
            asyncio.run(agent.run())
        except KeyboardInterrupt:
            print("\n[LaptopAgent] Stopped by user.")
