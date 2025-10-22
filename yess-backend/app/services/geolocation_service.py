import math
import asyncio
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)

class PartnerCategory(Enum):
    RESTAURANT = "restaurant"
    CAFE = "cafe"
    BEAUTY = "beauty"
    FITNESS = "fitness"
    SHOPPING = "shopping"
    ENTERTAINMENT = "entertainment"
    HEALTH = "health"
    EDUCATION = "education"

@dataclass
class Location:
    latitude: float
    longitude: float
    address: str
    city: str
    country: str = "Kyrgyzstan"

@dataclass
class Partner:
    id: int
    name: str
    category: PartnerCategory
    location: Location
    rating: float
    distance: Optional[float] = None
    is_open: bool = True
    discount_percent: float = 0.0

class GeolocationService:
    def __init__(self, db_session: Session):
        self.db = db_session
        self.earth_radius = 6371  # Радиус Земли в километрах
        
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Расчет расстояния между двумя точками по формуле Haversine
        """
        # Преобразование в радианы
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)
        
        # Разности координат
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        # Формула Haversine
        a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        return self.earth_radius * c
    
    def find_nearby_partners(
        self, 
        user_lat: float, 
        user_lon: float, 
        radius_km: float = 5.0,
        category: Optional[PartnerCategory] = None,
        limit: int = 50
    ) -> List[Partner]:
        """
        Поиск партнеров поблизости
        """
        try:
            # Базовый запрос
            base_query = """
                SELECT 
                    p.id,
                    p.name,
                    p.category,
                    p.latitude,
                    p.longitude,
                    p.address,
                    p.city,
                    p.rating,
                    p.is_open,
                    p.discount_percent,
                    (
                        6371 * acos(
                            cos(radians(:user_lat)) * cos(radians(p.latitude)) * 
                            cos(radians(p.longitude) - radians(:user_lon)) + 
                            sin(radians(:user_lat)) * sin(radians(p.latitude))
                        )
                    ) AS distance
                FROM partners p
                WHERE p.is_active = true
                AND (
                    6371 * acos(
                        cos(radians(:user_lat)) * cos(radians(p.latitude)) * 
                        cos(radians(p.longitude) - radians(:user_lon)) + 
                        sin(radians(:user_lat)) * sin(radians(p.latitude))
                    )
                ) <= :radius_km
            """
            
            params = {
                'user_lat': user_lat,
                'user_lon': user_lon,
                'radius_km': radius_km
            }
            
            # Добавление фильтра по категории
            if category:
                base_query += " AND p.category = :category"
                params['category'] = category.value
            
            # Сортировка по расстоянию и лимит
            base_query += " ORDER BY distance ASC LIMIT :limit"
            params['limit'] = limit
            
            query = text(base_query)
            results = self.db.execute(query, params).fetchall()
            
            partners = []
            for row in results:
                partner = Partner(
                    id=row[0],
                    name=row[1],
                    category=PartnerCategory(row[2]),
                    location=Location(
                        latitude=row[3],
                        longitude=row[4],
                        address=row[5],
                        city=row[6]
                    ),
                    rating=float(row[7]),
                    distance=float(row[10]),
                    is_open=row[8],
                    discount_percent=float(row[9])
                )
                partners.append(partner)
            
            return partners
            
        except Exception as e:
            logger.error(f"Error finding nearby partners: {e}")
            return []
    
    def get_partners_by_category(
        self, 
        category: PartnerCategory, 
        city: Optional[str] = None,
        limit: int = 100
    ) -> List[Partner]:
        """
        Получение партнеров по категории
        """
        try:
            query = text("""
                SELECT 
                    p.id,
                    p.name,
                    p.category,
                    p.latitude,
                    p.longitude,
                    p.address,
                    p.city,
                    p.rating,
                    p.is_open,
                    p.discount_percent
                FROM partners p
                WHERE p.category = :category AND p.is_active = true
            """)
            
            params = {'category': category.value}
            
            if city:
                query = text(str(query) + " AND p.city = :city")
                params['city'] = city
            
            query = text(str(query) + " ORDER BY p.rating DESC LIMIT :limit")
            params['limit'] = limit
            
            results = self.db.execute(query, params).fetchall()
            
            partners = []
            for row in results:
                partner = Partner(
                    id=row[0],
                    name=row[1],
                    category=PartnerCategory(row[2]),
                    location=Location(
                        latitude=row[3],
                        longitude=row[4],
                        address=row[5],
                        city=row[6]
                    ),
                    rating=float(row[7]),
                    is_open=row[8],
                    discount_percent=float(row[9])
                )
                partners.append(partner)
            
            return partners
            
        except Exception as e:
            logger.error(f"Error getting partners by category: {e}")
            return []
    
    def get_route_to_partner(
        self, 
        user_lat: float, 
        user_lon: float, 
        partner_id: int
    ) -> Dict:
        """
        Получение маршрута до партнера
        """
        try:
            # Получение координат партнера
            query = text("""
                SELECT latitude, longitude, name, address
                FROM partners 
                WHERE id = :partner_id AND is_active = true
            """)
            
            result = self.db.execute(query, {'partner_id': partner_id}).fetchone()
            
            if not result:
                return {"error": "Partner not found"}
            
            partner_lat, partner_lon, partner_name, partner_address = result
            
            # Расчет расстояния
            distance = self.calculate_distance(user_lat, user_lon, partner_lat, partner_lon)
            
            # Примерное время в пути (средняя скорость 30 км/ч в городе)
            estimated_time = (distance / 30) * 60  # в минутах
            
            return {
                "partner_id": partner_id,
                "partner_name": partner_name,
                "partner_address": partner_address,
                "distance_km": round(distance, 2),
                "estimated_time_minutes": round(estimated_time),
                "route_coordinates": {
                    "start": {"lat": user_lat, "lon": user_lon},
                    "end": {"lat": partner_lat, "lon": partner_lon}
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting route to partner: {e}")
            return {"error": "Failed to get route"}
    
    def get_city_partners(self, city: str) -> Dict[str, List[Partner]]:
        """
        Получение всех партнеров города, сгруппированных по категориям
        """
        try:
            partners_by_category = {}
            
            for category in PartnerCategory:
                partners = self.get_partners_by_category(category, city)
                if partners:
                    partners_by_category[category.value] = partners
            
            return partners_by_category
            
        except Exception as e:
            logger.error(f"Error getting city partners: {e}")
            return {}
    
    def search_partners(
        self, 
        query: str, 
        user_lat: Optional[float] = None,
        user_lon: Optional[float] = None,
        radius_km: float = 10.0,
        limit: int = 50
    ) -> List[Partner]:
        """
        Поиск партнеров по названию или описанию
        """
        try:
            base_query = """
                SELECT 
                    p.id,
                    p.name,
                    p.category,
                    p.latitude,
                    p.longitude,
                    p.address,
                    p.city,
                    p.rating,
                    p.is_open,
                    p.discount_percent
                FROM partners p
                WHERE p.is_active = true
                AND (
                    LOWER(p.name) LIKE LOWER(:search_query)
                    OR LOWER(p.description) LIKE LOWER(:search_query)
                    OR LOWER(p.address) LIKE LOWER(:search_query)
                )
            """
            
            params = {'search_query': f'%{query}%'}
            
            # Если указаны координаты пользователя, добавляем фильтр по расстоянию
            if user_lat and user_lon:
                base_query += """
                    AND (
                        6371 * acos(
                            cos(radians(:user_lat)) * cos(radians(p.latitude)) * 
                            cos(radians(p.longitude) - radians(:user_lon)) + 
                            sin(radians(:user_lat)) * sin(radians(p.latitude))
                        )
                    ) <= :radius_km
                """
                params.update({
                    'user_lat': user_lat,
                    'user_lon': user_lon,
                    'radius_km': radius_km
                })
            
            base_query += " ORDER BY p.rating DESC LIMIT :limit"
            params['limit'] = limit
            
            sql_query = text(base_query)
            results = self.db.execute(sql_query, params).fetchall()
            
            partners = []
            for row in results:
                partner = Partner(
                    id=row[0],
                    name=row[1],
                    category=PartnerCategory(row[2]),
                    location=Location(
                        latitude=row[3],
                        longitude=row[4],
                        address=row[5],
                        city=row[6]
                    ),
                    rating=float(row[7]),
                    is_open=row[8],
                    discount_percent=float(row[9])
                )
                
                # Расчет расстояния если указаны координаты пользователя
                if user_lat and user_lon:
                    partner.distance = self.calculate_distance(
                        user_lat, user_lon, partner.location.latitude, partner.location.longitude
                    )
                
                partners.append(partner)
            
            return partners
            
        except Exception as e:
            logger.error(f"Error searching partners: {e}")
            return []
