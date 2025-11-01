FROM python:3.10-slim-buster

# Метаданные
LABEL maintainer="yess-backend-team"
LABEL version="1.0.0"
LABEL description="YESS Backend Service"

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Установка переменных окружения
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV APP_HOME=/app

# Создание рабочей директории
WORKDIR ${APP_HOME}

# Копирование зависимостей
COPY requirements.txt .

# Установка зависимостей Python
RUN pip install --no-cache-dir -r requirements.txt

# Копирование исходного кода
COPY . .

# Создание пользователя приложения
RUN addgroup --system app && adduser --system --ingroup app app
USER app

# Порт для приложения
EXPOSE 8000

# Команда запуска
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

