import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.marginBottom || '16px'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;
`;

const InputLabel = styled.label`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
  
  ${props => props.required && css`
    &::after {
      content: '*';
      color: var(--danger);
      margin-left: 4px;
    }
  `}
`;

const StyledInput = styled(motion.input)`
  background: var(--dark-input);
  border: 1px solid ${props => props.error ? 'var(--danger)' : props.focused ? 'var(--accent-primary)' : 'var(--dark-border)'};
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: 14px;
  padding: 12px 16px;
  transition: all 0.2s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  outline: none;
  box-shadow: ${props => props.focused ? '0 0 0 2px rgba(var(--accent-primary-rgb), 0.2)' : 'none'};
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px rgba(var(--accent-primary-rgb), 0.2);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${props => props.type === 'textarea' && css`
    min-height: 100px;
    resize: vertical;
  `}
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: var(--danger);
  margin-top: 5px;
`;

const HelperText = styled.div`
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 5px;
`;

export const Input = forwardRef(({
  label,
  required,
  error,
  helperText,
  fullWidth = false,
  type = 'text',
  marginBottom,
  ...props
}, ref) => {
  const [focused, setFocused] = React.useState(false);
  
  const handleFocus = (e) => {
    setFocused(true);
    if (props.onFocus) props.onFocus(e);
  };
  
  const handleBlur = (e) => {
    setFocused(false);
    if (props.onBlur) props.onBlur(e);
  };
  
  return (
    <InputContainer fullWidth={fullWidth} marginBottom={marginBottom}>
      {label && (
        <InputLabel required={required}>
          {label}
        </InputLabel>
      )}
      
      <StyledInput
        as={type === 'textarea' ? 'textarea' : 'input'}
        type={type === 'textarea' ? undefined : type}
        ref={ref}
        required={required}
        focused={focused}
        error={error}
        fullWidth={fullWidth}
        onFocus={handleFocus}
        onBlur={handleBlur}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -5, opacity: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
      />
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputContainer>
  );
});

export default Input; 