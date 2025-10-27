import pytest
import asyncio
import time
from app.core.performance import PerformanceOptimizer

class TestPerformance:
    @pytest.mark.asyncio
    async def test_batch_execute(self):
        """Тест параллельного выполнения задач"""
        async def mock_task(delay):
            await asyncio.sleep(delay)
            return delay

        tasks = [mock_task(0.1) for _ in range(10)]
        start_time = time.time()
        
        results = await PerformanceOptimizer.batch_execute(tasks)
        
        total_time = time.time() - start_time
        
        assert len(results) == 10
        assert total_time < 0.5  # Должно выполняться быстрее 0.5 сек

    @pytest.mark.asyncio
    async def test_cache_result(self):
        """Тест кэширования результатов"""
        @PerformanceOptimizer.cache_result(ttl=1)
        async def expensive_function(x):
            await asyncio.sleep(0.5)  # Имитация долгого вычисления
            return x * 2

        # Первый вызов
        start_time = time.time()
        result1 = await expensive_function(5)
        first_call_time = time.time() - start_time

        # Второй вызов (должен быть быстрее)
        start_time = time.time()
        result2 = await expensive_function(5)
        second_call_time = time.time() - start_time

        assert result1 == 10
        assert result2 == 10
        assert second_call_time < first_call_time

    def test_measure_performance(self):
        """Тест декоратора измерения производительности"""
        @PerformanceOptimizer.measure_performance
        async def slow_function():
            await asyncio.sleep(1.1)  # Намеренно медленная функция

        with pytest.raises(AssertionError):
            asyncio.run(slow_function())
