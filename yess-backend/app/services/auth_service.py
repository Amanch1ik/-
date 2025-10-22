from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserInDB
from app.core.database import get_db

class AuthService:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """Проверка пароля с использованием bcrypt"""
        return cls.pwd_context.verify(plain_password, hashed_password)
    
    @classmethod
    def get_password_hash(cls, password: str) -> str:
        """Хэширование пароля"""
        return cls.pwd_context.hash(password)
    
    @classmethod
    def create_access_token(
        cls, 
        data: Dict[str, Any], 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Создание JWT токена доступа"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm="HS256"
        )
        return encoded_jwt
    
    @classmethod
    def create_refresh_token(
        cls, 
        data: Dict[str, Any], 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Создание refresh токена"""
        if not expires_delta:
            expires_delta = timedelta(days=7)
        
        return cls.create_access_token(data, expires_delta)
    
    @classmethod
    def decode_token(cls, token: str) -> Dict[str, Any]:
        """Декодирование и валидация токена"""
        try:
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=["HS256"]
            )
            return payload
        except JWTError:
            return None
    
    @classmethod
    def authenticate_user(
        cls, 
        db: Session, 
        username: str, 
        password: str
    ) -> Optional[User]:
        """Аутентификация пользователя"""
        user = db.query(User).filter(User.username == username).first()
        
        if not user:
            return None
        
        if not cls.verify_password(password, user.hashed_password):
            return None
        
        return user
    
    @classmethod
    def register_user(
        cls, 
        db: Session, 
        user: UserCreate
    ) -> UserInDB:
        """Регистрация нового пользователя"""
        hashed_password = cls.get_password_hash(user.password)
        
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=False
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return UserInDB.from_orm(db_user)
    
    @classmethod
    def is_password_strong(cls, password: str) -> bool:
        """Проверка сложности пароля"""
        return (
            len(password) >= 12 and  # Минимальная длина
            any(char.isupper() for char in password) and  # Заглавные буквы
            any(char.islower() for char in password) and  # Строчные буквы
            any(char.isdigit() for char in password) and  # Цифры
            any(not char.isalnum() for char in password)  # Спецсимволы
        )
    
    @classmethod
    def track_login_attempt(
        cls, 
        db: Session, 
        username: str, 
        success: bool
    ) -> None:
        """Отслеживание попыток входа"""
        login_attempt = LoginAttempt(
            username=username,
            success=success,
            timestamp=datetime.utcnow()
        )
        db.add(login_attempt)
        db.commit()

auth_service = AuthService()
