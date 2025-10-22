import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ErrorResponse } from '../types/api';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor для добавления токена
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor для обработки ошибок
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Обработка ошибки авторизации
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

  private async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await this.axiosInstance.post<ApiResponse<{ access_token: string }>>(
      '/auth/refresh/',
      { refresh: refreshToken }
    );

    localStorage.setItem('access_token', response.data.data.access_token);
    return response.data;
  }

  private logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }

  public async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance(config);
      return response.data;
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        detail: error.response?.data?.detail || 'Неизвестная ошибка',
        code: error.response?.data?.code
      };
      throw errorResponse;
    }
  }

  // Методы для основных HTTP-запросов
  public get<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  public delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }
}

export default new ApiService();
