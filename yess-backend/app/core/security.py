"""
Security utilities: JWT, password hashing
"""
import secrets
import hashlib
import base64
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from jose import jwt
from passlib.context import CryptContext

class SecurityManager:
    """
    Централизованный менеджер безопасности для YESS Loyalty
    """
    SECRET_KEY = secrets.token_hex(32)
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_DAYS = 7

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def hash_password(cls, password: str) -> str:
        """
        Хэширование пароля с использованием bcrypt
        """
        return cls.pwd_context.hash(password)

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """
        Проверка пароля
        """
        return cls.pwd_context.verify(plain_password, hashed_password)

    @classmethod
    def create_access_token(cls, data: Dict[str, Any]) -> str:
        """
        Создание JWT токена доступа
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=cls.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        
        return jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)

    @classmethod
    def create_refresh_token(cls, data: Dict[str, Any]) -> str:
        """
        Создание refresh токена
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=cls.REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        
        return jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)

    @classmethod
    def decode_token(cls, token: str) -> Optional[Dict[str, Any]]:
        """
        Декодирование и проверка токена
        """
        try:
            return jwt.decode(token, cls.SECRET_KEY, algorithms=[cls.ALGORITHM])
        except jwt.JWTError:
            return None

    @staticmethod
    def generate_secure_random_token(length: int = 32) -> str:
        """
        Генерация криптографически стойкого токена
        """
        return secrets.token_urlsafe(length)

    @staticmethod
    def generate_totp_secret() -> str:
        """
        Генерация секрета для двухфакторной аутентификации
        """
        return base64.b32encode(secrets.token_bytes(20)).decode('utf-8')

    @staticmethod
    def hash_data(data: str) -> str:
        """
        Хэширование данных с солью
        """
        salt = secrets.token_hex(16)
        return f"{salt}${hashlib.sha256((salt + data).encode()).hexdigest()}"

    @staticmethod
    def verify_data_hash(data: str, hash_value: str) -> bool:
        """
        Проверка хэша данных
        """
        salt, original_hash = hash_value.split('$')
        return hashlib.sha256((salt + data).encode()).hexdigest() == original_hash

# Глобальный экземпляр менеджера безопасности
security_manager = SecurityManager()
