import { Link } from 'react-router-dom'

const colors = {
  primary: '#021024',
  secondary: '#052659',
  accent: '#5483D3',
  accentLight: '#7DA0CA',
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: colors.white,
    fontSize: '24px',
    cursor: 'pointer',
    textDecoration: 'none',
    padding: '8px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.white,
  },
  shareIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    cursor: 'pointer',
  },
  cardContainer: {
    padding: '0 20px',
  },
  bonusCard: {
    background: colors.white,
    borderRadius: '24px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.gray,
    marginBottom: '4px',
    textAlign: 'center' as const,
  },
  bonusAmount: {
    fontSize: '48px',
    fontWeight: '700',
    color: colors.accent,
    textAlign: 'center' as const,
    marginBottom: '8px',
    letterSpacing: '-1px',
  },
  bnplInfo: {
    fontSize: '14px',
    color: colors.gray,
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  qrContainer: {
    background: colors.white,
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    border: `2px dashed ${colors.lightGray}`,
  },
  qrCode: {
    width: '200px',
    height: '200px',
    background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 20px 20px',
    borderRadius: '12px',
  },
  qrNote: {
    fontSize: '13px',
    color: colors.gray,
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  barcode: {
    width: '100%',
    height: '80px',
    background: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 8px, #fff 8px, #fff 10px)',
    borderRadius: '12px',
    marginBottom: '16px',
    border: `1px solid ${colors.lightGray}`,
  },
  cardNumber: {
    fontSize: '18px',
    fontWeight: '700',
    textAlign: 'center' as const,
    color: colors.primary,
    letterSpacing: '2px',
  },
  infoSection: {
    padding: '0 20px',
  },
  infoCard: {
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '12px',
    backdropFilter: 'blur(10px)',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.white,
    marginBottom: '8px',
  },
  infoText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
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

export function BonusCard() {
  const cardNumber = '1234 5678 9012 3456'

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Link to="/" style={styles.backButton}>←</Link>
        <div style={styles.title}>Бонусная карта</div>
        <div style={styles.shareIcon}>⤴</div>
      </div>

      {/* Card */}
      <div style={styles.cardContainer}>
        <div style={styles.bonusCard}>
          <div style={styles.cardTitle}>Ваш баланс</div>
          <div style={styles.bonusAmount}>0.00</div>
          <div style={styles.bnplInfo}>Лимит BNPL: 1200 сом</div>

          <div style={styles.qrContainer}>
            <div style={styles.qrCode}></div>
          </div>
          <div style={styles.qrNote}>
            Покажите QR-код на кассе для начисления или списания бонусов
          </div>

          <div style={styles.barcode}></div>
          <div style={styles.cardNumber}>{cardNumber}</div>
        </div>
      </div>

      {/* Info */}
      <div style={styles.infoSection}>
        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>💰 Как накопить бонусы?</div>
          <div style={styles.infoText}>
            Совершайте покупки у партнеров и получайте до 10% бонусов от суммы чека
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>🎁 Как потратить?</div>
          <div style={styles.infoText}>
            Оплачивайте бонусами до 50% стоимости покупки у любого партнера
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>📱 BNPL - Купи сейчас, плати потом</div>
          <div style={styles.infoText}>
            Ваш лимит 1200 сом. Покупайте в рассрочку без процентов до 4 месяцев
          </div>
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
        <Link to="/profile" style={styles.navItem}>
          <div style={styles.navIcon}>⚙️</div>
          <div>Профиль</div>
        </Link>
      </div>
    </div>
  )
}
