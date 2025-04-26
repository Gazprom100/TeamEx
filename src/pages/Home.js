import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button, ButtonVariants } from '../components/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--dark-background) 0%, var(--dark-background-lighter) 100%);
  padding: 20px;
`;

const Logo = styled.div`
  text-align: center;
  margin: 40px 0;
  
  h1 {
    font-size: 54px;
    font-weight: 300;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-gray);
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 40px;
`;

const FullWidthItem = styled.div`
  grid-column: 1 / -1;
`;

const StyledButton = styled(Button)`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 18px;
`;

const ExchangeButton = styled(Button)`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  font-size: 18px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const Home = () => {
  return (
    <Container>
      <CloseButton>✕</CloseButton>
      
      <Logo>
        <h1>MOSCA</h1>
        <p>ОБМЕН КРИПТОВАЛЮТ</p>
      </Logo>
      
      <FullWidthItem>
        <ExchangeButton 
          as={Link} 
          to="/exchange" 
          fullWidth 
          variant={ButtonVariants.PRIMARY}
        >
          Купить / Продать USDT
        </ExchangeButton>
      </FullWidthItem>
      
      <MenuGrid>
        <StyledButton 
          as={Link} 
          to="/rates" 
          variant={ButtonVariants.MENU}
        >
          Курс
        </StyledButton>
        
        <StyledButton 
          as={Link} 
          to="/requests" 
          variant={ButtonVariants.MENU}
        >
          Все заявки
        </StyledButton>
        
        <StyledButton 
          as={Link} 
          to="/support" 
          variant={ButtonVariants.MENU}
        >
          Поддержка
        </StyledButton>
        
        <StyledButton 
          as={Link} 
          to="/about" 
          variant={ButtonVariants.MENU}
        >
          О нас
        </StyledButton>
        
        <FullWidthItem>
          <StyledButton 
            as={Link} 
            to="/aml-check" 
            fullWidth 
            variant={ButtonVariants.MENU}
          >
            AML проверка
          </StyledButton>
        </FullWidthItem>
        
        <FullWidthItem>
          <StyledButton 
            as={Link} 
            to="/referral" 
            fullWidth 
            variant={ButtonVariants.MENU}
          >
            Реферальная программа
          </StyledButton>
        </FullWidthItem>
      </MenuGrid>
    </Container>
  );
};

export default Home; 