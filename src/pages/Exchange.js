import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button, ButtonVariants, ButtonSizes } from '../components/Button';
import { Card, CardTypes } from '../components/Card';
import { Layout } from '../components/Layout';
import ParticlesBackground from '../components/ParticlesBackground';
import { ExchangeIcon, ChartIcon, WalletIcon, SecurityIcon } from '../components/Icons';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

const ContentGrid = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
`;

const ExchangeCard = styled(Card)`
  margin-bottom: 20px;
`;

const FormSection = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const CurrencyIndicator = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--dark-input);
  padding: 5px 10px;
  border-radius: 6px;
  z-index: 2;
`;

const RateDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin: 20px 0;
  border-radius: var(--border-radius);
  background: rgba(32, 41, 58, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const RateTitle = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
`;

const RateValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
`;

const RequisitesContainer = styled.div`
  margin-top: 20px;
`;

const InfoMessage = styled(motion.div)`
  padding: 15px;
  border-radius: var(--border-radius);
  background: rgba(var(--info-rgb), 0.1);
  border: 1px solid rgba(var(--info-rgb), 0.2);
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
  
  svg {
    margin-right: 10px;
    flex-shrink: 0;
    color: var(--info);
  }
`;

const InfoText = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 10px;
    height: 2px;
    background: var(--dark-border);
    z-index: 0;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const StepDot = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${props => props.active ? 'var(--accent-primary)' : props.completed ? 'var(--success)' : 'var(--dark-border)'};
  color: var(--dark-background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  
  ${props => props.completed && `
    &::after {
      content: '✓';
      font-size: 12px;
    }
  `}
`;

const StepLabel = styled.div`
  font-size: 12px;
  color: ${props => props.active ? 'var(--text-primary)' : 'var(--text-tertiary)'};
  font-weight: ${props => props.active ? '500' : '400'};
`;

const Exchange = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: '',
    email: '',
    card: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({});
  const [currentRate, setCurrentRate] = useState(97.25);
  const [receiveAmount, setReceiveAmount] = useState('0.00');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    // Calculate receive amount if amount changes
    if (name === 'amount') {
      const numValue = parseFloat(value) || 0;
      setReceiveAmount((numValue * currentRate).toFixed(2));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Пожалуйста, введите сумму';
      }
      
      if (!formData.email) {
        newErrors.email = 'Пожалуйста, введите email';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Пожалуйста, введите корректный email';
      }
    } else if (step === 2) {
      if (!formData.card) {
        newErrors.card = 'Пожалуйста, введите номер карты';
      } else if (!/^\d{16,19}$/.test(formData.card.replace(/\s/g, ''))) {
        newErrors.card = 'Неверный формат карты';
      }
      
      if (!formData.fullName) {
        newErrors.fullName = 'Пожалуйста, введите ФИО';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validate()) {
      setStep(step + 1);
    }
  };
  
  const handleSubmit = () => {
    if (validate()) {
      // Submit the exchange request
      navigate('/success');
    }
  };
  
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatCardNumber(value);
    
    setFormData({
      ...formData,
      card: formattedValue
    });
    
    if (errors.card) {
      setErrors({
        ...errors,
        card: null
      });
    }
  };
  
  // Update amount when rate changes
  useEffect(() => {
    const numValue = parseFloat(formData.amount) || 0;
    setReceiveAmount((numValue * currentRate).toFixed(2));
  }, [currentRate, formData.amount]);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <PageContainer>
      <ParticlesBackground type="matrix" />
      <Layout>
        <Header 
          title="Обмен USDT → RUB" 
          subtitle="Быстрый и безопасный обмен" 
          backTo="/"
        />
        
        <StepIndicator>
          <Step>
            <StepDot active={step === 1} completed={step > 1}>1</StepDot>
            <StepLabel active={step === 1}>Сумма</StepLabel>
          </Step>
          <Step>
            <StepDot active={step === 2} completed={step > 2}>2</StepDot>
            <StepLabel active={step === 2}>Реквизиты</StepLabel>
          </Step>
          <Step>
            <StepDot active={step === 3} completed={step > 3}>3</StepDot>
            <StepLabel active={step === 3}>Оплата</StepLabel>
          </Step>
        </StepIndicator>
        
        <ContentGrid>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
              >
                <ExchangeCard type={CardTypes.FROSTED} title="Детали обмена">
                  <FormSection>
                    <InputGroup>
                      <FormLabel>Вы отправляете</FormLabel>
                      <Input 
                        type="number" 
                        name="amount" 
                        value={formData.amount} 
                        onChange={handleInputChange}
                        placeholder="0.00"
                        error={errors.amount}
                        fullWidth
                      />
                      <CurrencyIndicator>USDT</CurrencyIndicator>
                    </InputGroup>
                    
                    <InputGroup>
                      <FormLabel>Вы получаете</FormLabel>
                      <Input 
                        type="text" 
                        value={receiveAmount} 
                        readOnly 
                        fullWidth
                      />
                      <CurrencyIndicator>RUB</CurrencyIndicator>
                    </InputGroup>
                    
                    <RateDisplay>
                      <RateTitle>Текущий курс:</RateTitle>
                      <RateValue>1 USDT = {currentRate} RUB</RateValue>
                    </RateDisplay>
                    
                    <InputGroup>
                      <FormLabel>Email для связи</FormLabel>
                      <Input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        placeholder="example@mail.com"
                        error={errors.email}
                        fullWidth
                      />
                    </InputGroup>
                  </FormSection>
                  
                  <InfoMessage
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <SecurityIcon size="20px" color="var(--info)" />
                    <InfoText>
                      Мы соблюдаем требования AML/KYC. Возможна дополнительная верификация для крупных сумм.
                    </InfoText>
                  </InfoMessage>
                  
                  <Button 
                    onClick={handleNextStep} 
                    variant={ButtonVariants.GRADIENT}
                    size={ButtonSizes.LARGE}
                    fullWidth
                  >
                    Продолжить
                  </Button>
                </ExchangeCard>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                key="step2"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
              >
                <ExchangeCard type={CardTypes.FROSTED} title="Реквизиты для получения">
                  <FormSection>
                    <InputGroup>
                      <FormLabel>Номер карты</FormLabel>
                      <Input 
                        type="text" 
                        name="card" 
                        value={formData.card} 
                        onChange={handleCardChange}
                        placeholder="0000 0000 0000 0000"
                        error={errors.card}
                        fullWidth
                        maxLength={19}
                      />
                    </InputGroup>
                    
                    <InputGroup>
                      <FormLabel>Полное имя держателя</FormLabel>
                      <Input 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange}
                        placeholder="IVAN IVANOV"
                        error={errors.fullName}
                        fullWidth
                      />
                    </InputGroup>
                  </FormSection>
                  
                  <InfoMessage
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <SecurityIcon size="20px" color="var(--info)" />
                    <InfoText>
                      Имя получателя должно совпадать с именем отправителя для соблюдения AML требований
                    </InfoText>
                  </InfoMessage>
                  
                  <Button 
                    onClick={handleNextStep} 
                    variant={ButtonVariants.GRADIENT}
                    size={ButtonSizes.LARGE}
                    fullWidth
                  >
                    Продолжить
                  </Button>
                </ExchangeCard>
              </motion.div>
            )}
            
            {step === 3 && (
              <motion.div
                key="step3"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
              >
                <ExchangeCard type={CardTypes.FROSTED} title="Оплата">
                  <FormSection>
                    <h3 style={{ margin: '0 0 20px', color: 'var(--text-primary)' }}>
                      Отправьте {formData.amount} USDT на следующий адрес:
                    </h3>
                    
                    <InputGroup>
                      <FormLabel>Адрес кошелька TRC20</FormLabel>
                      <Input 
                        type="text" 
                        value="TG7uUMYzzNfG5ee3kWoLbGHvTG7VRygyLs" 
                        readOnly 
                        fullWidth
                      />
                    </InputGroup>
                    
                    <Button 
                      onClick={() => navigator.clipboard.writeText("TG7uUMYzzNfG5ee3kWoLbGHvTG7VRygyLs")}
                      variant={ButtonVariants.SECONDARY}
                      size={ButtonSizes.MEDIUM}
                      fullWidth
                      style={{ marginBottom: '20px' }}
                    >
                      Скопировать адрес
                    </Button>
                    
                    <InputGroup>
                      <FormLabel>Номер заявки (укажите в комментарии к платежу)</FormLabel>
                      <Input 
                        type="text" 
                        value="EX-2023-29834" 
                        readOnly 
                        fullWidth
                      />
                    </InputGroup>
                  </FormSection>
                  
                  <InfoMessage
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <SecurityIcon size="20px" color="var(--info)" />
                    <InfoText>
                      После получения платежа средства будут отправлены на указанную карту в течение 5-15 минут
                    </InfoText>
                  </InfoMessage>
                  
                  <Button 
                    onClick={handleSubmit} 
                    variant={ButtonVariants.SUCCESS}
                    size={ButtonSizes.LARGE}
                    fullWidth
                  >
                    Я оплатил, завершить
                  </Button>
                </ExchangeCard>
              </motion.div>
            )}
          </AnimatePresence>
        </ContentGrid>
      </Layout>
    </PageContainer>
  );
};

export default Exchange; 