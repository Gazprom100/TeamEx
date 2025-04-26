import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const ButtonVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  GRADIENT: 'gradient',
  OUTLINE: 'outline',
  SUCCESS: 'success',
  DANGER: 'danger',
  GHOST: 'ghost'
};

export const ButtonSizes = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

const baseButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    switch (props.size) {
      case ButtonSizes.SMALL: return '6px 12px';
      case ButtonSizes.LARGE: return '14px 24px';
      default: return '10px 18px';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case ButtonSizes.SMALL: return '12px';
      case ButtonSizes.LARGE: return '16px';
      default: return '14px';
    }
  }};
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
    margin-right: ${props => props.iconOnly ? '0' : '8px'};
    font-size: ${props => {
      switch (props.size) {
        case ButtonSizes.SMALL: return '14px';
        case ButtonSizes.LARGE: return '20px';
        default: return '16px';
      }
    }};
  }
  
  ${props => {
    switch (props.variant) {
      case ButtonVariants.PRIMARY:
        return css`
          background-color: var(--accent-primary);
          color: var(--white);
          
          &:hover {
            background-color: var(--accent-primary-hover);
          }
          
          &:active {
            background-color: var(--accent-primary-active);
          }
        `;
      case ButtonVariants.SECONDARY:
        return css`
          background-color: var(--dark-button);
          color: var(--text-primary);
          
          &:hover {
            background-color: var(--dark-button-hover);
          }
          
          &:active {
            background-color: var(--dark-button-active);
          }
        `;
      case ButtonVariants.GRADIENT:
        return css`
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          color: var(--white);
          
          &:hover {
            box-shadow: 0 5px 15px rgba(var(--accent-primary-rgb), 0.3);
          }
          
          &:active {
            opacity: 0.9;
          }
        `;
      case ButtonVariants.OUTLINE:
        return css`
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid var(--dark-border);
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.05);
            border-color: var(--text-secondary);
          }
          
          &:active {
            background-color: rgba(255, 255, 255, 0.1);
          }
        `;
      case ButtonVariants.SUCCESS:
        return css`
          background-color: var(--success);
          color: var(--white);
          
          &:hover {
            background-color: var(--success-hover);
          }
          
          &:active {
            background-color: var(--success-active);
          }
        `;
      case ButtonVariants.DANGER:
        return css`
          background-color: var(--danger);
          color: var(--white);
          
          &:hover {
            background-color: var(--danger-hover);
          }
          
          &:active {
            background-color: var(--danger-active);
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
            background-color: rgba(255, 255, 255, 0.1);
          }
        `;
      default:
        return css`
          background-color: var(--accent-primary);
          color: var(--white);
          
          &:hover {
            background-color: var(--accent-primary-hover);
          }
          
          &:active {
            background-color: var(--accent-primary-active);
          }
        `;
    }
  }}
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
  const buttonProps = {
    variant,
    size,
    disabled,
    fullWidth,
    iconOnly,
    margin,
    className,
    whileTap: !disabled ? { scale: 0.97 } : {},
    ...props
  };
  
  if (to) {
    return (
      <StyledLink to={to} {...buttonProps}>
        {icon && icon}
        {children}
      </StyledLink>
    );
  }
  
  return (
    <StyledButton onClick={disabled ? undefined : onClick} {...buttonProps}>
      {icon && icon}
      {children}
    </StyledButton>
  );
};

export default Button; 