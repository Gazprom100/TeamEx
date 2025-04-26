import React from 'react';
import styled, { css } from 'styled-components';

const ButtonVariants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  MENU: 'menu',
};

const StyledButton = styled.button`
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  ${({ variant }) => {
    switch (variant) {
      case ButtonVariants.PRIMARY:
        return css`
          background-color: var(--button-green);
          color: var(--text-white);
          border: 1px solid var(--main-green);
          
          &:hover {
            background-color: var(--button-hover);
          }
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `;
      case ButtonVariants.SECONDARY:
        return css`
          background-color: transparent;
          color: var(--text-white);
          border: 1px solid var(--text-gray);
          
          &:hover {
            border-color: var(--text-white);
          }
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `;
      case ButtonVariants.MENU:
        return css`
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-white);
          border: none;
          padding: 20px;
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        `;
      default:
        return css`
          background-color: var(--button-green);
          color: var(--text-white);
          border: none;
          
          &:hover {
            background-color: var(--button-hover);
          }
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `;
    }
  }}
`;

const Button = ({ 
  children, 
  variant = ButtonVariants.PRIMARY, 
  fullWidth = false, 
  ...props 
}) => {
  return (
    <StyledButton variant={variant} fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
};

export { Button, ButtonVariants }; 