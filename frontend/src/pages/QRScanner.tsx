import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

const scanLine = keyframes`
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #00A86B 0%, #26C281 100%);
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
`

const BackButton = styled(Link)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`

const Title = styled.h1`
  flex: 1;
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  text-align: center;
  margin-right: 40px;
`

const ScannerArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`

const ScanFrame = styled.div`
  width: 280px;
  height: 280px;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 32px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00FFB3, transparent);
    animation: ${scanLine} 2s ease-in-out infinite;
    box-shadow: 0 0 10px #00FFB3;
  }
`

const Corner = styled.div<{ $position: string }>`
  position: absolute;
  width: 40px;
  height: 40px;
  border-color: #FFFFFF;
  border-style: solid;
  border-width: 0;

  ${props => {
    switch(props.$position) {
      case 'tl':
        return `
          top: 12px;
          left: 12px;
          border-top-width: 4px;
          border-left-width: 4px;
          border-top-left-radius: 8px;
        `;
      case 'tr':
        return `
          top: 12px;
          right: 12px;
          border-top-width: 4px;
          border-right-width: 4px;
          border-top-right-radius: 8px;
        `;
      case 'bl':
        return `
          bottom: 12px;
          left: 12px;
          border-bottom-width: 4px;
          border-left-width: 4px;
          border-bottom-left-radius: 8px;
        `;
      case 'br':
        return `
          bottom: 12px;
          right: 12px;
          border-bottom-width: 4px;
          border-right-width: 4px;
          border-bottom-right-radius: 8px;
        `;
    }
  }}
`

const Instruction = styled.p`
  font-size: 16px;
  color: #FFFFFF;
  text-align: center;
  margin: 0 0 8px 0;
  font-weight: 600;
`

const SubInstruction = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin: 0 0 32px 0;
  line-height: 1.5;
`

const FlashButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 28px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  margin-bottom: 32px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`

const BottomSection = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`

const AlternativeOptions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`

const OptionButton = styled.button`
  flex: 1;
  padding: 16px;
  background: #FFFFFF;
  border: none;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`

const OptionIcon = styled.div`
  font-size: 32px;
`

const OptionLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #2C3E50;
`

const Hint = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
  line-height: 1.5;
`

export function QRScanner() {
  const navigate = useNavigate()
  const [flashOn, setFlashOn] = useState(false)

  const handleGallery = () => {
    alert('Открыть галерею для выбора QR-кода')
  }

  const handleMyQR = () => {
    navigate('/my-qr')
  }

  return (
    <Container>
      <Header>
        <BackButton to="/dashboard">←</BackButton>
        <Title>Сканировать</Title>
      </Header>

      <ScannerArea>
        <ScanFrame>
          <Corner $position="tl" />
          <Corner $position="tr" />
          <Corner $position="bl" />
          <Corner $position="br" />
        </ScanFrame>

        <Instruction>Сканируйте QR код</Instruction>
        <SubInstruction>
          Отсканируйте чек, чтобы получить<br/>бонусные баллы
        </SubInstruction>

        <FlashButton onClick={() => setFlashOn(!flashOn)}>
          {flashOn ? '🔦' : '⚫'}
        </FlashButton>
      </ScannerArea>

      <BottomSection>
        <AlternativeOptions>
          <OptionButton onClick={handleMyQR}>
            <OptionIcon>🆔</OptionIcon>
            <OptionLabel>Мой QR</OptionLabel>
          </OptionButton>
          <OptionButton onClick={handleGallery}>
            <OptionIcon>🖼️</OptionIcon>
            <OptionLabel>Из Галереи</OptionLabel>
          </OptionButton>
        </AlternativeOptions>

        <Hint>
          Наведите камеру на QR-код партнера<br/>
          для начисления бонусов
        </Hint>
      </BottomSection>
    </Container>
  )
}
