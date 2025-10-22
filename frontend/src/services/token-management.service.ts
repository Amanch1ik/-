import { makeAutoObservable } from 'mobx';
import ApiService from './api.service';
import SecurityService from './security.service';
import ErrorService from './error.service';
import { SECURITY_CONFIG } from '@/config';

interface TokenPair {
    access_token: string;
    refresh_token: string;
}

interface TokenPayload {
    sub: string;
    exp: number;
    iat: number;
    roles?: string[];
}

class TokenManagementService {
    // Состояние токенов
    private _tokens: TokenPair | null = null;
    private _payload: TokenPayload | null = null;
    
    // Таймер обновления токена
    private _refreshTimer: NodeJS.Timeout | null = null;

    constructor() {
        makeAutoObservable(this);
        this.initializeTokens();
    }

    // Инициализация токенов при загрузке
    private initializeTokens() {
        const accessToken = SecurityService.getSecureToken('access');
        const refreshToken = SecurityService.getSecureToken('refresh');

        if (accessToken && refreshToken) {
            this._tokens = { access_token: accessToken, refresh_token: refreshToken };
            this.decodeTokenPayload(accessToken);
            this.scheduleTokenRefresh();
        }
    }

    // Декодирование payload токена
    private decodeTokenPayload(token: string) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this._payload = payload;
        } catch (error) {
            ErrorService.handleError(error);
            this.logout();
        }
    }

    // Проверка истечения токена
    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }

    // Планирование автоматического обновления токена
    private scheduleTokenRefresh() {
        if (!this._payload) return;

        // За 5 минут до истечения токена
        const refreshTime = (this._payload.exp - 300) * 1000;
        const delay = Math.max(refreshTime - Date.now(), 0);

        this._refreshTimer = setTimeout(() => {
            this.refreshTokens();
        }, delay);
    }

    // Обновление токенов
    public async refreshTokens(): Promise<boolean> {
        if (!this._tokens) return false;

        try {
            const response = await ApiService.post<TokenPair>('/auth/refresh', {
                refresh_token: this._tokens.refresh_token
            });

            // Обновление и сохранение токенов
            this.setTokens(response);
            return true;
        } catch (error) {
            ErrorService.handleError(error);
            this.logout();
            return false;
        }
    }

    // Установка новых токенов
    public setTokens(tokens: TokenPair) {
        // Сохранение в безопасном хранилище
        SecurityService.setSecureToken('access', tokens.access_token);
        SecurityService.setSecureToken('refresh', tokens.refresh_token);

        this._tokens = tokens;
        this.decodeTokenPayload(tokens.access_token);
        
        // Перепланирование обновления токена
        if (this._refreshTimer) {
            clearTimeout(this._refreshTimer);
        }
        this.scheduleTokenRefresh();
    }

    // Проверка авторизации
    public isAuthenticated(): boolean {
        return !!this._tokens && !this.isTokenExpired(this._tokens.access_token);
    }

    // Получение ролей пользователя
    public getUserRoles(): string[] {
        return this._payload?.roles || [];
    }

    // Проверка наличия роли
    public hasRole(role: string): boolean {
        return this.getUserRoles().includes(role);
    }

    // Выход из системы
    public logout() {
        // Очистка токенов
        SecurityService.clearTokens();
        
        // Сброс состояния
        this._tokens = null;
        this._payload = null;

        // Остановка таймера обновления
        if (this._refreshTimer) {
            clearTimeout(this._refreshTimer);
        }

        // Редирект на страницу входа
        window.location.href = '/login';
    }

    // Геттеры
    get accessToken(): string | null {
        return this._tokens?.access_token || null;
    }

    get userId(): string | null {
        return this._payload?.sub || null;
    }
}

export default new TokenManagementService();
