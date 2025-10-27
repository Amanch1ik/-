# 🚀 YESS Loyalty - Инфраструктура

## 🔧 Архитектура

### Компоненты
- **Бэкенд**: FastAPI (Python)
- **База данных**: PostgreSQL
- **Кэш**: Redis
- **Мониторинг**: Prometheus, Grafana
- **CI/CD**: GitHub Actions

## 🌐 Деплой

### Требования
- Docker
- Docker Compose
- Python 3.10+

### Локальный запуск
```bash
# Клонирование репозитория
git clone https://github.com/yess-loyalty/backend.git
cd backend

# Установка зависимостей
pip install poetry
poetry install

# Запуск в режиме разработки
docker-compose up -d
```

### Продакшен деплой
```bash
# Сборка и публикация образа
docker build -t yess-backend .
docker push ghcr.io/yess-loyalty/backend
```

## 🔒 Безопасность

### Политики
- Автоматическое обновление зависимостей
- Еженедельное сканирование уязвимостей
- Резервное копирование базы данных

### Мониторинг
- Prometheus для сбора метрик
- Grafana для визуализации
- Алерты в Telegram/Email

## 📊 Метрики

### Отслеживаемые показатели
- Использование CPU/RAM
- Количество запросов
- Время отклика API
- Ошибки базы данных

## 🛠️ Инструменты

### Разработка
- Poetry для управления зависимостями
- Black для форматирования
- Mypy для статической типизации
- Pytest для тестирования

### Деплой
- Docker
- GitHub Actions
- SSH для удаленного управления

## 🆘 Поддержка
- Email: dev@yess-loyalty.kg
- Telegram: @yess_support

## 📝 Лицензия
MIT License
