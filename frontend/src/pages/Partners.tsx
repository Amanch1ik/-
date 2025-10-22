import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listPartners, toggleFavorite, Partner } from '@/lib/api'

const colors = {
  primary: '#021024',
  secondary: '#052659',
  accent: '#5483D3',
  accentLight: '#7DA0CA',
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
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: colors.white,
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    textDecoration: 'none',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.white,
  },
  settingsIcon: {
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
  searchSection: {
    padding: '16px 20px',
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
  categoriesSection: {
    padding: '0 20px 20px',
  },
  categoriesTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '16px',
    color: colors.white,
  },
  categoryRow: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  categoryItem: {
    minWidth: '90px',
    padding: '12px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.2s',
  },
  categoryIcon: {
    fontSize: '28px',
  },
  categoryLabel: {
    fontSize: '11px',
    textAlign: 'center' as const,
    color: colors.white,
    fontWeight: '500',
    lineHeight: '1.2',
  },
  filterSection: {
    display: 'flex',
    gap: '12px',
    padding: '0 20px 20px',
  },
  filterButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: colors.white,
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  mapContainer: {
    margin: '0 20px 20px',
    height: '180px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  partnersList: {
    padding: '0 20px',
  },
  partnersCount: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '16px',
    color: colors.white,
  },
  partnerCard: {
    background: colors.white,
    borderRadius: '20px',
    padding: '18px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: '18px',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: '6px',
  },
  partnerDetails: {
    fontSize: '13px',
    color: colors.gray,
  },
  favoriteButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'transform 0.2s',
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
    transition: 'all 0.2s',
  },
  activeNavItem: {
    color: colors.accent,
    background: 'rgba(84, 131, 211, 0.1)',
  },
  navIcon: {
    fontSize: '22px',
  },
  loadingText: {
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.5)',
    padding: '40px 20px',
    fontSize: '15px',
  },
}

export function Partners() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const data = await listPartners(q)
      setItems(data)
    } catch (error) {
      console.error('Failed to load partners:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Link to="/" style={styles.backButton}>←</Link>
        <div style={styles.title}>Наши партнеры</div>
        <div style={styles.settingsIcon}>⚙️</div>
      </div>

      {/* Search */}
      <div style={styles.searchSection}>
        <input
          type="text"
          placeholder="Поиск"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && load()}
          style={styles.searchInput}
        />
      </div>

      {/* Categories */}
      <div style={styles.categoriesSection}>
        <div style={styles.categoriesTitle}>Категории</div>
        <div style={styles.categoryRow}>
          <div style={styles.categoryItem}>
            <div style={styles.categoryIcon}>🍔</div>
            <div style={styles.categoryLabel}>Еда</div>
          </div>
          <div style={styles.categoryItem}>
            <div style={styles.categoryIcon}>👕</div>
            <div style={styles.categoryLabel}>Одежда</div>
          </div>
          <div style={styles.categoryItem}>
            <div style={styles.categoryIcon}>💄</div>
            <div style={styles.categoryLabel}>Красота</div>
          </div>
          <div style={styles.categoryItem}>
            <div style={styles.categoryIcon}>👶</div>
            <div style={styles.categoryLabel}>Для детей</div>
          </div>
          <div style={styles.categoryItem}>
            <div style={styles.categoryIcon}>🏥</div>
            <div style={styles.categoryLabel}>Здоровье</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterSection}>
        <button style={styles.filterButton}>
          Сортировать ▼
        </button>
        <button style={styles.filterButton}>
          Фильтр ▼
        </button>
      </div>

      {/* Map */}
      <div style={styles.mapContainer}>
        🗺️ Карта партнеров
      </div>

      {/* Partners List */}
      <div style={styles.partnersList}>
        <div style={styles.partnersCount}>{items.length} партнеров:</div>
        
        {loading ? (
          <div style={styles.loadingText}>
            Загрузка партнеров...
          </div>
        ) : items.length === 0 ? (
          <div style={styles.loadingText}>
            Партнеры не найдены
          </div>
        ) : (
          items.map((partner) => (
            <Link
              key={partner.id}
              to={`/partners/${partner.id}`}
              style={{textDecoration: 'none'}}
            >
              <div 
                style={styles.partnerCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)'
                }}
              >
                <div style={styles.partnerInfo}>
                  <div style={styles.partnerName}>{partner.name}</div>
                  <div style={styles.partnerDetails}>
                    Филиалов: {partner.branches} • Ближайший: {partner.nearest_km} km
                  </div>
                </div>
                <button
                  style={styles.favoriteButton}
                  onClick={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    try {
                      const res = await toggleFavorite(partner.id)
                      setItems((cur) => cur.map((it) => 
                        it.id === partner.id ? { ...it, is_favorite: res.favorite } : it
                      ))
                    } catch (error) {
                      console.error('Failed to toggle favorite:', error)
                    }
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {partner.is_favorite ? '❤️' : '🤍'}
                </button>
              </div>
            </Link>
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