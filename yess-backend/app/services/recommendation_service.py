from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict

from app.models.user import User
from app.models.partner import Partner
from app.models.transaction import Transaction
from app.schemas.partner import PartnerRecommendation

class RecommendationService:
    @classmethod
    def get_personalized_partners(
        cls, 
        db: Session, 
        user: User, 
        limit: int = 10
    ) -> List[PartnerRecommendation]:
        """
        Генерация персонализированных рекомендаций партнеров
        
        :param db: SQLAlchemy сессия базы данных
        :param user: Текущий пользователь
        :param limit: Максимальное количество рекомендаций
        :return: Список рекомендованных партнеров
        """
        # 1. Анализ истории транзакций
        transactions = db.query(Transaction).filter(
            Transaction.user_id == user.id
        ).all()
        
        # 2. Группировка по категориям и сумме транзакций
        category_scores = defaultdict(float)
        for transaction in transactions:
            category_scores[transaction.partner.category] += transaction.amount
        
        # 3. Определение топовых категорий
        top_categories = sorted(
            category_scores.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:3]
        
        # 4. Формирование рекомендаций
        recommendations = []
        for category, _ in top_categories:
            partners = db.query(Partner).filter(
                Partner.category == category
            ).order_by(func.random()).limit(3).all()
            
            for partner in partners:
                recommendation = PartnerRecommendation(
                    id=partner.id,
                    name=partner.name,
                    category=partner.category,
                    logo_url=partner.logo_url,
                    cashback_rate=cls._calculate_dynamic_cashback(user, partner)
                )
                recommendations.append(recommendation)
        
        # 5. Если недостаточно рекомендаций, добавляем случайные
        if len(recommendations) < limit:
            random_partners = db.query(Partner).order_by(func.random()).limit(
                limit - len(recommendations)
            ).all()
            
            for partner in random_partners:
                recommendation = PartnerRecommendation(
                    id=partner.id,
                    name=partner.name,
                    category=partner.category,
                    logo_url=partner.logo_url,
                    cashback_rate=cls._calculate_dynamic_cashback(user, partner)
                )
                recommendations.append(recommendation)
        
        return recommendations[:limit]
    
    @staticmethod
    def _calculate_dynamic_cashback(user: User, partner: Partner) -> float:
        """
        Динамический расчет кешбэка с учетом истории пользователя
        
        :param user: Пользователь
        :param partner: Партнер
        :return: Процент кешбэка
        """
        # Базовый кешбэк партнера
        base_cashback = partner.default_cashback_rate
        
        # История транзакций пользователя
        total_spent = sum(
            transaction.amount 
            for transaction in user.transactions 
            if transaction.partner.category == partner.category
        )
        
        # Бонусные множители
        multipliers = {
            (0, 10000): 1.0,     # Новый пользователь
            (10000, 50000): 1.2,  # Постоянный клиент
            (50000, 100000): 1.5, # Лояльный клиент
            (100000, float('inf')): 2.0  # VIP клиент
        }
        
        # Определение множителя
        for (min_spend, max_spend), multiplier in multipliers.items():
            if min_spend <= total_spent < max_spend:
                return base_cashback * multiplier
        
        return base_cashback

    @classmethod
    def get_trending_partners(
        cls, 
        db: Session, 
        limit: int = 10
    ) -> List[PartnerRecommendation]:
        """
        Получение трендовых партнеров
        
        :param db: SQLAlchemy сессия базы данных
        :param limit: Максимальное количество партнеров
        :return: Список трендовых партнеров
        """
        # Получаем партнеров с наибольшим количеством транзакций за последний месяц
        trending_partners = db.query(Partner).join(Transaction).filter(
            Transaction.created_at >= func.date_sub(func.current_date(), interval=1 month)
        ).group_by(Partner).order_by(
            func.count(Transaction.id).desc()
        ).limit(limit).all()
        
        return [
            PartnerRecommendation(
                id=partner.id,
                name=partner.name,
                category=partner.category,
                logo_url=partner.logo_url,
                cashback_rate=partner.default_cashback_rate
            ) for partner in trending_partners
        ]
