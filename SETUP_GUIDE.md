# 🚀 Руководство по установке Yess Loyalty

## 🖥️ Требования к системе

### Программное обеспечение
- **Python**: 3.9+
- **Node.js**: 16+
- **npm**: 8+
- **Git**

### Операционные системы
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+)

## 🔧 Подготовка окружения

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/yess-loyalty.git
cd yess-loyalty
```

### 2. Настройка Backend (Python)

#### 2.1 Создание виртуального окружения
```bash
# Windows
cd yess-backend
python -m venv venv
.\venv\Scripts\Activate.ps1

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2.2 Установка зависимостей
```bash
pip install -r requirements.txt
```

#### 2.3 Настройка базы данных
```bash
# Применение миграций
alembic upgrade head
```

### 3. Настройка Frontend (React)

#### 3.1 Установка зависимостей
```bash
cd ../frontend
npm install
```

#### 3.2 Создание .env файла
```bash
cp .env.example .env
# Отредактируйте .env с вашими настройками
```

## 🚀 Запуск приложения

### Локальный запуск (без Docker)

#### Backend
```bash
# В директории yess-backend
uvicorn app.main:app --reload
```

#### Frontend
```bash
# В директории frontend
npm start
```

### Запуск с помощью скрипта

```powershell
# В Windows
.\dev_start.ps1

# Режим отладки
.\dev_start.ps1 -Verbose
```

## 🔒 Безопасность

- Никогда не коммитьте `.env` файлы с реальными credentials
- Используйте `.env.example` как шаблон
- Храните секретные ключи в безопасном месте

## 🐛 Устранение проблем

### Частые ошибки

1. **Зависимости не установились**
   - Проверьте версии Python и npm
   - Обновите pip: `python -m pip install --upgrade pip`

2. **Ошибки миграций базы данных**
   - Убедитесь, что база данных настроена корректно
   - Проверьте строку подключения в `.env`

3. **Проблемы с портами**
   - Убедитесь, что порты 3000 (frontend) и 8000 (backend) свободны
   - Закройте другие приложения, использующие эти порты

## 📋 Чек-лист перед началом работы

- [ ] Установлен Python 3.9+
- [ ] Установлен Node.js 16+
- [ ] Клонирован репозиторий
- [ ] Создано виртуальное окружение
- [ ] Установлены зависимости
- [ ] Настроена база данных
- [ ] Создан `.env` файл

## 🆘 Поддержка

- **Telegram**: @yess_support
- **Email**: support@yessloyalty.com

**Удачи в разработке!** 🚀
