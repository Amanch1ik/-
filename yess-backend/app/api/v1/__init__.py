"""API v1 routes"""

from fastapi import APIRouter
from .endpoints import users, payments, notifications, achievements, reviews, promotions, analytics

api_router = APIRouter()

# Включение роутов
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(achievements.router, prefix="/achievements", tags=["achievements"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(promotions.router, prefix="/promotions", tags=["promotions"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])