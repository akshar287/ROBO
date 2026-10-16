# ROBO Feature Matrix

| Feature | Status | Execution Mechanism | External API Token Required? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Multilingual Voice (Gujarati)** | ✅ Fully Implemented | Web Speech API (`gu-IN`) / Android SpeechRecognizer | **No (100% Free)** | Recognizes native script & transliterated Gujlish |
| **Multilingual Voice (Hindi)** | ✅ Fully Implemented | Web Speech API (`hi-IN`) / Android SpeechRecognizer | **No (100% Free)** | Recognizes Devanagari script & Hinglish |
| **Multilingual Voice (English)** | ✅ Fully Implemented | Web Speech API (`en-IN`/`en-US`) / Android SpeechRecognizer | **No (100% Free)** | High accuracy voice input |
| **Zero-Token WhatsApp** | ✅ Fully Implemented | Android Intent `whatsapp://send` & Web Deep link | **No (100% Free)** | Pre-fills recipient and message draft without Meta Cloud API |
| **Zero-Token Phone Calls** | ✅ Fully Implemented | Android Native Dialer Intent (`tel:`) | **No (100% Free)** | Validates recipient, dials native phone app |
| **Persistent Agent State (Jarvis ON/OFF)** | ✅ Fully Implemented | SQLite database `SystemState` table + WebSocket broadcast | **No (100% Free)** | Persists when browser or app is closed |
| **Zero-Friction Login** | ✅ Fully Implemented | Mobile Number + Email + JWT | **No (100% Free)** | No complex developer onboarding |
| **Android Background Operation** | ✅ Fully Implemented | Kotlin Foreground Service + Sticky Notification | **No (100% Free)** | Keeps WebSocket connection alive |
| **Android Battery Optimization Guidance** | ✅ Fully Implemented | `ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | **No (100% Free)** | Prevents Android OS from killing agent |
| **Android Play Store Search** | ✅ Fully Implemented | Intent `market://search?q=` | **No (100% Free)** | Direct Play Store app search |
| **Windows Laptop Agent** | ✅ Fully Implemented | Python background daemon + WebSockets | **No (100% Free)** | Independent of browser tab |
| **Laptop App Launcher** | ✅ Fully Implemented | Safe allowlist (`chrome`, `notepad`, `calc`, `spotify`, etc.) | **No (100% Free)** | Prevents arbitrary shell injection |
| **Laptop Browser Automation** | ✅ Fully Implemented | Python `webbrowser` & URL dispatch | **No (100% Free)** | Launches YouTube, search queries |
| **Laptop File Sandbox** | ✅ Fully Implemented | Sandboxed in `~/Desktop/RoboFiles` | **No (100% Free)** | Path traversal protections strictly enforced |
| **Windows Startup Registration** | ✅ Fully Implemented | Batch shortcut in Windows Startup directory | **No (100% Free)** | Starts on PC boot |
| **Task Approval Queue** | ✅ Fully Implemented | Dashboard Modal + Backend Approval State | **No (100% Free)** | Sensitive emails/calls require 1-click user review |
| **Gmail Unread Summary & Reply Draft** | ✅ Fully Implemented | Zero-token direct mailto + simulated inbox + OAuth support | **No (100% Free)** | Shows full draft before sending |
| **Twilio AI Voice Call Integration** | 🔶 Optional Extension | Cloud VoIP calling interface | Yes (Paid account) | Disabled by default; zero-token Android dialer is default |
| **Always-on Locked Mic Capture** | ⚠️ Platform Restricted | OS Restricted (Microphone in background while locked) | N/A | Restricted by modern Android & Windows privacy policies. Alternative: persistent foreground service with quick notification action |
