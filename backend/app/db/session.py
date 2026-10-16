from typing import Generator
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Session
from backend.app.core.config import settings
from backend.app.db.models import Base, SystemState, User, Contact, Device
from backend.app.core.security import get_password_hash

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=False
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    
    with SessionLocal() as session:
        state_result = session.execute(select(SystemState).where(SystemState.id == 1))
        system_state = state_result.scalar_one_or_none()
        if not system_state:
            initial_state = SystemState(id=1, agent_state="ON", updated_by="system_init")
            session.add(initial_state)
        
        user_result = session.execute(select(User).where(User.email == "user@robo.ai"))
        user = user_result.scalar_one_or_none()
        if not user:
            user = User(
                email="user@robo.ai",
                phone="9876543210",
                full_name="Akshar Patel",
                hashed_password=get_password_hash("password123")
            )
            session.add(user)
            session.flush()
            
            contacts = [
                Contact(
                    user_id=user.id,
                    name="Mummy",
                    aliases="mummy, mom, mataji, માતાજી, મમ્મી, माँ, मम्मी",
                    phone_number="+919876500001",
                    email="mummy@example.com"
                ),
                Contact(
                    user_id=user.id,
                    name="Papa",
                    aliases="papa, dad, pitaji, પપ્પા, પિતાજી, पापा",
                    phone_number="+919876500002",
                    email="papa@example.com"
                ),
                Contact(
                    user_id=user.id,
                    name="Rahul",
                    aliases="rahul, રાહુલ, राहुल",
                    phone_number="+919876500003",
                    email="rahul@example.com"
                )
            ]
            for c in contacts:
                session.add(c)
                
            sample_devices = [
                Device(
                    device_id="laptop-windows-main",
                    device_name="Akshar's Windows Laptop",
                    device_type="laptop",
                    os_version="Windows 11 Pro",
                    is_online=False,
                    battery_level=None,
                    is_charging=False,
                    user_id=user.id
                ),
                Device(
                    device_id="android-phone-main",
                    device_name="Akshar's Android Phone",
                    device_type="android",
                    os_version="Android 14 (API 34)",
                    is_online=False,
                    battery_level=None,
                    is_charging=False,
                    user_id=user.id
                )
            ]
            for d in sample_devices:
                session.add(d)

        session.commit()
