import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 20px;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(14, 19, 26, 0.6);
  backdrop-filter: blur(10px);
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
`;

const FooterLink = styled(Link)`
  color: var(--text-secondary);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--accent-primary);
  }
`;

const Copyright = styled(motion.div)`
  color: var(--text-tertiary);
  font-size: 12px;
  text-align: center;
`;

const PoweredBy = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-tertiary);
  
  span {
    font-weight: 600;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          <FooterLink to="/">Главная</FooterLink>
          <FooterLink to="/exchange">Обмен</FooterLink>
          <FooterLink to="/support">Поддержка</FooterLink>
        </FooterLinks>
        
        <Copyright
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          © {year} TeamEx. Все права защищены.
        </Copyright>
        
        <PoweredBy>
          Powered by <span>TeamEx Exchange</span>
        </PoweredBy>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 