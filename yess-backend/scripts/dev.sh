#!/bin/bash

# Скрипт для управления разработкой YESS Loyalty Backend

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Функция помощи
show_help() {
    echo -e "${YELLOW}Использование:${NC}"
    echo "  ./dev.sh [команда]"
    echo
    echo -e "${YELLOW}Команды:${NC}"
    echo "  start       Запуск сервера разработки"
    echo "  test        Запуск тестов"
    echo "  lint        Проверка кода линтерами"
    echo "  format      Форматирование кода"
    echo "  migrate     Применение миграций базы данных"
    echo "  help        Показать справку"
}

# Запуск сервера разработки
start_dev_server() {
    echo -e "${GREEN}🚀 Запуск сервера разработки...${NC}"
    poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

# Запуск тестов
run_tests() {
    echo -e "${GREEN}🧪 Запуск тестов...${NC}"
    poetry run pytest tests/
}

# Линтинг кода
run_linters() {
    echo -e "${GREEN}🔍 Проверка кода линтерами...${NC}"
    poetry run flake8 app/ tests/
    poetry run mypy app/
}

# Форматирование кода
format_code() {
    echo -e "${GREEN}✨ Форматирование кода...${NC}"
    poetry run black app/ tests/
    poetry run isort app/ tests/
}

# Миграции базы данных
run_migrations() {
    echo -e "${GREEN}🗃️ Применение миграций...${NC}"
    poetry run alembic upgrade head
}

# Обработка аргументов
case "$1" in
    start)
        start_dev_server
        ;;
    test)
        run_tests
        ;;
    lint)
        run_linters
        ;;
    format)
        format_code
        ;;
    migrate)
        run_migrations
        ;;
    help)
        show_help
        ;;
    *)
        echo -e "${YELLOW}Неизвестная команда. Используйте 'help' для справки.${NC}"
        exit 1
        ;;
esac
