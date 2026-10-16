import os
from pathlib import Path

# Laptop Agent Configuration
DEVICE_ID = os.getenv("ROBO_DEVICE_ID", "laptop-windows-main")
DEVICE_NAME = os.getenv("ROBO_DEVICE_NAME", "Akshar's Windows Laptop")
BACKEND_WS_URL = os.getenv("ROBO_BACKEND_WS_URL", "ws://localhost:8000/ws/laptop")
BACKEND_HTTP_URL = os.getenv("ROBO_BACKEND_HTTP_URL", "http://localhost:8000")

# Sandboxed Directory for File Operations
SANDBOX_DIR = Path.home() / "Desktop" / "RoboFiles"
SANDBOX_DIR.mkdir(parents=True, exist_ok=True)

# Safe Application Allowlist (Includes common transliterations & aliases)
APP_ALLOWLIST = {
    "chrome": "chrome",
    "google chrome": "chrome",
    "crome": "chrome",
    "youtube": "chrome https://www.youtube.com",
    "you tube": "chrome https://www.youtube.com",
    "notepad": "notepad",
    "calculator": "calc",
    "calc": "calc",
    "spotify": "spotify",
    "code": "code",
    "vscode": "code",
    "terminal": "wt",
    "cmd": "cmd",
    "explorer": "explorer"
}
