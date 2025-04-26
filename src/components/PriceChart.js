import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ChartContainer = styled(motion.div)`
  width: 100%;
  height: ${props => props.height || '200px'};
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius);
  background: rgba(21, 29, 40, 0.5);
  padding: 20px;
  margin-bottom: ${props => props.marginBottom || '0'};
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
  padding: 20px;
  pointer-events: none;
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CurrentPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 5px;
`;

const PriceChange = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.isPositive ? 'var(--success)' : 'var(--danger)'};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
`;

const TimeControls = styled.div`
  display: flex;
  gap: 10px;
  pointer-events: auto;
`;

const TimeButton = styled.button`
  background: ${props => props.active ? 'rgba(var(--accent-primary-rgb), 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: none;
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(var(--accent-primary-rgb), 0.15);
  }
`;

// Функция для создания случайных данных
const generateDummyData = (days, trend = 'up') => {
  const data = [];
  let baseValue = 95 + Math.random() * 5;
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - (trend === 'up' ? 0.3 : 0.7)) * 2;
    baseValue += change;
    baseValue = Math.max(90, Math.min(100, baseValue));
    
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
  
  const drawChart = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Find min and max values
    const min = Math.min(...data) * 0.99;
    const max = Math.max(...data) * 1.01;
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
    
    // Draw price line
    ctx.strokeStyle = 'rgba(var(--accent-primary-rgb), 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Create line path
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const yNormalized = (data[i] - min) / range;
      const y = height - padding - (yNormalized * chartHeight);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(var(--accent-primary-rgb), 0.2)');
    gradient.addColorStop(1, 'rgba(var(--accent-primary-rgb), 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    // Draw same line but close the path to bottom
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const yNormalized = (data[i] - min) / range;
      const y = height - padding - (yNormalized * chartHeight);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
    
    // Draw points
    ctx.fillStyle = 'var(--accent-primary)';
    for (let i = 0; i < data.length; i += Math.floor(data.length / 5)) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const yNormalized = (data[i] - min) / range;
      const y = height - padding - (yNormalized * chartHeight);
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    
    // Generate appropriate data based on timeframe
    let days;
    switch(activeTimeframe) {
      case '1D': days = 24; break;
      case '1W': days = 7; break;
      case '1M': days = 30; break;
      case '3M': days = 90; break;
      default: days = 7;
    }
    
    const trend = priceChangePercent >= 0 ? 'up' : 'down';
    const data = generateDummyData(days, trend);
    
    drawChart(data);
    
    // Resize handler
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        drawChart(data);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTimeframe, priceChangePercent]);
  
  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
    // Имитация случайного изменения цены при смене таймфрейма
    const randomChange = ((Math.random() * 4) - 1).toFixed(1);
    setPriceChangePercent(parseFloat(randomChange));
  };
  
  return (
    <ChartContainer 
      height={height}
      marginBottom={marginBottom}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Canvas ref={canvasRef} />
      
      <ChartOverlay>
        <PriceInfo>
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
          >
            1D
          </TimeButton>
          <TimeButton 
            active={activeTimeframe === '1W'} 
            onClick={() => handleTimeframeChange('1W')}
          >
            1W
          </TimeButton>
          <TimeButton 
            active={activeTimeframe === '1M'} 
            onClick={() => handleTimeframeChange('1M')}
          >
            1M
          </TimeButton>
          <TimeButton 
            active={activeTimeframe === '3M'} 
            onClick={() => handleTimeframeChange('3M')}
          >
            3M
          </TimeButton>
        </TimeControls>
      </ChartOverlay>
    </ChartContainer>
  );
};

export default PriceChart; 