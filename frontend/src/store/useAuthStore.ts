import create from 'zustand';
import { persist } from 'zustand/middleware';
import AuthService from '../services/auth.service';
import { User, AuthResponse } from '../types/api';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (username: string, password: string) => Promise<void>;
    register: (userData: {
        username: string;
        email: string;
        password: string;
    }) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (username, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await AuthService.login({ username, password });
                    set({
                        user: response.user,
                        accessToken: response.access_token,
                        refreshToken: response.refresh_token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } catch (error: any) {
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: error.message || 'Ошибка входа'
                    });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await AuthService.register(userData);
                    set({
                        user: response.user,
                        accessToken: response.access_token,
                        refreshToken: response.refresh_token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } catch (error: any) {
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: error.message || 'Ошибка регистрации'
                    });
                    throw error;
                }
            },

            logout: () => {
                AuthService.logout();
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                });
            },

            updateUser: (userData) => {
                set(state => ({
                    user: state.user ? { ...state.user, ...userData } : null
                }));
            }
        }),
        {
            name: 'auth-storage', // Имя для localStorage
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);

export default useAuthStore;
