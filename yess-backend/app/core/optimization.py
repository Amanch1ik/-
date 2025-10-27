import asyncio
import time
import psutil
import logging
from functools import wraps
from typing import Callable, Any

class SystemOptimizer:
    """
    Комплексный оптимизатор производительности системы
    """
    @staticmethod
    def measure_resource_usage(func: Callable) -> Callable:
        """
        Декоратор для измерения использования ресурсов
        """
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Замер начальных показателей
            start_cpu = psutil.cpu_percent()
            start_memory = psutil.virtual_memory().percent
            start_time = time.time()

            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                # Замер финальных показателей
                end_time = time.time()
                end_cpu = psutil.cpu_percent()
                end_memory = psutil.virtual_memory().percent

                # Логирование метрик
                logging.info(
                    f"Performance Metrics for {func.__name__}:\n"
                    f"Execution Time: {end_time - start_time:.4f} sec\n"
                    f"CPU Usage: {start_cpu}% → {end_cpu}%\n"
                    f"Memory Usage: {start_memory}% → {end_memory}%"
                )

        return wrapper

    @staticmethod
    async def optimize_database_queries(queries):
        """
        Параллельное выполнение запросов с ограничением
        """
        semaphore = asyncio.Semaphore(10)  # Максимум 10 параллельных запросов

        async def bounded_query(query):
            async with semaphore:
                return await query

        return await asyncio.gather(*(bounded_query(q) for q in queries))

    @staticmethod
    def cache_with_expiration(
        cache_storage, 
        expire_seconds: int = 300
    ):
        """
        Декоратор для кэширования с явным указанием времени жизни
        """
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                # Генерация уникального ключа кэша
                cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"

                # Проверка кэша
                cached_result = cache_storage.get(cache_key)
                if cached_result:
                    return cached_result

                # Выполнение функции
                result = await func(*args, **kwargs)

                # Кэширование с истечением
                cache_storage.setex(
                    cache_key, 
                    expire_seconds, 
                    result
                )

                return result
            return wrapper
        return decorator

    @staticmethod
    def circuit_breaker(
        failure_threshold: int = 5, 
        recovery_timeout: int = 30
    ):
        """
        Декоратор для реализации паттерна Circuit Breaker
        """
        def decorator(func):
            failures = 0
            last_failure_time = 0

            @wraps(func)
            async def wrapper(*args, **kwargs):
                nonlocal failures, last_failure_time

                # Проверка состояния Circuit Breaker
                current_time = time.time()
                if (
                    failures >= failure_threshold and 
                    current_time - last_failure_time < recovery_timeout
                ):
                    raise Exception("Circuit is OPEN. Service temporarily unavailable")

                try:
                    result = await func(*args, **kwargs)
                    failures = 0  # Сброс счетчика при успешном выполнении
                    return result
                except Exception as e:
                    failures += 1
                    last_failure_time = current_time
                    logging.error(f"Circuit Breaker: {func.__name__} failed")
                    raise

            return wrapper
        return decorator

# Глобальный экземпляр оптимизатора
system_optimizer = SystemOptimizer()
