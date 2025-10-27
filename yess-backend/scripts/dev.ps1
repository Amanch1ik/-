#!/usr/bin/env pwsh

# Скрипт для управления разработкой YESS Loyalty Backend в Windows

# Цвета для вывода
$GREEN = "`e[32m"
$YELLOW = "`e[33m"
$NC = "`e[0m"

# Функция помощи
function Show-Help {
    Write-Host "${YELLOW}Использование:${NC}"
    Write-Host "  .\dev.ps1 [команда]"
    Write-Host ""
    Write-Host "${YELLOW}Команды:${NC}"
    Write-Host "  start       Запуск сервера разработки"
    Write-Host "  test        Запуск тестов"
    Write-Host "  lint        Проверка кода линтерами"
    Write-Host "  format      Форматирование кода"
    Write-Host "  migrate     Применение миграций базы данных"
    Write-Host "  help        Показать справку"
}

# Запуск сервера разработки
function Start-DevServer {
    Write-Host "${GREEN}🚀 Запуск сервера разработки...${NC}"
    poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

# Запуск тестов
function Run-Tests {
    Write-Host "${GREEN}🧪 Запуск тестов...${NC}"
    poetry run pytest tests/
}

# Линтинг кода
function Run-Linters {
    Write-Host "${GREEN}🔍 Проверка кода линтерами...${NC}"
    poetry run flake8 app/ tests/
    poetry run mypy app/
}

# Форматирование кода
function Format-Code {
    Write-Host "${GREEN}✨ Форматирование кода...${NC}"
    poetry run black app/ tests/
    poetry run isort app/ tests/
}

# Миграции базы данных
function Run-Migrations {
    Write-Host "${GREEN}🗃️ Применение миграций...${NC}"
    poetry run alembic upgrade head
}

# Обработка аргументов
switch ($args[0]) {
    "start" { Start-DevServer }
    "test" { Run-Tests }
    "lint" { Run-Linters }
    "format" { Format-Code }
    "migrate" { Run-Migrations }
    "help" { Show-Help }
    default { 
        Write-Host "${YELLOW}Неизвестная команда. Используйте 'help' для справки.${NC}"
        exit 1 
    }
}
