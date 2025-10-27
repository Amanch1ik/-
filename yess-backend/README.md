# 🚀 YESS Loyalty Backend

## 📋 Описание проекта

YESS Loyalty - это современная платформа для управления программой лояльности, предоставляющая гибкие инструменты для бизнеса и клиентов.

## 🛠 Технологический стек

- **Язык**: Python 3.10+
- **Веб-фреймворк**: FastAPI
- **База данных**: PostgreSQL
- **ORM**: SQLAlchemy
- **Кэширование**: Redis
- **Мониторинг**: Prometheus, Grafana
- **Контейнеризация**: Docker, Docker Compose

## 🚀 Быстрый старт

### Prerequisites

- Python 3.10+
- Docker
- Poetry

### Установка

1. Клонируйте репозиторий
```bash
git clone https://github.com/yess-loyalty/backend.git
cd backend
```

2. Установите зависимости
```bash
pip install poetry
poetry install
```

3. Настройте переменные окружения
```bash
cp .env.example .env
# Отредактируйте .env под свои нужды
```

4. Запуск в режиме разработки
```bash
docker-compose up -d
poetry run uvicorn app.main:app --reload
```

## 📦 Основные компоненты

- **Аутентификация**: JWT, двухфакторная аутентификация
- **Геолокация**: Поиск ближайших партнеров
- **Кэширование**: Redis для быстрого доступа к данным
- **Безопасность**: Шифрование, валидация входных данных
- **Мониторинг**: Метрики производительности, логирование

## 🧪 Тестирование

```bash
poetry run pytest
poetry run locust -f tests/load_testing/locustfile.py
```

## 🔒 Безопасность

- Регулярные обновления зависимостей
- Статический анализ кода
- Сканирование уязвимостей

## 📊 Мониторинг

- Prometheus для сбора метрик
- Grafana для визуализации
- Алерты в Telegram/Email

## 🚢 Деплой

```bash
docker build -t yess-backend .
docker push ghcr.io/yess-loyalty/backend
```

## 📝 Лицензия

MIT License

## 👥 Контрибьюторы

- [Ваше имя]
- [Имена разработчиков]

## 🆘 Поддержка

- Email: dev@yess-loyalty.kg
- Telegram: @yess_support
