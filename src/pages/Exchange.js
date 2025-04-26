import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const ExchangeTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--text-white);
`;

const ActionButtons = styled.div`
  display: flex;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 16px;
  background: ${({ active }) => active ? 'var(--button-green)' : 'transparent'};
  color: var(--text-white);
  border: none;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s ease;
`;

const AmountLabel = styled.p`
  font-size: 16px;
  margin-bottom: 10px;
`;

const AmountInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--text-gray);
  padding: 10px 0;
  font-size: 18px;
  color: var(--text-white);
  margin-bottom: 30px;
  
  &:focus {
    border-bottom: 1px solid var(--text-white);
    outline: none;
  }
`;

const FormSection = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--text-white);
`;

const WalletButton = styled(Button)`
  margin-top: 10px;
`;

const Exchange = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buy');
  const [amount, setAmount] = useState('');
  const [checked, setChecked] = useState(false);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleCreateRequest = () => {
    // Here would be request logic
    navigate('/');
  };
  
  const handleCreateWallet = () => {
    // Logic to create a one-time wallet
  };
  
  return (
    <Layout title="ОБМЕН" subtitle="бот">
      <ActionButtons>
        <ActionButton 
          active={activeTab === 'buy'} 
          onClick={() => handleTabChange('buy')}
        >
          КУПИТЬ USDT
        </ActionButton>
        <ActionButton 
          active={activeTab === 'sell'} 
          onClick={() => handleTabChange('sell')}
        >
          ПРОДАТЬ USDT
        </ActionButton>
      </ActionButtons>
      
      <AmountLabel>Введите сумму в рублях</AmountLabel>
      <AmountInput 
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0"
      />
      
      <FormSection>
        <SectionTitle>Данные:</SectionTitle>
        <Input 
          name="lastName"
          label="Фамилия"
          required
        />
        <Input 
          name="firstName"
          label="Имя"
          required
        />
        <Input 
          name="middleName"
          label="Отчество"
          required
        />
        
        {activeTab === 'buy' && (
          <Input 
            name="walletAddress"
            label="Адрес кошелька TRC-20 (34 символа)"
            required
          />
        )}
      </FormSection>
      
      <Checkbox 
        checked={checked}
        onChange={() => setChecked(!checked)}
        label="Я прочитал"
        linkText="правила"
        linkUrl="/rules"
      />
      
      {activeTab === 'buy' && (
        <WalletButton onClick={handleCreateWallet} fullWidth>
          Получить одноразовый кошелек
        </WalletButton>
      )}
      
      <Button 
        onClick={handleCreateRequest} 
        fullWidth 
        style={{ marginTop: '20px' }}
        disabled={!checked}
      >
        {activeTab === 'buy' ? 'Создать заявку' : 'Создать заявку'}
      </Button>
      
      <Button 
        onClick={() => navigate('/')} 
        fullWidth 
        style={{ marginTop: '20px' }}
        variant="secondary"
      >
        Перейти на главный экран
      </Button>
    </Layout>
  );
};

export default Exchange; 