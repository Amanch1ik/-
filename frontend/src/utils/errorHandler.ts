import { toast } from 'react-toastify';

interface ErrorDetails {
    message: string;
    code?: string;
    field?: string;
}

class ErrorHandler {
    // Приватный конструктор для синглтона
    private constructor() {}
    private static instance: ErrorHandler;

    // Синглтон
    public static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    // Обработка общих ошибок
    public handleError(error: any): void {
        const errorDetails = this.parseError(error);
        
        // Логирование ошибки
        console.error('Application Error:', errorDetails);

        // Уведомление пользователя
        this.showErrorToast(errorDetails);
    }

    // Парсинг различных типов ошибок
    private parseError(error: any): ErrorDetails {
        // Обработка ошибок от axios
        if (error.response) {
            return {
                message: error.response.data.message || 'Неизвестная ошибка сервера',
                code: error.response.status,
                field: error.response.data.field
            };
        }

        // Обработка сетевых ошибок
        if (error.request) {
            return {
                message: 'Нет соединения с сервером',
                code: 'NETWORK_ERROR'
            };
        }

        // Обработка других ошибок
        return {
            message: error.message || 'Произошла неизвестная ошибка',
            code: 'UNKNOWN_ERROR'
        };
    }

    // Показ toast-уведомлений
    private showErrorToast(error: ErrorDetails): void {
        toast.error(error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    // Специфические методы обработки ошибок
    public handleAuthError(error: any): void {
        const errorDetails = this.parseError(error);
        
        // Специфическая логика для ошибок аутентификации
        if (errorDetails.code === 401 || errorDetails.code === 403) {
            // Принудительный выход из системы
            this.handleLogoutOnAuthError();
        }

        this.handleError(error);
    }

    private handleLogoutOnAuthError(): void {
        // Очистка токенов и редирект на страницу входа
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    }

    // Метод для логирования ошибок в сервисах
    public logServiceError(service: string, error: any): void {
        const errorDetails = this.parseError(error);
        console.error(`Error in ${service} service:`, errorDetails);
    }
}

// Экспорт синглтона
export default ErrorHandler.getInstance();
