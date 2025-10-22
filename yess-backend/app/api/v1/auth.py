"""
Authentication endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.models.user import User
from app.models.wallet import Wallet
from app.models.agent import Agent, Referral
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.core.config import settings
import uuid

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register new user"""
    
    # Check if user exists
    if db.query(User).filter(User.phone == user_data.phone).first():
        raise HTTPException(status_code=400, detail="Phone already registered")
    
    if user_data.email and db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=get_password_hash(user_data.password),
        city_id=user_data.city_id,
        referral_code=str(uuid.uuid4())[:8].upper()  # Generate unique code
    )
    db.add(user)
    db.flush()
    
    # Create wallet
    wallet = Wallet(user_id=user.id, balance=0.00)
    db.add(wallet)
    
    # Handle referral
    if user_data.referral_code:
        agent = db.query(Agent).filter(Agent.referral_code == user_data.referral_code).first()
        if agent:
            # Create referral
            referral = Referral(
                agent_id=agent.id,
                referred_user_id=user.id,
                bonus=settings.DEFAULT_REFERRAL_BONUS
            )
            db.add(referral)
            
            # Give bonus to agent
            agent_wallet = db.query(Wallet).filter(Wallet.user_id == agent.user_id).first()
            if agent_wallet:
                agent_wallet.balance += settings.DEFAULT_REFERRAL_BONUS
                agent.total_bonus += settings.DEFAULT_REFERRAL_BONUS
                agent.total_referrals += 1
    
    db.commit()
    db.refresh(user)
    
    # Create tokens
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id
    )


@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    
    user = db.query(User).filter(User.phone == user_data.phone).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone or password"
        )
    
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: int, db: Session = Depends(get_db)):
    """Get current user info"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

