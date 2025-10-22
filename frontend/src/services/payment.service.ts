/**
 * Сервис платежей для Bonus APP Frontend
 * Интеграция с универсальным платежным шлюзом
 */

import { api } from '../lib/api';

export interface PaymentMethod {
  id: string;
  name: string;
  commission_rate: number;
  min_amount: number;
  max_amount: number;
  processing_time: string;
  is_available: boolean;
}

export interface PaymentRequest {
  amount: number;
  method: string;
  phone_number?: string;
  card_token?: string;
}

export interface PaymentResponse {
  transaction_id: number;
  status: string;
  amount: number;
  commission: number;
  new_balance?: number;
  message?: string;
  error?: string;
  payment_url?: string;
  qr_code?: string;
  expires_at?: string;
}

export interface WalletBalance {
  balance: number;
  currency: string;
  last_updated: string;
}

export interface TransactionHistory {
  id: number;
  amount: number;
  commission: number;
  payment_method: string;
  status: string;
  created_at: string;
  processed_at?: string;
  error_message?: string;
}

export interface PaymentLimits {
  daily_limit: number;
  monthly_limit: number;
  single_transaction_limit: number;
  used_daily: number;
  used_monthly: number;
  last_daily_reset: string;
  last_monthly_reset: string;
}

export interface PaymentAnalytics {
  total_replenishments: number;
  total_amount: number;
  average_amount: number;
  success_rate: number;
  methods_usage: Record<string, number>;
  daily_stats: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

class PaymentService {
  private baseUrl = '/api/v1/payments';

  /**
   * Получение доступных методов оплаты
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await api.get(`${this.baseUrl}/methods`);
      return response.data.methods;
    } catch (error) {
      console.error('Ошибка получения методов оплаты:', error);
      throw error;
    }
  }

  /**
   * Пополнение кошелька
   */
  async replenishWallet(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/replenish`, paymentRequest);
      
      // Обработка различных сценариев в зависимости от метода оплаты
      if (response.data.payment_url) {
        // Открытие платежной страницы для банковских карт
        await this.openPaymentPage(response.data.payment_url);
      }
      
      if (response.data.qr_code) {
        // Показ QR-кода для оплаты в терминале
        await this.showQRCode(response.data.qr_code);
      }
      
      return response.data;
    } catch (error) {
      console.error('Ошибка пополнения кошелька:', error);
      throw error;
    }
  }

  /**
   * Получение баланса кошелька
   */
  async getWalletBalance(): Promise<WalletBalance> {
    try {
      const response = await api.get(`${this.baseUrl}/balance`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения баланса:', error);
      throw error;
    }
  }

  /**
   * Получение истории транзакций
   */
  async getTransactionHistory(page: number = 1, pageSize: number = 20): Promise<{
    transactions: TransactionHistory[];
    total_count: number;
    page: number;
    page_size: number;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/transactions`, {
        params: { page, page_size: pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка получения истории транзакций:', error);
      throw error;
    }
  }

  /**
   * Проверка статуса транзакции
   */
  async getTransactionStatus(transactionId: number): Promise<PaymentResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/transactions/${transactionId}/status`);
      return response.data;
    } catch (error) {
      console.error('Ошибка проверки статуса транзакции:', error);
      throw error;
    }
  }

  /**
   * Запрос на возврат средств
   */
  async requestRefund(transactionId: number, reason: string, amount?: number): Promise<{
    refund_id: number;
    transaction_id: number;
    amount: number;
    status: string;
    message: string;
  }> {
    try {
      const response = await api.post(`${this.baseUrl}/refund`, {
        transaction_id: transactionId,
        reason,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка запроса возврата:', error);
      throw error;
    }
  }

  /**
   * Получение аналитики платежей
   */
  async getPaymentAnalytics(): Promise<PaymentAnalytics> {
    try {
      const response = await api.get(`${this.baseUrl}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения аналитики:', error);
      throw error;
    }
  }

  /**
   * Получение лимитов платежей
   */
  async getPaymentLimits(): Promise<PaymentLimits> {
    try {
      const response = await api.get(`${this.baseUrl}/limits`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения лимитов:', error);
      throw error;
    }
  }

  /**
   * Открытие платежной страницы
   */
  private async openPaymentPage(paymentUrl: string): Promise<void> {
    // Реализация открытия платежной страницы
    // В React Native можно использовать WebView или внешний браузер
    console.log('Открытие платежной страницы:', paymentUrl);
    
    // Пример для React Native:
    // import { Linking } from 'react-native';
    // await Linking.openURL(paymentUrl);
  }

  /**
   * Показ QR-кода для оплаты
   */
  private async showQRCode(qrCode: string): Promise<void> {
    // Реализация показа QR-кода
    console.log('QR-код для оплаты:', qrCode);
    
    // Пример для React Native:
    // import QRCode from 'react-native-qrcode-svg';
    // Показать модальное окно с QR-кодом
  }

  /**
   * Валидация суммы пополнения
   */
  validateAmount(amount: number, method: PaymentMethod): { isValid: boolean; error?: string } {
    if (amount < method.min_amount) {
      return {
        isValid: false,
        error: `Минимальная сумма: ${method.min_amount} сом`
      };
    }

    if (amount > method.max_amount) {
      return {
        isValid: false,
        error: `Максимальная сумма: ${method.max_amount} сом`
      };
    }

    return { isValid: true };
  }

  /**
   * Расчет комиссии
   */
  calculateCommission(amount: number, method: PaymentMethod): number {
    return amount * method.commission_rate;
  }

  /**
   * Форматирование суммы для отображения
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Получение названия метода оплаты на русском
   */
  getMethodName(methodId: string): string {
    const methodNames: Record<string, string> = {
      'bank_card': 'Банковская карта',
      'elsom': 'Элсом',
      'mobile_balance': 'Баланс телефона',
      'elkart': 'Элкарт',
      'cash_terminal': 'Терминал',
      'bank_transfer': 'Банковский перевод'
    };
    
    return methodNames[methodId] || methodId;
  }

  /**
   * Получение статуса транзакции на русском
   */
  getStatusName(status: string): string {
    const statusNames: Record<string, string> = {
      'pending': 'Ожидает',
      'processing': 'Обрабатывается',
      'success': 'Успешно',
      'failed': 'Ошибка',
      'cancelled': 'Отменено'
    };
    
    return statusNames[status] || status;
  }

  /**
   * Получение цвета статуса для UI
   */
  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      'pending': '#FFA500',
      'processing': '#2196F3',
      'success': '#4CAF50',
      'failed': '#F44336',
      'cancelled': '#9E9E9E'
    };
    
    return statusColors[status] || '#9E9E9E';
  }
}

// Экспорт экземпляра сервиса
export const paymentService = new PaymentService();

// Экспорт типов для использования в компонентах
export type {
  PaymentMethod,
  PaymentRequest,
  PaymentResponse,
  WalletBalance,
  TransactionHistory,
  PaymentLimits,
  PaymentAnalytics
};
