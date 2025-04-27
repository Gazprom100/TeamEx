import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '../Card';

const StatsContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--spacing-md);
  height: calc(100vh - 220px);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
`;

const MetricCard = styled(Card)`
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
`;

const MetricTitle = styled.h3`
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
`;

const MetricValue = styled.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  
  span {
    color: ${props => props.positive ? 'var(--color-success)' : props.negative ? 'var(--color-danger)' : 'inherit'};
  }
`;

const MetricChange = styled.div`
  font-size: var(--font-size-xs);
  color: ${props => props.positive ? 'var(--color-success)' : props.negative ? 'var(--color-danger)' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: var(--spacing-xs);
  }
`;

const ChartCard = styled(Card)`
  grid-column: span 3;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ChartTitle = styled.h2`
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: 500;
`;

const ChartControls = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const ChartButton = styled.button`
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  color: ${props => props.active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const ChartContent = styled.div`
  flex: 1;
  min-height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartPlaceholder = styled.div`
  text-align: center;
  color: var(--text-secondary);
  
  svg {
    font-size: 48px;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
  }
  
  p {
    margin: 0;
    font-size: var(--font-size-sm);
  }
`;

const RecentActivityCard = styled(Card)`
  grid-column: span 3;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ActivityHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActivityTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: 500;
`;

const ActivityContent = styled.div`
  flex: 1;
  overflow-y: auto;
  font-size: var(--font-size-sm);
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

const ActivityIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => 
    props.type === 'buy' ? 'rgba(0, 200, 83, 0.1)' : 
    props.type === 'sell' ? 'rgba(255, 59, 48, 0.1)' : 
    'rgba(10, 132, 255, 0.1)'
  };
  color: ${props => 
    props.type === 'buy' ? 'var(--color-success)' : 
    props.type === 'sell' ? 'var(--color-danger)' : 
    'var(--color-primary)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
`;

const ActivityDetails = styled.div`
  flex: 1;
`;

const ActivityTitle2 = styled.div`
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const ActivityMeta = styled.div`
  color: var(--text-secondary);
  display: flex;
  font-size: var(--font-size-xs);
  
  span {
    display: flex;
    align-items: center;
    
    &:not(:last-child) {
      margin-right: var(--spacing-md);
    }
    
    svg {
      margin-right: var(--spacing-xs);
    }
  }
`;

const ActivityAmount = styled.div`
  font-weight: 500;
  color: ${props => 
    props.type === 'buy' ? 'var(--color-success)' : 
    props.type === 'sell' ? 'var(--color-danger)' : 
    'var(--text-primary)'
  };
`;

// Мок данных для демонстрации
const MOCK_RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'buy',
    title: 'Покупка USDT',
    user: '@user123',
    timestamp: '10 минут назад',
    amount: '1000 USDT',
    rubles: '80500 ₽'
  },
  {
    id: 2,
    type: 'sell',
    title: 'Продажа USDT',
    user: '@trader456',
    timestamp: '25 минут назад',
    amount: '500 USDT',
    rubles: '39000 ₽'
  },
  {
    id: 3,
    type: 'buy',
    title: 'Покупка USDT',
    user: '@crypto789',
    timestamp: '45 минут назад',
    amount: '2500 USDT',
    rubles: '201250 ₽'
  },
  {
    id: 4,
    type: 'sell',
    title: 'Продажа USDT',
    user: '@investor321',
    timestamp: '2 часа назад',
    amount: '1800 USDT',
    rubles: '140400 ₽'
  },
  {
    id: 5,
    type: 'buy',
    title: 'Покупка USDT',
    user: '@newuser555',
    timestamp: '3 часа назад',
    amount: '300 USDT',
    rubles: '24150 ₽'
  },
];

const ArrowUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5L19 12L17.6 13.4L13 8.8V19H11V8.8L6.4 13.4L5 12L12 5Z" fill="currentColor"/>
  </svg>
);

const ArrowDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 19L5 12L6.4 10.6L11 15.2V5H13V15.2L17.6 10.6L19 12L12 19Z" fill="currentColor"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13H7V21H3V13ZM10 9H14V21H10V9ZM17 5H21V21H17V5Z" fill="currentColor"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
  </svg>
);

const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13ZM18 18H6V17.01C6.2 16.29 9.3 15 12 15C14.7 15 17.8 16.29 18 17V18Z" fill="currentColor"/>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="currentColor"/>
  </svg>
);

const AdminStats = () => {
  const [periodFilter, setPeriodFilter] = useState('week');
  const [recentActivity, setRecentActivity] = useState([]);
  
  // Симуляция загрузки данных
  useEffect(() => {
    // В реальном приложении здесь был бы API-запрос
    setRecentActivity(MOCK_RECENT_ACTIVITY);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      <StatsContainer>
        <StatsGrid>
          <MetricCard>
            <MetricTitle>Объем транзакций (USDT)</MetricTitle>
            <MetricValue positive>
              <span>12,450</span>
            </MetricValue>
            <MetricChange positive>
              <ArrowUp /> +24.8% с прошлого периода
            </MetricChange>
          </MetricCard>
          
          <MetricCard>
            <MetricTitle>Активные пользователи</MetricTitle>
            <MetricValue>
              <span>328</span>
            </MetricValue>
            <MetricChange positive>
              <ArrowUp /> +12.3% с прошлого периода
            </MetricChange>
          </MetricCard>
          
          <MetricCard>
            <MetricTitle>Средний чек (руб.)</MetricTitle>
            <MetricValue negative>
              <span>42,800 ₽</span>
            </MetricValue>
            <MetricChange negative>
              <ArrowDown /> -5.2% с прошлого периода
            </MetricChange>
          </MetricCard>
          
          <ChartCard>
            <ChartHeader>
              <ChartTitle>Объем транзакций</ChartTitle>
              <ChartControls>
                <ChartButton 
                  active={periodFilter === 'day'} 
                  onClick={() => setPeriodFilter('day')}
                >
                  День
                </ChartButton>
                <ChartButton 
                  active={periodFilter === 'week'} 
                  onClick={() => setPeriodFilter('week')}
                >
                  Неделя
                </ChartButton>
                <ChartButton 
                  active={periodFilter === 'month'} 
                  onClick={() => setPeriodFilter('month')}
                >
                  Месяц
                </ChartButton>
                <ChartButton 
                  active={periodFilter === 'year'} 
                  onClick={() => setPeriodFilter('year')}
                >
                  Год
                </ChartButton>
              </ChartControls>
            </ChartHeader>
            
            <ChartContent>
              <ChartPlaceholder>
                <ChartIcon />
                <p>Здесь будет отображаться график транзакций за выбранный период</p>
              </ChartPlaceholder>
            </ChartContent>
          </ChartCard>
          
          <RecentActivityCard>
            <ActivityHeader>
              <ActivityTitle>Последние операции</ActivityTitle>
            </ActivityHeader>
            
            <ActivityContent>
              {recentActivity.map(activity => (
                <ActivityItem key={activity.id}>
                  <ActivityIcon type={activity.type}>
                    <ShoppingCartIcon />
                  </ActivityIcon>
                  
                  <ActivityDetails>
                    <ActivityTitle2>{activity.title}</ActivityTitle2>
                    <ActivityMeta>
                      <span>
                        <UserIcon /> {activity.user}
                      </span>
                      <span>
                        <ClockIcon /> {activity.timestamp}
                      </span>
                    </ActivityMeta>
                  </ActivityDetails>
                  
                  <ActivityAmount type={activity.type}>
                    {activity.type === 'buy' ? '+' : '-'} {activity.amount}
                    <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.7 }}>
                      {activity.rubles}
                    </div>
                  </ActivityAmount>
                </ActivityItem>
              ))}
            </ActivityContent>
          </RecentActivityCard>
        </StatsGrid>
      </StatsContainer>
    </motion.div>
  );
};

export default AdminStats; 