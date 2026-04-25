from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..auth import create_access_token, get_db, hash_password, verify_password
from ..models import User
from ..schemas import RegisterSchema, LoginSchema, TokenResponse, UserReadSchema

router = APIRouter()

@router.post("/register", response_model=UserReadSchema)
def register(user: RegisterSchema, db: Session = Depends(get_db)):
    role = user.role.strip().lower()
    if role not in {"admin", "developer"}:
        raise HTTPException(status_code=400, detail="Role must be 'admin' or 'developer'")

    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=user.username,
        password=hash_password(user.password),
        role=role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=TokenResponse)
def login(user: LoginSchema, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": db_user.id,
        "role": db_user.role,
    })

    return {
        "access_token": token,
        "role": db_user.role,
    }