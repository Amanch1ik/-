import time
import asyncio
from functools import wraps
from prometheus_client import Counter, Histogram, start_http_server
import logging

class PerformanceMonitor:
    """
    Класс для мониторинга производительности приложения
    с использованием Prometheus метрик
    """
    # Метрики Prometheus
    REQUEST_COUNT = Counter(
        'yess_requests_total', 
        'Общее количество запросов',
        ['method', 'endpoint', 'status']
    )
    
    REQUEST_LATENCY = Histogram(
        'yess_request_latency_seconds', 
        'Время обработки запроса',
        ['method', 'endpoint']
    )

    CPU_USAGE = Histogram(
        'yess_cpu_usage', 
        'Использование CPU',
        ['service']
    )

    MEMORY_USAGE = Histogram(
        'yess_memory_usage', 
        'Использование памяти',
        ['service']
    )

    @classmethod
    def start_metrics_server(cls, port=8000):
        """
        Запуск HTTP-сервера для Prometheus метрик
        
        :param port: Порт для метрик
        """
        start_http_server(port)
        logging.info(f"Prometheus metrics server started on port {port}")

    @classmethod
    def track_request(
        cls, 
        method: str, 
        endpoint: str, 
        status: str = 'success'
    ):
        """
        Трекинг количества запросов
        
        :param method: HTTP-метод
        :param endpoint: Эндпоинт
        :param status: Статус запроса
        """
        cls.REQUEST_COUNT.labels(
            method=method, 
            endpoint=endpoint, 
            status=status
        ).inc()

    @classmethod
    def measure_request_time(cls, method: str, endpoint: str):
        """
        Декоратор для измерения времени выполнения запроса
        
        :param method: HTTP-метод
        :param endpoint: Эндпоинт
        """
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                start_time = time.time()
                try:
                    result = await func(*args, **kwargs)
                    cls.track_request(method, endpoint)
                    return result
                except Exception as e:
                    cls.track_request(method, endpoint, 'error')
                    raise
                finally:
                    duration = time.time() - start_time
                    cls.REQUEST_LATENCY.labels(
                        method=method, 
                        endpoint=endpoint
                    ).observe(duration)
            return wrapper
        return decorator

    @classmethod
    def log_performance_warning(
        cls, 
        method: str, 
        endpoint: str, 
        duration: float
    ):
        """
        Логирование предупреждений о производительности
        
        :param method: HTTP-метод
        :param endpoint: Эндпоинт
        :param duration: Время выполнения
        """
        if duration > 1.0:  # Более 1 секунды
            logging.warning(
                f"Slow request: {method} {endpoint} "
                f"took {duration:.2f} seconds"
            )

# Глобальный экземпляр
performance_monitor = PerformanceMonitor()

# Пример использования в контроллере
class PartnerController:
    @performance_monitor.measure_request_time(
        method='GET', 
        endpoint='/partners/nearby'
    )
    async def get_nearby_partners(self, request):
        # Логика получения партнеров
        partners = await partner_service.get_nearby_partners(
            request.latitude, 
            request.longitude
        )
        return partners

# Запуск сервера метрик при старте приложения
performance_monitor.start_metrics_server()
