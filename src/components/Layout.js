import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Container = styled(motion.div)`
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex-grow: 1;
  width: 100%;
  position: relative;
  z-index: 1;
`;

export const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <Container
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Content>
        {children}
      </Content>
    </Container>
  );
};

export default Layout; 