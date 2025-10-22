interface AppConfig {
  API_BASE_URL: string;
  APP_VERSION: string;
  ENVIRONMENT: 'development' | 'production' | 'staging';
  FEATURE_FLAGS: {
    ENABLE_ACHIEVEMENTS: boolean;
    ENABLE_QUESTS: boolean;
    ENABLE_PERFORMANCE_MONITORING: boolean;
  };
}

export const APP_CONFIG: AppConfig = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.bonus-app.com',
  APP_VERSION: '1.0.0',
  ENVIRONMENT: (process.env.NODE_ENV as AppConfig['ENVIRONMENT']) || 'development',
  FEATURE_FLAGS: {
    ENABLE_ACHIEVEMENTS: true,
    ENABLE_QUESTS: true,
    ENABLE_PERFORMANCE_MONITORING: true
  }
};
