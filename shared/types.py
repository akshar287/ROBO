from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class AgentState(str, Enum):
    ON = "ON"
    OFF = "OFF"

class DeviceType(str, Enum):
    LAPTOP = "laptop"
    ANDROID = "android"
    WEBSITE = "website"
    SERVER = "server"

class TaskStatus(str, Enum):
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TaskPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"

class ActionType(str, Enum):
    # Laptop actions
    LAUNCH_APP = "launch_app"
    CLOSE_APP = "close_app"
    BROWSER_OPEN = "browser_open"
    BROWSER_SEARCH = "browser_search"
    BROWSER_SCRAPE = "browser_scrape"
    FILE_READ = "file_read"
    FILE_WRITE = "file_write"
    FILE_LIST = "file_list"
    DESKTOP_NOTIFY = "desktop_notify"
    
    # Android actions
    OPEN_APP = "open_app"
    PLAY_STORE_SEARCH = "play_store_search"
    DIAL_PHONE = "dial_phone"
    SEND_SMS_DRAFT = "send_sms_draft"
    WHATSAPP_DRAFT = "whatsapp_draft"
    ANDROID_NOTIFY = "android_notify"
    
    # Server / AI actions
    GMAIL_LIST_UNREAD = "gmail_list_unread"
    GMAIL_SUMMARIZE = "gmail_summarize"
    GMAIL_DRAFT_REPLY = "gmail_draft_reply"
    GMAIL_SEND = "gmail_send"
    CALL_INITIATE_AI = "call_initiate_ai"
    VOICE_SPEAK = "voice_speak"

class TaskStep(BaseModel):
    step_id: str
    target_device: DeviceType
    action: ActionType
    parameters: Dict[str, Any] = Field(default_factory=dict)
    status: TaskStatus = TaskStatus.QUEUED
    result: Optional[Any] = None
    error: Optional[str] = None
    requires_approval: bool = False
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class Task(BaseModel):
    task_id: str
    user_id: str
    original_prompt: str
    detected_language: str = "en"
    priority: TaskPriority = TaskPriority.NORMAL
    status: TaskStatus = TaskStatus.QUEUED
    steps: List[TaskStep] = Field(default_factory=list)
    requires_approval: bool = False
    approval_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    execution_log: List[str] = Field(default_factory=list)

class DeviceRegistration(BaseModel):
    device_id: str
    device_name: str
    device_type: DeviceType
    os_version: Optional[str] = None
    capabilities: List[str] = Field(default_factory=list)
    pairing_code: Optional[str] = None

class DeviceHeartbeat(BaseModel):
    device_id: str
    device_type: DeviceType
    battery_level: Optional[float] = None
    is_charging: Optional[bool] = None
    agent_version: str = "1.0.0"
    current_status: str = "idle"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class WebSocketMessage(BaseModel):
    type: str # "command", "task_update", "heartbeat", "agent_state", "approval_request", "ack"
    source: DeviceType
    target: Optional[DeviceType] = None
    payload: Dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
