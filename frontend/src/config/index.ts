// Конфигурация окружения
export const ENV = {
    DEVELOPMENT: {
        API_URL: 'http://localhost:8000/api/v1',
        WS_URL: 'ws://localhost:8000/ws',
    },
    PRODUCTION: {
        API_URL: 'https://api.yess-loyalty.com/api/v1',
        WS_URL: 'wss://api.yess-loyalty.com/ws',
    }
};

// Определение текущего окружения
export const isProduction = process.env.NODE_ENV === 'production';

// Выбор конфигурации
export const CONFIG = isProduction ? ENV.PRODUCTION : ENV.DEVELOPMENT;

// Конфигурация безопасности
export const SECURITY_CONFIG = {
    // Ключи для токенов
    TOKEN_KEY: 'yess_access_token',
    REFRESH_TOKEN_KEY: 'yess_refresh_token',
    
    // Секретный ключ для шифрования
    SECRET_KEY: 'yess_loyalty_secure_key_2023',
    
    // Настройки токенов
    TOKEN_EXPIRATION: 60 * 60 * 24, // 24 часа
    REFRESH_TOKEN_EXPIRATION: 60 * 60 * 24 * 7, // 7 дней
    
    // Политика паролей
    PASSWORD_POLICY: {
        MIN_LENGTH: 12,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBERS: true,
        REQUIRE_SPECIAL_CHARS: true
    },
    
    // Настройки CSRF
    CSRF_PROTECTION: {
        ENABLED: true,
        HEADER_NAME: 'X-CSRF-Token'
    },
    
    // Политика безопасности
    SECURITY_POLICY: {
        // Максимальное количество неудачных попыток входа
        MAX_LOGIN_ATTEMPTS: 5,
        
        // Время блокировки после превышения попыток входа
        LOGIN_BLOCK_DURATION: 15 * 60, // 15 минут
        
        // Требование двухфакторной аутентификации
        TWO_FACTOR_AUTH: {
            ENABLED: false,
            METHODS: ['email', 'sms', 'authenticator_app']
        }
    }
};

// Константы приложения
export const APP_CONSTANTS = {
    NAME: 'YESS Loyalty',
    VERSION: '1.0.0',
    SUPPORT_EMAIL: 'support@yess-loyalty.com',
};

// Настройки запросов
export const REQUEST_CONFIG = {
    TIMEOUT: 10000, // 10 секунд
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000, // 1 секунда
};

// Конфигурация логирования
export const LOG_CONFIG = {
    // Общие настройки
    ENABLED: process.env.NODE_ENV !== 'production',
    LEVEL: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    
    // Конфигурация Sentry
    SENTRY_DSN: 'https://your-sentry-dsn.ingest.sentry.io/project-id',
    
    // Настройки логирования ошибок
    ERROR_TRACKING: {
        MAX_HISTORY_LENGTH: 50,
        SEND_TO_SERVER: true,
        CONSOLE_OUTPUT: true,
        TOAST_NOTIFICATIONS: true
    },
    
    // Настройки производительности
    PERFORMANCE_TRACKING: {
        ENABLED: true,
        SAMPLE_RATE: 0.1, // 10% запросов
        SLOW_REQUEST_THRESHOLD: 500 // мс
    },
    
    // Настройки мониторинга
    MONITORING: {
        HEARTBEAT_INTERVAL: 60000, // 1 минута
        RESOURCE_CHECK_INTERVAL: 30000 // 30 секунд
    }
};

export default LOG_CONFIG;
