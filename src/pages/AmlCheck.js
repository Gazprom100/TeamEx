import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Input from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const CheckTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--text-white);
`;

const WalletInput = styled.div`
  margin-bottom: 40px;
`;

const RemainingChecks = styled.p`
  font-size: 14px;
  color: var(--text-gray);
  margin-top: 10px;
`;

const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
`;

const InfoIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E4D00A;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #E4D00A;
  line-height: 1.5;
`;

const AmlCheck = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [remainingChecks] = useState(5);
  
  const handleCheck = () => {
    // Here would be check wallet logic
    alert('Проверка выполнена успешно');
  };
  
  return (
    <Layout 
      title="AML ПРОВЕРКА" 
      subtitle="бот"
      footerButtonText="Перейти на главный экран"
      onFooterButtonClick={() => navigate('/')}
    >
      <CheckTitle>Введите кошелек для проверки</CheckTitle>
      
      <WalletInput>
        <Input 
          name="walletAddress"
          label="Адрес кошелька TRC-20 (34 символа)"
          required
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <RemainingChecks>Осталось проверок: {remainingChecks}</RemainingChecks>
      </WalletInput>
      
      <InfoBox>
        <InfoIcon>i</InfoIcon>
        <InfoText>
          Внимание! Доступны {remainingChecks} бесплатных проверок в месяц.
        </InfoText>
      </InfoBox>
      
      <Button 
        onClick={handleCheck} 
        fullWidth 
        disabled={!walletAddress}
      >
        Проверить кошелек
      </Button>
    </Layout>
  );
};

export default AmlCheck; 