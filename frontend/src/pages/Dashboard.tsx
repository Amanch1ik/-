import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #00A86B 0%, #26C281 100%);
  padding-bottom: 100px;
`

const Header = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #FFFFFF;
`

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
`

const UserDetails = styled.div`
  h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 2px 0;
  }
  p {
    font-size: 13px;
    opacity: 0.8;
    margin: 0;
  }
`

const NotificationIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.25);
  }

  &::after {
    content: '';
    position: absolute;
    top: 12px;
    right: 12px;
    width: 8px;
    height: 8px;
    background: #FF4757;
    border-radius: 50%;
    border: 2px solid #00A86B;
  }
`

const BalanceCard = styled(Link)`
  margin: 0 20px 24px;
  background: #FFFFFF;
  border-radius: 24px;
  padding: 24px;
  text-decoration: none;
  display: block;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  animation: ${fadeInUp} 0.6s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: backwards;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`

const BalanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`

const BalanceInfo = styled.div`
  flex: 1;
`

const BalanceLabel = styled.div`
  font-size: 14px;
  color: #7F8C8D;
  margin-bottom: 8px;
  font-weight: 500;
`

const BalanceAmount = styled.div`
  font-size: 42px;
  font-weight: 800;
  color: #00A86B;
  letter-spacing: -1px;
  line-height: 1;
  margin-bottom: 4px;

  span {
    font-size: 24px;
    font-weight: 600;
    margin-left: 4px;
  }
`

const LevelBadge = styled.div`
  background: linear-gradient(135deg, #FFB84D 0%, #FFC876 100%);
  color: #FFFFFF;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(255, 184, 77, 0.3);
  animation: ${float} 3s ease-in-out infinite;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 14px;
  border-radius: 16px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #00A86B 0%, #26C281 100%);
    color: #FFFFFF;
    box-shadow: 0 4px 12px rgba(0, 168, 107, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 168, 107, 0.4);
    }
  ` : `
    background: rgba(0, 168, 107, 0.1);
    color: #00A86B;
    border: 2px solid rgba(0, 168, 107, 0.2);

    &:hover {
      background: rgba(0, 168, 107, 0.15);
      border-color: rgba(0, 168, 107, 0.3);
    }
  `}

  &:active {
    transform: scale(0.98);
  }
`

const Section = styled.div<{ $delay?: number }>`
  padding: 0 20px 24px;
  animation: ${fadeInUp} 0.6s ease-out;
  animation-delay: ${props => props.$delay || 0}s;
  animation-fill-mode: backwards;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
`

const SectionLink = styled(Link)`
  font-size: 14px;
  color: #FFFFFF;
  text-decoration: none;
  font-weight: 600;
  opacity: 0.9;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`

const CategoryScroll = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const CategoryCard = styled(Link)`
  min-width: 120px;
  height: 140px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`

const CategoryIcon = styled.div`
  font-size: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`

const CategoryLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  text-align: center;
  line-height: 1.3;
`

const PromoCard = styled(Link)`
  background: #FFFFFF;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;
  text-decoration: none;
  display: block;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
`

const PromoImage = styled.div<{ $color: string }>`
  height: 160px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shimmer} 3s infinite;
  }
`

const PromoContent = styled.div`
  padding: 16px;
`

const PromoTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 6px 0;
`

const PromoDescription = styled.p`
  font-size: 13px;
  color: #7F8C8D;
  margin: 0 0 12px 0;
  line-height: 1.5;
`

const PromoDiscount = styled.div`
  display: inline-block;
  background: #E74C3C;
  color: #FFFFFF;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
`

const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 168, 107, 0.98);
  backdrop-filter: blur(20px);
  padding: 12px 20px 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
`

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: ${props => props.$active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'};
  text-decoration: none;
  font-size: 11px;
  font-weight: ${props => props.$active ? '700' : '500'};
  padding: 8px 12px;
  border-radius: 12px;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  transition: all 0.3s ease;
  min-width: 64px;

  &:hover {
    color: #FFFFFF;
    background: rgba(255, 255, 255, 0.1);
  }
`

const NavIcon = styled.div`
  font-size: 24px;
`

const QRButton = styled(Link)`
  width: 56px;
  height: 56px;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  margin-top: -28px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1) rotate(90deg);
  }

  &:active {
    transform: scale(0.95);
  }
`

export function Dashboard() {
  const [activeTab] = useState('home')

  return (
    <Container>
      <Header>
        <UserInfo>
          <Avatar>👤</Avatar>
          <UserDetails>
            <h3>Тынаев Сырга к</h3>
            <p>+996 507700007</p>
          </UserDetails>
        </UserInfo>
        <NotificationIcon>🔔</NotificationIcon>
      </Header>

      <BalanceCard to="/bonus-card">
        <BalanceHeader>
          <BalanceInfo>
            <BalanceLabel>Ваш Баланс</BalanceLabel>
            <BalanceAmount>
              55.7 <span>Yess!Coin</span>
            </BalanceAmount>
          </BalanceInfo>
          <LevelBadge>
            🏆 Бронза
          </LevelBadge>
        </BalanceHeader>

        <ActionButtons>
          <ActionButton $variant="primary">
            <span>📱</span>
            <span>Сканировать</span>
          </ActionButton>
          <ActionButton $variant="secondary">
            <span>💰</span>
            <span>Пополнить</span>
          </ActionButton>
        </ActionButtons>
      </BalanceCard>

      <Section $delay={0.2}>
        <SectionHeader>
          <SectionTitle>Категории</SectionTitle>
          <SectionLink to="/partners">Все</SectionLink>
        </SectionHeader>
        <CategoryScroll>
          <CategoryCard to="/partners?category=food">
            <CategoryIcon>🍔</CategoryIcon>
            <CategoryLabel>Еда и напитки</CategoryLabel>
          </CategoryCard>
          <CategoryCard to="/partners?category=beauty">
            <CategoryIcon>💄</CategoryIcon>
            <CategoryLabel>Красота</CategoryLabel>
          </CategoryCard>
          <CategoryCard to="/partners?category=clothing">
            <CategoryIcon>👕</CategoryIcon>
            <CategoryLabel>Одежда</CategoryLabel>
          </CategoryCard>
          <CategoryCard to="/partners?category=home">
            <CategoryIcon>🏠</CategoryIcon>
            <CategoryLabel>Для дома</CategoryLabel>
          </CategoryCard>
          <CategoryCard to="/partners?category=products">
            <CategoryIcon>🥗</CategoryIcon>
            <CategoryLabel>Продукты</CategoryLabel>
          </CategoryCard>
        </CategoryScroll>
      </Section>

      <Section $delay={0.3}>
        <SectionHeader>
          <SectionTitle>Акции</SectionTitle>
          <SectionLink to="/promotions">Все</SectionLink>
        </SectionHeader>

        <PromoCard to="/promo/dogshop">
          <PromoImage $color="linear-gradient(135deg, #FFB84D 0%, #A855F7 100%)">
            🐶
          </PromoImage>
          <PromoContent>
            <PromoTitle>DOGSHOP</PromoTitle>
            <PromoDescription>Скидка на все лакомства для ваших питомцев</PromoDescription>
            <PromoDiscount>СКИДКА 40%</PromoDiscount>
          </PromoContent>
        </PromoCard>

        <PromoCard to="/promo/delivery">
          <PromoImage $color="linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)">
            🍕
          </PromoImage>
          <PromoContent>
            <PromoTitle>5 Доставка</PromoTitle>
            <PromoDescription>Скидка на первые два заказа от 1500₽</PromoDescription>
            <PromoDiscount>-20%</PromoDiscount>
          </PromoContent>
        </PromoCard>

        <PromoCard to="/promo/coffee">
          <PromoImage $color="linear-gradient(135deg, #FFB84D 0%, #F5A623 100%)">
            ☕
          </PromoImage>
          <PromoContent>
            <PromoTitle>MANSION VIEW STUDIO</PromoTitle>
            <PromoDescription>Специальные напитки и выпечка</PromoDescription>
            <PromoDiscount>СКИДКА -25%</PromoDiscount>
          </PromoContent>
        </PromoCard>
      </Section>

      <BottomNav>
        <NavItem to="/dashboard" $active={activeTab === 'home'}>
          <NavIcon>🏠</NavIcon>
          <span>Главная</span>
        </NavItem>
        <NavItem to="/partners">
          <NavIcon>🏪</NavIcon>
          <span>Партнеры</span>
        </NavItem>
        <QRButton to="/qr-scanner">📷</QRButton>
        <NavItem to="/notifications">
          <NavIcon>🔔</NavIcon>
          <span>Уведомления</span>
        </NavItem>
        <NavItem to="/profile">
          <NavIcon>👤</NavIcon>
          <span>Еще</span>
        </NavItem>
      </BottomNav>
    </Container>
  )
}
