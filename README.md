# Yess Loyalty App

## Структура проекта

- `yess-backend/`: Бэкенд на Python (FastAPI)
- `YessLoyaltyApp/`: Мобильное приложение на .NET MAUI
- `frontend/`: Фронтенд (React/TypeScript)

## Требования

- Python 3.9+
- .NET 7.0 SDK
- Node.js 16+
- Git

## Настройка backend

1. Перейти в директорию backend:
   ```bash
   cd yess-backend
   ```

2. Создать виртуальное окружение:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Для Unix
   venv\Scripts\activate     # Для Windows
   ```

3. Установить зависимости:
   ```bash
   pip install -r requirements.txt
   ```

4. Настроить переменные окружения:
   Скопируйте `env.example` в `.env` и заполните необходимые параметры

5. Запустить миграции:
   ```bash
   alembic upgrade head
   ```

6. Запустить сервер:
   ```bash
   uvicorn app.main:app --reload
   ```

## Настройка frontend

1. Создать директорию frontend:
   ```bash
   mkdir frontend
   cd frontend
   ```

2. Инициализировать проект:
   ```bash
   npx create-react-app . --template typescript
   ```

3. Установить зависимости:
   ```bash
   npm install axios react-router-dom
   ```

4. Настроить `.env`:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

## Workflow разработки

1. Клонировать репозиторий
2. Создавать feature-ветки от `master`
3. Именование веток: `feature/название-фичи` или `fix/описание-фикса`

### Правила работы с Git

- Всегда создавайте feature-ветку от актуального `master`
- Pull Request должен содержать:
  - Описание изменений
  - Скриншоты (если применимо)
  - Линки на связанные задачи

### Линтинг и форматирование

- Frontend: ESLint, Prettier
- Backend: Black, Flake8
- Мобильное приложение: StyleCop

## Деплой

- Бэкенд: Heroku/DigitalOcean
- Фронтенд: Netlify/Vercel
- Мобильное приложение: App Store, Google Play

## Контакты

- Telegram: @project_manager
- Email: support@yessloyalty.com

## Лицензия

MIT License  

