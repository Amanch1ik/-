import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

const fadeOut = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.95);
  }
`

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`

const Container = styled.div<{ $fadeOut: boolean }>`
  min-height: 100vh;
  background: linear-gradient(180deg, #00A86B 0%, #26C281 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${props => props.$fadeOut ? fadeOut : 'none'} 0.5s ease-out;
`

const Content = styled.div<{ $show: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  opacity: ${props => props.$show ? 1 : 0};
  animation: ${props => props.$show ? fadeIn : 'none'} 0.8s ease-out;
`

const WelcomeText = styled.div`
  font-size: 24px;
  font-weight: 400;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
`

const LogoContainer = styled.div<{ $pulse: boolean }>`
  animation: ${props => props.$pulse ? pulse : 'none'} 2s ease-in-out infinite;
`

const Logo = styled.div`
  font-size: 72px;
  font-weight: 700;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  letter-spacing: -2px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`

export function SplashScreen() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [fadeOutScreen, setFadeOutScreen] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 100)

    const timer = setTimeout(() => {
      setFadeOutScreen(true)
      setTimeout(() => {
        navigate('/login')
      }, 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <Container $fadeOut={fadeOutScreen}>
      <Content $show={show}>
        <WelcomeText>Добро пожаловать в</WelcomeText>
        <LogoContainer $pulse={show}>
          <Logo>Yess!</Logo>
        </LogoContainer>
      </Content>
    </Container>
  )
}
