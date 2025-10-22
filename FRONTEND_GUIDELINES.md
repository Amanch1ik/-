# Руководство для фронтенд-разработчика

## 🚀 Workflow разработки

### 1. Клонирование репозитория
```bash
git clone https://github.com/your-username/yess-loyalty.git
cd yess-loyalty
```

### 2. Создание feature-ветки
```bash
git checkout -b feature/название-фичи
```

### 3. Работа с API бэкенда

#### Базовые правила:
- Все запросы к API должны идти через `src/services/api.ts`
- Используйте переменные окружения для URL API
- Всегда обрабатывайте ошибки запросов

#### Пример запроса:
```typescript
import { apiClient } from '../services/api';

async function getPartners() {
  try {
    const response = await apiClient.get('/partners');
    return response.data;
  } catch (error) {
    // Обработка ошибок
    console.error('Ошибка загрузки партнеров', error);
  }
}
```

### 4. Структура проекта
```
frontend/
├── public/
├── src/
│   ├── components/     # Переиспользуемые компоненты
│   ├── pages/          # Компоненты страниц
│   ├── services/       # Сервисы (API, аутентификация)
│   ├── store/          # Управление состоянием
│   ├── types/          # TypeScript типы
│   ├── utils/          # Утилиты
│   └── App.tsx
├── .env               # Локальные переменные окружения
├── .env.example       # Пример конфигурации
└── README.md
```

### 5. Правила именования
- Компоненты: PascalCase (`PartnerCard.tsx`)
- Файлы сервисов: camelCase (`partnerService.ts`)
- Константы: UPPER_SNAKE_CASE
- Ветки: `feature/`, `fix/`, `refactor/`

### 6. Линтинг и форматирование
```bash
npm run lint       # Проверка кода
npm run format     # Автоформатирование
```

### 7. Коммиты
- Используйте conventional commits
- Пример: `feat: add partner filtering`
- `feat:` - новая функциональность
- `fix:` - исправление ошибок
- `docs:` - изменения в документации
- `refactor:` - рефакторинг кода

### 8. Pull Request
- Название PR должно быть информативным
- Описание: что изменено, зачем, скриншоты
- Все PR проходят code review

### 9. Безопасность
- Никогда не коммитьте `.env` с реальными ключами
- Используйте `.env.example`
- Храните токены в `localStorage`/`sessionStorage`

### 10. Деплой
```bash
npm run build      # Сборка проекта
npm run deploy     # Деплой на staging
```

## 🛠 Технический стек
- React 18
- TypeScript
- Redux Toolkit
- React Router
- Axios
- Styled Components

## 📋 Чек-лист перед PR
- [ ] Код прошел линтинг
- [ ] Написаны/обновлены тесты
- [ ] Задокументированы изменения
- [ ] Проверена совместимость с бэкендом

## 🆘 Поддержка
- Telegram: @frontend_support
- Email: frontend@yessloyalty.com

**Успехов в разработке!** 🚀
