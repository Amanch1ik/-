import React, { createContext, useState, useContext } from 'react';

// Типы для состояния пользователя
interface User {
  id: number;
  username: string;
  email: string;
  bonusPoints: number;
}

// Интерфейс контекста
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Создаем контекст
const AppContext = createContext<AppContextType | undefined>(undefined);

// Провайдер для управления глобальным состоянием
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Функция входа (заглушка, позже заменить на реальную логику)
  const login = async (username: string, password: string): Promise<boolean> => {
    // TODO: Реальная логика аутентификации
    if (username === 'demo' && password === 'password') {
      const mockUser: User = {
        id: 1,
        username: 'demo',
        email: 'demo@bonusapp.com',
        bonusPoints: 1000
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  // Функция выхода
  const logout = () => {
    setUser(null);
  };

  // Проверка аутентификации
  const isAuthenticated = user !== null;

  return (
    <AppContext.Provider 
      value={{ 
        user, 
        setUser, 
        isAuthenticated, 
        login, 
        logout 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Хук для использования глобального состояния
export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within a StoreProvider');
  }
  return context;
};
