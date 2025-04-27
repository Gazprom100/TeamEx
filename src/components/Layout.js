import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import useSafeAnimation from '../hooks/useSafeAnimation';

const Container = styled(motion.div)`
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-md);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 576px) {
    padding: var(--spacing-lg);
  }
  
  @media (min-width: 768px) {
    padding: var(--spacing-xl);
    max-width: 640px;
  }
  
  @media (min-width: 992px) {
    padding: var(--spacing-xxl);
    max-width: 768px;
  }
  
  @media (max-width: 375px) {
    padding: var(--spacing-sm);
  }
`;

const Content = styled.div`
  flex-grow: 1;
  width: 100%;
  position: relative;
  z-index: 1;
`;

export const Layout = ({ children }) => {
  const location = useLocation();
  const { isMounted, containerRef } = useSafeAnimation(300);
  
  // Простые начальные значения для лучшей производительности
  const initialAnimation = {
    opacity: 0
  };
  
  // Полная анимация только если монтирование завершено и анимации включены
  const animationVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.2,
        ease: "easeIn" 
      }
    }
  };
  
  return (
    <Container
      ref={containerRef}
      key={location.pathname}
      initial={initialAnimation}
      animate={isMounted ? "visible" : "hidden"}
      exit="exit"
      variants={animationVariants}
    >
      <Content>
        {children}
      </Content>
    </Container>
  );
};

export default Layout; 