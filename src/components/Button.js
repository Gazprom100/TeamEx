import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { safeAnimationProps } from '../utils/motionFeatureDetection';

export const ButtonVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  GRADIENT: 'gradient',
  OUTLINE: 'outline',
  SUCCESS: 'success',
  DANGER: 'danger',
  GHOST: 'ghost',
  ACCENT: 'accent',
  GLASS: 'glass'
};

export const ButtonSizes = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

// Функция для определения стилей в зависимости от размера
const getSizeStyles = (size) => {
  switch (size) {
    case ButtonSizes.SMALL:
      return {
        padding: 'var(--spacing-xs) var(--spacing-md)',
        fontSize: 'var(--font-size-sm)',
        height: '32px',
        iconSize: '14px',
        iconMargin: '6px'
      };
    case ButtonSizes.LARGE:
      return {
        padding: 'var(--spacing-sm) var(--spacing-lg)',
        fontSize: 'var(--font-size-md)',
        height: '48px',
        iconSize: '20px',
        iconMargin: '10px'
      };
    default: // MEDIUM
      return {
        padding: 'var(--spacing-sm) var(--spacing-md)',
        fontSize: 'var(--font-size-sm)',
        height: '40px',
        iconSize: '16px',
        iconMargin: '8px'
      };
  }
};

const baseButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => getSizeStyles(props.size).padding};
  font-size: ${props => getSizeStyles(props.size).fontSize};
  height: ${props => getSizeStyles(props.size).height};
  font-weight: 600;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin: ${props => props.margin || '0'};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  svg {
    margin-right: ${props => props.iconOnly ? '0' : getSizeStyles(props.size).iconMargin};
    font-size: ${props => getSizeStyles(props.size).iconSize};
    flex-shrink: 0;
  }
  
  // Стили для различных вариантов кнопок
  ${props => {
    switch (props.variant) {
      case ButtonVariants.PRIMARY:
        return css`
          background-color: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 6px rgba(var(--accent-primary-rgb), 0.2);
          
          &:hover {
            box-shadow: 0 5px 10px rgba(var(--accent-primary-rgb), 0.3);
            transform: translateY(-1px);
          }
          
          &:active {
            box-shadow: 0 2px 4px rgba(var(--accent-primary-rgb), 0.2);
            transform: translateY(0);
          }
        `;
      case ButtonVariants.SECONDARY:
        return css`
          background-color: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.15);
          }
          
          &:active {
            background-color: rgba(255, 255, 255, 0.2);
          }
        `;
      case ButtonVariants.GRADIENT:
        return css`
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          color: white;
          box-shadow: 0 4px 10px rgba(var(--accent-primary-rgb), 0.3);
          
          &:hover {
            box-shadow: 0 6px 15px rgba(var(--accent-primary-rgb), 0.4);
            transform: translateY(-1px);
          }
          
          &:active {
            box-shadow: 0 3px 8px rgba(var(--accent-primary-rgb), 0.3);
            transform: translateY(0);
          }
        `;
      case ButtonVariants.OUTLINE:
        return css`
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid rgba(255, 255, 255, 0.2);
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.3);
          }
          
          &:active {
            background-color: rgba(255, 255, 255, 0.1);
          }
        `;
      case ButtonVariants.SUCCESS:
        return css`
          background-color: var(--success, #10b981);
          color: white;
          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
          
          &:hover {
            box-shadow: 0 5px 10px rgba(16, 185, 129, 0.3);
            transform: translateY(-1px);
          }
          
          &:active {
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
            transform: translateY(0);
          }
        `;
      case ButtonVariants.DANGER:
        return css`
          background-color: var(--danger, #ef4444);
          color: white;
          box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
          
          &:hover {
            box-shadow: 0 5px 10px rgba(239, 68, 68, 0.3);
            transform: translateY(-1px);
          }
          
          &:active {
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
            transform: translateY(0);
          }
        `;
      case ButtonVariants.GHOST:
        return css`
          background-color: transparent;
          color: var(--text-secondary);
          
          &:hover {
            color: var(--text-primary);
            background-color: rgba(255, 255, 255, 0.05);
          }
          
          &:active {
            background-color: rgba(255, 255, 255, 0.08);
          }
        `;
      case ButtonVariants.ACCENT:
        return css`
          background-color: rgba(var(--accent-primary-rgb), 0.15);
          color: var(--accent-primary);
          
          &:hover {
            background-color: rgba(var(--accent-primary-rgb), 0.2);
          }
          
          &:active {
            background-color: rgba(var(--accent-primary-rgb), 0.25);
          }
        `;
      case ButtonVariants.GLASS:
        return css`
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          
          &:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
          }
          
          &:active {
            background: rgba(255, 255, 255, 0.2);
          }
        `;
      default:
        return css`
          background-color: var(--accent-primary);
          color: white;
          
          &:hover {
            background-color: var(--accent-secondary);
          }
          
          &:active {
            opacity: 0.9;
          }
        `;
    }
  }}
  
  // Адаптивные стили
  @media (max-width: 576px) {
    font-size: ${props => props.size === ButtonSizes.LARGE ? 'var(--font-size-sm)' : getSizeStyles(props.size).fontSize};
    padding: ${props => {
      if (props.size === ButtonSizes.LARGE) {
        return 'var(--spacing-sm) var(--spacing-md)';
      }
      return getSizeStyles(props.size).padding;
    }};
  }
  
  // Улучшенная доступность для сенсорных устройств
  @media (hover: none) {
    min-height: 44px;
    padding: ${props => props.iconOnly ? 'var(--spacing-sm)' : getSizeStyles(props.size).padding};
  }
`;

const StyledButton = styled(motion.button)`
  ${baseButtonStyles}
`;

const StyledLink = styled(motion(Link))`
  ${baseButtonStyles}
  text-decoration: none;
`;

export const Button = ({
  children,
  variant = ButtonVariants.PRIMARY,
  size = ButtonSizes.MEDIUM,
  onClick,
  to,
  icon,
  iconOnly = false,
  disabled = false,
  fullWidth = false,
  margin,
  className,
  ...props
}) => {
  const motionProps = safeAnimationProps({
    whileTap: !disabled ? { scale: 0.97 } : {},
    whileHover: !disabled ? { y: -1 } : {}
  });
  
  const buttonProps = {
    variant,
    size,
    disabled,
    fullWidth,
    iconOnly,
    margin,
    className,
    ...motionProps,
    ...props
  };
  
  if (to) {
    return (
      <StyledLink to={to} {...buttonProps}>
        {icon && icon}
        {!iconOnly && children}
      </StyledLink>
    );
  }
  
  return (
    <StyledButton onClick={disabled ? undefined : onClick} {...buttonProps}>
      {icon && icon}
      {!iconOnly && children}
    </StyledButton>
  );
};

export default Button; 