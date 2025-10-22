import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestOtp, verifyOtp } from '@/lib/api'

const colors = {
  primary: '#021024',
  secondary: '#052659',
  accent: '#5483D3',
  accentLight: '#7DA0CA',
  white: '#FFFFFF',
  gray: '#666666',
  error: '#E74C3C',
  success: '#27AE60',
}

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: colors.white,
    borderRadius: '28px',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center' as const,
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: colors.gray,
    textAlign: 'center' as const,
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '13px',
    color: colors.primary,
    marginBottom: '8px',
    fontWeight: '600',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '16px 18px',
    border: `2px solid ${colors.accentLight}20`,
    borderRadius: '14px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  inputFocus: {
    borderColor: colors.accent,
    boxShadow: `0 0 0 4px ${colors.accent}10`,
  },
  button: {
    width: '100%',
    padding: '16px',
    background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
    color: colors.white,
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 8px 20px rgba(84, 131, 211, 0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(84, 131, 211, 0.4)',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none',
  },
  error: {
    color: colors.error,
    fontSize: '13px',
    textAlign: 'center' as const,
    marginTop: '16px',
    padding: '12px',
    background: `${colors.error}10`,
    borderRadius: '10px',
    fontWeight: '500',
  },
  success: {
    color: colors.success,
    fontSize: '13px',
    textAlign: 'center' as const,
    marginTop: '16px',
    padding: '12px',
    background: `${colors.success}10`,
    borderRadius: '10px',
    fontWeight: '500',
  },
  codeNote: {
    fontSize: '12px',
    color: colors.gray,
    textAlign: 'center' as const,
    marginTop: '12px',
    lineHeight: '1.5',
  },
  loadingDots: {
    display: 'inline-block',
    animation: 'dots 1.5s infinite',
  },
}

export function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('+996 ')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  async function onSend() {
    if (phone.length < 10) {
      setError('Введите корректный номер телефона')
      return
    }
    
    setError(null)
    setLoading(true)
    try {
      await requestOtp(phone)
      setSent(true)
    } catch (e) {
      setError('Не удалось отправить код. Попробуйте снова')
    } finally {
      setLoading(false)
    }
  }

  async function onVerify() {
    setError(null)
    setLoading(true)
    try {
      const data = await verifyOtp(phone, code)
      setToken(data.access_token)
      localStorage.setItem('token', data.access_token)
      
      // Успешный вход - переход на главную
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (e) {
      setError('Неверный код. Попробуйте еще раз')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Добро пожаловать в YESS</h1>
        <p style={styles.subtitle}>
          {sent ? 'Введите код из SMS' : 'Введите номер телефона для входа'}
        </p>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Номер телефона</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={() => setFocusedInput('phone')}
            onBlur={() => setFocusedInput(null)}
            style={{
              ...styles.input,
              ...(focusedInput === 'phone' ? styles.inputFocus : {}),
            }}
            placeholder="+996 700 700 700"
            disabled={sent}
          />
        </div>

        {!sent ? (
          <>
            <button 
              onClick={onSend} 
              style={styles.button}
              disabled={loading || phone.length < 10}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? 'Отправляем...' : 'Получить код'}
            </button>
            <p style={styles.codeNote}>
              Мы отправим SMS с кодом подтверждения на ваш номер
            </p>
          </>
        ) : (
          <div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Код подтверждения</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onFocus={() => setFocusedInput('code')}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...styles.input,
                  ...(focusedInput === 'code' ? styles.inputFocus : {}),
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: '700',
                  letterSpacing: '8px',
                }}
                placeholder="••••"
                maxLength={4}
                autoFocus
              />
            </div>
            <button 
              onClick={onVerify} 
              style={styles.button}
              disabled={loading || code.length !== 4}
              onMouseEnter={(e) => !loading && code.length === 4 && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? 'Проверяем...' : 'Войти'}
            </button>
            <p style={styles.codeNote}>
              Код отправлен на номер {phone}<br/>
              Для теста используйте код: 1234
            </p>
          </div>
        )}

        {token && (
          <div style={styles.success}>
            ✓ Вход выполнен успешно! Перенаправление...
          </div>
        )}
        
        {error && <div style={styles.error}>✕ {error}</div>}
      </div>
    </div>
  )
}