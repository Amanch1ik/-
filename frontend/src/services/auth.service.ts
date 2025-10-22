import ApiService from './api';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  ApiResponse, 
  User 
} from '../types/api';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>('/auth/login/', credentials);
    
    // Сохраняем токены и информацию о пользователе
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>('/auth/register/', credentials);
    
    // Сохраняем токены и информацию о пользователе
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  }

  logout(): void {
    // Удаляем токены и информацию о пользователе
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  async resetPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return await ApiService.post('/auth/reset-password/', { email });
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return await ApiService.put('/auth/profile/', userData);
  }
}

export default new AuthService();
