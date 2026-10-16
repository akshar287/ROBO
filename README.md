# ROBO — Multilingual Personal AI Agent Ecosystem

> **Zero-Token, Zero-Friction Personal Assistant for Gujarati, Hindi, English, Android & Windows Laptop.**

ROBO is a complete, modular, runnable personal AI agent system that allows anyone—even non-technical users—to control their phone, laptop, and services with natural voice commands.

---

## 🌟 Key Features

* **Zero-Token Usability**: No Meta WhatsApp Business Cloud API tokens, no Facebook developer accounts, and no Twilio telecom credit cards needed. Runs on native device intents out of the box!
* **1-Click / Mobile + Email Login**: Simply enter your mobile number and email to access your personal assistant immediately.
* **Multilingual Voice System**:
  * **Gujarati (ગુજરાતી)**: e.g., *"મમ્મીને ફોન કરો."*, *"મારા Gmail માં unread email ચેક કરીને reply draft કરો."*
  * **Hindi (हिन्दी)**: e.g., *"मम्मी को कॉल करो."*, *"Play Store kholo aur is application ko search karo."*, *"Mere laptop par Chrome kholo aur YouTube open karo."*
  * **English**: e.g., *"Open Gmail and summarize my unread emails."*, *"Call Mummy."*
  * **Code-Switched**: e.g., *"ROBO, WhatsApp par Rahul ko message draft karo."*
* **Real Background Operation**:
  * **Android**: Declared Foreground Service (`RoboBackgroundService`) with sticky notification and `FOREGROUND_SERVICE_DATA_SYNC` to stay alive when website or screen is closed.
  * **Windows Laptop**: Background Python daemon (`agent.py`) with optional Windows Startup integration.
* **Persistent Master Switch (Jarvis Mode)**: Master ON/OFF toggle state is persisted in the backend database. Closing the browser tab does not reset the state.
* **Safety Approval Queue**: Sensitive operations (e.g., sending email replies or placing calls) require 1-click user review before execution.

---

## 📂 Repository Structure

```text
Robo/
├── backend/            # Python FastAPI service, SQLite DB, WebSockets, Multilingual NLP
│   ├── app/            # Core, DB models, API endpoints, zero-token services
│   └── tests/          # Pytest unit & integration test suite (10/10 passing)
├── website/            # Next.js 14, TypeScript, Tailwind CSS dashboard
│   ├── src/app/        # App Router dashboard & layout
│   └── src/components/ # Voice interface, Device cards, Approval modal, Login modal
├── android-app/        # Native Kotlin Android Studio project
│   └── app/src/main/   # Foreground Service, ActionExecutor, WebSockets, MainActivity
├── laptop-agent/       # Windows Python background daemon
│   ├── agent.py        # WebSocket client with heartbeat & command executor
│   ├── tools.py        # Safe app launcher allowlist, sandboxed files, browser controls
│   └── run_agent.bat   # 1-click batch launcher for non-technical users
├── shared/             # Shared TypeScript & Python schemas and types
└── docs/               # Full architecture, setup, non-technical guide, troubleshooting
```

---

## 🚀 Quick Start Guide

### 1. Start Backend (Terminal 1)
```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation: `http://localhost:8000/docs`

### 2. Start Website Dashboard (Terminal 2)
```bash
cd website
npm run dev
```
Open `http://localhost:3000` in your browser. Click **"1-Click Demo Login"** to enter.

### 3. Start Windows Laptop Agent (Terminal 3)
```bash
cd laptop-agent
python agent.py
# Or simply double-click run_agent.bat
```

### 4. Run Android App
Open `android-app/` in Android Studio and click **Run (▶)** on your phone or emulator.

---

## 🧪 Automated Tests

Run the backend and laptop agent test suites:

```bash
# Test backend NLP, API endpoints, and persistent state
python -m pytest backend\tests

# Test laptop agent allowlist and sandbox security
python -m pytest laptop-agent\tests
```

---

## 📚 Documentation

* [Non-Technical User Guide](file:///c:/Users/Akshar/Desktop/Robo/docs/NON_TECHNICAL_GUIDE.md)
* [System Architecture & Flows](file:///c:/Users/Akshar/Desktop/Robo/docs/ARCHITECTURE.md)
* [Detailed Setup Instructions](file:///c:/Users/Akshar/Desktop/Robo/docs/SETUP.md)
* [Feature Matrix](file:///c:/Users/Akshar/Desktop/Robo/docs/FEATURE_MATRIX.md)
* [Troubleshooting Guide](file:///c:/Users/Akshar/Desktop/Robo/docs/TROUBLESHOOTING.md)
* [Security & Safety Guidelines](file:///c:/Users/Akshar/Desktop/Robo/docs/SECURITY.md)
