import logging
import sys
from logging.handlers import RotatingFileHandler
import json
from datetime import datetime

class YessLoyaltyLogger:
    def __init__(self, name='yess_loyalty'):
        # Основной логгер
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # Форматтер с JSON-структурой
        self.json_formatter = logging.Formatter(
            json.dumps({
                'timestamp': '%(asctime)s',
                'level': '%(levelname)s',
                'logger': '%(name)s',
                'message': '%(message)s',
                'module': '%(module)s',
                'line': '%(lineno)d'
            })
        )

        # Консольный вывод
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(self.json_formatter)
        
        # Файловый логгер с ротацией
        file_handler = RotatingFileHandler(
            f'logs/yess_loyalty_{datetime.now().strftime("%Y%m%d")}.log',
            maxBytes=10*1024*1024,  # 10 МБ
            backupCount=5
        )
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(self.json_formatter)
        
        # Добавление обработчиков
        self.logger.addHandler(console_handler)
        self.logger.addHandler(file_handler)

    def info(self, message, **kwargs):
        """Информационное сообщение"""
        extra = {
            'extra': kwargs
        }
        self.logger.info(message, extra=extra)

    def warning(self, message, **kwargs):
        """Предупреждение"""
        extra = {
            'extra': kwargs
        }
        self.logger.warning(message, extra=extra)

    def error(self, message, exc_info=False, **kwargs):
        """Ошибка с возможностью трассировки"""
        extra = {
            'extra': kwargs
        }
        self.logger.error(message, exc_info=exc_info, extra=extra)

    def critical(self, message, **kwargs):
        """Критическая ошибка"""
        extra = {
            'extra': kwargs
        }
        self.logger.critical(message, extra=extra)

# Глобальный экземпляр логгера
logger = YessLoyaltyLogger()

# Пример использования
def log_example():
    logger.info("Тестовое информационное сообщение", user_id=123)
    logger.warning("Предупреждение о высокой нагрузке", load=95)
    
    try:
        1 / 0  # Вызов ошибки
    except Exception as e:
        logger.error("Произошла математическая ошибка", exc_info=True, operation="деление")
