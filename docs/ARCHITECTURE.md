# ROBO AI Assistant — System Architecture

ROBO is a modular, zero-token personal AI agent ecosystem that operates across **Web**, **Android**, and **Windows Laptop**.

```mermaid
flowchart TD
    User([User Voice / Text]) -->|Gujarati / Hindi / English| Web[Next.js Web Dashboard]
    User -->|Native SpeechRecognizer| Android[Android Native App]
    
    subgraph CloudOrLocal [ROBO Backend - FastAPI]
        API[REST & WebSocket Gateway]
        State[Persistent SystemState DB]
        NLP[Multilingual NLP Parser]
        Router[Cross-Device Task Orchestrator]
        Auth[Mobile & Email Auth]
        Approvals[Task Approval Queue]
    end

    Web <-->|WebSockets & REST| API
    Android <-->|WebSockets & Intent Dispatch| API
    Laptop[Windows Desktop Agent] <-->|WebSockets & Safe Tools| API

    subgraph PhoneActions [Android Phone Execution]
        AndroidService[Foreground Service & Sticky Notification]
        WhatsApp[Native WhatsApp URI Intent]
        Dialer[Native Phone Dialer]
        PlayStore[Google Play Store Search]
    end

    subgraph LaptopActions [Windows Laptop Execution]
        TrayAgent[Python Background Daemon]
        AppLauncher[Safe App Allowlist]
        BrowserAuto[Browser & URL Automation]
        Sandbox[Sandboxed File System]
    end

    Android --> AndroidService
    AndroidService --> WhatsApp
    AndroidService --> Dialer
    AndroidService --> PlayStore

    Laptop --> TrayAgent
    TrayAgent --> AppLauncher
    TrayAgent --> BrowserAuto
    TrayAgent --> Sandbox
```

## Key Architectural Principles

1. **Zero-Token, Zero-Friction Usability**:
   - Designed for non-technical users.
   - Requires **no WhatsApp Business Cloud API tokens**, no Facebook developer accounts, no Twilio telecom credit cards.
   - Uses native Android intents (`whatsapp://send`, `tel:`, `market://search`) and universal web protocols.

2. **Persistent Desired Agent State**:
   - Master ON/OFF toggle is persisted in SQLite (`SystemState` table).
   - Closing the browser tab does **not** reset the state.
   - Connected devices stay synchronized and refuse new tasks when the agent is turned OFF.

3. **Multilingual Voice Pipeline**:
   - Full support for **Gujarati (ગુજરાતી)**, **Hindi (हिन्दी)**, **English**, and code-switched phrases (Gujlish & Hinglish).
   - Uses browser Web Speech API (`gu-IN`, `hi-IN`, `en-IN`) on web and Android native `SpeechRecognizer` on phone.
   - Spoken feedback via Web Speech Synthesis and Android `TextToSpeech`.

4. **Real Background Operation**:
   - **Android**: Declared Foreground Service (`RoboBackgroundService`) with sticky notification and `FOREGROUND_SERVICE_DATA_SYNC` type, maintaining WebSocket connection even when screen is locked.
   - **Windows**: Independent background Python daemon (`agent.py`) with optional Windows Startup folder integration.

5. **Approval Gates for Sensitive Operations**:
   - Actions like drafting email replies or placing direct calls require explicit confirmation in the Dashboard Approval Queue.
