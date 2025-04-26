import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from './Icons';

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const BackButton = styled(motion.button)`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  padding: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  border-radius: var(--border-radius);
  margin-bottom: 10px;
  align-self: flex-start;
  
  &:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.05);
  }
  
  svg {
    margin-right: 6px;
  }
`;

const Title = styled(motion.h1)`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 5px;
`;

const Subtitle = styled(motion.p)`
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 400;
`;

export const Header = ({ title, subtitle, backTo }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <HeaderContainer>
      {backTo !== undefined && (
        <BackButton 
          onClick={handleBack}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeftIcon size="16px" />
          Назад
        </BackButton>
      )}
      
      <Title
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </Title>
      
      {subtitle && (
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {subtitle}
        </Subtitle>
      )}
    </HeaderContainer>
  );
};

export default Header; 