import pytest
import asyncio
from sqlalchemy.orm import Session
from app.core.database import database_manager
from app.models.partner import Partner
from app.services.geolocation_optimizer import GeolocationOptimizer
from app.core.cache_manager import cache_manager

class TestPartnerIntegration:
    @pytest.fixture
    def db_session(self):
        """Фикстура для создания сессии базы данных"""
        with database_manager.session_scope() as session:
            yield session

    def test_partner_geosearch(self, db_session):
        """
        Тест интеграции геопоиска и базы данных
        """
        # Подготовка тестовых данных
        test_partners = [
            Partner(
                name="Тестовый Магазин 1", 
                latitude=42.8746, 
                longitude=74.5698
            ),
            Partner(
                name="Тестовый Магазин 2", 
                latitude=42.8732, 
                longitude=74.6016
            )
        ]
        
        db_session.add_all(test_partners)
        db_session.commit()

        # Поиск ближайших партнеров
        nearby_partners = GeolocationOptimizer.optimize_nearby_search(
            session=db_session,
            model=Partner,
            latitude=42.8740,
            longitude=74.5700,
            max_distance=5
        )

        assert len(nearby_partners) > 0, "Должны быть найдены ближайшие партнеры"
        assert any(partner.name == "Тестовый Магазин 1" for partner in nearby_partners)

    def test_partner_caching(self, db_session):
        """
        Тест кэширования данных о партнерах
        """
        @cache_manager.cache_result(expire=60)
        async def get_partner_by_id(partner_id):
            return db_session.query(Partner).get(partner_id)

        # Первый вызов - запись в кэш
        partner_id = 1
        first_call = asyncio.run(get_partner_by_id(partner_id))
        
        # Второй вызов - должен быть из кэша
        second_call = asyncio.run(get_partner_by_id(partner_id))

        assert first_call is not None
        assert second_call is not None
        assert first_call == second_call

    def test_performance_tracking(self):
        """
        Тест мониторинга производительности
        """
        from app.core.performance_monitor import performance_monitor
        import time

        @performance_monitor.measure_request_time(
            method='GET', 
            endpoint='/test/performance'
        )
        async def slow_function():
            await asyncio.sleep(0.5)  # Имитация медленной функции
            return "Completed"

        start_time = time.time()
        result = asyncio.run(slow_function())
        duration = time.time() - start_time

        assert result == "Completed"
        assert duration >= 0.5  # Проверка задержки
