import redis
import json
import hashlib
from functools import wraps
import asyncio

class CacheManager:
    def __init__(
        self, 
        host='localhost', 
        port=6379, 
        db=0
    ):
        """
        Инициализация Redis-клиента
        
        :param host: Хост Redis
        :param port: Порт Redis
        :param db: Номер базы данных
        """
        self.redis_client = redis.Redis(
            host=host, 
            port=port, 
            db=db,
            decode_responses=True
        )

    def generate_cache_key(self, func_name, *args, **kwargs):
        """
        Генерация уникального ключа кэша
        
        :param func_name: Имя функции
        :param args: Позиционные аргументы
        :param kwargs: Именованные аргументы
        :return: Хэш-ключ
        """
        key_parts = [
            func_name,
            *[str(arg) for arg in args],
            *[f"{k}={v}" for k, v in sorted(kwargs.items())]
        ]
        return hashlib.md5('_'.join(key_parts).encode()).hexdigest()

    def cache_result(self, expire=300):
        """
        Декоратор для кэширования асинхронных функций
        
        :param expire: Время жизни кэша в секундах
        """
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                # Генерация ключа кэша
                cache_key = self.generate_cache_key(
                    func.__name__, *args, **kwargs
                )

                # Попытка получить из кэша
                cached_result = self.redis_client.get(cache_key)
                if cached_result:
                    return json.loads(cached_result)

                # Выполнение функции
                result = await func(*args, **kwargs)

                # Кэширование результата
                self.redis_client.setex(
                    cache_key, 
                    expire, 
                    json.dumps(result)
                )

                return result
            return wrapper
        return decorator

    def invalidate_cache(self, func_name, *args, **kwargs):
        """
        Принудительное удаление кэша
        
        :param func_name: Имя функции
        :param args: Позиционные аргументы
        :param kwargs: Именованные аргументы
        """
        cache_key = self.generate_cache_key(
            func_name, *args, **kwargs
        )
        self.redis_client.delete(cache_key)

# Глобальный экземпляр
cache_manager = CacheManager()
