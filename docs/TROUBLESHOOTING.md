# ROBO AI Assistant — Troubleshooting Guide

This guide covers common issues and their solutions when running ROBO.

---

## 1. Android Background Agent Stops When Screen is Locked

### Why it happens:
Modern Android operating systems (especially MIUI, OneUI, ColorOS, and Android 12+) aggressively kill background processes to save battery.

### Solution:
1. In the ROBO Android App, tap the **"⚡ Keep Alive"** button.
2. Select **"Allow"** when prompted to ignore battery optimizations.
3. In your phone's Android Settings:
   - Go to **Settings -> Apps -> ROBO AI -> Battery**.
   - Change from "Optimized" to **"Unrestricted"**.
   - Enable **"Autostart"** (on Xiaomi/Redmi/Oppo devices).
4. The ROBO persistent notification in the status bar ensures the foreground service continues running.

---

## 2. Phone Calls & WhatsApp Intents Don't Open

### Solution:
* Ensure WhatsApp is installed on the phone.
* When executing a call or WhatsApp dispatch, ROBO launches the official app with the recipient and message pre-filled.
* Check that Android hasn't blocked "Open supported links" for WhatsApp.

---

## 3. Web Dashboard Shows "WebSocket Connection Error"

### Solution:
1. Ensure the Backend FastAPI server is running on port 8000:
   ```bash
   uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
   ```
2. Check `NEXT_PUBLIC_API_URL` in `website/.env` (defaults to `http://localhost:8000`).
3. If connecting from a physical phone on the same WiFi network, change `localhost` to your computer's local IP address (e.g. `192.168.1.15`).

---

## 4. Laptop Agent Cannot Connect to Backend

### Solution:
1. Verify the Backend is running.
2. Check `laptop-agent/config.py`:
   `BACKEND_WS_URL` should point to `ws://localhost:8000/ws/laptop`.
3. If Windows Defender Firewall prompts you, click **Allow access** for Python.

---

## 5. Microphone Access in Web Browser

### Solution:
* Open the website on `http://localhost:3000` (or `https://` if hosted).
* Modern browsers (Chrome, Edge) require either a `localhost` origin or an `https://` connection to access the microphone.
* Click the "Site permissions" lock icon in your browser URL bar and set **Microphone** to **Allow**.
