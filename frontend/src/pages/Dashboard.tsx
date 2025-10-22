import { useState } from 'react'
import { Link } from 'react-router-dom'

// Цвета из дизайна YESS
const colors = {
  primary: '#021024',
  primaryDark: '#010812',
  secondary: '#052659',
  accent: '#5483D3',
  accentLight: '#7DA0CA',
  accentLighter: '#C1E8FF',
  white: '#FFFFFF',
  gray: '#666666',
  lightGray: '#E0E0E0',
}

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    paddingBottom: '100px',
  },
  header: {
    padding: '20px 20px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '28px',
    fontWeight: '700',
    color: colors.white,
    letterSpacing: '-0.5px',
  },
  notificationIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
  },
  bonusCard: {
    margin: '0 20px 20px',
    background: colors.white,
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
  bonusTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.gray,
    marginBottom: '4px',
  },
  bonusAmount: {
    fontSize: '40px',
    fontWeight: '700',
    color: colors.accent,
    marginBottom: '2px',
    letterSpacing: '-1px',
  },
  bnplLimit: {
    fontSize: '13px',
    color: colors.gray,
    marginBottom: '20px',
  },
  barcode: {
    width: '100%',
    height: '70px',
    background: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 8px, #fff 8px, #fff 10px)',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid ' + colors.lightGray,
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    flex: 1,
    padding: '14px 16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  primaryButton: {
    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
    color: colors.white,
    boxShadow: '0 4px 12px rgba(84, 131, 211, 0.3)',
  },
  secondaryButton: {
    background: 'rgba(84, 131, 211, 0.08)',
    color: colors.accent,
    border: `1px solid ${colors.accentLighter}`,
  },
  searchSection: {
    padding: '0 20px 20px',
  },
  searchInput: {
    width: '100%',
    padding: '14px 16px 14px 44px',
    borderRadius: '16px',
    border: 'none',
    fontSize: '15px',
    background: 'rgba(255, 255, 255, 0.08)',
    color: colors.white,
    backdropFilter: 'blur(10px)',
    outline: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgba(255,255,255,0.5)\' stroke-width=\'2\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'/%3E%3Cpath d=\'m21 21-4.35-4.35\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '16px center',
    backgroundSize: '18px 18px',
  },
  partnersSection: {
    padding: '0 20px 20px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '16px',
    color: colors.white,
  },
  categoryRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '8px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  categoryItem: {
    minWidth: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '24px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  newsSection: {
    padding: '0 20px',
  },
  newsCard: {
    background: colors.white,
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  },
  newsTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '6px',
    color: colors.primary,
  },
  newsDescription: {
    fontSize: '14px',
    color: colors.gray,
    marginBottom: '12px',
  },
  discountTag: {
    display: 'inline-block',
    background: '#E74C3C',
    color: colors.white,
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.5px',
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
    transition: 'all 0.2s ease',
  },
  activeNavItem: {
    color: colors.accent,
    background: 'rgba(84, 131, 211, 0.1)',
  },
  navIcon: {
    fontSize: '22px',
  },
}

export function Dashboard() {
  const [activeTab] = useState('home')

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>Yess!</div>
        <div style={styles.notificationIcon}>🔔</div>
      </div>

      {/* Bonus Card */}
      <Link to="/card" style={{textDecoration: 'none'}}>
        <div style={styles.bonusCard}>
          <div style={styles.bonusTitle}>Бонусные баллы</div>
          <div style={styles.bonusAmount}>0.00</div>
          <div style={styles.bnplLimit}>Лимит BNPL: 1200</div>
          <div style={styles.barcode}></div>
          
          <div style={styles.actionButtons}>
            <button style={{...styles.button, ...styles.primaryButton}}>
              <span>📱</span>
              <span>Сканировать чек</span>
            </button>
            <button style={{...styles.button, ...styles.secondaryButton}}>
              <span>💰</span>
              <span>Оплатить</span>
            </button>
          </div>
        </div>
      </Link>

      {/* Search */}
      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="Поиск"
          style={styles.searchInput}
        />
      </div>

      {/* Partners */}
      <div style={styles.partnersSection}>
        <div style={styles.sectionTitle}>Партнеры</div>
        <div style={styles.categoryRow}>
          <div style={styles.categoryItem}>🏠</div>
          <div style={styles.categoryItem}>❤️</div>
          <div style={styles.categoryItem}>☕</div>
          <div style={styles.categoryItem}>🛍️</div>
          <div style={styles.categoryItem}>✨</div>
        </div>
      </div>

      {/* News */}
      <div style={styles.newsSection}>
        <div style={styles.sectionTitle}>Новинки этой недели</div>
        
        <div style={styles.newsCard}>
          <div style={styles.newsTitle}>ПИЦЦА</div>
          <div style={styles.newsDescription}>Свежая пицца каждый день с доставкой</div>
          <div style={styles.discountTag}>СКИДКА 40%</div>
        </div>

        <div style={styles.newsCard}>
          <div style={styles.newsTitle}>MEGA SALE</div>
          <div style={styles.newsDescription}>Большие скидки на все товары в магазинах</div>
          <div style={styles.discountTag}>ДО -50%</div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={styles.bottomNav}>
        <Link to="/" style={{...styles.navItem, ...(activeTab === 'home' ? styles.activeNavItem : {})}}>
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
        <Link to="/profile" style={styles.navItem}>
          <div style={styles.navIcon}>⚙️</div>
          <div>Профиль</div>
        </Link>
      </div>
    </div>
  )
}