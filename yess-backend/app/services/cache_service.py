import redis
import json
import asyncio
from functools import wraps
from typing import Any, Callable
from app.core.config import settings

class CacheService:
    def __init__(self):
        self.redis_client = redis.Redis.from_url(
            settings.REDIS_URL, 
            decode_responses=True,
            max_connections=20,
            retry_on_timeout=True
        )

    def set(self, key: str, value: Any, expire: int = None):
        """
        Установка значения в кэш с возможностью указания времени жизни
        """
        if expire is None:
            expire = settings.CACHE_EXPIRATION

        serialized_value = json.dumps(value)
        self.redis_client.setex(key, expire, serialized_value)

    async def set_async(self, key: str, value: Any, expire: int = None):
        """
        Асинхронная установка значения в кэш
        """
        if expire is None:
            expire = settings.CACHE_EXPIRATION

        serialized_value = json.dumps(value)
        await asyncio.get_event_loop().run_in_executor(
            None, 
            lambda: self.redis_client.setex(key, expire, serialized_value)
        )

    def get(self, key: str) -> Any:
        """
        Получение значения из кэша с десериализацией
        """
        cached_value = self.redis_client.get(key)
        if cached_value:
            return json.loads(cached_value)
        return None

    async def get_async(self, key: str) -> Any:
        """
        Асинхронное получение значения из кэша
        """
        cached_value = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: self.redis_client.get(key)
        )
        if cached_value:
            return json.loads(cached_value)
        return None

    def delete(self, key: str):
        """
        Удаление ключа из кэша
        """
        self.redis_client.delete(key)

    async def delete_async(self, key: str):
        """
        Асинхронное удаление ключа из кэша
        """
        await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: self.redis_client.delete(key)
        )

    def clear(self):
        """
        Полная очистка кэша
        """
        self.redis_client.flushdb()

    async def clear_async(self):
        """
        Асинхронная полная очистка кэша
        """
        await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: self.redis_client.flushdb()
        )

    def cached(self, key_prefix: str = '', expire: int = None):
        """
        Декоратор для кэширования результатов функций
        """
        def decorator(func: Callable):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                # Генерация уникального ключа на основе аргументов
                key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(kwargs))}"
                
                # Проверка кэша
                cached_result = await self.get_async(key)
                if cached_result is not None:
                    return cached_result
                
                # Выполнение функции
                result = await func(*args, **kwargs)
                
                # Кэширование результата
                await self.set_async(key, result, expire)
                
                return result
            return wrapper
        return decorator

cache_service = CacheService()
