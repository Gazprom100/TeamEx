import React from 'react';
import styled from 'styled-components';

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.checked ? 'var(--main-green)' : 'var(--text-gray)'};
  background: ${props => props.checked ? 'var(--main-green)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px rgba(58, 112, 87, 0.3);
  }
`;

const CheckIcon = styled.div`
  width: 10px;
  height: 10px;
  background: var(--text-white);
  border-radius: 50%;
  opacity: ${props => props.checked ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const Label = styled.label`
  margin-left: 12px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
`;

const LinkText = styled.span`
  color: var(--main-green);
  margin-left: 4px;
`;

const Checkbox = ({ checked, onChange, label, linkText, linkUrl, ...props }) => {
  return (
    <CheckboxContainer>
      <HiddenCheckbox checked={checked} onChange={onChange} {...props} />
      <StyledCheckbox checked={checked} onClick={onChange}>
        <CheckIcon checked={checked} />
      </StyledCheckbox>
      <Label>
        {label}
        {linkText && (
          <LinkText as="a" href={linkUrl}>
            {linkText}
          </LinkText>
        )}
      </Label>
    </CheckboxContainer>
  );
};

export default Checkbox; 