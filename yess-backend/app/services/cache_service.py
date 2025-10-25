from redis import Redis
from typing import Any, Optional
import json

class CacheService:
    def __init__(self, redis_host: str = 'redis', redis_port: int = 6379):
        self.redis = Redis(host=redis_host, port=redis_port, decode_responses=True)
        self.default_expiry = 3600  # 1 час по умолчанию

    def set(self, key: str, value: Any, expiry: Optional[int] = None):
        """Установка значения в кэш"""
        expiry = expiry or self.default_expiry
        serialized_value = json.dumps(value)
        self.redis.setex(key, expiry, serialized_value)

    def get(self, key: str) -> Optional[Any]:
        """Получение значения из кэша"""
        cached_value = self.redis.get(key)
        if cached_value:
            return json.loads(cached_value)
        return None

    def delete(self, key: str):
        """Удаление ключа из кэша"""
        self.redis.delete(key)

    def clear_cache(self):
        """Полная очистка кэша"""
        self.redis.flushdb()

    def cache_method(self, expiry: Optional[int] = None):
        """Декоратор для кэширования методов"""
        def decorator(func):
            def wrapper(*args, **kwargs):
                # Создание уникального ключа на основе аргументов
                cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
                
                # Проверка кэша
                cached_result = self.get(cache_key)
                if cached_result is not None:
                    return cached_result
                
                # Выполнение метода
                result = func(*args, **kwargs)
                
                # Кэширование результата
                self.set(cache_key, result, expiry)
                
                return result
            return wrapper
        return decorator

# Глобальный экземпляр сервиса
cache_service = CacheService()
