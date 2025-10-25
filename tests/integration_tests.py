import pytest
import httpx
from app.services.cache_service import cache_service
from app.core.security_middleware import SecurityMiddleware
from app.services.backup_service import backup_service
import os

class TestSystemIntegration:
    @pytest.mark.asyncio
    async def test_cache_and_security_integration(self):
        """
        Проверка интеграции кэширования и middleware безопасности
        """
        # Имитация запросов
        security_middleware = SecurityMiddleware(None)
        
        # Множественные запросы с одного IP
        for _ in range(10):
            security_middleware._track_ip_attempt('test_ip')
        
        # Проверка блокировки
        assert security_middleware._is_ip_blocked('test_ip') == True
        
        # Проверка кэширования
        @cache_service.cache_method()
        def test_cached_function(x):
            return x * 2
        
        result1 = test_cached_function(5)
        result2 = test_cached_function(5)
        
        assert result1 == result2

    def test_backup_integration(self):
        """
        Проверка полного цикла резервного копирования
        """
        # Выполнение бэкапа
        backup_service.backup_routine()
        
        # Проверка создания локального бэкапа
        assert len(os.listdir(backup_service.backup_dir)) > 0
        
        # Проверка загрузки в S3
        s3_objects = backup_service.s3_client.list_objects_v2(
            Bucket=backup_service.s3_bucket,
            Prefix='daily/'
        )
        assert len(s3_objects.get('Contents', [])) > 0

    @pytest.mark.asyncio
    async def test_external_service_integration(self):
        """
        Проверка интеграции с внешними сервисами
        """
        async with httpx.AsyncClient() as client:
            # Тест подключения к основным сервисам
            services_to_check = [
                'https://api.optimalbank.kg',
                'https://api.elcart.kg',
                'https://firebase.googleapis.com'
            ]
            
            for service_url in services_to_check:
                response = await client.get(service_url, timeout=10)
                assert response.status_code == 200

def run_integration_tests():
    pytest.main([
        "-v",  # Verbose режим
        "--tb=short",  # Короткие трейсбэки
        "tests/integration_tests.py"
    ])

if __name__ == "__main__":
    run_integration_tests()
