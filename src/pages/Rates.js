import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const RatesContainer = styled.div`
  margin: 20px 0;
`;

const RateBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const RateTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--text-white);
`;

const RateValue = styled.p`
  font-size: 32px;
  font-weight: bold;
  color: var(--main-green);
  margin-bottom: 0;
`;

const RateInfo = styled.p`
  font-size: 14px;
  color: var(--text-gray);
  margin-top: 5px;
`;

const UpdateTime = styled.p`
  font-size: 14px;
  color: var(--text-gray);
  text-align: center;
  margin-top: 20px;
`;

const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
`;

const InfoTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--text-white);
`;

const InfoText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-white);
`;

const Rates = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Mock rates data
  const [rates] = useState({
    buy: 101.5,
    sell: 98.75
  });
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <Layout 
      title="КУРС" 
      subtitle="бот"
      footerButtonText="Перейти на главный экран"
      onFooterButtonClick={() => navigate('/')}
    >
      <RatesContainer>
        <RateBox>
          <RateTitle>Покупка USDT</RateTitle>
          <RateValue>{rates.buy} ₽</RateValue>
          <RateInfo>Без комиссии</RateInfo>
        </RateBox>
        
        <RateBox>
          <RateTitle>Продажа USDT</RateTitle>
          <RateValue>{rates.sell} ₽</RateValue>
          <RateInfo>Без комиссии</RateInfo>
        </RateBox>
        
        <UpdateTime>
          Курс обновлен в {formattedTime}
        </UpdateTime>
      </RatesContainer>
      
      <InfoBox>
        <InfoTitle>Информация о курсе</InfoTitle>
        <InfoText>
          Курс обменника обновляется каждую минуту.
          Мы не взимаем комиссию за обмен.
          Курсы могут меняться в зависимости от рыночной ситуации.
        </InfoText>
      </InfoBox>
    </Layout>
  );
};

export default Rates; 