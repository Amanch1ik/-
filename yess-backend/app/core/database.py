"""
Database connection and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager
from app.core.config import settings

class DatabaseManager:
    def __init__(
        self, 
        database_url: str, 
        pool_size: int = 20,
        max_overflow: int = 10,
        pool_timeout: int = 30,
        pool_recycle: int = 1800
    ):
        """
        Инициализация менеджера базы данных с настройкой пула соединений
        
        :param database_url: URL подключения к базе данных
        :param pool_size: Базовый размер пула соединений
        :param max_overflow: Максимальное количество дополнительных соединений
        :param pool_timeout: Время ожидания соединения
        :param pool_recycle: Время жизни соединения перед обновлением
        """
        self.engine = create_engine(
            database_url,
            poolclass=QueuePool,
            pool_size=pool_size,           # Базовый размер пула
            max_overflow=max_overflow,     # Дополнительные соединения
            pool_timeout=pool_timeout,     # Время ожидания
            pool_recycle=pool_recycle,     # Обновление соединений
            pool_pre_ping=True             # Проверка живости соединения
        )

        # Создание фабрики сессий
        self.SessionLocal = scoped_session(
            sessionmaker(
                autocommit=False, 
                autoflush=False, 
                bind=self.engine
            )
        )

    @contextmanager
    def session_scope(self):
        """
        Контекстный менеджер для работы с сессиями
        Автоматически коммитит или откатывает транзакцию
        """
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    def get_session(self):
        """
        Получение сессии из пула
        
        :return: Сессия SQLAlchemy
        """
        return self.SessionLocal()

    def dispose(self):
        """
        Закрытие всех соединений в пуле
        """
        self.engine.dispose()

# Глобальный экземпляр
database_manager = DatabaseManager(
    database_url=settings.DATABASE_URL
)

# Пример использования
def example_database_operation():
    with database_manager.session_scope() as session:
        # Выполнение операций с базой данных
        # partners = session.query(Partner).all() # Assuming Partner model is defined elsewhere
        return "Database operation example"

