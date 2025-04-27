import React, { useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonVariants, ButtonSizes } from '../components/Button';
import { Layout } from '../components/Layout';
import ParticlesBackground from '../components/ParticlesBackground';
import PriceChart from '../components/PriceChart';
import { Card, CardTypes } from '../components/Card';
import { ExchangeIcon, ChartIcon, WalletIcon, UserIcon, BankIcon, SecurityIcon, LogoIcon, AdminIcon } from '../components/Icons';
import AnimationSafeWrapper from '../components/AnimationSafeWrapper';
import { safeAnimationProps, safeVariants, areComplexAnimationsAllowed } from '../utils/motionFeatureDetection';
import { isUserAdmin } from '../services/AdminAuth';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

// Статические версии компонентов для запасного варианта
const StaticHero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
`;

const StaticLogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoText = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-left: 10px;
  
  span {
    color: var(--accent-primary);
  }
`;

const StaticTagline = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 25px;
  max-width: 320px;
`;

const Tagline = styled(motion.p)`
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 25px;
  max-width: 320px;
`;

const StaticMainActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  margin-bottom: 30px;
`;

const MainActions = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  margin-bottom: 30px;
`;

const StaticStatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  background: rgba(21, 29, 40, 0.7);
  backdrop-filter: blur(8px);
  border-radius: var(--border-radius);
  padding: 15px;
  margin-bottom: 30px;
`;

const StatsRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  background: rgba(21, 29, 40, 0.7);
  backdrop-filter: blur(8px);
  border-radius: var(--border-radius);
  padding: 15px;
  margin-bottom: 30px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
`;

const MenuCard = styled(motion(Card))`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-decoration: none;
  color: var(--text-primary);
  min-height: 130px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(var(--accent-primary-rgb), 0.1);
  margin-bottom: 15px;
  color: var(--accent-primary);
`;

const MenuTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const MenuDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
`;

const StaticPoweredBy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  opacity: 0.6;
`;

const PoweredBy = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  opacity: 0.6;
`;

const PoweredByText = styled.p`
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 5px;
`;

const TeamExLogo = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
`;

const AdminLink = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const StatusBadge = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: ${props => props.isAdmin ? 'var(--color-success)' : 'var(--color-danger)'};
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 5px;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const Home = ({ telegramUser }) => {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState(null);
  
  // Проверяем, разрешены ли сложные анимации
  const complexAnimationsAllowed = useMemo(() => areComplexAnimationsAllowed(), []);
  
  // Проверяем, является ли текущий пользователь администратором
  const isAdmin = useMemo(() => isUserAdmin(telegramUser), [telegramUser]);
  
  // Отображение отладочной информации
  useEffect(() => {
    setDebugInfo({
      isAdmin,
      telegramUserId: telegramUser?.id,
      hasLocalAccess: localStorage.getItem('adminAccess') === 'true'
    });
  }, [isAdmin, telegramUser]);
  
  // Безопасные варианты анимации
  const containerVariants = safeVariants({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  });
  
  const itemVariants = safeVariants({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  });
  
  // Определяем свойства анимации для карточек
  const cardVariants = safeVariants({
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: complexAnimationsAllowed ? { 
      y: -5,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      transition: { type: "spring", stiffness: 300, damping: 20 }
    } : undefined,
    tap: complexAnimationsAllowed ? { scale: 0.98 } : undefined
  });
  
  const handleExchangeClick = () => {
    navigate('/exchange');
  };
  
  const menuItems = [
    {
      id: 'exchange',
      title: 'Обмен валют',
      description: 'Мгновенный обмен USDT на RUB и обратно по выгодному курсу',
      icon: <ExchangeIcon size="24px" />,
      onClick: () => navigate('/exchange')
    },
    {
      id: 'rates',
      title: 'Курсы валют',
      description: 'Актуальные курсы криптовалют и аналитические инструменты',
      icon: <ChartIcon size="24px" />,
      onClick: () => navigate('/rates')
    },
    {
      id: 'wallet',
      title: 'Крипто кошелёк',
      description: 'Безопасное хранение и управление криптовалютными активами',
      icon: <WalletIcon size="24px" />,
      onClick: () => navigate('/wallet')
    },
    {
      id: 'account',
      title: 'Учетная запись',
      description: 'Управление профилем, верификация и история транзакций',
      icon: <UserIcon size="24px" />,
      onClick: () => navigate('/account')
    }
  ];
  
  // Статическая версия страницы для fallback
  const staticContent = (
    <PageContainer>
      <ParticlesBackground />
      <Layout>
        <StatusBadge isAdmin={isAdmin}>
          {isAdmin ? 'Админ-доступ: Есть' : 'Админ-доступ: Нет'} 
          {isAdmin ? '✓' : '✗'}
        </StatusBadge>
        <StaticHero>
          <StaticLogoContainer>
            <LogoIcon size="40px" color="var(--accent-primary)" />
            <LogoText>Team<span>Ex</span></LogoText>
          </StaticLogoContainer>
          
          <StaticTagline>
            Безопасный и быстрый обмен криптовалют на рубли и обратно
          </StaticTagline>
          
          <StaticMainActions>
            <Button 
              variant={ButtonVariants.GRADIENT}
              size="large"
              onClick={handleExchangeClick}
              icon={<ExchangeIcon size="20px" />}
            >
              Купить USDT
            </Button>
            <Button 
              variant={ButtonVariants.OUTLINE}
              size="large"
              onClick={handleExchangeClick}
              icon={<BankIcon size="20px" />}
            >
              Продать USDT
            </Button>
          </StaticMainActions>
          
          <StaticStatsRow>
            <StatItem>
              <StatValue>96.5₽</StatValue>
              <StatLabel>Покупка USDT</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>95.0₽</StatValue>
              <StatLabel>Продажа USDT</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>27,183₽</StatValue>
              <StatLabel>BTC/RUB</StatLabel>
            </StatItem>
          </StaticStatsRow>
        </StaticHero>
        
        <PriceChart />
        
        <MenuGrid>
          {menuItems.map(item => (
            <Card 
              key={item.id}
              type={CardTypes.FROSTED}
              clickable
              onClick={item.onClick}
            >
              <IconContainer>
                {item.icon}
              </IconContainer>
              <MenuTitle>{item.title}</MenuTitle>
              <MenuDescription>{item.description}</MenuDescription>
            </Card>
          ))}
        </MenuGrid>
        
        <StaticPoweredBy>
          <PoweredByText>Powered by</PoweredByText>
          <TeamExLogo>TeamEx Exchange</TeamExLogo>
        </StaticPoweredBy>
        
        {isAdmin && (
          <AdminLink>
            <Button 
              variant={ButtonVariants.TEXT}
              size={ButtonSizes.SMALL}
              onClick={() => navigate('/admin')}
            >
              Панель администратора
            </Button>
          </AdminLink>
        )}
      </Layout>
    </PageContainer>
  );

  // Анимированная версия страницы
  const animatedContent = (
    <PageContainer>
      <ParticlesBackground />
      <Layout>
        <StatusBadge isAdmin={isAdmin}>
          {isAdmin ? 'Админ-доступ: Есть' : 'Админ-доступ: Нет'} 
          {isAdmin ? '✓' : '✗'}
        </StatusBadge>
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
        >
          <Hero>
            <LogoContainer variants={itemVariants}>
              <LogoIcon size="40px" color="var(--accent-primary)" />
              <LogoText>Team<span>Ex</span></LogoText>
            </LogoContainer>
            
            <Tagline variants={itemVariants}>
              Безопасный и быстрый обмен криптовалют на рубли и обратно
            </Tagline>
            
            <MainActions variants={itemVariants}>
              <Button 
                variant={ButtonVariants.GRADIENT}
                size="large"
                onClick={handleExchangeClick}
                icon={<ExchangeIcon size="20px" />}
              >
                Купить USDT
              </Button>
              <Button 
                variant={ButtonVariants.OUTLINE}
                size="large"
                onClick={handleExchangeClick}
                icon={<BankIcon size="20px" />}
              >
                Продать USDT
              </Button>
            </MainActions>
            
            <StatsRow variants={itemVariants}>
              <StatItem>
                <StatValue>96.5₽</StatValue>
                <StatLabel>Покупка USDT</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>95.0₽</StatValue>
                <StatLabel>Продажа USDT</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>27,183₽</StatValue>
                <StatLabel>BTC/RUB</StatLabel>
              </StatItem>
            </StatsRow>
          </Hero>
          
          <PriceChart />
          
          <MenuGrid>
            {menuItems.map(item => (
              <MenuCard 
                key={item.id}
                variants={cardVariants}
                type={CardTypes.FROSTED}
                {...(complexAnimationsAllowed ? {
                  whileHover: "hover",
                  whileTap: "tap"
                } : {})}
                clickable
                onClick={item.onClick}
              >
                <IconContainer>
                  {item.icon}
                </IconContainer>
                <MenuTitle>{item.title}</MenuTitle>
                <MenuDescription>{item.description}</MenuDescription>
              </MenuCard>
            ))}
          </MenuGrid>
          
          <PoweredBy
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <PoweredByText>Powered by</PoweredByText>
            <TeamExLogo>TeamEx Exchange</TeamExLogo>
          </PoweredBy>
          
          {isAdmin && (
            <AdminLink>
              <Button 
                variant={ButtonVariants.TEXT}
                size={ButtonSizes.SMALL}
                onClick={() => navigate('/admin')}
              >
                Панель администратора
              </Button>
            </AdminLink>
          )}
        </motion.div>
      </Layout>
    </PageContainer>
  );

  return (
    <AnimationSafeWrapper delay={500} fallback={staticContent}>
      {animatedContent}
    </AnimationSafeWrapper>
  );
};

export default Home; 