from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.services.auth_service import AuthService
from app.services.recommendation_service import RecommendationService
from app.services.geolocation_service import GeolocationService
from app.services.route_service import RouteService
from app.schemas.unified import (
    UserResponse, 
    PartnerResponse, 
    TransactionResponse, 
    WalletResponse, 
    NotificationResponse,
    RouteResponse,
    RecommendationResponse,
    GeolocationResponse,
    ErrorResponse
)
from app.models.user import User
from app.models.partner import Partner
from app.models.transaction import Transaction
from app.models.wallet import Wallet
from app.models.notification import Notification

class UnifiedApiService:
    def __init__(
        self, 
        auth_service: AuthService,
        recommendation_service: RecommendationService,
        geolocation_service: GeolocationService,
        route_service: RouteService
    ):
        self._auth_service = auth_service
        self._recommendation_service = recommendation_service
        self._geolocation_service = geolocation_service
        self._route_service = route_service

    def get_user_profile(self, db: Session, user_id: int) -> UserResponse:
        """
        Получение профиля пользователя
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="Пользователь не найден")

            return UserResponse(
                id=user.id,
                username=user.username,
                email=user.email,
                phone=user.phone,
                first_name=user.first_name,
                last_name=user.last_name,
                loyalty_level=user.loyalty_level
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_partners(
        self, 
        db: Session, 
        page: int = 1, 
        page_size: int = 10,
        category: Optional[str] = None
    ) -> List[PartnerResponse]:
        """
        Получение списка партнеров с фильтрацией
        """
        try:
            query = db.query(Partner)
            
            if category:
                query = query.filter(Partner.category == category)
            
            total_partners = query.count()
            partners = query.offset((page - 1) * page_size).limit(page_size).all()

            return [
                PartnerResponse(
                    id=partner.id,
                    name=partner.name,
                    category=partner.category,
                    logo_url=partner.logo_url,
                    description=partner.description,
                    cashback_rate=partner.default_cashback_rate,
                    is_verified=partner.is_verified,
                    location={
                        "latitude": partner.latitude,
                        "longitude": partner.longitude
                    } if partner.latitude and partner.longitude else None
                ) for partner in partners
            ]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_transactions(
        self, 
        db: Session, 
        user_id: int, 
        page: int = 1, 
        page_size: int = 10
    ) -> List[TransactionResponse]:
        """
        Получение истории транзакций пользователя
        """
        try:
            transactions = (
                db.query(Transaction)
                .filter(Transaction.user_id == user_id)
                .order_by(Transaction.created_at.desc())
                .offset((page - 1) * page_size)
                .limit(page_size)
                .all()
            )

            return [
                TransactionResponse(
                    id=transaction.id,
                    partner_id=transaction.partner_id,
                    partner_name=transaction.partner.name,
                    amount=transaction.amount,
                    cashback_earned=transaction.yescoin_earned,
                    type=transaction.type,
                    date=transaction.created_at
                ) for transaction in transactions
            ]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_wallet(self, db: Session, user_id: int) -> WalletResponse:
        """
        Получение информации о кошельке пользователя
        """
        try:
            wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
            if not wallet:
                raise HTTPException(status_code=404, detail="Кошелек не найден")

            return WalletResponse(
                balance=wallet.yescoin_balance,
                total_cashback=wallet.total_cashback,
                loyalty_points=wallet.loyalty_points,
                loyalty_level=wallet.loyalty_level
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_notifications(
        self, 
        db: Session, 
        user_id: int, 
        page: int = 1, 
        page_size: int = 10
    ) -> List[NotificationResponse]:
        """
        Получение уведомлений пользователя
        """
        try:
            notifications = (
                db.query(Notification)
                .filter(Notification.user_id == user_id)
                .order_by(Notification.created_at.desc())
                .offset((page - 1) * page_size)
                .limit(page_size)
                .all()
            )

            return [
                NotificationResponse(
                    id=notification.id,
                    title=notification.title,
                    body=notification.body,
                    type=notification.type,
                    is_read=notification.is_read,
                    created_at=notification.created_at
                ) for notification in notifications
            ]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_partner_recommendations(
        self, 
        db: Session, 
        user_id: int
    ) -> RecommendationResponse:
        """
        Получение персонализированных рекомендаций партнеров
        """
        try:
            user = db.query(User).filter(User.id == user_id).first()
            recommendations = self._recommendation_service.get_personalized_partners(
                db=db, 
                user=user
            )

            return RecommendationResponse(
                recommendations=[
                    PartnerResponse(
                        id=partner.id,
                        name=partner.name,
                        category=partner.category,
                        cashback_rate=partner.default_cashback_rate
                    ) for partner in recommendations
                ]
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def calculate_route(
        self, 
        db: Session, 
        partner_location_ids: List[int]
    ) -> RouteResponse:
        """
        Построение маршрута между партнерами
        """
        try:
            route = self._route_service.calculate_route(
                db=db, 
                partner_location_ids=partner_location_ids
            )

            return RouteResponse(
                total_distance=route.total_distance,
                estimated_time=route.estimated_time,
                route_points=route.route_points
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# Singleton
unified_api_service = UnifiedApiService(
    auth_service=AuthService(),
    recommendation_service=RecommendationService(),
    geolocation_service=GeolocationService(),
    route_service=RouteService()
)
