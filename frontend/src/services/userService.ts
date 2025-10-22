import apiService from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  total_bonus_points: number;
  is_partner: boolean;
  level: number;
  experience_points: number;
  is_notifications_enabled: boolean;
  bnpl_limit?: number;
}

export interface UpdateUserData {
  email?: string;
  phone?: string;
  is_notifications_enabled?: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

class UserService {
  /**
   * Получить данные текущего пользователя
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/users/me/');
    return response.data;
  }

  /**
   * Обновить данные пользователя
   */
  async updateUser(data: UpdateUserData): Promise<User> {
    const response = await apiService.put<User>('/users/me/', data);
    return response.data;
  }

  /**
   * Получить уведомления пользователя
   */
  async getNotifications() {
    const response = await apiService.get('/users/notifications/');
    return response.data;
  }

  /**
   * Пометить уведомление как прочитанное
   */
  async markNotificationAsRead(notificationId: number) {
    const response = await apiService.post(`/users/notifications/${notificationId}/read/`);
    return response.data;
  }

  /**
   * Вход в систему
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login/', credentials);
    
    // Сохраняем токены
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  }

  /**
   * Регистрация нового пользователя
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register/', data);
    
    // Сохраняем токены
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  }

  /**
   * Выход из системы
   */
  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout/');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  /**
   * Проверка авторизации
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export default new UserService();

