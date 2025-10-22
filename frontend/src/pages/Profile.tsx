import { Link } from 'react-router-dom'
import { useState } from 'react'

const colors = {
  primary: '#021024',
  secondary: '#052659',
  accent: '#5483D3',
  white: '#FFFFFF',
  gray: '#666666',
}

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    paddingBottom: '100px',
  },
  header: {
    padding: '20px',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.white,
  },
  profileSection: {
    padding: '0 20px 24px',
  },
  profileCard: {
    background: colors.white,
    borderRadius: '24px',
    padding: '32px',
    textAlign: 'center' as const,
    marginBottom: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    boxShadow: '0 4px 16px rgba(84, 131, 211, 0.3)',
  },
  userName: {
    fontSize: '22px',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: '4px',
  },
  userPhone: {
    fontSize: '14px',
    color: colors.gray,
  },
  menuSection: {
    padding: '0 20px',
  },
  menuItem: {
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '18px 20px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  menuItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  menuIcon: {
    fontSize: '24px',
  },
  menuText: {
    fontSize: '16px',
    fontWeight: '500',
    color: colors.white,
  },
  menuArrow: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  logoutButton: {
    background: 'rgba(231, 76, 60, 0.1)',
    borderRadius: '16px',
    padding: '18px 20px',
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    border: '1px solid rgba(231, 76, 60, 0.2)',
  },
  logoutText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#E74C3C',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(2, 16, 36, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '12px 20px 20px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    color: 'rgba(255, 255, 255, 0.5)',
    textDecoration: 'none',
    fontSize: '11px',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '12px',
  },
  activeNavItem: {
    color: colors.accent,
    background: 'rgba(84, 131, 211, 0.1)',
  },
  navIcon: {
    fontSize: '22px',
  },
}

export function Profile() {
  const phone = localStorage.getItem('phone') || '+996 700 700 700'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('phone')
    window.location.href = '/login'
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>Профиль</div>
      </div>

      {/* Profile Info */}
      <div style={styles.profileSection}>
        <div style={styles.profileCard}>
          <div style={styles.avatar}>👤</div>
          <div style={styles.userName}>Пользователь</div>
          <div style={styles.userPhone}>{phone}</div>
        </div>
      </div>

      {/* Menu */}
      <div style={styles.menuSection}>
        <Link to="/card" style={styles.menuItem}>
          <div style={styles.menuItemLeft}>
            <div style={styles.menuIcon}>💳</div>
            <div style={styles.menuText}>Моя бонусная карта</div>
          </div>
          <div style={styles.menuArrow}>→</div>
        </Link>

        <div style={styles.menuItem}>
          <div style={styles.menuItemLeft}>
            <div style={styles.menuIcon}>📊</div>
            <div style={styles.menuText}>История транзакций</div>
          </div>
          <div style={styles.menuArrow}>→</div>
        </div>

        <div style={styles.menuItem}>
          <div style={styles.menuItemLeft}>
            <div style={styles.menuIcon}>❤️</div>
            <div style={styles.menuText}>Избранные партнеры</div>
          </div>
          <div style={styles.menuArrow}>→</div>
        </div>

        <div style={styles.menuItem}>
          <div style={styles.menuItemLeft}>
            <div style={styles.menuIcon}>🔔</div>
            <div style={styles.menuText}>Уведомления</div>
          </div>
          <div style={styles.menuArrow}>→</div>
        </div>

        <div style={styles.menuItem}>
          <div style={styles.menuItemLeft}>
            <div style={styles.menuIcon}>⚙️</div>
            <div style={styles.menuText}>Настройки</div>
          </div>
          <div style={styles.menuArrow}>→</div>
        </div>

        <div style={styles.menuItem}>
          <div style={styles.menuItemLeft}>
            <div style={styles.menuIcon}>❓</div>
            <div style={styles.menuText}>Помощь</div>
          </div>
          <div style={styles.menuArrow}>→</div>
        </div>

        <div style={styles.logoutButton} onClick={handleLogout}>
          <div style={styles.menuIcon}>🚪</div>
          <div style={styles.logoutText}>Выйти</div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={styles.bottomNav}>
        <Link to="/" style={styles.navItem}>
          <div style={styles.navIcon}>🏠</div>
          <div>Главная</div>
        </Link>
        <Link to="/partners" style={styles.navItem}>
          <div style={styles.navIcon}>❤️</div>
          <div>Партнеры</div>
        </Link>
        <Link to="/news" style={styles.navItem}>
          <div style={styles.navIcon}>🔔</div>
          <div>Новости</div>
        </Link>
        <Link to="/profile" style={{...styles.navItem, ...styles.activeNavItem}}>
          <div style={styles.navIcon}>⚙️</div>
          <div>Профиль</div>
        </Link>
      </div>
    </div>
  )
}
