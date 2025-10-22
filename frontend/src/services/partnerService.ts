import apiService from './api';

export interface Partner {
  id: number;
  name: string;
  description: string;
  logo_url?: string;
  category: string;
  bonus_rate: number;
  is_active: boolean;
  website?: string;
  phone?: string;
  address?: string;
}

export interface PartnerOffer {
  id: number;
  partner: Partner;
  title: string;
  description: string;
  discount: string;
  valid_until?: string;
  image_url?: string;
  terms?: string;
}

export interface PartnerFilters {
  category?: string;
  is_active?: boolean;
  search?: string;
}

class PartnerService {
  /**
   * Получить всех партнеров
   */
  async getPartners(filters?: PartnerFilters): Promise<Partner[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
      if (filters.search) params.append('search', filters.search);
    }

    const queryString = params.toString();
    const url = `/partners/${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiService.get<Partner[]>(url);
    return response.data;
  }

  /**
   * Получить партнера по ID
   */
  async getPartner(id: number): Promise<Partner> {
    const response = await apiService.get<Partner>(`/partners/${id}/`);
    return response.data;
  }

  /**
   * Получить все предложения партнеров
   */
  async getOffers(): Promise<PartnerOffer[]> {
    const response = await apiService.get<PartnerOffer[]>('/partners/offers/');
    return response.data;
  }

  /**
   * Получить предложение по ID
   */
  async getOffer(id: number): Promise<PartnerOffer> {
    const response = await apiService.get<PartnerOffer>(`/partners/offers/${id}/`);
    return response.data;
  }

  /**
   * Получить активные предложения
   */
  async getActiveOffers(): Promise<PartnerOffer[]> {
    const response = await apiService.get<PartnerOffer[]>('/partners/offers/active/');
    return response.data;
  }

  /**
   * Получить предложения партнера
   */
  async getPartnerOffers(partnerId: number): Promise<PartnerOffer[]> {
    const response = await apiService.get<PartnerOffer[]>(`/partners/${partnerId}/offers/`);
    return response.data;
  }

  /**
   * Получить категории партнеров
   */
  async getCategories(): Promise<string[]> {
    const response = await apiService.get<string[]>('/partners/categories/');
    return response.data;
  }

  /**
   * Поиск партнеров
   */
  async searchPartners(query: string): Promise<Partner[]> {
    const response = await apiService.get<Partner[]>(`/partners/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export default new PartnerService();

