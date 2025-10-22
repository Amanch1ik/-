import { makeAutoObservable } from 'mobx';
import { toast } from 'react-toastify';
import * as Sentry from "@sentry/react";
import { LOG_CONFIG } from '@/config';

// Типы ошибок
enum ErrorType {
    NETWORK = 'network',
    VALIDATION = 'validation',
    AUTHENTICATION = 'authentication',
    AUTHORIZATION = 'authorization',
    SERVER = 'server',
    CLIENT = 'client',
    UNKNOWN = 'unknown'
}

// Уровни серьезности ошибок
enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

// Структура ошибки
interface ErrorDetails {
    type: ErrorType;
    severity: ErrorSeverity;
    message: string;
    code?: string;
    field?: string;
    timestamp: number;
    stackTrace?: string;
}

class ErrorHandlerService {
    // История ошибок
    private _errorHistory: ErrorDetails[] = [];
    
    // Максимальное количество сохраняемых ошибок
    private readonly MAX_ERROR_HISTORY = 50;

    // Конфигурация обработки ошибок
    private _config = {
        logToConsole: LOG_CONFIG.ERROR_TRACKING.CONSOLE_OUTPUT,
        showToast: LOG_CONFIG.ERROR_TRACKING.TOAST_NOTIFICATIONS,
        sendToServer: LOG_CONFIG.ERROR_TRACKING.SEND_TO_SERVER
    };

    constructor() {
        makeAutoObservable(this);
        this.initializeErrorTracking();
    }

    // Инициализация глобального отслеживания ошибок
    private initializeErrorTracking() {
        // Глобальный обработчик необработанных ошибок
        window.addEventListener('error', (event) => {
            this.handleUnhandledError(event.error);
        });

        // Обработчик необработанных промисов
        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledPromiseRejection(event.reason);
        });
    }

    // Определение типа ошибки
    private determineErrorType(error: any): ErrorType {
        if (error.response) {
            switch (error.response.status) {
                case 400: return ErrorType.VALIDATION;
                case 401: return ErrorType.AUTHENTICATION;
                case 403: return ErrorType.AUTHORIZATION;
                case 500: return ErrorType.SERVER;
                default: return ErrorType.NETWORK;
            }
        }
        return error instanceof Error ? ErrorType.CLIENT : ErrorType.UNKNOWN;
    }

    // Определение серьезности ошибки
    private determineErrorSeverity(type: ErrorType): ErrorSeverity {
        switch (type) {
            case ErrorType.AUTHENTICATION:
            case ErrorType.AUTHORIZATION:
            case ErrorType.SERVER:
                return ErrorSeverity.CRITICAL;
            case ErrorType.NETWORK:
            case ErrorType.VALIDATION:
                return ErrorSeverity.HIGH;
            case ErrorType.CLIENT:
                return ErrorSeverity.MEDIUM;
            default:
                return ErrorSeverity.LOW;
        }
    }

    // Обработка необработанных ошибок
    private handleUnhandledError(error: Error) {
        const errorDetails: ErrorDetails = {
            type: this.determineErrorType(error),
            severity: this.determineErrorSeverity(this.determineErrorType(error)),
            message: error.message || 'Неизвестная ошибка',
            timestamp: Date.now(),
            stackTrace: error.stack
        };

        this.processError(errorDetails);
    }

    // Обработка необработанных промисов
    private handleUnhandledPromiseRejection(reason: any) {
        const errorDetails: ErrorDetails = {
            type: this.determineErrorType(reason),
            severity: this.determineErrorSeverity(this.determineErrorType(reason)),
            message: reason.message || 'Необработанная ошибка промиса',
            timestamp: Date.now(),
            stackTrace: reason.stack
        };

        this.processError(errorDetails);
    }

    // Глобальный метод обработки ошибок
    public processError(
        error: Error | any, 
        customDetails: Partial<ErrorDetails> = {}
    ) {
        // Создание детализации ошибки
        const errorDetails: ErrorDetails = {
            type: this.determineErrorType(error),
            severity: this.determineErrorSeverity(this.determineErrorType(error)),
            message: error.message || 'Неизвестная ошибка',
            timestamp: Date.now(),
            stackTrace: error.stack,
            ...customDetails
        };

        // Логирование в консоль
        if (this._config.logToConsole) {
            console.error(
                `[${errorDetails.type}] ${errorDetails.message}`, 
                errorDetails
            );
        }

        // Уведомление через toast
        if (this._config.showToast) {
            this.showToast(errorDetails);
        }

        // Отправка в Sentry
        this.reportToSentry(error, errorDetails);

        // Сохранение в историю ошибок
        this.addToErrorHistory(errorDetails);

        // Отправка на сервер
        if (this._config.sendToServer) {
            this.sendErrorToServer(errorDetails);
        }
    }

    // Показ уведомлений
    private showToast(errorDetails: ErrorDetails) {
        switch (errorDetails.severity) {
            case ErrorSeverity.CRITICAL:
            case ErrorSeverity.HIGH:
                toast.error(errorDetails.message);
                break;
            case ErrorSeverity.MEDIUM:
                toast.warn(errorDetails.message);
                break;
            default:
                toast.info(errorDetails.message);
        }
    }

    // Отправка ошибки в Sentry
    private reportToSentry(error: Error, details: ErrorDetails) {
        Sentry.captureException(error, {
            extra: {
                type: details.type,
                severity: details.severity,
                timestamp: details.timestamp
            }
        });
    }

    // Добавление ошибки в историю
    private addToErrorHistory(errorDetails: ErrorDetails) {
        this._errorHistory.push(errorDetails);

        // Усечение истории
        if (this._errorHistory.length > this.MAX_ERROR_HISTORY) {
            this._errorHistory.shift();
        }
    }

    // Отправка ошибки на сервер
    private async sendErrorToServer(errorDetails: ErrorDetails) {
        try {
            // Заглушка для отправки на сервер
            // В реальном приложении используйте ApiService
            await fetch('/api/errors/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorDetails)
            });
        } catch (sendError) {
            console.error('Не удалось отправить ошибку на сервер', sendError);
        }
    }

    // Настройка конфигурации
    public setErrorConfig(config: Partial<typeof this._config>) {
        this._config = { ...this._config, ...config };
    }

    // Получение истории ошибок
    get errorHistory(): ErrorDetails[] {
        return this._errorHistory;
    }

    // Очистка истории ошибок
    public clearErrorHistory() {
        this._errorHistory = [];
    }

    // Генерация отчета об ошибках
    public generateErrorReport(): string {
        const report: string[] = ['Error Report'];

        const errorStats = this._errorHistory.reduce((stats, error) => {
            if (!stats[error.type]) {
                stats[error.type] = {
                    count: 0,
                    severities: {}
                };
            }

            stats[error.type].count++;
            stats[error.type].severities[error.severity] = 
                (stats[error.type].severities[error.severity] || 0) + 1;

            return stats;
        }, {} as Record<ErrorType, { count: number, severities: Record<ErrorSeverity, number> }>);

        Object.entries(errorStats).forEach(([type, stats]) => {
            report.push(`
${type.toUpperCase()}:
- Всего ошибок: ${stats.count}
${Object.entries(stats.severities).map(([severity, count]) => 
    `- ${severity.toUpperCase()}: ${count}`
).join('\n')}
            `);
        });

        return report.join('\n');
    }
}

export default new ErrorHandlerService();
