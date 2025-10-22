import React, { lazy, Suspense } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import AuthService from '../services/auth.service';
import LoadingScreen from '../components/common/LoadingScreen';
import Layout from '../components/layout/Layout';

// Ленивая загрузка компонентов
const LoginPage = lazy(() => import('../pages/auth/Login'));
const RegisterPage = lazy(() => import('../pages/auth/Register'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Transactions = lazy(() => import('../pages/dashboard/Transactions'));
const ProfilePage = lazy(() => import('../pages/dashboard/Profile'));
const BonusesPage = lazy(() => import('../pages/dashboard/Bonuses'));
const PartnersPage = lazy(() => import('../pages/dashboard/Partners'));

// Компонент защищенного маршрута
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  return isAuthenticated ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

// Компонент публичного маршрута
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Публичные маршруты */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />

          {/* Защищенные маршруты */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/bonuses" 
            element={
              <PrivateRoute>
                <BonusesPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/partners" 
            element={
              <PrivateRoute>
                <PartnersPage />
              </PrivateRoute>
            } 
          />

          {/* Редирект по умолчанию */}
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
