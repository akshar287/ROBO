from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.db.session import init_db
from backend.app.api.endpoints import auth, state, tasks, devices, voice, ws

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database and seed models
    print("[ROBO Backend] Starting up and initializing database...")
    init_db()
    print("[ROBO Backend] Ready to accept device connections and commands!")
    yield
    print("[ROBO Backend] Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multilingual Personal AI Agent Backend Orchestrator",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend and external devices
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(state.router, prefix=f"{settings.API_V1_STR}/state", tags=["Agent State"])
app.include_router(tasks.router, prefix=f"{settings.API_V1_STR}/tasks", tags=["Tasks"])
app.include_router(devices.router, prefix=f"{settings.API_V1_STR}/devices", tags=["Devices"])
app.include_router(voice.router, prefix=f"{settings.API_V1_STR}/voice", tags=["Voice"])
app.include_router(ws.router, prefix="/ws", tags=["WebSockets"])

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "ROBO AI Agent Backend",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
