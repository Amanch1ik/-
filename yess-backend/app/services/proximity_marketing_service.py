from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.core.notifications import SMSService, PushNotificationService
from app.models.user import User
from app.models.partner import Partner, PartnerLocation
from app.models.transaction import Transaction
from app.models.wallet import Wallet
from app.services.recommendation_service import RecommendationService
from app.services.geolocation_service import GeolocationService

class ProximityMarketingService:
    def __init__(
        self, 
        sms_service: SMSService, 
        push_service: PushNotificationService,
        recommendation_service: RecommendationService
    ):
        self._sms_service = sms_service
        self._push_service = push_service
        self._recommendation_service = recommendation_service

    async def check_nearby_partners(
        self, 
        user: User, 
        current_location: Dict[str, float], 
        db: Session,
        radius: float = 0.5  # 500 метров
    ):
        """
        Проверка ближайших партнеров и отправка персонализированных уведомлений
        """
        # Находим ближайшие локации партнеров
        nearby_locations = db.query(PartnerLocation).filter(
            func.ST_DWithin(
                PartnerLocation.geom, 
                func.ST_MakePoint(current_location['longitude'], current_location['latitude']),
                radius * 1000  # Перевод в метры
            )
        ).all()

        if not nearby_locations:
            return

        # Получаем историю транзакций пользователя
        recent_transactions = db.query(Transaction).filter(
            Transaction.user_id == user.id,
            Transaction.created_at >= datetime.utcnow() - timedelta(days=30)
        ).all()

        # Получаем текущий баланс кошелька
        wallet = db.query(Wallet).filter(Wallet.user_id == user.id).first()

        for location in nearby_locations:
            partner = location.partner
            
            # Персонализированное предложение
            personalized_offer = self._get_personalized_offer(
                user, partner, recent_transactions, wallet
            )

            # Отправляем уведомление
            await self._send_proximity_notification(
                user, partner, location, personalized_offer, db
            )

    def _get_personalized_offer(
        self, 
        user: User, 
        partner: Partner, 
        recent_transactions: List[Transaction],
        wallet: Wallet
    ) -> Dict[str, Any]:
        """
        Генерация персонализированного предложения
        """
        # Анализ истории транзакций
        partner_transactions = [
            t for t in recent_transactions if t.partner_id == partner.id
        ]

        # Расчет персонализированного кешбэка
        dynamic_cashback = self._recommendation_service._calculate_dynamic_cashback(
            user, partner
        )

        # Определение типа предложения
        if not partner_transactions:
            # Новый партнер для пользователя
            offer_type = "first_visit"
            message = f"Впервые у {partner.name}? Специальная скидка {dynamic_cashback}%!"
        elif len(partner_transactions) < 3:
            # Постоянный клиент
            offer_type = "loyalty"
            message = f"Ваш кешбэк у {partner.name} вырос до {dynamic_cashback}%!"
        else:
            # Частый посетитель
            offer_type = "frequent_visitor"
            message = f"Ваш баланс: {wallet.yescoin_balance} YesCoin. Используйте их в {partner.name}!"

        return {
            "type": offer_type,
            "message": message,
            "cashback_rate": dynamic_cashback,
            "partner_name": partner.name
        }

    async def _send_proximity_notification(
        self, 
        user: User, 
        partner: Partner, 
        location: PartnerLocation,
        offer: Dict[str, Any],
        db: Session
    ):
        """
        Отправка proximity-уведомления
        """
        # SMS уведомление
        if user.sms_enabled and user.phone:
            await self._sms_service.send_sms(
                user.phone, 
                f"🎁 {offer['message']} Ждем вас по адресу: {location.address}"
            )

        # Push-уведомление
        if user.push_enabled and user.device_tokens:
            await self._push_service.send_push(
                device_tokens=user.device_tokens,
                title=f"Специальное предложение от {partner.name}",
                body=offer['message'],
                data={
                    "type": "proximity_offer",
                    "partner_id": str(partner.id),
                    "partner_name": partner.name,
                    "offer_type": offer['type'],
                    "cashback_rate": str(offer['cashback_rate'])
                }
            )

        # In-App уведомление
        from app.models.notification import Notification
        notification = Notification(
            user_id=user.id,
            type="proximity_offer",
            title=f"Предложение от {partner.name}",
            body=offer['message'],
            data={
                "partner_id": partner.id,
                "location_id": location.id,
                "offer_type": offer['type'],
                "cashback_rate": offer['cashback_rate']
            },
            is_read=False
        )
        db.add(notification)
        db.commit()

# Singleton
proximity_marketing_service = ProximityMarketingService(
    sms_service=sms_service,
    push_service=push_service,
    recommendation_service=recommendation_service
)
