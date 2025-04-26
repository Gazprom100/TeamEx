import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Регистрируем необходимые компоненты для ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartContainer = styled(motion.div)`
  width: 100%;
  height: ${({ height }) => height || '300px'};
  position: relative;
  border-radius: var(--card-radius);
  overflow: hidden;
  padding: ${({ compact }) => compact ? '10px' : '20px'};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const ChartPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const PriceValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ increase }) => 
    increase === true 
      ? 'var(--accent-success)' 
      : increase === false 
        ? 'var(--accent-danger)' 
        : 'var(--text-primary)'
  };
`;

const PriceChange = styled.span`
  font-size: 14px;
  color: ${({ increase }) => 
    increase ? 'var(--accent-success)' : 'var(--accent-danger)'
  };
  margin-top: 2px;
`;

const TimeRangeContainer = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 15px;
`;

const TimeButton = styled.button`
  padding: 4px 8px;
  font-size: 12px;
  border-radius: var(--button-radius);
  background: ${({ active }) => 
    active ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)'
  };
  color: ${({ active }) => 
    active ? 'white' : 'var(--text-secondary)'
  };
  transition: all var(--transition-fast);
  
  &:hover {
    background: ${({ active }) => 
      active ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)'
    };
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(12, 14, 20, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(55, 114, 255, 0.1);
  border-top: 3px solid var(--accent-primary);
  border-radius: 50%;
`;

// Генерация моковых данных для графика
const generateChartData = (days, trend = 'up') => {
  const data = [];
  const labels = [];
  
  const startPrice = 92 + Math.random() * 10;
  let currentPrice = startPrice;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    labels.push(
      days <= 7 
        ? date.toLocaleDateString('ru-RU', { weekday: 'short' })
        : date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    );
    
    // Генерируем случайные изменения с заданным трендом
    const change = (Math.random() - (trend === 'up' ? 0.4 : 0.6)) * 2;
    currentPrice = Math.max(85, Math.min(115, currentPrice + change));
    data.push(currentPrice);
  }
  
  return { labels, data, currentPrice, startPrice };
};

const PriceChart = ({ 
  symbol = 'USDT/RUB',
  height = '300px',
  compact = false,
  loading = false,
  showControls = true
}) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    // Имитация загрузки данных
    setChartData(null);
    const timer = setTimeout(() => {
      const trend = Math.random() > 0.5 ? 'up' : 'down';
      let days;
      
      switch(timeRange) {
        case '1d':
          days = 24; // Используем часы для 1-дневного графика
          break;
        case '7d':
          days = 7;
          break;
        case '1m':
          days = 30;
          break;
        case '3m':
          days = 90;
          break;
        case '1y':
          days = 365;
          break;
        default:
          days = 7;
      }
      
      setChartData(generateChartData(days, trend));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [timeRange]);
  
  const getChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(26, 31, 53, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `${context.parsed.y.toFixed(2)} ₽`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: 'rgba(161, 168, 194, 0.6)',
            font: {
              size: 10
            },
            maxRotation: 0
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: 'rgba(161, 168, 194, 0.6)',
            font: {
              size: 10
            },
            callback: function(value) {
              return value + ' ₽';
            }
          }
        }
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 5,
          hitRadius: 30
        },
        line: {
          tension: 0.4
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    };
  };
  
  const getChartConfig = () => {
    if (!chartData) return null;
    
    const { labels, data } = chartData;
    const isPositive = chartData.currentPrice >= chartData.startPrice;
    
    return {
      labels,
      datasets: [
        {
          data,
          borderColor: isPositive ? 'var(--accent-success)' : 'var(--accent-danger)',
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
            gradient.addColorStop(0, isPositive ? 'rgba(0, 183, 117, 0.2)' : 'rgba(245, 59, 87, 0.2)');
            gradient.addColorStop(1, 'rgba(26, 31, 53, 0)');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          borderWidth: 2
        }
      ]
    };
  };
  
  const isPriceIncrease = chartData 
    ? chartData.currentPrice > chartData.startPrice 
    : null;
  
  const priceChange = chartData 
    ? ((chartData.currentPrice - chartData.startPrice) / chartData.startPrice * 100).toFixed(2) 
    : 0;
  
  return (
    <ChartContainer 
      height={height}
      compact={compact}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ChartHeader>
        <ChartTitle>{symbol}</ChartTitle>
        {chartData && (
          <ChartPrice>
            <PriceValue increase={isPriceIncrease}>
              {chartData.currentPrice.toFixed(2)} ₽
            </PriceValue>
            <PriceChange increase={isPriceIncrease}>
              {isPriceIncrease ? '+' : ''}{priceChange}%
            </PriceChange>
          </ChartPrice>
        )}
      </ChartHeader>
      
      {chartData && getChartConfig() && (
        <Line 
          data={getChartConfig()} 
          options={getChartOptions()} 
          height={compact ? 120 : 200} 
        />
      )}
      
      {showControls && (
        <TimeRangeContainer>
          <TimeButton 
            active={timeRange === '1d'} 
            onClick={() => setTimeRange('1d')}
          >
            1Д
          </TimeButton>
          <TimeButton 
            active={timeRange === '7d'} 
            onClick={() => setTimeRange('7d')}
          >
            7Д
          </TimeButton>
          <TimeButton 
            active={timeRange === '1m'} 
            onClick={() => setTimeRange('1m')}
          >
            1М
          </TimeButton>
          <TimeButton 
            active={timeRange === '3m'} 
            onClick={() => setTimeRange('3m')}
          >
            3М
          </TimeButton>
          <TimeButton 
            active={timeRange === '1y'} 
            onClick={() => setTimeRange('1y')}
          >
            1Г
          </TimeButton>
        </TimeRangeContainer>
      )}
      
      {(loading || !chartData) && (
        <LoadingOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingSpinner 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </LoadingOverlay>
      )}
    </ChartContainer>
  );
};

export default PriceChart; 