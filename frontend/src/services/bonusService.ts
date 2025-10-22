import apiService from './api';

export interface BonusTransaction {
  id: number;
  user: number;
  amount: number;
  transaction_type: 'AC' | 'WO' | 'GF' | 'PT';
  description: string;
  created_at: string;
}

export interface BonusCategory {
  id: number;
  name: string;
  description: string;
  required_points: number;
  is_active: boolean;
}

export interface CreateTransactionData {
  amount: number;
  transaction_type: 'AC' | 'WO' | 'GF' | 'PT';
  description?: string;
}

export interface TransactionFilters {
  type?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

class BonusService {
  /**
   * Получить все транзакции пользователя
   */
  async getTransactions(filters?: TransactionFilters): Promise<BonusTransaction[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.type) params.append('type', filters.type);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
    }

    const queryString = params.toString();
    const url = `/bonuses/transactions/${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<BonusTransaction[]>(url);
    return response.data;
  }

  /**
   * Получить конкретную транзакцию
   */
  async getTransaction(id: number): Promise<BonusTransaction> {
    const response = await apiService.get<BonusTransaction>(`/bonuses/transactions/${id}/`);
    return response.data;
  }

  /**
   * Создать новую транзакцию
   */
  async createTransaction(data: CreateTransactionData): Promise<BonusTransaction> {
    const response = await apiService.post<BonusTransaction>('/bonuses/transactions/', data);
    return response.data;
  }

  /**
   * Получить все категории бонусов
   */
  async getCategories(): Promise<BonusCategory[]> {
    const response = await apiService.get<BonusCategory[]>('/bonuses/categories/');
    return response.data;
  }

  /**
   * Получить категорию по ID
   */
  async getCategory(id: number): Promise<BonusCategory> {
    const response = await apiService.get<BonusCategory>(`/bonuses/categories/${id}/`);
    return response.data;
  }

  /**
   * Начислить бонусы
   */
  async addBonusPoints(amount: number, description?: string): Promise<BonusTransaction> {
    return this.createTransaction({
      amount,
      transaction_type: 'AC',
      description: description || 'Начисление бонусов'
    });
  }

  /**
   * Списать бонусы
   */
  async spendBonusPoints(amount: number, description?: string): Promise<BonusTransaction> {
    return this.createTransaction({
      amount,
      transaction_type: 'WO',
      description: description || 'Списание бонусов'
    });
  }

  /**
   * Получить статистику по бонусам
   */
  async getBonusStats(): Promise<{
    total_earned: number;
    total_spent: number;
    current_balance: number;
    transactions_count: number;
  }> {
    const response = await apiService.get('/bonuses/stats/');
    return response.data;
  }
}

export default new BonusService();

