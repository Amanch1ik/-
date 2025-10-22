export function BottomNav() {
  const barStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    background: '#f2f4f7',
    borderTop: '1px solid #e5e7eb'
  }
  return (
    <div style={barStyle}>
      <span>🏠</span>
      <span>❤️</span>
      <span>🔔</span>
      <span>⚙️</span>
    </div>
  )
}
