import axios from 'axios';
import { 
    UserProfileResponse, 
    BonusInDB, 
    TransactionInDB 
} from '../types/api';

class DashboardService {
    private apiUrl = '/api/users';

    async getUserProfile(): Promise<UserProfileResponse> {
        try {
            const response = await axios.get(`${this.apiUrl}/profile`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    async getAvailableBonuses(): Promise<BonusInDB[]> {
        try {
            const response = await axios.get(`${this.apiUrl}/bonuses`);
            return response.data;
        } catch (error) {
            console.error('Error fetching available bonuses:', error);
            throw error;
        }
    }

    async redeemBonus(bonusId: number): Promise<any> {
        try {
            const response = await axios.post(`${this.apiUrl}/bonuses/redeem/${bonusId}`);
            return response.data;
        } catch (error) {
            console.error('Error redeeming bonus:', error);
            throw error;
        }
    }

    async getUserTransactions(limit: number = 50, offset: number = 0): Promise<TransactionInDB[]> {
        try {
            const response = await axios.get(`${this.apiUrl}/transactions`, {
                params: { limit, offset }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user transactions:', error);
            throw error;
        }
    }

    async updateUserProfile(profileData: any): Promise<any> {
        try {
            const response = await axios.put(`${this.apiUrl}/profile`, profileData);
            return response.data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }
}

export default new DashboardService();
