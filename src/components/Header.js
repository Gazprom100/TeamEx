import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--dark-background);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-white);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
`;

const Title = styled.h1`
  margin: 0 auto;
  font-size: 20px;
  font-weight: 500;
  flex-grow: 1;
  text-align: center;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: var(--text-gray);
  margin: 0 auto;
  text-align: center;
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-white);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 16px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = ({ title, subtitle, showBackButton = true, showMenu = true }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <HeaderContainer>
      {showBackButton ? (
        <BackButton onClick={handleBackClick}>
          &#x2190; Назад
        </BackButton>
      ) : (
        <div style={{ width: '24px' }} />
      )}
      
      <TitleContainer>
        <Title>{title}</Title>
        {subtitle && <SubTitle>{subtitle}</SubTitle>}
      </TitleContainer>
      
      {showMenu && (
        <MenuButton aria-label="Menu">
          &#8942;&#8942;&#8942;
        </MenuButton>
      )}
    </HeaderContainer>
  );
};

export default Header; 