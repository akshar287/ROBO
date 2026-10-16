from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select

from backend.app.db.session import get_db
from backend.app.db.models import User
from backend.app.core.security import create_access_token, get_password_hash

router = APIRouter()

class LoginRequest(BaseModel):
    phone: str
    email: str
    password: str = "password123"

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str
    email: str
    phone: str

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    clean_phone = "".join(filter(str.isdigit, req.phone))
    clean_email = req.email.strip().lower()

    result = db.execute(select(User).where((User.email == clean_email) | (User.phone == clean_phone)))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            email=clean_email,
            phone=clean_phone or "9876543210",
            full_name=clean_email.split("@")[0].capitalize(),
            hashed_password=get_password_hash(req.password)
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "email": user.email, "phone": user.phone})

    return LoginResponse(
        access_token=token,
        user_id=user.id,
        full_name=user.full_name or "Robo User",
        email=user.email,
        phone=user.phone
    )

@router.get("/me")
def get_me(db: Session = Depends(get_db)):
    result = db.execute(select(User).limit(1))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": user.id,
        "email": user.email,
        "phone": user.phone,
        "full_name": user.full_name
    }
