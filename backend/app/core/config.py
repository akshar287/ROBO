import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "ROBO Personal AI Agent"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Server settings
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]
    
    # Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "robo-secret-key-for-zero-friction-personal-assistant-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    
    # Database (Standard zero-dependency SQLite)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./robo.db")
    
    # AI Brain (Zero-token smart NLP is default, with optional Ollama/API)
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "smart_nlp")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3:8b")
    OPENAI_COMPATIBLE_API_KEY: str = os.getenv("OPENAI_COMPATIBLE_API_KEY", "")
    OPENAI_COMPATIBLE_BASE_URL: str = os.getenv("OPENAI_COMPATIBLE_BASE_URL", "https://api.groq.com/openai/v1")
    OPENAI_COMPATIBLE_MODEL: str = os.getenv("OPENAI_COMPATIBLE_MODEL", "llama-3.1-8b-instant")
    
    # Zero-Token Integrations
    WHATSAPP_MODE: str = os.getenv("WHATSAPP_MODE", "zero_token")
    CALLING_PROVIDER: str = os.getenv("CALLING_PROVIDER", "zero_token")

settings = Settings()
