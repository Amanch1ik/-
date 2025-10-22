import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPartner, getPartnerReviews, toggleFavorite, PartnerDetail as PartnerDetailType, Review } from '@/lib/api'

const colors = {
  primary: '#021024',
  secondary: '#052659',
  accent: '#5483D3',
  white: '#FFFFFF',
  gray: '#666666',
  yellow: '#FFC107',
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
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  iconButton: {
    width: '40px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    cursor: 'pointer',
    border: 'none',
  },
  heroSection: {
    padding: '0 20px 24px',
  },
  heroCard: {
    background: colors.white,
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
  partnerLogo: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    boxShadow: '0 4px 16px rgba(84, 131, 211, 0.3)',
  },
  partnerName: {
    fontSize: '24px',
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center' as const,
    marginBottom: '8px',
  },
  ratingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  stars: {
    fontSize: '20px',
  },
  ratingText: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.primary,
  },
  reviewsCount: {
    fontSize: '13px',
    color: colors.gray,
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  statItem: {
    flex: 1,
    textAlign: 'center' as const,
    padding: '16px',
    background: `${colors.accent}08`,
    borderRadius: '12px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.accent,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: colors.gray,
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    flex: 1,
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '14px',
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
    border: `1px solid ${colors.accent}40`,
  },
  infoSection: {
    padding: '0 20px 24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: colors.white,
    marginBottom: '16px',
  },
  infoCard: {
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '12px',
    backdropFilter: 'blur(10px)',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  infoLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.white,
  },
  reviewsSection: {
    padding: '0 20px',
  },
  reviewCard: {
    background: colors.white,
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  reviewAuthor: {
    fontSize: '15px',
    fontWeight: '600',
    color: colors.primary,
  },
  reviewRating: {
    fontSize: '16px',
  },
  reviewText: {
    fontSize: '14px',
    color: colors.gray,
    lineHeight: '1.6',
    marginBottom: '8px',
  },
  reviewDate: {
    fontSize: '12px',
    color: colors.gray,
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

export function PartnerDetail() {
  const { id } = useParams()
  const [partner, setPartner] = useState<PartnerDetailType | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!id) return
      
      setLoading(true)
      try {
        const [partnerData, reviewsData] = await Promise.all([
          getPartner(Number(id)),
          getPartnerReviews(Number(id)),
        ])
        setPartner(partnerData)
        setReviews(reviewsData)
      } catch (error) {
        console.error('Failed to load partner details:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleToggleFavorite = async () => {
    if (!id || !partner) return
    
    try {
      const res = await toggleFavorite(Number(id))
      setPartner({...partner, is_favorite: res.favorite})
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{textAlign: 'center', padding: '40px', color: colors.white}}>
          Загрузка...
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div style={styles.container}>
        <div style={{textAlign: 'center', padding: '40px', color: colors.white}}>
          Партнер не найден
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Link to="/partners" style={styles.backButton}>←</Link>
        <div style={styles.headerActions}>
          <button style={styles.iconButton} onClick={handleToggleFavorite}>
            {partner.is_favorite ? '❤️' : '🤍'}
          </button>
          <div style={styles.iconButton}>⤴</div>
        </div>
      </div>

      {/* Hero */}
      <div style={styles.heroSection}>
        <div style={styles.heroCard}>
          <div style={styles.partnerLogo}>
            {partner.name === 'KFC' ? '🍗' : 
             partner.name === 'Domino\'s Pizza' ? '🍕' :
             partner.name === 'Zora' ? '👕' :
             partner.name === 'Sulpak' ? '📱' :
             partner.name === 'VitaMag' ? '💊' : '🏪'}
          </div>
          <div style={styles.partnerName}>{partner.name}</div>
          
          <div style={styles.ratingContainer}>
            <div style={styles.stars}>{'⭐'.repeat(Math.floor(partner.rating))}</div>
            <div style={styles.ratingText}>{partner.rating.toFixed(1)}</div>
            <div style={styles.reviewsCount}>({reviews.length} отзывов)</div>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{partner.branches}</div>
              <div style={styles.statLabel}>филиала</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{partner.nearest_km} км</div>
              <div style={styles.statLabel}>ближайший</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>5%</div>
              <div style={styles.statLabel}>кэшбэк</div>
            </div>
          </div>

          <div style={styles.actionButtons}>
            <button style={{...styles.button, ...styles.primaryButton}}>
              📞 Позвонить
            </button>
            <button style={{...styles.button, ...styles.secondaryButton}}>
              🗺️ Маршрут
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={styles.infoSection}>
        <div style={styles.sectionTitle}>Информация</div>
        <div style={styles.infoCard}>
          {partner.phone && (
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>Телефон</div>
              <div style={styles.infoValue}>{partner.phone}</div>
            </div>
          )}
          {partner.website && (
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>Сайт</div>
              <div style={styles.infoValue}>{partner.website}</div>
            </div>
          )}
          {partner.description && (
            <div style={{...styles.infoRow, marginBottom: 0, flexDirection: 'column', alignItems: 'flex-start', gap: '8px'}}>
              <div style={styles.infoLabel}>Описание</div>
              <div style={styles.infoValue}>{partner.description}</div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div style={styles.reviewsSection}>
        <div style={styles.sectionTitle}>Отзывы ({reviews.length})</div>
        {reviews.length === 0 ? (
          <div style={{textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', padding: '20px'}}>
            Пока нет отзывов
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewAuthor}>{review.author}</div>
                <div style={styles.reviewRating}>{'⭐'.repeat(review.rating)}</div>
              </div>
              <div style={styles.reviewText}>{review.text}</div>
              <div style={styles.reviewDate}>
                {new Date(review.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={styles.bottomNav}>
        <Link to="/" style={styles.navItem}>
          <div style={styles.navIcon}>🏠</div>
          <div>Главная</div>
        </Link>
        <Link to="/partners" style={{...styles.navItem, ...styles.activeNavItem}}>
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
