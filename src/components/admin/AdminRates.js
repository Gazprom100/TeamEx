import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '../Card';
import { getBuyRate, getSellRate, getRatesHistory, updateRates } from '../../services/RatesService';

const RatesContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--spacing-md);
  height: calc(100vh - 220px);
`;

const RateCard = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
`;

const RateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const RateTitle = styled.h2`
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
`;

const RateDescription = styled.p`
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--text-secondary);
`;

const RateForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
`;

const Input = styled.input`
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  outline: none;
  
  &:focus {
    border-color: var(--color-primary);
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-md);
  grid-column: span 2;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--text-secondary)'};
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: ${props => props.primary ? 'var(--spacing-md)' : '0'};
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--color-primary-dark)' : 'rgba(255, 255, 255, 0.05)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HistoryCard = styled(Card)`
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const HistoryHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HistoryTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: 500;
`;

const HistoryTable = styled.div`
  flex: 1;
  overflow-y: auto;
  font-size: var(--font-size-sm);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  position: sticky;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-secondary);
  font-weight: 500;
`;

const TableCell = styled.td`
  padding: var(--spacing-sm) var(--spacing-md);
  color: ${props => props.highlight ? 'var(--color-success)' : 'var(--text-primary)'};
`;

const NotificationBar = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${props => props.type === 'success' ? 'rgba(0, 200, 83, 0.9)' : 'rgba(255, 59, 48, 0.9)'};
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const EmptyHistory = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--text-secondary);
  font-style: italic;
`;

const AdminRates = () => {
  const [buyRate, setBuyRate] = useState('');
  const [sellRate, setSellRate] = useState('');
  const [history, setHistory] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // Загрузка данных при монтировании
  useEffect(() => {
    loadRates();
  }, []);
  
  // Загрузка актуальных курсов и истории
  const loadRates = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Получаем актуальные курсы через API
      const currentBuyRate = await getBuyRate();
      const currentSellRate = await getSellRate();
      const ratesHistory = getRatesHistory();
      
      setBuyRate(currentBuyRate.toString());
      setSellRate(currentSellRate.toString());
      setHistory(ratesHistory);
      
      // Сбрасываем флаг изменений при загрузке данных
      setIsFormChanged(false);
      
      console.log('Данные о курсах загружены:', { currentBuyRate, currentSellRate, historyLength: ratesHistory.length });
    } catch (error) {
      console.error('Ошибка при загрузке курсов:', error);
      showNotification('Ошибка при загрузке данных: ' + (error.message || 'Неизвестная ошибка'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Обработчик изменения курса покупки
  const handleBuyRateChange = (e) => {
    setBuyRate(e.target.value);
    setIsFormChanged(true);
  };
  
  // Обработчик изменения курса продажи
  const handleSellRateChange = (e) => {
    setSellRate(e.target.value);
    setIsFormChanged(true);
  };
  
  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация перед отправкой
    if (!buyRate || isNaN(parseFloat(buyRate)) || parseFloat(buyRate) <= 0) {
      showNotification('Курс покупки должен быть положительным числом', 'error');
      return;
    }
    
    if (!sellRate || isNaN(parseFloat(sellRate)) || parseFloat(sellRate) <= 0) {
      showNotification('Курс продажи должен быть положительным числом', 'error');
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Обновляем курсы через сервис
      const result = await updateRates(parseFloat(buyRate), parseFloat(sellRate));
      
      // Обновляем состояние компонента
      setBuyRate(result.buyRate.toString());
      setSellRate(result.sellRate.toString());
      setHistory([result.historyEntry, ...history]);
      setIsFormChanged(false);
      
      // Показываем уведомление об успехе
      showNotification('Курсы успешно обновлены', 'success');
      
      console.log('Курсы обновлены:', result);
    } catch (error) {
      console.error('Ошибка при обновлении курсов:', error);
      showNotification('Ошибка при обновлении курсов: ' + (error.message || 'Неизвестная ошибка'), 'error');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Отображение уведомления
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };
  
  // Обработчик сброса формы
  const handleReset = async () => {
    try {
      setIsUpdating(true);
      
      // Возврат к последним сохраненным значениям
      if (history.length > 0) {
        const lastEntry = history[0];
        setBuyRate(lastEntry.buyRate.toString());
        setSellRate(lastEntry.sellRate.toString());
      } else {
        // Если истории нет, берем значения из сервиса
        const currentBuyRate = await getBuyRate();
        const currentSellRate = await getSellRate();
        setBuyRate(currentBuyRate.toString());
        setSellRate(currentSellRate.toString());
      }
      
      setIsFormChanged(false);
    } catch (error) {
      console.error('Ошибка при сбросе формы:', error);
      showNotification('Ошибка при загрузке текущих курсов: ' + (error.message || 'Неизвестная ошибка'), 'error');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Обработчик обновления курсов
  const handleRefresh = async () => {
    await loadRates();
    showNotification('Курсы успешно обновлены', 'success');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      {notification.show && (
        <NotificationBar type={notification.type}>
          {notification.message}
        </NotificationBar>
      )}
      
      <RatesContainer>
        <RateCard>
          <RateHeader>
            <RateTitle>Управление курсами USDT</RateTitle>
            <Button 
              type="button" 
              onClick={handleRefresh}
              disabled={isUpdating || isLoading}
            >
              Обновить
            </Button>
          </RateHeader>
          
          <RateDescription>
            Установите актуальные курсы покупки и продажи USDT. После сохранения изменений новые курсы будут 
            автоматически применены для всех пользователей.
          </RateDescription>
          
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
              Загрузка курсов...
            </div>
          ) : (
            <RateForm onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="buyRate">Курс покупки (руб.)</Label>
                <Input
                  id="buyRate"
                  type="number"
                  step="0.1"
                  min="0"
                  value={buyRate}
                  onChange={handleBuyRateChange}
                  required
                  disabled={isUpdating}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="sellRate">Курс продажи (руб.)</Label>
                <Input
                  id="sellRate"
                  type="number"
                  step="0.1"
                  min="0"
                  value={sellRate}
                  onChange={handleSellRateChange}
                  required
                  disabled={isUpdating}
                />
              </FormGroup>
              
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={handleReset}
                  disabled={!isFormChanged || isUpdating}
                >
                  Отменить
                </Button>
                <Button
                  type="submit"
                  primary
                  disabled={!isFormChanged || isUpdating}
                >
                  {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </ButtonGroup>
            </RateForm>
          )}
        </RateCard>
        
        <HistoryCard>
          <HistoryHeader>
            <HistoryTitle>
              История изменений
              {history.length > 0 ? ` (${history.length})` : ''}
            </HistoryTitle>
          </HistoryHeader>
          
          <HistoryTable>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                Загрузка истории...
              </div>
            ) : history.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Дата и время</TableHeader>
                    <TableHeader>Администратор</TableHeader>
                    <TableHeader>Курс покупки</TableHeader>
                    <TableHeader>Курс продажи</TableHeader>
                  </TableRow>
                </TableHead>
                <tbody>
                  {history.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.timestamp}</TableCell>
                      <TableCell>{entry.user}</TableCell>
                      <TableCell>{entry.buyRate.toFixed(1)}</TableCell>
                      <TableCell>{entry.sellRate.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyHistory>
                <p>История изменений пуста</p>
              </EmptyHistory>
            )}
          </HistoryTable>
        </HistoryCard>
      </RatesContainer>
    </motion.div>
  );
};

export default AdminRates; 