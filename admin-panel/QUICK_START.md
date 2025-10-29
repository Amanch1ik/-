# Быстрый старт: YESS Admin Panel

## Что было создано

Полнофункциональная веб-панель администратора для системы лояльности YESS Loyalty с современным интерфейсом на базе React + TypeScript + Ant Design.

## Основные возможности

### ✅ Реализованный функционал:

1. **Аутентификация**
   - Защищенный вход для администраторов
   - JWT токены
   - Автоматическая проверка сессии

2. **Dashboard (Дашборд)**
   - Ключевые метрики в реальном времени
   - Графики роста пользователей и оборота
   - Последние транзакции

3. **Управление пользователями**
   - Просмотр списка всех пользователей
   - Поиск и фильтрация
   - Блокировка/разблокировка пользователей
   - Детальная информация о каждом пользователе

4. **Управление партнерами**
   - Список всех партнеров
   - Верификация новых партнеров
   - Редактирование данных
   - Статистика по партнерам

5. **Транзакции**
   - Полный список транзакций
   - Фильтры по типу и статусу
   - Экспорт данных

6. **Уведомления**
   - Массовая отправка push/SMS/email уведомлений
   - Планирование уведомлений
   - История отправок
   - Сегментация аудитории

7. **Акции и промо-кампании**
   - Создание новых акций
   - Управление промо-кодами
   - Статистика использования
   - Планирование по датам

8. **Аналитика**
   - Детальная статистика
   - Графики и диаграммы
   - Анализ по городам
   - Топ партнеров

9. **Настройки системы**
   - Общие настройки приложения
   - Настройки платежей
   - Управление уведомлениями

## Технологический стек

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - быстрая сборка
- **Ant Design 5** - готовые UI компоненты
- **React Query** - управление серверным состоянием
- **Zustand** - state management
- **Axios** - HTTP клиент
- **Recharts** - графики и визуализация
- **React Router 6** - навигация
- **Supabase** - база данных

## Установка и запуск

### 1. Установка зависимостей

```bash
cd admin-panel
npm install
```

### 2. Настройка переменных окружения

Файл `.env` уже создан с нужными значениями:

```env
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```

Панель будет доступна по адресу: **http://localhost:3001**

### 4. Сборка для продакшена

```bash
npm run build
```

Результат сборки будет в папке `dist/`

## Структура проекта

```
admin-panel/
├── src/
│   ├── components/          # Переиспользуемые компоненты
│   │   ├── MainLayout.tsx   # Основной layout с меню
│   │   ├── ProtectedRoute.tsx
│   │   ├── PageHeader.tsx
│   │   └── StatCard.tsx
│   │
│   ├── pages/               # Страницы приложения
│   │   ├── LoginPage.tsx    # Страница входа
│   │   ├── DashboardPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── PartnersPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── PromotionsPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── services/            # API интеграция
│   │   └── api.ts          # Все API endpoints
│   │
│   ├── hooks/               # Custom hooks
│   │   └── useAuth.ts
│   │
│   ├── store/               # State management
│   │   └── authStore.ts
│   │
│   ├── types/               # TypeScript типы
│   │   └── index.ts
│   │
│   ├── utils/               # Утилиты
│   │   └── format.ts
│   │
│   ├── config/              # Конфигурация
│   │   └── supabase.ts
│   │
│   ├── App.tsx              # Главный компонент
│   ├── main.tsx             # Точка входа
│   └── vite-env.d.ts        # TypeScript declarations
│
├── public/                  # Статические файлы
├── dist/                    # Сборка (создается при build)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Интеграция с Backend

Панель интегрируется с вашим FastAPI backend:

- **Base URL**: `http://localhost:8000`
- **API endpoints**: определены в `src/services/api.ts`
- **Аутентификация**: JWT токены в localStorage
- **Автоматическая обработка**: ошибки 401 = редирект на логин

## Доступные API endpoints

```typescript
// Аутентификация
POST /api/v1/auth/login
GET  /api/v1/auth/me

// Пользователи
GET  /api/v1/users
GET  /api/v1/users/:id
PUT  /api/v1/users/:id
POST /api/v1/users/:id/block
POST /api/v1/users/:id/unblock

// Партнеры
GET  /api/v1/partner
GET  /api/v1/partner/:id
PUT  /api/v1/partner/:id
POST /api/v1/partner/:id/verify

// Транзакции
GET  /api/v1/transactions
GET  /api/v1/transactions/:id

// Уведомления
GET  /api/v1/notifications
POST /api/v1/notifications/send
POST /api/v1/notifications/bulk

// Акции
GET  /api/v1/promotions
POST /api/v1/promotions
PUT  /api/v1/promotions/:id
DELETE /api/v1/promotions/:id

// Аналитика
GET  /api/v1/analytics/dashboard
GET  /api/v1/analytics/users/growth
GET  /api/v1/analytics/revenue
```

## Следующие шаги

1. **Подключите backend**
   - Убедитесь, что FastAPI backend запущен на порту 8000
   - Проверьте, что API endpoints доступны

2. **Настройте аутентификацию**
   - Создайте тестового администратора в базе данных
   - Проверьте JWT токены

3. **Добавьте реальные данные**
   - Подключите к Supabase
   - Заполните тестовыми данными

4. **Кастомизация**
   - Измените цветовую схему в `App.tsx`
   - Добавьте логотип компании
   - Настройте тексты под себя

## Тестовые данные

Для тестирования можно использовать mock данные, которые уже встроены в компоненты (Dashboard, Analytics).

## Полезные команды

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшн сборки
npm run preview

# Проверка TypeScript
npm run lint
```

## Технические детали

- **Port**: 3001 (dev server)
- **TypeScript**: Strict mode включен
- **Build size**: ~520 KB (gzipped)
- **Поддержка браузеров**: Chrome, Firefox, Safari, Edge (последние версии)

## Примечания

- Все пароли должны храниться в хешированном виде
- JWT токены имеют ограниченный срок действия
- Для продакшена рекомендуется включить HTTPS
- Настройте CORS на backend для домена админ панели

## Поддержка

При возникновении проблем проверьте:
1. Backend запущен и доступен
2. Переменные окружения настроены правильно
3. Нет ошибок в консоли браузера
4. API endpoints возвращают правильные данные

---

**© 2025 YESS Loyalty Admin Panel**
