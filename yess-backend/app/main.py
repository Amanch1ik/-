"""
Main FastAPI application
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from loguru import logger
import time
import asyncio
import os

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import (
    auth, wallet, partner, order, 
    agent, city, qr, maps, upload, payments,
    notifications, achievements, reviews, promotions, analytics, banks, localization
)
from app.api.admin import admin_router, partner_admin_router
from app.services.performance_monitor import performance_monitor
from app.services.alert_manager import alert_manager
from app.services.auto_scaler import auto_scaler
from app.services.database_optimizer import db_optimizer

# Создание таблиц
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="YESS Loyalty API",
    description="Backend API для системы лояльности YESS",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Middleware для CORS с расширенной конфигурацией
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS
)

# Middleware для сжатия ответов
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Middleware для мониторинга производительности
@app.middleware("http")
async def performance_middleware(request: Request, call_next):
    start_time = time.time()
    
    performance_monitor.track_request(
        method=request.method,
        endpoint=request.url.path
    )
    
    response = await call_next(request)
    
    duration = time.time() - start_time
    performance_monitor.track_duration(duration)
    
    if duration > 2.0:
        alert_manager.add_alert(
            level=alert_manager.AlertLevel.WARNING,
            message=f"Медленное время отклика: {duration:.2f}с для {request.url.path}",
            metadata={"endpoint": request.url.path, "duration": duration}
        )
    
    return response

# Подключение роутеров
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Аутентификация"])
app.include_router(wallet.router, prefix="/api/v1/wallet", tags=["Кошелек"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["Платежи"])
app.include_router(partner.router, prefix="/api/v1/partner", tags=["Партнеры"])
app.include_router(order.router, prefix="/api/v1/order", tags=["Заказы"])
app.include_router(agent.router, prefix="/api/v1/agent", tags=["Агенты"])
app.include_router(city.router, prefix="/api/v1/city", tags=["Города"])
app.include_router(qr.router, prefix="/api/v1", tags=["QR-коды"])
app.include_router(maps.router, prefix="/api/v1", tags=["Карты и геолокация"])
app.include_router(upload.router, prefix="/api/v1", tags=["Загрузка файлов"])

# Новые роутеры
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Уведомления"])
app.include_router(achievements.router, prefix="/api/v1/achievements", tags=["Достижения"])
app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["Отзывы"])
app.include_router(promotions.router, prefix="/api/v1/promotions", tags=["Акции"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Аналитика"])
app.include_router(banks.router, prefix="/api/v1/banks", tags=["Банки КР"])
app.include_router(localization.router, prefix="/api/v1/localization", tags=["Локализация"])

# Роутеры администратора
app.include_router(admin_router, prefix="/api", tags=["Панель администратора"])
app.include_router(partner_admin_router, prefix="/api", tags=["Администрирование партнеров"])

# Монтирование статических файлов
if os.path.exists("uploads"):
    app.mount("/static", StaticFiles(directory="uploads"), name="static")

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Запуск YESS Loyalty API...")
    logger.info(f"📍 Сервер работает на {settings.HOST}:{settings.PORT}")
    logger.info(f"📚 Документация доступна по http://{settings.HOST}:{settings.PORT}/docs")
    
    # Запуск мониторинга производительности
    asyncio.create_task(performance_monitor.start_monitoring())
    
    # Запуск автоматического масштабирования
    asyncio.create_task(auto_scaler.start_monitoring())
    
    # Создание индексов для оптимизации БД
    db_optimizer.create_indexes()
    
    logger.info("✅ Все сервисы инициализированы успешно")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Завершение работы YESS Loyalty API...")

@app.get("/")
async def root():
    return {
        "message": "YESS Loyalty API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "работает"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "здоров",
        "timestamp": time.time(),
        "version": "1.0.0"
    }

@app.get("/metrics")
async def get_metrics():
    return performance_monitor.get_metrics()

@app.get("/alerts")
async def get_alerts():
    return {
        "alerts": [
            {
                "level": alert.level.value,
                "message": alert.message,
                "timestamp": alert.timestamp,
                "metadata": alert.metadata
            }
            for alert in alert_manager.alerts[-10:]
        ]
    }

@app.get("/scaling")
async def get_scaling_info():
    return {
        "текущие_инстансы": auto_scaler.current_instances,
        "конфигурация_масштабирования": auto_scaler.scaling_config,
        "история_масштабирования": auto_scaler.scaling_history[-5:]
    }

@app.get("/database/stats")
async def get_database_stats():
    return db_optimizer.get_database_stats()

