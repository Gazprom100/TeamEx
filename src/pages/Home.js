import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonVariants } from '../components/Button';
import { Layout } from '../components/Layout';
import ParticlesBackground from '../components/ParticlesBackground';
import PriceChart from '../components/PriceChart';
import { Card, CardTypes } from '../components/Card';
import { ExchangeIcon, ChartIcon, WalletIcon, UserIcon, BankIcon, SecurityIcon, LogoIcon } from '../components/Icons';
import useSafeAnimation from '../hooks/useSafeAnimation';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
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

const Tagline = styled(motion.p)`
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 25px;
  max-width: 320px;
`;

const MainActions = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
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

const Home = () => {
  const navigate = useNavigate();
  const isMounted = useSafeAnimation();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: { 
      y: -5,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    tap: { scale: 0.98 }
  };
  
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
  
  // Не рендерим компонент с анимациями, если он ещё не смонтирован
  if (!isMounted) {
    return (
      <PageContainer>
        <ParticlesBackground />
        <Layout>
          <Hero>
            <LogoContainer>
              <LogoIcon size="40px" color="var(--accent-primary)" />
              <LogoText>Team<span>Ex</span></LogoText>
            </LogoContainer>
            
            <Tagline>
              Безопасный и быстрый обмен криптовалют на рубли и обратно
            </Tagline>
            
            <MainActions>
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
          </Hero>
          
          <StatsRow>
            <StatItem>
              <StatValue>97.25 ₽</StatValue>
              <StatLabel>USDT/RUB</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>95.30 ₽</StatValue>
              <StatLabel>RUB/USDT</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>5 мин.</StatValue>
              <StatLabel>Скорость</StatLabel>
            </StatItem>
          </StatsRow>
          
          <PriceChart 
            height="220px"
            marginBottom="30px"
          />
          
          <MenuGrid>
            {menuItems.map((item) => (
              <MenuCard
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
              </MenuCard>
            ))}
          </MenuGrid>
          
          <Card 
            type={CardTypes.FROSTED}
            icon={<SecurityIcon size="20px" color="var(--info)" />}
            title="Безопасный обмен"
          >
            <MenuDescription>
              Мы используем передовые технологии шифрования и соблюдаем требования KYC/AML для обеспечения безопасности ваших транзакций. Все обмены происходят автоматически без участия третьих лиц.
            </MenuDescription>
          </Card>
          
          <PoweredBy>
            <PoweredByText>Powered by</PoweredByText>
            <TeamExLogo>TeamEx Exchange</TeamExLogo>
          </PoweredBy>
        </Layout>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <ParticlesBackground />
      <Layout>
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
          </Hero>
          
          <StatsRow variants={itemVariants}>
            <StatItem>
              <StatValue>97.25 ₽</StatValue>
              <StatLabel>USDT/RUB</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>95.30 ₽</StatValue>
              <StatLabel>RUB/USDT</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>5 мин.</StatValue>
              <StatLabel>Скорость</StatLabel>
            </StatItem>
          </StatsRow>
          
          <PriceChart 
            height="220px"
            marginBottom="30px"
          />
          
          <MenuGrid>
            {menuItems.map((item) => (
              <MenuCard
                key={item.id}
                type={CardTypes.FROSTED}
                clickable
                onClick={item.onClick}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <IconContainer>
                  {item.icon}
                </IconContainer>
                <MenuTitle>{item.title}</MenuTitle>
                <MenuDescription>{item.description}</MenuDescription>
              </MenuCard>
            ))}
          </MenuGrid>
          
          <Card 
            type={CardTypes.FROSTED}
            variants={itemVariants}
            icon={<SecurityIcon size="20px" color="var(--info)" />}
            title="Безопасный обмен"
          >
            <MenuDescription>
              Мы используем передовые технологии шифрования и соблюдаем требования KYC/AML для обеспечения безопасности ваших транзакций. Все обмены происходят автоматически без участия третьих лиц.
            </MenuDescription>
          </Card>
          
          <PoweredBy variants={itemVariants}>
            <PoweredByText>Powered by</PoweredByText>
            <TeamExLogo>TeamEx Exchange</TeamExLogo>
          </PoweredBy>
        </motion.div>
      </Layout>
    </PageContainer>
  );
};

export default Home; 