import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  font-size: 16px;
  color: var(--text-white);
  margin-bottom: 8px;
`;

const StyledInput = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid var(--text-gray);
  padding: 10px 0;
  font-size: 16px;
  color: var(--text-white);
  width: 100%;
  
  &:focus {
    border-bottom: 1px solid var(--text-white);
  }
  
  &::placeholder {
    color: var(--text-gray);
  }
`;

const RequiredStar = styled.span`
  color: var(--main-green);
  margin-left: 2px;
`;

const Input = ({ 
  label, 
  name, 
  required = false, 
  ...props 
}) => {
  return (
    <InputContainer>
      {label && (
        <InputLabel htmlFor={name}>
          {label}
          {required && <RequiredStar>*</RequiredStar>}
        </InputLabel>
      )}
      <StyledInput id={name} name={name} required={required} {...props} />
    </InputContainer>
  );
};

export default Input; 