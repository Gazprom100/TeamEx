import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import PriceChart from '../components/PriceChart';
import { ArrowRight } from '../components/Icons';
import api from '../services/api';
import Header from '../components/Header';
import axios from 'axios';

const ExchangeContainer = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  position: relative;
  max-width: 600px;
  margin: 0 auto 40px;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-card)'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 0 15px rgba(0, 120, 255, 0.5)' : 'none'};
`;

const StepTitle = styled.div`
  font-size: 14px;
  color: ${props => props.active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.3s ease;
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 20px;
  left: 70px;
  right: 70px;
  height: 3px;
  background-color: var(--bg-card);
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => {
      if (props.step === 1) return '0%';
      if (props.step === 2) return '50%';
      return '100%';
    }};
    background-color: var(--accent-primary);
    transition: width 0.5s ease;
  }
`;

const FormContainer = styled(Card)`
  max-width: 600px;
  margin: 0 auto 30px;
  padding: 30px;
`;

const FormTitle = styled.h2`
  margin: 0 0 20px;
  font-size: 22px;
  color: var(--text-primary);
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const InputWithPrice = styled.div`
  position: relative;
`;

const CurrencyTag = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--accent-primary);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
`;

const PriceInfo = styled.div`
  display: flex;
  margin-top: 6px;
  font-size: 14px;
  color: var(--text-secondary);
  justify-content: space-between;
`;

const RateInfo = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: var(--bg-element);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  justify-content: space-between;
`;

const ChartContainer = styled.div`
  margin: 40px auto;
  max-width: 900px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ErrorMessage = styled.div`
  color: var(--danger);
  font-size: 14px;
  margin-top: 5px;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  color: var(--success);
  font-size: 14px;
  margin-top: 5px;
  font-weight: 500;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.div`
  color: var(--text-secondary);
`;

const SummaryValue = styled.div`
  color: var(--text-primary);
  font-weight: 600;
`;

const TotalRow = styled(SummaryItem)`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  font-size: 16px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 20px;
  background: linear-gradient(135deg, #101318, #181e29);
  color: white;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
`;

const RateCard = styled(Card)`
  display: flex;
  justify-content: space-around;
  padding: 16px;
`;

const RateColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RateLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
`;

const RateValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.type === 'buy' ? '#00f0ff' : '#5773ff'};
`;

const ExchangeForm = styled.form`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const Select = styled.select`
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #5773ff;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 10px 16px;
  background: ${props => props.checked ? 'rgba(87, 115, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 8px;
  border: 1px solid ${props => props.checked ? '#5773ff' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    background: rgba(87, 115, 255, 0.1);
  }
`;

const RadioInput = styled.input`
  display: none;
`;

const RadioText = styled.span`
  font-size: 14px;
  font-weight: ${props => props.checked ? '600' : '400'};
`;

const Footnote = styled.p`
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 24px;
`;

const CalculationRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 10px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
`;

const Exchange = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState({
    buy: 97.5,
    sell: 95.5
  });
  const [exchangeType, setExchangeType] = useState('buy'); // 'buy' or 'sell'
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('tinkoff');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [telegramWebApp, setTelegramWebApp] = useState(null);
  const [user, setUser] = useState(null);

  // Инициализируем Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand(); // Расширяем WebApp на весь экран
      tg.ready(); // Сообщаем Telegram, что WebApp готов

      setTelegramWebApp(tg);
      
      // Получаем информацию о пользователе
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }
  }, []);

  // Получаем курсы обмена
  useEffect(() => {
    fetchRates();
    // Обновляем курсы каждые 30 секунд
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  // Пересчитываем сумму при изменении входных данных
  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      if (exchangeType === 'buy') {
        // Если покупаем USDT: сумма в рублях -> получаем USDT
        setCalculatedAmount((parseFloat(amount) / rates.buy).toFixed(2));
      } else {
        // Если продаем USDT: сумма в USDT -> получаем рубли
        setCalculatedAmount((parseFloat(amount) * rates.sell).toFixed(2));
      }
    } else {
      setCalculatedAmount(0);
    }
  }, [amount, rates, exchangeType]);

  const fetchRates = async () => {
    try {
      // В реальном проекте здесь будет запрос к бэкенду
      // const response = await axios.get('/api/rates');
      // setRates(response.data);
      
      // Временное решение с фиксированными курсами для демонстрации
      setRates({
        buy: 97.5,
        sell: 95.5
      });
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const newErrors = {};
      
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        newErrors.amount = 'Введите корректную сумму';
      }

      if (Object.keys(newErrors).length === 0) {
        setErrors({});
        setStep(2);
      } else {
        setErrors(newErrors);
      }
    } else if (step === 2) {
      const newErrors = {};
      
      if (!email || !email.includes('@')) {
        newErrors.email = 'Введите корректный Email';
      }
      
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Введите 16 цифр номера карты';
      }
      
      if (!fullName || fullName.trim().split(' ').length < 2) {
        newErrors.fullName = 'Введите имя и фамилию';
      }

      if (Object.keys(newErrors).length === 0) {
        setErrors({});
        handleSubmit();
      } else {
        setErrors(newErrors);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверяем, что все поля заполнены
    if (!amount || parseFloat(amount) <= 0) {
      setError('Пожалуйста, введите корректную сумму');
      return;
    }
    
    if (exchangeType === 'buy' && (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16)) {
      setError('Пожалуйста, введите корректный номер карты');
      return;
    }
    
    if (!paymentMethod) {
      setError('Пожалуйста, выберите способ оплаты');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Данные для отправки
      const orderData = {
        user_id: user?.id,
        username: user?.username,
        type: exchangeType,
        amount: parseFloat(amount),
        total: parseFloat(calculatedAmount),
        payment_method: paymentMethod,
        card_number: exchangeType === 'buy' ? cardNumber.replace(/\s/g, '') : undefined
      };
      
      // В реальном проекте здесь будет запрос к бэкенду
      // const response = await axios.post('/api/orders', orderData);
      
      // Временное решение для демонстрации
      console.log('Order data:', orderData);
      
      // Отправляем данные в Telegram
      if (telegramWebApp) {
        telegramWebApp.sendData(JSON.stringify(orderData));
        
        // Показываем сообщение об успешной отправке
        telegramWebApp.showPopup({
          title: 'Заявка отправлена',
          message: `Ваша заявка на ${exchangeType === 'buy' ? 'покупку' : 'продажу'} USDT успешно отправлена. Ожидайте сообщения от оператора.`,
          buttons: [{ type: 'ok' }]
        });
        
        // Закрываем WebApp после успешной отправки
        setTimeout(() => {
          telegramWebApp.close();
        }, 3000);
      } else {
        // Если WebApp не доступен, просто показываем сообщение об успехе
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setAmount('');
          setCardNumber('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setError('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExchangeType = () => {
    setExchangeType(exchangeType === 'buy' ? 'sell' : 'buy');
    setAmount('');
    setReceiveAmount('');
  };
  
  // Форматирование номера карты
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

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <Container>
      <Header />
      <Content>
        <RateCard>
          <RateColumn>
            <RateLabel>Покупка USDT</RateLabel>
            <RateValue type="buy">{rates.buy} ₽</RateValue>
          </RateColumn>
          <RateColumn>
            <RateLabel>Продажа USDT</RateLabel>
            <RateValue type="sell">{rates.sell} ₽</RateValue>
          </RateColumn>
        </RateCard>
        
        <Card>
          <ExchangeForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Выберите операцию</Label>
              <RadioGroup>
                <RadioLabel checked={exchangeType === 'buy'}>
                  <RadioInput 
                    type="radio" 
                    name="type" 
                    value="buy" 
                    checked={exchangeType === 'buy'} 
                    onChange={() => setExchangeType('buy')} 
                  />
                  <RadioText checked={exchangeType === 'buy'}>Купить USDT</RadioText>
                </RadioLabel>
                <RadioLabel checked={exchangeType === 'sell'}>
                  <RadioInput 
                    type="radio" 
                    name="type" 
                    value="sell" 
                    checked={exchangeType === 'sell'} 
                    onChange={() => setExchangeType('sell')} 
                  />
                  <RadioText checked={exchangeType === 'sell'}>Продать USDT</RadioText>
                </RadioLabel>
              </RadioGroup>
            </FormGroup>
            
            <FormGroup>
              <Label>{exchangeType === 'buy' ? 'Сумма в рублях' : 'Количество USDT'}</Label>
              <Input 
                type="number" 
                placeholder={exchangeType === 'buy' ? 'Введите сумму в рублях' : 'Введите количество USDT'} 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
              <CalculationRow>
                <span>Вы {exchangeType === 'buy' ? 'получите' : 'получите'}:</span>
                <strong>{calculatedAmount} {exchangeType === 'buy' ? 'USDT' : '₽'}</strong>
              </CalculationRow>
            </FormGroup>
            
            {exchangeType === 'buy' && (
              <FormGroup>
                <Label>Ваша банковская карта</Label>
                <Input 
                  type="text" 
                  placeholder="Номер карты" 
                  value={cardNumber} 
                  onChange={handleCardNumberChange}
                  maxLength="19"
                  required
                />
              </FormGroup>
            )}
            
            <FormGroup>
              <Label>Способ оплаты</Label>
              <Select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="tinkoff">Тинькофф</option>
                <option value="sber">Сбербанк</option>
                <option value="alfabank">Альфа-Банк</option>
                <option value="qiwi">QIWI</option>
                <option value="yoomoney">ЮMoney</option>
              </Select>
            </FormGroup>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>Заявка успешно отправлена!</SuccessMessage>}
            
            <Button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? 'Отправка...' : `${exchangeType === 'buy' ? 'Купить' : 'Продать'} USDT`}
            </Button>
          </ExchangeForm>
        </Card>
        
        <Footnote>
          Нажимая на кнопку, вы соглашаетесь с условиями обмена. 
          Курсы обновляются автоматически каждые 30 секунд.
        </Footnote>
      </Content>
    </Container>
  );
};

export default Exchange; 