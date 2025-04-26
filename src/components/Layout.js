import React from 'react';
import styled from 'styled-components';
import Header from './Header';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--dark-background) 0%, var(--dark-background-lighter) 100%);
`;

const Content = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const FooterButton = styled.div`
  padding: 20px;
`;

const Layout = ({ 
  title, 
  subtitle,
  children, 
  showBackButton = true, 
  showMenu = true,
  footerButtonText,
  onFooterButtonClick
}) => {
  return (
    <Container>
      <Header 
        title={title} 
        subtitle={subtitle} 
        showBackButton={showBackButton} 
        showMenu={showMenu} 
      />
      <Content>
        {children}
      </Content>
      {footerButtonText && (
        <FooterButton>
          <button 
            onClick={onFooterButtonClick}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-white)',
              width: '100%',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '16px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {footerButtonText}
          </button>
        </FooterButton>
      )}
    </Container>
  );
};

export default Layout; 