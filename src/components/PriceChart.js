import React, { useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import useSafeAnimation from '../hooks/useSafeAnimation';

const ChartContainer = styled(motion.div)`
  width: 100%;
  height: ${props => props.height || '200px'};
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius);
  background: rgba(21, 29, 40, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: var(--spacing-md);
  margin-bottom: ${props => props.marginBottom || '0'};
  
  @media (min-width: 768px) {
    padding: var(--spacing-lg);
    height: ${props => props.height || '220px'};
  }
  
  @media (max-width: 576px) {
    padding: var(--spacing-sm);
    height: ${props => props.height || '180px'};
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const ChartOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-md);
  pointer-events: none;
  
  @media (min-width: 768px) {
    padding: var(--spacing-lg);
  }
  
  @media (max-width: 576px) {
    padding: var(--spacing-sm);
  }
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CurrentPrice = styled.div`
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 5px;
  
  @media (min-width: 768px) {
    font-size: var(--font-size-xl);
  }
  
  @media (max-width: 576px) {
    font-size: var(--font-size-md);
  }
`;

const PriceChange = styled.div`
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: ${props => props.isPositive ? 'var(--success, #00B775)' : 'var(--danger, #F53B57)'};
  display: flex;
  align-items: center;
  background: ${props => props.isPositive ? 'rgba(0, 183, 117, 0.1)' : 'rgba(245, 59, 87, 0.1)'};
  padding: 2px 8px;
  border-radius: 12px;
  
  svg {
    margin-right: 4px;
  }
`;

const CurrencyLabel = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-bottom: 2px;
`;

const TimeControls = styled.div`
  display: flex;
  gap: 6px;
  pointer-events: auto;
  
  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const TimeButton = styled.button`
  background: ${props => props.active ? 'rgba(55, 114, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: none;
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 28px;
  
  &:hover {
    background: rgba(55, 114, 255, 0.15);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 576px) {
    padding: 2px 6px;
    min-height: 24px;
  }
  
  @media (hover: none) {
    min-height: 32px;
    
    @media (max-width: 576px) {
      min-height: 28px;
    }
  }
`;

// Функция для создания случайных данных с более реалистичными паттернами
const generateDummyData = (days, trend = 'up') => {
  const data = [];
  let baseValue = 95 + Math.random() * 5;
  
  // Создаем более реалистичные движения цены
  let momentum = 0;
  
  for (let i = 0; i < days; i++) {
    // Учитываем текущий тренд
    const trendBias = trend === 'up' ? 0.2 : -0.2;
    
    // Инерция предыдущих движений (momentum)
    momentum = momentum * 0.9 + (Math.random() - 0.5 + trendBias) * 0.3;
    
    // Ограничиваем максимальное движение
    if (momentum > 1) momentum = 1;
    if (momentum < -1) momentum = -1;
    
    // Добавляем небольшую случайность для естественности
    const randomNoise = (Math.random() - 0.5) * 0.2;
    
    // Итоговое изменение
    baseValue += momentum + randomNoise;
    
    // Ограничиваем диапазон цены для USDT
    baseValue = Math.max(92, Math.min(102, baseValue));
    
    data.push(baseValue);
  }
  
  return data;
};

const PriceChart = ({ 
  height, 
  marginBottom,
  currency = 'USDT/RUB',
  price = 97.25
}) => {
  const canvasRef = useRef(null);
  const [activeTimeframe, setActiveTimeframe] = React.useState('1W');
  const [priceChangePercent, setPriceChangePercent] = React.useState(2.1);
  const { isMounted, containerRef } = useSafeAnimation(300);
  
  // Используем themeContext для определения цветов (можно получать из CSS переменных)
  const getThemeColors = () => {
    try {
      const style = getComputedStyle(document.documentElement);
      
      // Пытаемся получить CSS переменные
      const accentPrimaryRaw = style.getPropertyValue('--accent-primary') || '#3772FF';
      const accentPrimaryRgbRaw = style.getPropertyValue('--accent-primary-rgb') || '55, 114, 255';
      const successRaw = style.getPropertyValue('--success') || '#00B775';
      const dangerRaw = style.getPropertyValue('--danger') || '#F53B57';
      
      return {
        ACCENT_COLOR: accentPrimaryRaw,
        ACCENT_RGB: accentPrimaryRgbRaw.split(',').map(n => parseInt(n.trim())),
        SUCCESS_COLOR: successRaw,
        DANGER_COLOR: dangerRaw
      };
    } catch (e) {
      // Если не удалось получить переменные, используем значения по умолчанию
      return {
        ACCENT_COLOR: '#3772FF',
        ACCENT_RGB: [55, 114, 255],
        SUCCESS_COLOR: '#00B775',
        DANGER_COLOR: '#F53B57'
      };
    }
  };
  
  // Мемоизируем цвета, чтобы не вычислять их при каждом рендере
  const themeColors = useMemo(() => getThemeColors(), []);
  
  const drawChart = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Масштабируем под ретина-дисплеи
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    const padding = Math.min(width, height) * 0.1; // Адаптивный отступ
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Find min and max values
    const min = Math.min(...data) * 0.995;
    const max = Math.max(...data) * 1.005;
    const range = max - min;
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Vertical grid lines (для таймфреймов)
    for (let i = 0; i <= 4; i++) {
      const x = padding + (chartWidth / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    
    // Подготовка данных для отрисовки с более плавными линиями
    const points = [];
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const normalizedValue = (data[i] - min) / range;
      const y = height - padding - (normalizedValue * chartHeight);
      points.push({ x, y });
    }
    
    // Draw price line с более плавными изгибами
    ctx.strokeStyle = `rgba(${themeColors.ACCENT_RGB.join(',')}, 0.8)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Используем кривую Безье для создания более плавной линии
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    
    // Последняя точка
    ctx.quadraticCurveTo(
      points[points.length - 2].x, 
      points[points.length - 2].y, 
      points[points.length - 1].x, 
      points[points.length - 1].y
    );
    
    ctx.stroke();
    
    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, `rgba(${themeColors.ACCENT_RGB.join(',')}, 0.2)`);
    gradient.addColorStop(1, `rgba(${themeColors.ACCENT_RGB.join(',')}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    // Рисуем заполнение под линией
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    
    // Последняя точка
    ctx.quadraticCurveTo(
      points[points.length - 2].x, 
      points[points.length - 2].y, 
      points[points.length - 1].x, 
      points[points.length - 1].y
    );
    
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Draw points - выделенные точки на линии
    ctx.fillStyle = themeColors.ACCENT_COLOR;
    
    // Рисуем только начало, середину и конец для улучшения производительности
    const keyPoints = [0, Math.floor(points.length / 2), points.length - 1];
    
    keyPoints.forEach(i => {
      if (i < points.length) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };
  
  useEffect(() => {
    // Выходим, если компонент не смонтирован или canvasRef еще не инициализирован
    if (!isMounted || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resize();
    
    // Generate appropriate data based on timeframe
    let days;
    switch(activeTimeframe) {
      case '1D': days = 24; break;
      case '1W': days = 7 * 24 / 3; break; // 3-hour intervals for a week
      case '1M': days = 30; break;
      case '3M': days = 90; break;
      default: days = 7 * 24 / 3;
    }
    
    const trend = priceChangePercent >= 0 ? 'up' : 'down';
    const data = generateDummyData(days, trend);
    
    drawChart(data);
    
    // Resize handler with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        drawChart(data);
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [activeTimeframe, priceChangePercent, isMounted, themeColors]); 
  
  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
    // Имитация случайного изменения цены при смене таймфрейма
    const randomChange = ((Math.random() * 4) - 1).toFixed(1);
    setPriceChangePercent(parseFloat(randomChange));
  };
  
  // Не рендерим компонент, если он еще не смонтирован
  if (!isMounted) {
    return null;
  }
  
  return (
    <ChartContainer 
      ref={containerRef}
      height={height}
      marginBottom={marginBottom}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Canvas ref={canvasRef} />
      
      <ChartOverlay>
        <PriceInfo>
          <CurrencyLabel>{currency}</CurrencyLabel>
          <CurrentPrice>{price} ₽</CurrentPrice>
          <PriceChange isPositive={priceChangePercent >= 0}>
            {priceChangePercent >= 0 ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10L2 6L6 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {Math.abs(priceChangePercent)}%
          </PriceChange>
        </PriceInfo>
        
        <TimeControls>
          <TimeButton 
            active={activeTimeframe === '1D'} 
            onClick={() => handleTimeframeChange('1D')}
            aria-label="Show 1 day chart"
          >
            1D
          </TimeButton>
          <TimeButton 
            active={activeTimeframe === '1W'} 
            onClick={() => handleTimeframeChange('1W')}
            aria-label="Show 1 week chart"
          >
            1W
          </TimeButton>
          <TimeButton 
            active={activeTimeframe === '1M'} 
            onClick={() => handleTimeframeChange('1M')}
            aria-label="Show 1 month chart"
          >
            1M
          </TimeButton>
          <TimeButton 
            active={activeTimeframe === '3M'} 
            onClick={() => handleTimeframeChange('3M')}
            aria-label="Show 3 months chart"
          >
            3M
          </TimeButton>
        </TimeControls>
      </ChartOverlay>
    </ChartContainer>
  );
};

export default PriceChart; 