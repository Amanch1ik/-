# Базовый образ
FROM python:3.10-slim AS builder

# Устанавливаем зависимости для сборки
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем poetry
RUN pip install --no-cache-dir poetry

# Копируем файлы проекта
WORKDIR /app
COPY pyproject.toml poetry.lock* ./

# Устанавливаем зависимости
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --only main

# Финальный образ
FROM python:3.10-slim

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копируем установленные зависимости
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Копируем код приложения
WORKDIR /app
COPY . .

# Создаем пользователя для запуска
RUN addgroup --system --gid 1001 appuser \
    && adduser --system --uid 1001 --ingroup appuser appuser \
    && chown -R appuser:appuser /app

# Переключаемся на пользователя appuser
USER appuser

# Порт для приложения
EXPOSE 8000

# Переменные окружения
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Точка входа
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

