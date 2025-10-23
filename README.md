# 🚀 YessLoyalty: Умная Система Лояльности

## 📝 Описание Проекта

YessLoyalty - это инновационная мобильная платформа для управления бонусами и кешбэком, разработанная с использованием современных технологий и подходов к разработке программного обеспечения.

### 🌟 Ключевые Особенности

- **Персонализированные Рекомендации**: Умный алгоритм подбора партнеров
- **Геолокационный Маркетинг**: Уведомления о бонусах рядом с вами
- **Многоуровневая Бонусная Система**: Динамический кешбэк
- **Безопасная Аутентификация**: Поддержка Google и Apple Sign-In
- **Мультиплатформенность**: .NET MAUI для iOS, Android, Windows

## 🚀 Версия 1.0.0

### Что нового:
- 🌐 Унифицированный API для фронтенда
- 📊 Расширенная система рекомендаций
- 🗺️ Интеграция с картографическими сервисами
- 🔒 Улучшенная безопасность и аутентификация
- 📱 Новые сервисы для мобильного приложения

## 🛠 Технологический Стек

### Backend
- **Язык**: Python 3.9+
- **Фреймворк**: FastAPI
- **База Данных**: PostgreSQL с PostGIS
- **ORM**: SQLAlchemy
- **Аутентификация**: JWT, OAuth 2.0
- **Документация**: Swagger/OpenAPI

### Frontend
- **Язык**: C#
- **Фреймворк**: .NET MAUI
- **Архитектура**: MVVM
- **UI**: Xamarin.Forms
- **Зависимости**: Dependency Injection
- **Навигация**: Кастомный NavigationService

### Инфраструктура
- **Контейнеризация**: Docker
- **CI/CD**: GitHub Actions
- **Мониторинг**: App Center

## 🚀 Быстрый Старт

### Prerequisites
- .NET 6+ SDK
- Python 3.9+
- PostgreSQL 13+
- Docker (опционально)

### Установка Backend

```bash
# Клонирование репозитория
git clone https://github.com/yourusername/yess-loyalty.git

# Переход в директорию backend
cd yess-loyalty/yess-backend

# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # Для Unix
venv\Scripts\activate    # Для Windows

# Установка зависимостей
pip install -r requirements.txt

# Настройка базы данных
alembic upgrade head

# Запуск сервера
uvicorn app.main:app --reload
```

### Установка Frontend

```bash
# Переход в директорию frontend
cd ../YessLoyaltyApp

# Открытие решения в Visual Studio
start YessLoyaltyApp.sln

# Восстановление пакетов
dotnet restore

# Запуск приложения
dotnet run
```

## 🔒 Безопасность

- Шифрование JWT токенов
- Биометрическая аутентификация
- Геолокационная защита
- Мониторинг безопасности

## 📊 Аналитика

- Персонализированные рекомендации
- Трекинг активности пользователей
- A/B тестирование функций

## 🤝 Contributing

1. Fork репозитория
2. Создайте feature-branch
3. Commits с подробными описаниями
4. Pull Request с описанием изменений

## 📄 Лицензия

MIT License. Смотрите `LICENSE.md`

## 📞 Контакты

- **Email**: aman4ikaitbekov@icloud.com
- **Telegram**: @amanaitbekov

## 🙏 Благодарности

- Команде разработчиков
- Спонсорам проекта
- Сообществу Open Source

---

**Сделано с ❤️ в России** 🇷🇺
