#!/bin/bash

# Скрипт резервного копирования базы данных YESS Loyalty

# Параметры подключения к базе данных
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="yess_loyalty"
DB_USER="yess_user"

# Директория для хранения бэкапов
BACKUP_DIR="/var/backups/yess_loyalty"
BACKUP_RETENTION_DAYS=7

# Создание директории для бэкапов
mkdir -p "$BACKUP_DIR"

# Генерация имени файла с текущей датой
BACKUP_FILE="$BACKUP_DIR/yess_loyalty_$(date +"%Y%m%d_%H%M%S").sql.gz"

# Выполнение резервного копирования с компрессией
PGPASSWORD="yess_password" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -f "$BACKUP_FILE" \
    -Z 9

# Удаление старых бэкапов
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +$BACKUP_RETENTION_DAYS -delete

# Логирование
echo "Резервное копирование базы данных YESS Loyalty завершено: $BACKUP_FILE"

# Опциональная отправка уведомления (например, по электронной почте)
# echo "Backup completed" | mail -s "YESS Loyalty DB Backup" admin@yess-loyalty.kg
