import json
from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(32), unique=True, index=True, nullable=False)
    full_name = Column(String(255), default="Robo User")
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    devices = relationship("Device", back_populates="user")
    tasks = relationship("TaskModel", back_populates="user")
    contacts = relationship("Contact", back_populates="user")

class SystemState(Base):
    __tablename__ = "system_state"
    
    id = Column(Integer, primary_key=True, default=1)
    agent_state = Column(String(10), default="ON")  # "ON" or "OFF"
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = Column(String(255), default="system")

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String(100), unique=True, index=True, nullable=False)
    device_name = Column(String(255), nullable=False)
    device_type = Column(String(50), nullable=False)  # "laptop", "android", "website"
    os_version = Column(String(100), nullable=True)
    is_online = Column(Boolean, default=False)
    last_seen = Column(DateTime, default=datetime.utcnow)
    battery_level = Column(Float, nullable=True)
    is_charging = Column(Boolean, nullable=True)
    pairing_code = Column(String(10), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    user = relationship("User", back_populates="devices")

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), index=True, nullable=False)
    aliases = Column(String(255), nullable=True)  # e.g., "mummy, mom, mataji, માતાજી, મમ્મી, माँ"
    phone_number = Column(String(30), nullable=False)
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="contacts")

class TaskModel(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    original_prompt = Column(Text, nullable=False)
    detected_language = Column(String(20), default="en")
    priority = Column(String(20), default="normal")
    status = Column(String(30), default="queued")  # "pending_approval", "in_progress", "completed", "failed", "cancelled"
    requires_approval = Column(Boolean, default=False)
    approval_reason = Column(Text, nullable=True)
    result_summary = Column(Text, nullable=True)
    execution_log = Column(Text, default="[]")  # JSON string array
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="tasks")
    steps = relationship("TaskStepModel", back_populates="task", cascade="all, delete-orphan")

    def get_logs(self) -> List[str]:
        try:
            return json.loads(self.execution_log)
        except Exception:
            return []

    def add_log(self, message: str):
        logs = self.get_logs()
        logs.append(f"[{datetime.utcnow().strftime('%H:%M:%S')}] {message}")
        self.execution_log = json.dumps(logs)

class TaskStepModel(Base):
    __tablename__ = "task_steps"
    
    id = Column(Integer, primary_key=True, index=True)
    step_id = Column(String(100), unique=True, index=True, nullable=False)
    task_id = Column(String(100), ForeignKey("tasks.task_id"), nullable=False)
    target_device = Column(String(50), nullable=False)  # "laptop", "android", "server"
    action = Column(String(100), nullable=False)
    parameters_json = Column(Text, default="{}")
    status = Column(String(30), default="queued")
    result_json = Column(Text, nullable=True)
    error = Column(Text, nullable=True)
    requires_approval = Column(Boolean, default=False)
    
    task = relationship("TaskModel", back_populates="steps")

    def get_parameters(self) -> dict:
        try:
            return json.loads(self.parameters_json)
        except Exception:
            return {}

    def set_parameters(self, data: dict):
        self.parameters_json = json.dumps(data)
