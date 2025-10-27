import time
import asyncio
from functools import wraps
from typing import Callable, Any

class PerformanceOptimizer:
    @staticmethod
    def measure_performance(func: Callable) -> Callable:
        """
        Декоратор для измерения времени выполнения функции
        """
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start_time
                if duration > 1.0:  # Логируем медленные запросы
                    print(f"⏱️ Slow function: {func.__name__}, Duration: {duration:.2f}s")
        return wrapper

    @staticmethod
    async def batch_execute(tasks, max_concurrent=10):
        """
        Выполнение пакетных задач с ограничением параллельности
        """
        semaphore = asyncio.Semaphore(max_concurrent)

        async def bounded_task(task):
            async with semaphore:
                return await task

        return await asyncio.gather(*(bounded_task(task) for task in tasks))

    @staticmethod
    def cache_result(ttl=300):
        """
        Декоратор для кэширования результатов функций
        """
        def decorator(func):
            cache = {}

            @wraps(func)
            async def wrapper(*args, **kwargs):
                key = str(args) + str(kwargs)
                current_time = time.time()

                if key in cache:
                    result, timestamp = cache[key]
                    if current_time - timestamp < ttl:
                        return result

                result = await func(*args, **kwargs)
                cache[key] = (result, current_time)
                return result

            return wrapper
        return decorator

# Пример использования
class UserService:
    @PerformanceOptimizer.measure_performance
    @PerformanceOptimizer.cache_result(ttl=60)
    async def get_user_details(self, user_id):
        # Имитация запроса к базе данных
        await asyncio.sleep(0.5)
        return {"id": user_id, "name": "Test User"}

# Глобальный экземпляр оптимизатора
performance_optimizer = PerformanceOptimizer()
