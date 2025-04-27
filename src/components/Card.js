import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AnimationSafeWrapper from './AnimationSafeWrapper';
import { safeAnimationProps } from '../utils/motionFeatureDetection';

export const CardTypes = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  FROSTED: 'frosted',
  GRADIENT: 'gradient',
  DARK: 'dark',
};

// Создаем обычную версию контейнера без motion
const StaticCardContainer = styled.div`
  border-radius: var(--border-radius);
  padding: ${props => props.compact ? '15px' : '20px'};
  height: ${props => props.fullHeight ? '100%' : 'auto'};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  ${props => {
    switch (props.type) {
      case CardTypes.PRIMARY:
        return `
          background: var(--card-primary);
          border: 1px solid var(--card-border);
        `;
      case CardTypes.SECONDARY:
        return `
          background: var(--card-secondary);
          border: 1px solid var(--card-border);
        `;
      case CardTypes.FROSTED:
        return `
          background: rgba(21, 29, 40, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
      case CardTypes.GRADIENT:
        return `
          background: linear-gradient(135deg, rgba(41, 56, 78, 0.7) 0%, rgba(26, 35, 49, 0.7) 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
        `;
      case CardTypes.DARK:
        return `
          background: rgba(14, 19, 26, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.03);
        `;
      default:
        return `
          background: var(--card-primary);
          border: 1px solid var(--card-border);
        `;
    }
  }}
  
  ${props => props.clickable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

const CardContainer = styled(motion.div)`
  border-radius: var(--border-radius);
  padding: ${props => props.compact ? '15px' : '20px'};
  height: ${props => props.fullHeight ? '100%' : 'auto'};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  ${props => {
    switch (props.type) {
      case CardTypes.PRIMARY:
        return `
          background: var(--card-primary);
          border: 1px solid var(--card-border);
        `;
      case CardTypes.SECONDARY:
        return `
          background: var(--card-secondary);
          border: 1px solid var(--card-border);
        `;
      case CardTypes.FROSTED:
        return `
          background: rgba(21, 29, 40, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
      case CardTypes.GRADIENT:
        return `
          background: linear-gradient(135deg, rgba(41, 56, 78, 0.7) 0%, rgba(26, 35, 49, 0.7) 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
        `;
      case CardTypes.DARK:
        return `
          background: rgba(14, 19, 26, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.03);
        `;
      default:
        return `
          background: var(--card-primary);
          border: 1px solid var(--card-border);
        `;
    }
  }}
  
  ${props => props.clickable && `
    cursor: pointer;
  `}
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 15px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const CardContent = styled.div`
  flex: 1;
`;

// Функция для определения, использовать ли анимацию
export const Card = ({ 
  children, 
  title, 
  icon, 
  type = CardTypes.PRIMARY, 
  compact = false,
  fullHeight = false,
  clickable = false,
  onClick,
  className,
  ...props 
}) => {
  // Статическая версия карточки без анимаций
  const staticCard = (
    <StaticCardContainer 
      type={type} 
      compact={compact}
      fullHeight={fullHeight}
      clickable={clickable}
      onClick={clickable ? onClick : undefined}
      className={className}
      {...props}
    >
      {title && (
        <CardTitle>
          {icon && icon}
          {title}
        </CardTitle>
      )}
      <CardContent>
        {children}
      </CardContent>
    </StaticCardContainer>
  );
  
  // Анимированная версия карточки
  const animatedCard = (
    <CardContainer 
      type={type} 
      compact={compact}
      fullHeight={fullHeight}
      clickable={clickable}
      onClick={clickable ? onClick : undefined}
      className={className}
      {...safeAnimationProps(clickable ? {
        whileHover: { y: -2, boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)" },
        whileTap: { y: 0 }
      } : {})}
      {...props}
    >
      {title && (
        <CardTitle>
          {icon && icon}
          {title}
        </CardTitle>
      )}
      <CardContent>
        {children}
      </CardContent>
    </CardContainer>
  );

  // Используем обертку для безопасной анимации
  return (
    <AnimationSafeWrapper delay={400} fallback={staticCard}>
      {animatedCard}
    </AnimationSafeWrapper>
  );
};

export default Card; 