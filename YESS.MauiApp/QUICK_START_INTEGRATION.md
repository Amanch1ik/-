# 🚀 Быстрый старт: YESS MAUI App + Backend

## 📋 Что включено

- ✅ **Backend API** (FastAPI) - `/yess-backend`
- ✅ **Mobile App** (.NET MAUI) - `/YESS.MauiApp`
- ✅ **Полная интеграция** с JWT авторизацией
- ✅ **Тестовые данные** и демо-пользователь

## ⚡ Быстрый запуск (5 минут)

### Шаг 1: Запуск Backend

#### Windows:
```bash
# Перейти в папку бэкенда
cd yess-backend

# Запустить (автоматически установит зависимости и создаст БД)
START_BACKEND.bat
```

#### Linux/Mac:
```bash
cd yess-backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Создать тестовые данные
python seed_data.py

# Запустить сервер
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend будет доступен на:**
- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`

### Шаг 2: Запуск MAUI приложения

#### Через Visual Studio 2022:
1. Открыть `YESS.MauiApp.sln`
2. Выбрать платформу:
   - **Android Emulator** (Pixel 5 или выше)
   - **iOS Simulator** (требуется Mac)
3. Нажать **F5** (Debug) или **Ctrl+F5** (Run)

#### Через командную строку:

**Android:**
```bash
cd YESS.MauiApp
dotnet build -f net8.0-android
dotnet run -f net8.0-android
```

**iOS (только Mac):**
```bash
cd YESS.MauiApp
dotnet build -f net8.0-ios
dotnet run -f net8.0-ios
```

### Шаг 3: Тестовый вход

В мобильном приложении используйте:
- **Телефон:** `+996700000001`
- **Пароль:** `password123`
- **Начальный баланс:** 500 YessCoin

## 🔧 Конфигурация

### Backend URL в MAUI приложении

Файл: `YESS.MauiApp/MauiProgram.cs`

```csharp
#if DEBUG
    #if ANDROID
    builder.Services.AddYessServices("http://10.0.2.2:8000");  // Android Emulator
    #else
    builder.Services.AddYessServices("http://localhost:8000"); // iOS Simulator
    #endif
#else
    builder.Services.AddYessServices("https://api.yess.kg");   // Production
#endif
```

### Для физического устройства

Замените URL на IP вашего компьютера:
```csharp
builder.Services.AddYessServices("http://192.168.1.100:8000");
```

Как узнать IP:
- **Windows:** `ipconfig` (найти IPv4)
- **Mac/Linux:** `ifconfig` или `ip a`

## 📊 Тестовые данные

После запуска `seed_data.py` будет создано:

### Пользователи
| Телефон | Пароль | Баланс | Email |
|---------|--------|--------|-------|
| +996700000001 | password123 | 500 YessCoin | test@yess.kg |
| +996700000002 | password123 | 1000 YessCoin | ivan@yess.kg |
| +996700000003 | password123 | 2000 YessCoin | aigul@yess.kg |

### Партнёры (8 заведений)
- 🍽️ Ресторан Faiza (15% скидка) - 2 локации
- ☕ Кофейня Coffee Boom (10% скидка)
- 💅 Салон красоты Beauty Bar (20% скидка)
- 👕 Магазин одежды Fashion House (25% скидка)
- 🍕 Pizzeria Bella Italia (12% скидка)
- 🛒 Супермаркет Fresh Market (8% скидка)
- 💪 Фитнес-клуб Champion (30% скидка)
- 👶 Детский магазин Kids World (18% скидка)

### Города
- Бишкек
- Ош
- Джалал-Абад
- Каракол
- Талас

## 🧪 Проверка работы

### 1. Проверка Backend
```bash
# Здоровье API
curl http://localhost:8000/health
# Ответ: {"status":"healthy"}

# Список партнёров
curl http://localhost:8000/api/v1/partner/list
```

### 2. Swagger UI
Откройте `http://localhost:8000/docs` и протестируйте эндпоинты:
1. **POST /api/v1/auth/login** - войти
2. **GET /api/v1/wallet/** - получить баланс
3. **GET /api/v1/partner/list** - список партнёров

### 3. Тест в MAUI приложении

После входа в приложение:
1. ✅ Главная страница показывает баланс **500 YessCoin**
2. ✅ Страница "Партнёры" показывает **8 категорий**
3. ✅ Карта показывает **10+ локаций** партнёров
4. ✅ Можно рассчитать скидку и сделать заказ

## 📱 Функции приложения

### Главная страница
- 💰 Текущий баланс YessCoin
- 📊 Статистика использования
- 🎁 Баннеры акций

### Партнёры
- 🏪 Категории: Food, Cafe, Beauty, Clothes, Sport и др.
- 🔍 Поиск по названию
- 📍 Просмотр локаций на карте
- ℹ️ Детали партнёра и процент скидки

### Заказы
1. Выбрать партнёра
2. Ввести сумму заказа
3. Автоматически рассчитывается скидка
4. Подтвердить → YessCoin списываются

### Кошелёк
- 💳 Пополнение через QR-код
- 📜 История транзакций
- 🔄 Переводы (если включено)

### Профиль
- 👤 Информация о пользователе
- 🤝 Реферальный код
- ⚙️ Настройки

## 🐛 Решение проблем

### Проблема: "Connection refused" на Android

**Решение:**
```csharp
// В MauiProgram.cs используйте:
builder.Services.AddYessServices("http://10.0.2.2:8000");
```

10.0.2.2 - это специальный IP для доступа к localhost хост-машины из Android эмулятора.

### Проблема: "CORS error"

**Решение:** Убедитесь что в `yess-backend/app/core/config.py` добавлены origins:
```python
CORS_ORIGINS: List[str] = [
    "http://10.0.2.2:8000",  # Android
    "http://localhost:8000",  # iOS
]
```

### Проблема: "Database locked"

**Решение:**
```bash
# Остановить сервер (Ctrl+C)
# Удалить БД и пересоздать
cd yess-backend
del yess.db
python seed_data.py
```

### Проблема: Backend не запускается

**Проверьте:**
1. Python 3.11+ установлен: `python --version`
2. Виртуальное окружение активировано
3. Зависимости установлены: `pip list`
4. Порт 8000 свободен: `netstat -an | findstr 8000`

### Проблема: MAUI приложение не собирается

**Проверьте:**
1. .NET 8.0 SDK установлен: `dotnet --version`
2. MAUI workload установлен: `dotnet workload list`
3. Если нет, установите: `dotnet workload install maui`

## 📦 Структура проекта

```
bonus---APP-main/
├── yess-backend/              # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/           # API эндпоинты
│   │   ├── models/           # SQLAlchemy модели
│   │   ├── schemas/          # Pydantic схемы
│   │   └── core/             # Конфигурация, security
│   ├── seed_data.py          # Скрипт заполнения БД
│   ├── START_BACKEND.bat     # Запуск для Windows
│   └── requirements.txt      # Python зависимости
│
└── YESS.MauiApp/             # .NET MAUI Mobile App
    ├── Services/             # API клиенты
    ├── ViewModels/           # MVVM логика
    ├── Views/                # XAML страницы
    ├── Models/               # C# модели данных
    └── MauiProgram.cs        # Конфигурация DI
```

## 🔐 Безопасность

### JWT Tokens
- **Access Token:** 60 минут (для API запросов)
- **Refresh Token:** 30 дней (для обновления access)
- Автоматическое обновление при истечении
- Хранение в SecureStorage

### Идемпотентность
Повторные запросы подтверждения заказа с одним `idempotency_key` не дублируются.

## 🎯 Что дальше?

### Для разработки:
1. ✅ Настроить production database (PostgreSQL)
2. ✅ Добавить реальную интеграцию с банками
3. ✅ Настроить push-уведомления (Firebase)
4. ✅ Добавить SMS-верификацию (Twilio)
5. ✅ Настроить CI/CD

### Для продакшена:
1. ✅ Развернуть backend на сервере
2. ✅ Настроить HTTPS (SSL сертификат)
3. ✅ Опубликовать приложение в Google Play / App Store
4. ✅ Настроить мониторинг (Sentry)
5. ✅ Настроить логирование

## 📚 Документация

- 📖 [Backend API](yess-backend/README.md)
- 📖 [MAUI App README](README.md)
- 📖 [Интеграция](INTEGRATION_WITH_BACKEND.md)
- 📖 [Backend спецификация](BACKEND_SPECIFICATION.md)

## 📞 Поддержка

**Email:** narbotokerimov@gmail.com  
**Telegram:** @HeSoYaIVI  
**GitHub:** inspireVictim

---

**Последнее обновление:** 14.10.2025

