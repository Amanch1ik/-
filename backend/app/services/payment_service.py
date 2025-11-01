import asyncio
import hashlib
import hmac
import json
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
import requests
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class PaymentStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class PaymentMethod(Enum):
    OPTIMA_BANK = "optima"
    DEMIR_BANK = "demir"
    BAKAI_BANK = "bakai"
    MBANK = "mbank"
    ELSOM = "elsom"
    O_MONEY = "o_money"
    MEGAPAY = "megapay"

@dataclass
class PaymentRequest:
    user_id: int
    amount: float
    currency: str = "KGS"
    payment_method: PaymentMethod = PaymentMethod.OPTIMA_BANK
    description: str = ""
    callback_url: Optional[str] = None

@dataclass
class PaymentResponse:
    payment_id: str
    status: PaymentStatus
    redirect_url: Optional[str] = None
    qr_code: Optional[str] = None
    error_message: Optional[str] = None

class PaymentService:
    def __init__(self):
        self.payment_configs = {
            PaymentMethod.OPTIMA_BANK: {
                "api_url": "https://api.optimabank.kg",
                "merchant_id": "YESS_MERCHANT",
                "api_key": "optima_api_key",
                "secret_key": "optima_secret_key"
            },
            PaymentMethod.DEMIR_BANK: {
                "api_url": "https://api.demirbank.kg",
                "merchant_id": "YESS_MERCHANT",
                "api_key": "demir_api_key",
                "secret_key": "demir_secret_key"
            },
            PaymentMethod.BAKAI_BANK: {
                "api_url": "https://api.bakaibank.kg",
                "merchant_id": "YESS_MERCHANT",
                "api_key": "bakai_api_key",
                "secret_key": "bakai_secret_key"
            },
            PaymentMethod.MBANK: {
                "api_url": "https://api.mbank.kg",
                "merchant_id": "YESS_MERCHANT",
                "api_key": "mbank_api_key",
                "secret_key": "mbank_secret_key"
            },
            PaymentMethod.ELSOM: {
                "api_url": "https://api.elsom.kg",
                "merchant_id": "YESS_MERCHANT",
                "api_key": "elsom_api_key",
                "secret_key": "elsom_secret_key"
            },
            PaymentMethod.O_MONEY: {
                "api_url": "https://api.o.kg",
                "merchant_id": "YESS_MERCHANT",
                "api_key": "o_money_api_key",
                "secret_key": "o_money_secret_key"
            },
            PaymentMethod.MEGAPAY: {
                "api_url": "https://api.megapay.kg",
                "merchant_id": "YESS_MERCHANT",
                "api_key": "megapay_api_key",
                "secret_key": "megapay_secret_key"
            }
        }
    
    def generate_payment_id(self, user_id: int, amount: float) -> str:
        """
        Генерация уникального ID платежа
        """
        timestamp = str(int(time.time()))
        unique_string = f"{user_id}_{amount}_{timestamp}"
        return hashlib.md5(unique_string.encode()).hexdigest()
    
    def create_signature(self, data: Dict[str, Any], secret_key: str) -> str:
        """
        Создание подписи для запроса
        """
        sorted_data = sorted(data.items())
        query_string = "&".join([f"{k}={v}" for k, v in sorted_data])
        return hmac.new(
            secret_key.encode(),
            query_string.encode(),
            hashlib.sha256
        ).hexdigest()
    
    async def process_payment(self, payment_request: PaymentRequest) -> PaymentResponse:
        """
        Обработка платежа через выбранную платежную систему
        """
        try:
            payment_id = self.generate_payment_id(payment_request.user_id, payment_request.amount)
            config = self.payment_configs[payment_request.payment_method]
            
            # Подготовка данных для запроса
            payment_data = {
                "merchant_id": config["merchant_id"],
                "payment_id": payment_id,
                "amount": payment_request.amount,
                "currency": payment_request.currency,
                "description": payment_request.description,
                "user_id": payment_request.user_id,
                "timestamp": int(time.time()),
                "callback_url": payment_request.callback_url or f"https://yess.app/api/payments/callback"
            }
            
            # Создание подписи
            signature = self.create_signature(payment_data, config["secret_key"])
            payment_data["signature"] = signature
            
            # Отправка запроса к платежной системе
            response = await self.send_payment_request(config["api_url"], payment_data, config["api_key"])
            
            if response.get("success"):
                return PaymentResponse(
                    payment_id=payment_id,
                    status=PaymentStatus.PROCESSING,
                    redirect_url=response.get("redirect_url"),
                    qr_code=response.get("qr_code")
                )
            else:
                return PaymentResponse(
                    payment_id=payment_id,
                    status=PaymentStatus.FAILED,
                    error_message=response.get("error_message", "Payment failed")
                )
                
        except Exception as e:
            logger.error(f"Error processing payment: {e}")
            return PaymentResponse(
                payment_id="",
                status=PaymentStatus.FAILED,
                error_message=str(e)
            )
    
    async def send_payment_request(self, api_url: str, data: Dict[str, Any], api_key: str) -> Dict[str, Any]:
        """
        Отправка запроса к API платежной системы
        """
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "YESS-Payment-Service/1.0"
            }
            
            # Симуляция запроса (в реальности здесь будет HTTP запрос)
            await asyncio.sleep(0.1)  # Имитация сетевой задержки
            
            # Пример успешного ответа
            return {
                "success": True,
                "redirect_url": f"{api_url}/payment/{data['payment_id']}",
                "qr_code": f"https://api.qrserver.com/v1/create-qr-code/?data={data['payment_id']}",
                "expires_at": int(time.time()) + 1800  # 30 минут
            }
            
        except Exception as e:
            logger.error(f"Error sending payment request: {e}")
            return {
                "success": False,
                "error_message": str(e)
            }
    
    async def check_payment_status(self, payment_id: str, payment_method: PaymentMethod) -> PaymentStatus:
        """
        Проверка статуса платежа
        """
        try:
            config = self.payment_configs[payment_method]
            
            # Подготовка данных для запроса статуса
            status_data = {
                "merchant_id": config["merchant_id"],
                "payment_id": payment_id,
                "timestamp": int(time.time())
            }
            
            signature = self.create_signature(status_data, config["secret_key"])
            status_data["signature"] = signature
            
            # Отправка запроса статуса
            response = await self.send_status_request(config["api_url"], status_data, config["api_key"])
            
            if response.get("success"):
                status = response.get("status", "pending")
                return PaymentStatus(status)
            else:
                return PaymentStatus.FAILED
                
        except Exception as e:
            logger.error(f"Error checking payment status: {e}")
            return PaymentStatus.FAILED
    
    async def send_status_request(self, api_url: str, data: Dict[str, Any], api_key: str) -> Dict[str, Any]:
        """
        Отправка запроса статуса платежа
        """
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            # Симуляция запроса статуса
            await asyncio.sleep(0.05)
            
            # Пример ответа со статусом
            return {
                "success": True,
                "status": "completed",
                "amount": 1000.0,
                "currency": "KGS",
                "completed_at": int(time.time())
            }
            
        except Exception as e:
            logger.error(f"Error sending status request: {e}")
            return {
                "success": False,
                "error_message": str(e)
            }
    
    async def process_callback(self, payment_id: str, callback_data: Dict[str, Any]) -> bool:
        """
        Обработка callback от платежной системы
        """
        try:
            # Проверка подписи callback
            signature = callback_data.get("signature")
            if not self.verify_callback_signature(callback_data, signature):
                logger.warning(f"Invalid callback signature for payment {payment_id}")
                return False
            
            # Обновление статуса платежа в базе данных
            status = callback_data.get("status")
            if status == "completed":
                # Начисление средств на кошелек пользователя
                await self.credit_user_wallet(payment_id, callback_data)
                logger.info(f"Payment {payment_id} completed successfully")
                return True
            elif status == "failed":
                logger.info(f"Payment {payment_id} failed")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error processing callback: {e}")
            return False
    
    def verify_callback_signature(self, data: Dict[str, Any], signature: str) -> bool:
        """
        Проверка подписи callback
        """
        try:
            # Удаляем подпись из данных для проверки
            data_without_signature = {k: v for k, v in data.items() if k != "signature"}
            
            # Создаем подпись заново
            expected_signature = self.create_signature(data_without_signature, "callback_secret_key")
            
            return hmac.compare_digest(signature, expected_signature)
            
        except Exception as e:
            logger.error(f"Error verifying callback signature: {e}")
            return False
    
    async def credit_user_wallet(self, payment_id: str, callback_data: Dict[str, Any]):
        """
        Начисление средств на кошелек пользователя
        """
        try:
            # Здесь должна быть логика обновления баланса в базе данных
            amount = callback_data.get("amount", 0)
            user_id = callback_data.get("user_id")
            
            logger.info(f"Crediting {amount} to user {user_id} wallet")
            
            # Обновление баланса кошелька
            # UPDATE wallets SET balance = balance + amount WHERE user_id = user_id
            
        except Exception as e:
            logger.error(f"Error crediting user wallet: {e}")
    
    def get_supported_payment_methods(self) -> List[Dict[str, Any]]:
        """
        Получение списка поддерживаемых платежных методов
        """
        return [
            {
                "method": PaymentMethod.OPTIMA_BANK.value,
                "name": "Optima Bank",
                "logo": "https://yess.app/images/payments/optima.png",
                "min_amount": 10.0,
                "max_amount": 100000.0,
                "fee_percent": 1.5
            },
            {
                "method": PaymentMethod.DEMIR_BANK.value,
                "name": "Demir Bank",
                "logo": "https://yess.app/images/payments/demir.png",
                "min_amount": 10.0,
                "max_amount": 100000.0,
                "fee_percent": 1.8
            },
            {
                "method": PaymentMethod.BAKAI_BANK.value,
                "name": "Bakai Bank",
                "logo": "https://yess.app/images/payments/bakai.png",
                "min_amount": 10.0,
                "max_amount": 100000.0,
                "fee_percent": 2.0
            },
            {
                "method": PaymentMethod.MBANK.value,
                "name": "MBank",
                "logo": "https://yess.app/images/payments/mbank.png",
                "min_amount": 10.0,
                "max_amount": 100000.0,
                "fee_percent": 1.2
            },
            {
                "method": PaymentMethod.ELSOM.value,
                "name": "Elsom",
                "logo": "https://yess.app/images/payments/elsom.png",
                "min_amount": 5.0,
                "max_amount": 50000.0,
                "fee_percent": 0.8
            },
            {
                "method": PaymentMethod.O_MONEY.value,
                "name": "O! Money",
                "logo": "https://yess.app/images/payments/o_money.png",
                "min_amount": 5.0,
                "max_amount": 50000.0,
                "fee_percent": 0.9
            },
            {
                "method": PaymentMethod.MEGAPAY.value,
                "name": "MegaPay",
                "logo": "https://yess.app/images/payments/megapay.png",
                "min_amount": 5.0,
                "max_amount": 50000.0,
                "fee_percent": 1.0
            }
        ]

# Глобальный экземпляр сервиса платежей
payment_service = PaymentService()