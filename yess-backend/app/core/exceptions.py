from fastapi import HTTPException, status
from enum import Enum
from typing import Optional, Dict, Any

class ErrorType(Enum):
    VALIDATION_ERROR = "validation_error"
    AUTH_ERROR = "authentication_error"
    NOT_FOUND = "not_found"
    PERMISSION_DENIED = "permission_denied"
    INTERNAL_SERVER_ERROR = "internal_server_error"
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"
    EXTERNAL_SERVICE_ERROR = "external_service_error"

class YessLoyaltyException(Exception):
    """Базовое исключение для YESS Loyalty"""
    def __init__(
        self, 
        message: str, 
        error_type: ErrorType = ErrorType.INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.error_type = error_type
        self.details = details or {}
        super().__init__(self.message)

    def to_dict(self):
        return {
            "error": {
                "type": self.error_type.value,
                "message": self.message,
                "details": self.details
            }
        }

class ValidationException(YessLoyaltyException):
    """Ошибки валидации данных"""
    def __init__(self, field: str, error: str):
        super().__init__(
            f"Ошибка валидации: {field} - {error}",
            error_type=ErrorType.VALIDATION_ERROR,
            details={"field": field, "error": error}
        )

class AuthenticationException(YessLoyaltyException):
    """Ошибки аутентификации"""
    def __init__(self, message: str):
        super().__init__(
            message, 
            error_type=ErrorType.AUTH_ERROR
        )

class NotFoundException(YessLoyaltyException):
    """Ресурс не найден"""
    def __init__(self, resource: str):
        super().__init__(
            f"Ресурс не найден: {resource}",
            error_type=ErrorType.NOT_FOUND,
            details={"resource": resource}
        )

class PermissionDeniedException(YessLoyaltyException):
    """Недостаточно прав"""
    def __init__(self, action: str):
        super().__init__(
            f"Недостаточно прав для выполнения: {action}",
            error_type=ErrorType.PERMISSION_DENIED,
            details={"action": action}
        )
