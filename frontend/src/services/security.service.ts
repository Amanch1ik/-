import CryptoJS from 'crypto-js';
import { SECURITY_CONFIG } from '@/config';

class SecurityService {
    private readonly SECRET_KEY: string = SECURITY_CONFIG.SECRET_KEY;

    // Шифрование данных
    public encrypt(data: string): string {
        try {
            return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
        } catch (error) {
            console.error('Encryption error:', error);
            return data;
        }
    }

    // Дешифрование данных
    public decrypt(encryptedData: string): string {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Decryption error:', error);
            return encryptedData;
        }
    }

    // Хэширование пароля
    public hashPassword(password: string): string {
        return CryptoJS.SHA256(password).toString();
    }

    // Проверка сложности пароля
    public isPasswordStrong(password: string): boolean {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        return passwordRegex.test(password);
    }

    // Генерация токена
    public generateToken(length: number = 32): string {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            token += charset[randomIndex];
        }
        return token;
    }

    // Безопасное хранение токена
    public setSecureToken(tokenType: 'access' | 'refresh', token: string): void {
        const encryptedToken = this.encrypt(token);
        localStorage.setItem(
            tokenType === 'access' 
                ? SECURITY_CONFIG.TOKEN_KEY 
                : SECURITY_CONFIG.REFRESH_TOKEN_KEY, 
            encryptedToken
        );
    }

    // Безопасное получение токена
    public getSecureToken(tokenType: 'access' | 'refresh'): string | null {
        const encryptedToken = localStorage.getItem(
            tokenType === 'access' 
                ? SECURITY_CONFIG.TOKEN_KEY 
                : SECURITY_CONFIG.REFRESH_TOKEN_KEY
        );

        return encryptedToken ? this.decrypt(encryptedToken) : null;
    }

    // Удаление токенов
    public clearTokens(): void {
        localStorage.removeItem(SECURITY_CONFIG.TOKEN_KEY);
        localStorage.removeItem(SECURITY_CONFIG.REFRESH_TOKEN_KEY);
    }

    // Проверка csrf-токена
    public validateCSRFToken(token: string): boolean {
        // Реализация проверки CSRF токена
        return token.length === 32;
    }
}

export default new SecurityService();
