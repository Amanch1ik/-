import { makeAutoObservable } from 'mobx';
import ApiService from './api.service';
import SecurityService from './security.service';
import ErrorService from './error.service';
import { SECURITY_CONFIG } from '@/config';

enum TwoFactorMethod {
    EMAIL = 'email',
    SMS = 'sms',
    AUTHENTICATOR = 'authenticator'
}

interface TwoFactorSetupResponse {
    secret: string;
    qr_code_url?: string;
    backup_codes: string[];
}

class TwoFactorAuthService {
    // Состояние двухфакторной аутентификации
    private _isEnabled: boolean = false;
    private _method: TwoFactorMethod = TwoFactorMethod.EMAIL;
    private _remainingBackupCodes: number = 0;

    constructor() {
        makeAutoObservable(this);
        this.loadTwoFactorStatus();
    }

    // Загрузка статуса двухфакторной аутентификации
    private async loadTwoFactorStatus() {
        try {
            const status = await ApiService.get('/auth/two-factor/status');
            this._isEnabled = status.enabled;
            this._method = status.method;
            this._remainingBackupCodes = status.backup_codes_count;
        } catch (error) {
            ErrorService.handleError(error);
        }
    }

    // Инициация настройки двухфакторной аутентификации
    public async initSetup(): Promise<TwoFactorSetupResponse> {
        try {
            const response = await ApiService.post('/auth/two-factor/setup');
            
            // Сохраняем секретный ключ в безопасном хранилище
            SecurityService.setSecureToken('two_factor_secret', response.secret);
            
            return {
                secret: response.secret,
                qr_code_url: response.qr_code_url,
                backup_codes: response.backup_codes
            };
        } catch (error) {
            ErrorService.handleError(error);
            throw error;
        }
    }

    // Подтверждение настройки двухфакторной аутентификации
    public async confirmSetup(code: string): Promise<boolean> {
        try {
            const secret = SecurityService.getSecureToken('two_factor_secret');
            
            const response = await ApiService.post('/auth/two-factor/confirm', {
                code,
                secret
            });

            if (response.success) {
                this._isEnabled = true;
                SecurityService.clearSecureToken('two_factor_secret');
                return true;
            }

            return false;
        } catch (error) {
            ErrorService.handleError(error);
            return false;
        }
    }

    // Вход с двухфакторной аутентификацией
    public async loginWithTwoFactor(username: string, password: string, code: string): Promise<boolean> {
        try {
            const response = await ApiService.post('/auth/two-factor/login', {
                username,
                password,
                code
            });

            if (response.success) {
                // Сохраняем токены
                SecurityService.setSecureToken('access', response.access_token);
                SecurityService.setSecureToken('refresh', response.refresh_token);
                return true;
            }

            return false;
        } catch (error) {
            ErrorService.handleError(error);
            return false;
        }
    }

    // Отключение двухфакторной аутентификации
    public async disableTwoFactor(code: string): Promise<boolean> {
        try {
            const response = await ApiService.post('/auth/two-factor/disable', { code });

            if (response.success) {
                this._isEnabled = false;
                return true;
            }

            return false;
        } catch (error) {
            ErrorService.handleError(error);
            return false;
        }
    }

    // Использование резервного кода
    public async useBackupCode(backupCode: string): Promise<boolean> {
        try {
            const response = await ApiService.post('/auth/two-factor/backup-code', { code: backupCode });

            if (response.success) {
                this._remainingBackupCodes--;
                return true;
            }

            return false;
        } catch (error) {
            ErrorService.handleError(error);
            return false;
        }
    }

    // Геттеры
    get isEnabled(): boolean {
        return this._isEnabled;
    }

    get method(): TwoFactorMethod {
        return this._method;
    }

    get remainingBackupCodes(): number {
        return this._remainingBackupCodes;
    }
}

export default new TwoFactorAuthService();
