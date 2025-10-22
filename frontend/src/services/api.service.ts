import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import CONFIG from '@/config';
import { SECURITY_CONFIG } from '@/config';

class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: CONFIG.CONFIG.API_URL,
            timeout: CONFIG.REQUEST_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Добавление токена к каждому запросу
        this.axiosInstance.interceptors.request.use(
            config => {
                const token = localStorage.getItem(SECURITY_CONFIG.TOKEN_KEY);
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        // Обработка ошибок и обновление токена
        this.axiosInstance.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                // Если токен просрочен, пробуем обновить
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        await this.refreshToken();
                        return this.axiosInstance(originalRequest);
                    } catch (refreshError) {
                        this.logout();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Базовые методы запросов
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Обновление токена
    private async refreshToken(): Promise<void> {
        const refreshToken = localStorage.getItem(SECURITY_CONFIG.REFRESH_TOKEN_KEY);
        
        if (!refreshToken) {
            this.logout();
            return;
        }

        try {
            const response = await this.axiosInstance.post('/auth/refresh', { refresh_token: refreshToken });
            const { access_token, refresh_token } = response.data;

            localStorage.setItem(SECURITY_CONFIG.TOKEN_KEY, access_token);
            localStorage.setItem(SECURITY_CONFIG.REFRESH_TOKEN_KEY, refresh_token);
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    // Обработка ошибок
    private handleError(error: any): void {
        if (CONFIG.LOG_CONFIG.ENABLED) {
            console.error('API Error:', error);
        }
    }

    // Выход пользователя
    private logout(): void {
        localStorage.removeItem(SECURITY_CONFIG.TOKEN_KEY);
        localStorage.removeItem(SECURITY_CONFIG.REFRESH_TOKEN_KEY);
        // Редирект на страницу входа
        window.location.href = '/login';
    }
}

export default new ApiService();
