import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '../Card';

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

// Мок данных для демонстрации
const MOCK_HISTORY = [
  { id: 1, timestamp: '2023-06-01 10:15', user: 'admin', buyRate: 78.5, sellRate: 76.2 },
  { id: 2, timestamp: '2023-06-01 14:30', user: 'admin', buyRate: 79.0, sellRate: 76.8 },
  { id: 3, timestamp: '2023-06-02 09:45', user: 'admin', buyRate: 78.8, sellRate: 76.5 },
  { id: 4, timestamp: '2023-06-03 11:20', user: 'admin', buyRate: 79.2, sellRate: 77.0 },
  { id: 5, timestamp: '2023-06-04 16:10', user: 'admin', buyRate: 79.5, sellRate: 77.2 },
  { id: 6, timestamp: '2023-06-05 13:40', user: 'admin', buyRate: 80.0, sellRate: 77.5 },
  { id: 7, timestamp: '2023-06-06 10:05', user: 'admin', buyRate: 80.2, sellRate: 77.8 },
  { id: 8, timestamp: '2023-06-07 15:30', user: 'admin', buyRate: 80.5, sellRate: 78.0 },
];

const AdminRates = () => {
  const [buyRate, setBuyRate] = useState('80.5');
  const [sellRate, setSellRate] = useState('78.0');
  const [history, setHistory] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  
  // Симуляция загрузки данных
  useEffect(() => {
    // В реальном приложении здесь был бы API-запрос
    setHistory(MOCK_HISTORY);
  }, []);
  
  const handleBuyRateChange = (e) => {
    setBuyRate(e.target.value);
    setIsFormChanged(true);
  };
  
  const handleSellRateChange = (e) => {
    setSellRate(e.target.value);
    setIsFormChanged(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // В реальном приложении здесь был бы API-запрос для обновления курсов
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      user: 'admin',
      buyRate: parseFloat(buyRate),
      sellRate: parseFloat(sellRate)
    };
    
    setHistory([newEntry, ...history]);
    setIsFormChanged(false);
    
    // Здесь мог бы быть вызов уведомления об успешном обновлении
  };
  
  const handleReset = () => {
    // Возврат к последним сохраненным значениям
    if (history.length > 0) {
      const lastEntry = history[0];
      setBuyRate(lastEntry.buyRate.toString());
      setSellRate(lastEntry.sellRate.toString());
    }
    setIsFormChanged(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      <RatesContainer>
        <RateCard>
          <RateHeader>
            <RateTitle>Управление курсами USDT</RateTitle>
          </RateHeader>
          
          <RateDescription>
            Установите актуальные курсы покупки и продажи USDT. После сохранения изменений новые курсы будут 
            автоматически применены для всех пользователей.
          </RateDescription>
          
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
              />
            </FormGroup>
            
            <ButtonGroup>
              <Button
                type="button"
                onClick={handleReset}
                disabled={!isFormChanged}
              >
                Отменить
              </Button>
              <Button
                type="submit"
                primary
                disabled={!isFormChanged}
              >
                Сохранить изменения
              </Button>
            </ButtonGroup>
          </RateForm>
        </RateCard>
        
        <HistoryCard>
          <HistoryHeader>
            <HistoryTitle>История изменений</HistoryTitle>
          </HistoryHeader>
          
          <HistoryTable>
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
          </HistoryTable>
        </HistoryCard>
      </RatesContainer>
    </motion.div>
  );
};

export default AdminRates; 