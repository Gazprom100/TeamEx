import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonVariants } from '../components/Button';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';
import ParticlesBackground from '../components/ParticlesBackground';
import { Card, CardTypes } from '../components/Card';

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
`;

const IconWrapper = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(var(--success-rgb), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;

const SuccessIcon = styled(motion.svg)`
  width: 60px;
  height: 60px;
  color: var(--success);
`;

const Title = styled(motion.h1)`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-primary);
`;

const Description = styled(motion.p)`
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin-bottom: 30px;
  max-width: 320px;
`;

const DetailsCard = styled(Card)`
  margin-bottom: 30px;
  width: 100%;
`;

const TransactionDetail = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: var(--text-secondary);
  font-size: 14px;
`;

const DetailValue = styled.span`
  color: var(--text-primary);
  font-weight: 500;
  font-size: 14px;
`;

const ButtonsContainer = styled.div`
  display: grid;
  gap: 10px;
  width: 100%;
  margin-top: 20px;
`;

const Success = () => {
  const navigate = useNavigate();
  
  // Эффект для работы с конфетти
  useEffect(() => {
    // Можно добавить анимацию конфетти для более праздничного UI
    // Или интегрировать библиотеку типа canvas-confetti
    
    // Имитация получения данных транзакции с сервера
    const timer = setTimeout(() => {
      // Здесь можно выполнить запрос к API для получения деталей транзакции
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  const handleNewExchangeClick = () => {
    navigate('/exchange');
  };
  
  // Анимационные варианты
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
  
  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1,
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };
  
  const circleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 0.4
      }
    }
  };
  
  return (
    <div style={{ position: 'relative' }}>
      <ParticlesBackground />
      <Layout>
        <Header 
          title="Успешный обмен" 
          backTo="/"
        />
        
        <SuccessContainer
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <IconWrapper
            variants={circleVariants}
          >
            <SuccessIcon
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={checkmarkVariants}
              />
              <motion.path
                d="M22 4L12 14.01L9 11.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={checkmarkVariants}
              />
            </SuccessIcon>
          </IconWrapper>
          
          <Title variants={itemVariants}>
            Транзакция завершена!
          </Title>
          
          <Description variants={itemVariants}>
            Ваш обмен был успешно завершен. Средства отправлены на указанные реквизиты.
          </Description>
          
          <DetailsCard 
            type={CardTypes.FROSTED} 
            title="Детали транзакции"
            variants={itemVariants}
          >
            <TransactionDetail>
              <DetailLabel>Номер заявки</DetailLabel>
              <DetailValue>EX-2023-29834</DetailValue>
            </TransactionDetail>
            
            <TransactionDetail>
              <DetailLabel>Сумма USDT</DetailLabel>
              <DetailValue>100 USDT</DetailValue>
            </TransactionDetail>
            
            <TransactionDetail>
              <DetailLabel>Получено RUB</DetailLabel>
              <DetailValue>9 725 RUB</DetailValue>
            </TransactionDetail>
            
            <TransactionDetail>
              <DetailLabel>Курс обмена</DetailLabel>
              <DetailValue>1 USDT = 97.25 RUB</DetailValue>
            </TransactionDetail>
            
            <TransactionDetail>
              <DetailLabel>Дата и время</DetailLabel>
              <DetailValue>{new Date().toLocaleString()}</DetailValue>
            </TransactionDetail>
          </DetailsCard>
          
          <ButtonsContainer>
            <Button 
              onClick={handleNewExchangeClick}
              variant={ButtonVariants.GRADIENT}
              fullWidth
            >
              Новый обмен
            </Button>
            
            <Button 
              onClick={handleHomeClick}
              variant={ButtonVariants.SECONDARY}
              fullWidth
            >
              На главную
            </Button>
          </ButtonsContainer>
        </SuccessContainer>
      </Layout>
    </div>
  );
};

export default Success; 