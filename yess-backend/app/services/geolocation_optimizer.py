from sqlalchemy import func
from sqlalchemy.orm import Session
from geoalchemy2 import Geography
from typing import List, Type, Any

class GeolocationOptimizer:
    @staticmethod
    def optimize_nearby_search(
        session: Session, 
        model: Type[Any], 
        latitude: float, 
        longitude: float, 
        max_distance: float = 10,
        limit: int = 50
    ) -> List[Any]:
        """
        Оптимизированный геопоиск с использованием пространственных индексов
        
        :param session: SQLAlchemy сессия
        :param model: Модель для поиска
        :param latitude: Широта центра поиска
        :param longitude: Долгота центра поиска
        :param max_distance: Максимальное расстояние в км
        :param limit: Максимальное количество результатов
        :return: Список ближайших объектов
        """
        # Создание точки для поиска с использованием PostGIS
        search_point = func.ST_MakePoint(longitude, latitude)
        
        # Оптимизированный запрос с пространственным индексом
        query = (
            session.query(model)
            .filter(
                func.ST_DWithin(
                    func.geography(model.location),
                    func.geography(search_point),
                    max_distance * 1000  # Перевод в метры
                )
            )
            .order_by(
                func.ST_Distance(
                    func.geography(model.location),
                    func.geography(search_point)
                )
            )
            .limit(limit)
        )

        return query.all()

    @staticmethod
    def calculate_distance(
        lat1: float, 
        lon1: float, 
        lat2: float, 
        lon2: float
    ) -> float:
        """
        Расчет расстояния между двумя точками по формуле Haversine
        
        :param lat1: Широта первой точки
        :param lon1: Долгота первой точки
        :param lat2: Широта второй точки
        :param lon2: Долгота второй точки
        :return: Расстояние в километрах
        """
        from math import radians, sin, cos, sqrt, atan2

        R = 6371  # Радиус Земли в километрах

        # Перевод координат в радианы
        lat1, lon1, lat2, lon2 = map(
            radians, [lat1, lon1, lat2, lon2]
        )

        # Разница координат
        dlat = lat2 - lat1
        dlon = lon2 - lon1

        # Формула Haversine
        a = (
            sin(dlat/2)**2 + 
            cos(lat1) * cos(lat2) * sin(dlon/2)**2
        )
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        
        return R * c

# Пример использования в сервисе партнеров
class PartnerService:
    def __init__(self, session):
        self.session = session

    async def get_nearby_partners(
        self, 
        latitude: float, 
        longitude: float, 
        radius: float = 10
    ):
        partners = GeolocationOptimizer.optimize_nearby_search(
            session=self.session,
            model=Partner,  # Модель партнера
            latitude=latitude,
            longitude=longitude,
            max_distance=radius
        )

        # Обогащение результатов расстоянием
        for partner in partners:
            partner.distance = GeolocationOptimizer.calculate_distance(
                latitude, longitude, 
                partner.latitude, partner.longitude
            )

        return partners
