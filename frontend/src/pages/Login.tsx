import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { requestOtp, verifyOtp } from '@/lib/api'

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #00A86B 0%, #26C281 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Card = styled.div`
  background: #FFFFFF;
  border-radius: 32px;
  padding: 40px 32px;
  width: 100%
;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: ${slideUp} 0.5s ease-out;
`

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  background: #F5F5F5;
  padding: 6px;
  border-radius: 16px;
`

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  background: ${props => props.$active ? '#FFFFFF' : 'transparent'};
  color: ${props => props.$active ? '#2C3E50' : '#7F8C8D'};
  font-size: 15px;
  font-weight: ${props => props.$active ? '700' : '500'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none'};

  &:hover {
    background: ${props => props.$active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'};
  }
`

const InputGroup = styled.div`
  margin-bottom: 20px;
`

const Label = styled.label`
  font-size: 13px;
  color: #7F8C8D;
  margin-bottom: 8px;
  font-weight: 500;
  display: block;
`

const Input = styled.input<{ $hasIcon?: boolean }>`
  width: 100%;
  padding: 16px 18px;
  padding-right: ${props => props.$hasIcon ? '48px' : '18px'};
  border: 2px solid #E8F5F0;
  border-radius: 14px;
  fontSize: 16px;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
  background: #F8FDFB;

  &:focus {
    border-color: #00A86B;
    background: #FFFFFF;
    box-shadow: 0 0 0 4px rgba(0, 168, 107, 0.1);
  }

  &::placeholder {
    color: #BDC3C7;
  }

  &:disabled {
    background: #F5F5F5;
    cursor: not-allowed;
  }
`

const InputWrapper = styled.div`
  position: relative;
`

const InputIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #7F8C8D;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #00A86B;
  }
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 16px;
  background: ${props => props.$variant === 'secondary'
    ? 'transparent'
    : 'linear-gradient(135deg, #00A86B 0%, #26C281 100%)'};
  color: ${props => props.$variant === 'secondary' ? '#00A86B' : '#FFFFFF'};
  border: ${props => props.$variant === 'secondary' ? '2px solid #00A86B' : 'none'};
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: ${props => props.$variant === 'secondary'
    ? 'none'
    : '0 8px 20px rgba(0, 168, 107, 0.25)'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.$variant === 'secondary'
      ? '0 4px 12px rgba(0, 168, 107, 0.15)'
      : '0 12px 28px rgba(0, 168, 107, 0.35)'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const Message = styled.div<{ $type: 'error' | 'success' }>`
  color: ${props => props.$type === 'error' ? '#E74C3C' : '#00A86B'};
  font-size: 13px;
  text-align: center;
  margin-top: 16px;
  padding: 12px;
  background: ${props => props.$type === 'error' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(0, 168, 107, 0.1)'};
  border-radius: 12px;
  font-weight: 500;
  animation: ${slideUp} 0.3s ease-out;
`

const Note = styled.p`
  font-size: 12px;
  color: #7F8C8D;
  text-align: center;
  margin-top: 12px;
  line-height: 1.5;
`

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: #00A86B;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  width: 100%;
  text-align: center;
  padding: 8px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`

const GoogleButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #FFFFFF;
  border: 2px solid #E0E0E0;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #2C3E50;
  cursor: pointer;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00A86B;
    background: rgba(0, 168, 107, 0.05);
  }
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: #BDC3C7;
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #E0E0E0;
  }
`

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0;
  cursor: pointer;
  font-size: 14px;
  color: #7F8C8D;
`

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid #E0E0E0;
  cursor: pointer;
  accent-color: #00A86B;
`

export function Login() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) {
      setError('Заполните все поля')
      return
    }

    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSuccess('Вход выполнен успешно!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (e) {
      setError('Неверный email или пароль')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    if (!name || !surname || !email || !password) {
      setError('Заполните все поля')
      return
    }

    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSuccess('Регистрация успешна!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (e) {
      setError('Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Card>
        <Tabs>
          <Tab $active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
            ВХОД
          </Tab>
          <Tab $active={activeTab === 'register'} onClick={() => setActiveTab('register')}>
            РЕГИСТРАЦИЯ
          </Tab>
        </Tabs>

        {activeTab === 'login' ? (
          <>
            <InputGroup>
              <Label>E-mail</Label>
              <InputWrapper>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sofia@gmail.com"
                  $hasIcon
                />
                <InputIcon>👤</InputIcon>
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Пароль</Label>
              <InputWrapper>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  $hasIcon
                />
                <InputIcon onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </InputIcon>
              </InputWrapper>
            </InputGroup>

            <CheckboxWrapper>
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Запомнить меня</span>
            </CheckboxWrapper>

            <Button onClick={handleLogin} disabled={loading}>
              {loading ? 'Входим...' : 'ВОЙТИ'}
            </Button>

            <ForgotPassword onClick={() => alert('Функция восстановления пароля')}>
              Забыли пароль?
            </ForgotPassword>

            <Divider>или</Divider>

            <GoogleButton onClick={() => alert('Google OAuth')}>
              <span style={{ fontSize: '20px' }}>G</span>
              Продолжить с Google
            </GoogleButton>
          </>
        ) : (
          <>
            <InputGroup>
              <Label>Имя</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Актан"
              />
            </InputGroup>

            <InputGroup>
              <Label>Фамилия</Label>
              <Input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Жакиев"
              />
            </InputGroup>

            <InputGroup>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Jakievaktan@gmail.com"
              />
            </InputGroup>

            <InputGroup>
              <Label>Пароль</Label>
              <InputWrapper>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  $hasIcon
                />
                <InputIcon onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </InputIcon>
              </InputWrapper>
            </InputGroup>

            <Button onClick={handleRegister} disabled={loading}>
              {loading ? 'Регистрируем...' : 'РЕГИСТРАЦИЯ'}
            </Button>

            <Divider>или</Divider>

            <GoogleButton onClick={() => alert('Google OAuth')}>
              <span style={{ fontSize: '20px' }}>G</span>
              Продолжить с Google
            </GoogleButton>
          </>
        )}

        {success && <Message $type="success">✓ {success}</Message>}
        {error && <Message $type="error">✕ {error}</Message>}
      </Card>
    </Container>
  )
}
