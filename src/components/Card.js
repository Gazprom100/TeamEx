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
  ACCENT: 'accent',
};

export const CardSizes = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

// Функция стилей для разных размеров карточек
const getSizingStyles = (size, compact) => {
  // Базовые размеры (для medium)
  let padding = compact ? 'var(--spacing-md)' : 'var(--spacing-lg)';
  let titleSize = 'var(--font-size-lg)';
  let titleMargin = 'var(--spacing-md)';
  let iconSize = '24px';
  let iconMargin = 'var(--spacing-sm)';
  
  // Переопределяем для разных размеров
  switch (size) {
    case CardSizes.SMALL:
      padding = compact ? 'var(--spacing-sm)' : 'var(--spacing-md)';
      titleSize = 'var(--font-size-md)';
      titleMargin = 'var(--spacing-sm)';
      iconSize = '20px';
      iconMargin = '6px';
      break;
    case CardSizes.LARGE:
      padding = compact ? 'var(--spacing-lg)' : 'var(--spacing-xl)';
      titleSize = 'var(--font-size-xl)';
      titleMargin = 'var(--spacing-lg)';
      iconSize = '28px';
      iconMargin = 'var(--spacing-md)';
      break;
    default:
      // Medium - уже установлены базовые значения
      break;
  }
  
  return { padding, titleSize, titleMargin, iconSize, iconMargin };
};

// Общая логика стилей для обоих контейнеров (статического и анимированного)
const getCardStyles = (props) => {
  const { padding } = getSizingStyles(props.size, props.compact);
  
  return `
    border-radius: var(--border-radius);
    padding: ${padding};
    height: ${props.fullHeight ? '100%' : 'auto'};
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    
    ${(() => {
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
            background: rgba(21, 29, 40, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
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
            background: rgba(14, 19, 26, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.03);
          `;
        case CardTypes.ACCENT:
          return `
            background: rgba(var(--accent-primary-rgb), 0.15);
            border: 1px solid rgba(var(--accent-primary-rgb), 0.3);
          `;
        default:
          return `
            background: var(--card-primary);
            border: 1px solid var(--card-border);
          `;
      }
    })()}
    
    @media (max-width: 576px) {
      padding: ${props.compact ? 'var(--spacing-sm)' : 'var(--spacing-md)'};
    }
  `;
};

// Создаем обычную версию контейнера без motion
const StaticCardContainer = styled.div`
  ${props => getCardStyles(props)}
  
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
  ${props => getCardStyles(props)}
  
  ${props => props.clickable && `
    cursor: pointer;
  `}
`;

const CardTitle = styled.h3`
  font-size: ${props => getSizingStyles(props.size, props.compact).titleSize};
  font-weight: 600;
  margin: 0 0 ${props => getSizingStyles(props.size, props.compact).titleMargin};
  color: var(--text-primary);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${props => getSizingStyles(props.size, props.compact).iconMargin};
    font-size: ${props => getSizingStyles(props.size, props.compact).iconSize};
  }
  
  @media (max-width: 576px) {
    font-size: calc(${props => getSizingStyles(props.size, props.compact).titleSize} * 0.9);
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
  size = CardSizes.MEDIUM,
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
      size={size}
      compact={compact}
      fullHeight={fullHeight}
      clickable={clickable}
      onClick={clickable ? onClick : undefined}
      className={className}
      {...props}
    >
      {title && (
        <CardTitle size={size} compact={compact}>
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
      size={size}
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
        <CardTitle size={size} compact={compact}>
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