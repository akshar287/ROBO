# ROBO AI Assistant — Setup & Running Instructions

This guide provides the exact terminal commands to run each component of the ROBO ecosystem.

---

## Prerequisites

* **Node.js**: v18.0.0 or newer (v22 installed)
* **Python**: 3.10+ (Python 3.12 installed)
* **Android Studio**: (For building APK or deploying to Android phone/emulator)

---

## 1. Starting the Backend (FastAPI + WebSockets)

Open a terminal in the root directory:

```bash
# Navigate to project root
cd c:\Users\Akshar\Desktop\Robo

# Start the FastAPI server using Uvicorn
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

* **Swagger API Docs**: `http://localhost:8000/docs`
* **Health Check**: `http://localhost:8000/health`
* **Database**: Automatically initializes `robo.db` (SQLite) on first startup.

---

## 2. Starting the Website Dashboard (Next.js)

Open a second terminal:

```bash
cd c:\Users\Akshar\Desktop\Robo\website

# Install packages (if not already installed)
npm install

# Start development server
npm run dev
```

* **Dashboard URL**: `http://localhost:3000`
* Simply click **"1-Click Demo Login"** or enter your phone & email.

---

## 3. Running the Windows Laptop Agent

Open a third terminal:

```bash
cd c:\Users\Akshar\Desktop\Robo\laptop-agent

# Run the agent
python agent.py
```

* Alternatively, double-click `run_agent.bat` in File Explorer.
* To register ROBO to start automatically every time you log in to Windows:
  ```bash
  python agent.py --install-startup
  ```

---

## 4. Running the Android Application

1. Open **Android Studio**.
2. Select **Open an existing project** and choose `c:\Users\Akshar\Desktop\Robo\android-app`.
3. Connect your Android phone via USB (with Developer options & USB Debugging enabled) or start an Android Virtual Device (AVD).
4. In `MainActivity`, the default server address is set to `ws://10.0.2.2:8000` (for emulator) or your laptop's local WiFi IP (e.g., `ws://192.168.1.100:8000` for physical phone).
5. Click the green **Run (▶)** button in Android Studio to build and install the APK.
6. When prompted, grant permissions for:
   - Microphone (for voice commands)
   - Notifications (for foreground service)
   - Ignore Battery Optimizations (so ROBO stays alive in background).

---

## 5. Running Automated Tests

Run the backend and laptop agent test suites:

```bash
# Test backend NLP, API endpoints, and persistent state
python -m pytest backend\tests

# Test laptop agent allowlist and sandbox security
python -m pytest laptop-agent\tests
```
